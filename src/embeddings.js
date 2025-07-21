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
  });

  const documents = await getDocuments();
  const vectorStore = await HNSWLib.fromDocuments(documents, embeddings);

  return vectorStore.asRetriever(5);
};

/**
 * @param {function} onToken
 * @param {string} systemPrompt
 */
export const getOpenAIChat = async (onToken, systemPrompt) =>
  new OpenAIChat({
    modelName: "gpt-4o",
    openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
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
