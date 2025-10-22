import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIChat } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { getDocuments } from "./documents.js";

/**
 * @returns {Promise<VectorStoreRetriever<HNSWLib>>}
 */
export const initializeDocumentRetriever = async () => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
    configuration: {
      baseURL: process.env._APP_ASSISTANT_BASE_URL || "https://api.openai.com/v1",
    },
    modelName: process.env._APP_ASSISTANT_EMBEDDING_MODEL || "text-embedding-ada-002",
    batchSize: 10,
  });

  const documents = await getDocuments();
  
  if (documents.length === 0) {
    throw new Error("No documents found. Make sure to run 'pnpm run fetch-sources' first.");
  }

  const vectorStore = await HNSWLib.fromDocuments(documents, embeddings, {
    space: "cosine",
  });

  return vectorStore.asRetriever(5);
};

/**
 * @param {function} onToken
 * @param {string} systemPrompt
 */
export const getOpenAIChat = async (onToken, systemPrompt) =>
  new OpenAIChat({
    modelName: process.env._APP_ASSISTANT_MODEL_NAME || "gpt-4o",
    openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
    configuration: {
      baseURL: process.env._APP_ASSISTANT_BASE_URL || "https://api.openai.com/v1",
    },
    temperature: 0,
    maxTokens: 1000,
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken: onToken,
      },
    ],
    prefixMessages: [
      {
        role: "system",
        content: systemPrompt,
      },
    ],
  });

/**
 * @param {function} onToken
 * @param {string} systemPrompt
 */
export const getRagChain = async (onToken, systemPrompt) => {
  return loadQAStuffChain(await getOpenAIChat(onToken, systemPrompt));
};
