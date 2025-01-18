import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import {
  getRagChain,
  getOpenAIChat,
  intializeDocumentRetriever as initializeRetriever,
} from "./embeddings.js";

const app = express();
app.use(
  cors({
    origin: "*",
  }),
);
app.use(bodyParser.raw({ inflate: true, type: "*/*" }));

/** @type {import("langchain/schema/retriever").BaseRetriever?} */
let retriever = null;

const port = 3003;

const SYSTEM_PROMPT =
  "You are an AI chat bot with information about Appwrite documentation. You need to help developers answer Appwrite related questions only. You will be given an input and you need to respond with the appropriate answer, using information confirmed with Appwrite documentation and reference pages. If applicable, show code examples. Code examples should use the Node and Web Appwrite SDKs unless otherwise specified.";

app.post("/v1/models/assistant/prompt", async (req, res) => {
  if (!retriever) {
    res.status(500).send("Search index not initialized");
    return;
  }

  // raw to text
  const decoder = new TextDecoder();
  const text = decoder.decode(req.body);

  let { prompt, systemPrompt } = JSON.parse(text);
  systemPrompt ??= SYSTEM_PROMPT;

  const relevantDocuments = await retriever.getRelevantDocuments(prompt);

  const chain = await getRagChain((token) => {
    res.write(token);
  });

  await chain.call({
    input_documents: relevantDocuments,
    question: `${systemPrompt}\n\n${prompt}`,
  });

  const sources = new Set(
    relevantDocuments.map((d) => d.metadata.url).filter((url) => !!url),
  );

  if (sources.size > 0) {
    res.write("\n\nSources:\n");
    for (const sourceUrl of new Set(
      relevantDocuments.map((d) => d.metadata.url).filter((url) => !!url),
    )) {
      res.write("- " + sourceUrl + "\n");
    }
  }

  res.end();
});

app.post("/v1/models/generic/prompt", async (req, res) => {
  const decoder = new TextDecoder();
  const text = decoder.decode(req.body);

  let { prompt, systemPrompt } = JSON.parse(text);
  systemPrompt ??= SYSTEM_PROMPT;

  const chain = await getOpenAIChat((token) => {
    res.write(token);
  });

  await chain.invoke([
    ["system", systemPrompt],
    ["human", prompt],
  ])

  res.end();
});

app.get("/v1/health", (_, res) => {
  res.send("OK");
});

app.listen(port, async () => {
  console.log(`Started server on port: ${port}`);
  console.log("Initializing search index...");
  try {
    retriever = await initializeRetriever();
    console.log("Search index initialized");
  } catch (e) {
    console.error(e);
  }
});
