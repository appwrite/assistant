import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { getDocuments } from "./documents.js";

/**
 * @param {function} onToken
 * @returns {ChatOpenAI}
 */
const createChatModel = (onToken) => {
  return new ChatOpenAI({
    model: process.env._APP_ASSISTANT_OPENAI_MODEL || "gpt-4o",
    apiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
    temperature: 0,
    maxTokens: 1000,
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken: onToken,
      },
    ],
  });
};

/**
 * @returns {Promise<VectorStoreRetriever<HNSWLib>>}
 */
export const initializeDocumentRetriever = async () => {
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
  });

  const documents = await getDocuments();
  const vectorStore = await HNSWLib.fromDocuments(documents, embeddings);

  return vectorStore.asRetriever(5);
};

/**
 * @param {function} onToken
 */
export const getOpenAIChat = async (onToken) => {
  return createChatModel(onToken);
};

/**
 * @param {function} onToken
 * @param {string} systemPrompt
 */
export const getRagChain = async (onToken, systemPrompt) => {
  const llm = createChatModel(onToken);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{context}\n\n{question}"],
  ]);

  return loadQAStuffChain(llm, { prompt });
};
