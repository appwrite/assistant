import fs from "fs";
import path from "path";
import { getDocuments } from "./documents.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";

/** @type {import("@langchain/core/retrievers").BaseRetriever?}*/
let retriever = null;

export const getRetriever = async () => {
  if (retriever) {
    return retriever;
  }

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
    batchSize: 2048,
  });

  const storeDir = "sources/vector";
  const indexFilePath = path.join(storeDir, "hnswlib.index");

  let vectorStore;

  if (fs.existsSync(indexFilePath)) {
    console.log("Found existing vector store. Loading from disk...");
    vectorStore = await HNSWLib.load(storeDir, embeddings);
  } else {
    console.log("No existing vector store found. Building new vector store...");

    const documents = await getDocuments();

    console.log(`Building vector store from ${documents.length} documents...`);
    vectorStore = await HNSWLib.fromDocuments(documents, embeddings);

    if (!fs.existsSync(storeDir)) {
      fs.mkdirSync(storeDir);
    }

    console.log("Saving the new vector store to disk...");
    await vectorStore.save(storeDir);
  }

  retriever = vectorStore.asRetriever(5);

  return retriever;
};
