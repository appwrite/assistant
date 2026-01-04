import "dotenv/config";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  getRagChain,
  getOpenAIChat,
  initializeDocumentRetriever as initializeRetriever,
} from "./embeddings.js";

import { BaseRetriever } from "@langchain/core/retrievers";

/** @type BaseRetriever } */
let retriever = null;

const port = 3003;

const SYSTEM_PROMPT =
  "You are an AI chat bot with information about Appwrite documentation. You need to help developers answer Appwrite related questions only. You will be given an input and you need to respond with the appropriate answer, using information confirmed with Appwrite documentation and reference pages. If applicable, show code examples. Code examples should use the Node and Web Appwrite SDKs unless otherwise specified.";

const streamResponse = async (callback) => {
  let chunks = [];
  await callback((token) => chunks.push(token));
  return chunks.join("");
};

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    // Handle preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Health endpoint
    if (url.pathname === "/v1/health" && req.method === "GET") {
      return new Response("OK", { headers: corsHeaders });
    }

    // Assistant prompt endpoint (RAG)
    if (
      url.pathname === "/v1/models/assistant/prompt" &&
      req.method === "POST"
    ) {
      if (!retriever) {
        return new Response("Search index not initialized", {
          status: 500,
          headers: corsHeaders,
        });
      }

      const body = await req.json();
      const { prompt } = body;

      const relevantDocuments = await retriever.invoke(prompt);

      const response = await streamResponse(async (onToken) => {
        const chain = await getRagChain(onToken, SYSTEM_PROMPT);
        await chain.invoke({
          input_documents: relevantDocuments,
          question: prompt,
        });
      });

      const sources = new Set(
        relevantDocuments.map((d) => d.metadata.url).filter((url) => !!url),
      );

      let fullResponse = response;
      if (sources.size > 0) {
        fullResponse += "\n\nSources:\n";
        for (const sourceUrl of sources) {
          fullResponse += "- " + sourceUrl + "\n";
        }
      }

      return new Response(fullResponse, {
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    // Generic prompt endpoint
    if (url.pathname === "/v1/models/generic/prompt" && req.method === "POST") {
      const body = await req.json();
      const { prompt } = body;

      const response = await streamResponse(async (onToken) => {
        const chat = await getOpenAIChat(onToken);
        await chat.invoke([
          new SystemMessage(SYSTEM_PROMPT),
          new HumanMessage(prompt),
        ]);
      });

      return new Response(response, {
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

console.log(`Started server on port: ${port}`);
console.log("Initializing search index...");
try {
  retriever = await initializeRetriever();
  console.log("Search index initialized");
} catch (e) {
  console.error(e);
}
