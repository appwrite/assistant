import { HNSWLib } from "langchain/vectorstores/hnswlib";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { SelfQueryRetriever } from "langchain/retrievers/self_query";
import { FunctionalTranslator } from "langchain/retrievers/self_query/functional";
import { OpenAI, OpenAIChat } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { getDocuments, documentContents, attributeInfo } from "./documents.js";

export const intializeDocumentRetriever = async () => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
  });

  const documents = await getDocuments();
  const vectorStore = await HNSWLib.fromDocuments(documents, embeddings);

  return await SelfQueryRetriever.fromLLM({
    llm: new OpenAI({
      openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
      temperature: 0.3,
      maxTokens: 1000,
    }),
    vectorStore,
    documentContents,
    attributeInfo,
    structuredQueryTranslator: new FunctionalTranslator(),
    verbose: true,
  });
};

export const getChain = async (onToken) => {
  return loadQAStuffChain(
    new OpenAIChat({
      openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
      temperature: 0.3,
      maxTokens: 1000,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken: onToken,
        },
      ],
    })
  );
};
