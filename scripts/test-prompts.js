import { writeFile, mkdir } from "fs/promises";

const SERVER_URL = "http://localhost:3003/v1/models/assistant/prompt";
const PROMPTS = [
  "How do you add a custom domain in the console?",
  "Show me how I can set up database collections and documents.",
  "What's the difference between Server and Client SDKs?",
  "How do I use the users API to create a new user with Dart?",
  "What endpoints are available for the Avatars API? I'm using the PHP SDK",
  "How to use Appwrite with React?",
  "How do I host a simple static website with Appwrite?"
];
const TESTS_FOLDER = "./tests";

await mkdir(TESTS_FOLDER, { recursive: true });

for (const prompt of PROMPTS) {
  console.log(`Executing prompt: ${prompt}`);

  const response = await fetch(SERVER_URL, {
    method: "POST",
    body: JSON.stringify({
      prompt,
    }),
  });

  if (!response.ok) throw new Error(response.statusText);

  const text = await response.text();

  await writeFile(`${TESTS_FOLDER}/${slugify(prompt)}.md`, text);
}

function slugify(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
