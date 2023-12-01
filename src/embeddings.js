import { loadQAStuffChain } from "langchain/chains";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIChat } from "langchain/llms/openai";
import { Document } from "langchain/document";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { documentation, references } from "./sources.js";

async function chunkSources(sources) {
  const sourceChunks = [];
  const splitter = new MarkdownTextSplitter({
    chunk_size: 1024,
    chunk_overlap: 64,
  });

  for (const source of sources) {
    for (const chunk of await splitter.splitText(source.pageContent)) {
      sourceChunks.push(
        new Document({
          pageContent: chunk,
          metadata: source.metadata,
        })
      );
    }
  }

  return sourceChunks;
}

export const initializeSearchIndex = async () => {
  const sources = [...documentation, ...references].map((page) => {
    return new Document({
      pageContent: page.contents,
      metadata: page.metadata,
    });
  });

  return FaissStore.fromDocuments(
    await chunkSources(sources),
    new OpenAIEmbeddings({
      openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
    })
  );
};

export const getChain = (handleLLMNewToken) => {
  return loadQAStuffChain(
    new OpenAIChat({
      openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
      temperature: 0.3,
      max_tokens: 1000,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken,
        },
      ],
    })
  );
};
