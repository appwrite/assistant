import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { getChain } from "./embeddings.js";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.raw({ inflate: true, type: "*/*" }));

const port = 3003;

app.listen(port, async () => {
  console.log(`Started server on port: ${port}`);
});

const chain = await getChain();

app.post("/", async (req, res) => {
  const decoder = new TextDecoder();
  const text = decoder.decode(req.body);
  const { prompt } = JSON.parse(text);

  console.log(`Received prompt: ${prompt}`);

  const stream = await chain.stream(prompt);

  for await (const chunk of stream) {
    res.write(chunk);
  }
  res.end();
});
