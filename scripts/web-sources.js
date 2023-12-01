import { mkdir, writeFile } from "fs/promises";
import { execa } from "execa";
import { NodeHtmlMarkdown } from "node-html-markdown";

console.log("Downloading reference pages");

await execa("rm", ["-rf", "./sources/references"]);
await mkdir("./sources/references", { recursive: true });

const SDKS = [
  "client-web",
  "client-flutter",
  "client-apple",
  "client-android-kotlin",
  "client-android-java",
  "client-graphql",
  "client-rest",
  "server-dart",
  "server-deno",
  "server-dotnet",
  "server-nodejs",
  "server-php",
  "server-python",
  "server-ruby",
  "server-swift",
  "server-kotlin",
  "server-java",
  "server-graphql",
  "server-rest",
];

const SERVICES = [
  "account",
  "avatars",
  "databases",
  "functions",
  "locale",
  "storage",
  "teams",
  "users",
];

for (const sdk of SDKS) {
  await mkdir(`./sources/references/${sdk}/`, { recursive: true });

  for (const service of SERVICES) {
    const url = `https://appwrite.io/docs/references/cloud/${sdk}/${service}`;

    const response = await fetch(url);
    const html = await response.text();

    const article = html.match(/<main class="u-contents">(.|\n)*<\/main>/)[0];
    const markdown = NodeHtmlMarkdown.translate(article);

    await writeFile(`./sources/references/${sdk}/${service}.md`, markdown);
  }
}
