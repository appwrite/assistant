import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { getChain, initializeSearchIndex } from "./embeddings.js";
import "dotenv/config";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.raw({ inflate: true, type: "*/*" }));

let searchIndex = null;

const port = 3003;

const template = (
  prompt
) => `You are an AI chat bot trained on Appwrite Docs. You need to help developers answer Appwrite related questions only. You will be given an input and you need to respond with the appropriate answer from the reference docs. For each question show code examples when applicable. Unless otherwise specified, you should provide examples using the Node and Web SDKs.
${prompt}`;

app.post("/", async (req, res) => {
  if (!searchIndex) {
    res.status(500).send("Search index not initialized");
    return;
  }
  // raw to text
  const decoder = new TextDecoder();
  const text = decoder.decode(req.body);
  const { prompt } = JSON.parse(text);
  const templated = template(prompt);

  const inputDocuments = await searchIndex.similaritySearch(prompt, 4);
  if (process.env.DEBUG) {
    res.write("Prompt: " + templated + "\n\n");

    for (const doc of inputDocuments) {
      res.write("Using source: " + doc.metadata.url + "\n");
      res.write(doc.pageContent + "\n\n");
    }

    res.write("Completion: ");
  }

  const chain = await getChain((token) => {
    res.write(token);
  });

  await chain.call({
    input_documents: inputDocuments,
    question: templated,
  });

  res.end();
});

app.listen(port, async () => {
  console.log(`Started server on port: ${port}`);
  console.log("Initializing search index...");
  try {
    searchIndex = await initializeSearchIndex();
    console.log("Search index initialized");
  } catch (e) {
    console.error(e);
  }
});
