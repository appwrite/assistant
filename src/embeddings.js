import { getDocuments } from "./documents.js";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";

/** @type {import("@langchain/core/retrievers").BaseRetriever?}*/
let retriever = null;

export const getRetriever = async () => {
  if (retriever) {
    return retriever;
  }

  console.log("Loading embeddings...");

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
  });

  const documents = await getDocuments();
  const vectorStore = await HNSWLib.fromDocuments(documents, embeddings);
  retriever = vectorStore.asRetriever(5);

  console.log("Embeddings loaded.");

  return retriever;
};

export const getChain = async () => {
  return RunnableSequence.from([
    {
      context: (await getRetriever()).pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are an AI chatbot with information about Appwrite documentation. You need to help developers answer Appwrite-related questions only. Use the provided context to formulate your answers, ensuring they are confirmed with Appwrite documentation and reference pages. If applicable, show code examples using the Node and Web Appwrite SDKs unless otherwise specified.",
      ],
      ["assistant", "Context: {context}"],
      ["human", "Question: {question}"],
    ]),
    new ChatOpenAI({
      model: "gpt-4o",
      openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
      temperature: 0.1,
      maxTokens: 1000,
    }),
    new StringOutputParser(),
  ]);
};
