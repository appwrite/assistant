import fs from "fs";
import { globSync } from "glob";

import { loadQAStuffChain } from "langchain/chains";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIChat } from "langchain/llms/openai";
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";

async function chunk_sources(sources) {
  const source_chunks = [];
  const splitter = new CharacterTextSplitter({
    separator: " ",
    chunk_size: 1024,
    chunk_overlap: 64,
  });

  for (let source of sources) {
    for (let chunk of await splitter.splitText(source.pageContent)) {
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
  const sources = globSync("docs/*.json").map((filename) => {
    const source = JSON.parse(fs.readFileSync(filename));
    return new Document({
      pageContent: source.page_content,
      metadata: source.metadata,
    });
  });
  
  return FaissStore.fromDocuments(
    await chunk_sources(sources),
    new OpenAIEmbeddings({
      openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
    })
  );
}

export const getChain = (res) => {
  return loadQAStuffChain(
    new OpenAIChat({
      openAIApiKey: process.env._APP_ASSISTANT_OPENAI_API_KEY,
      temperature: 0.6,
      max_tokens: 1000,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken: (token) => {
            res.write(token);
          },
        },
      ],
    })
  );
};
