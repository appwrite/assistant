import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { getChain, intializeDocumentRetriever } from "./embeddings.js";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.raw({ inflate: true, type: "*/*" }));

/** @type {import("langchain/retrievers/self_query").SelfQueryRetriever?} */
let retriever = null;

const port = 3003;

const template = (
  prompt
) => `You are an AI chat bot with information about Appwrite documentation. You need to help developers answer Appwrite related questions only. You will be given an input and you need to respond with the appropriate answer, using information confirmed with Appwrite documentation and reference pages. If applicable, show code examples. Code examples should use the Node and Web Appwrite SDKs unless otherwise specified.
${prompt}`;

app.post("/", async (req, res) => {
  if (!retriever) {
    res.status(500).send("Search index not initialized");
    return;
  }
  // raw to text
  const decoder = new TextDecoder();
  const text = decoder.decode(req.body);
  const { prompt } = JSON.parse(text);
  const templated = template(prompt);

  const relevantDocuments = await retriever.getRelevantDocuments(prompt);

  const chain = await getChain((token) => {
    res.write(token);
  });

  await chain.call({
    input_documents: relevantDocuments,
    question: templated,
  });

  res.write("\n\nSources:\n");
  for (const sourceUrl of new Set(
    relevantDocuments.map((d) => d.metadata.url)
  )) {
    res.write("-" + sourceUrl + "\n");
  }

  res.end();
});

app.listen(port, async () => {
  console.log(`Started server on port: ${port}`);
  console.log("Initializing search index...");
  try {
    retriever = await intializeDocumentRetriever();
    console.log("Search index initialized");
  } catch (e) {
    console.error(e);
  }
});
