import { loadQAStuffChain } from "langchain/chains";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIChat } from "langchain/llms/openai";
import { Document } from "langchain/document";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { documentation } from "./scrape.js";

async function chunk_sources(sources) {
  const source_chunks = [];
  const splitter = new MarkdownTextSplitter({
    chunk_size: 1024,
    chunk_overlap: 64,
  });

  for (const source of sources) {
    for (const chunk of await splitter.splitText(source.pageContent)) {
      source_chunks.push(
        new Document({
          pageContent: chunk,
          metadata: source.metadata,
        })
      );
    }
  }

  return source_chunks;
}

export const initializeSearchIndex = async () => {
  const sources = documentation.map((page) => {
    return new Document({
      pageContent: page.contents,
      metadata: page.metadata,
    });
  });

  return FaissStore.fromDocuments(
    await chunk_sources(sources),
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
