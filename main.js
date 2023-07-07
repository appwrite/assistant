import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { Configuration, OpenAIApi } from "openai-edge";
import { getChain, search_index } from "./embeddings.js";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.raw({ inflate: true, type: "*/*" }));

const port = 3003;

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const template = (
  prompt
) => `You are an AI chat bot trained on Appwrite Docs. You need to help developers answer Appwrite related
question only. You will be given an input and you need to respond with the appropriate answer from the
reference docs. For each question show code examples when applicable. Answer in atleast 100 words.
${prompt}`;

app.post("/", async (req, res) => {
  // raw to text
  const decoder = new TextDecoder();
  const text = decoder.decode(req.body);
  const { prompt } = JSON.parse(text);
  const templated = template(prompt);

  const chain = await getChain(res);
  await chain.call({
    input_documents: await (await search_index).similaritySearch(templated, 4),
    question: templated,
  });

  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
