import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { getChain } from "./chain.js";

const DEFAULT_SYSTEM_PROMPT = `You are an AI chatbot with information about Appwrite documentation. You need to help developers answer Appwrite-related questions only. Use the provided context to formulate your answers, ensuring they are confirmed with Appwrite documentation and reference pages. If applicable, show code examples using the Node and Web Appwrite SDKs unless otherwise specified.`;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.raw({ inflate: true, type: "*/*" }));

const chain = await getChain();

app.post("/", async (req, res) => {
  const decoder = new TextDecoder();
  const text = decoder.decode(req.body);

  const { prompt: userPrompt } = JSON.parse(text);
  if (!userPrompt || typeof userPrompt !== "string") {
    res.status(400).send("Missing 'prompt' in request body.");
    return;
  }

  const systemPrompt = req.headers["x-assistant-system-prompt"] ?? DEFAULT_SYSTEM_PROMPT;

  const stream = await chain.stream({
    userPrompt,
    systemPrompt,
  });

  for await (const chunk of stream) {
    res.write(chunk);
  }

  res.end();
});

app.get("/v1/health", (_, res) => {
  res.send("OK");
});

const port = 3003;
app.listen(port, async () => {
  console.log(`Started server on port: ${port}`);
});
