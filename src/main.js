import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { getChain } from "./chain.js";

const DEFAULT_SYSTEM_PROMPT = `
- You are an AI chatbot called Appwrite Assistant, with information from Appwrite documentation and references.
- Help developers answer Appwrite-related questions only. 
- Use the context to formulate your answers, only refer to SDK methods and API endpoints directly from the context, do not guess.
- By default, orovide code examples in Node and Web Appwrite SDKs.
`;

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

  const { prompt: userPrompt, systemPrompt } = JSON.parse(text);
  if (!userPrompt || typeof userPrompt !== "string") {
    res.status(400).send("Missing 'prompt' in request body.");
    return;
  }

  const systemPrompt = req.headers["x-assistant-system-prompt"] ;

  const stream = await chain.stream({
    messages: [{ role: "user", content: userPrompt }],
    systemPrompt ?? DEFAULT_SYSTEM_PROMPT
  });

  for await (const chunk of stream) {
    res.write(chunk.content)
  }

  res.end();
});

app.post("/v1/chat", async (req, res) => {
  const decoder = new TextDecoder();
  const text = decoder.decode(req.body);

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    res.status(400).send("Invalid JSON in request body.");
    return;
  }

  let { messages } = parsed;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).send("Missing or invalid 'messages' in request body.");
    return;
  }

  // Filter out any user-provided system messages
  // Only allow 'user' and 'assistant' roles from the user’s request.
  // The server injects its own system prompt in the chain
  messages = messages.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  const systemPrompt = req.headers["x-assistant-system-prompt"] ?? DEFAULT_SYSTEM_PROMPT;

  const stream = await chain.stream({
    messages,
    systemPrompt,
  });

  for await (const chunk of stream) {
    res.write(chunk.content);
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
