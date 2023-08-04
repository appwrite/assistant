import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { getChain, search_index } from "./embeddings.js";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.raw({ inflate: true, type: "*/*" }));

const port = 3003;

const template = (
  prompt
) => `You are an AI chat bot trained on Appwrite Docs. You need to help developers answer Appwrite related
question only. You will be given an input and you need to respond with the appropriate answer from the
reference docs. For each question show code examples when applicable.
${prompt}`;

app.post("/", async (req, res) => {
  const secret = req.headers.authorization;
  if(secret !== process.env.ASSISTANT_SECRET) {
    res.status(403);
    res.send('Unauthorized access. Please make sure you are providing the authorized secret key.')
    return;
  }
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
  console.log(`Started server on port: ${port}`);
});
