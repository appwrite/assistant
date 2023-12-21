import { mkdir, writeFile } from "fs/promises";
import { execa } from "execa";
import { NodeHtmlMarkdown } from "node-html-markdown";

const LOCAL_PATH = "./sources/references";
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

await execa("rm", ["-rf", LOCAL_PATH]);
await mkdir(LOCAL_PATH, { recursive: true });

console.log("Downloading reference pages...");

for (const sdk of SDKS) {
  await mkdir(`./sources/references/${sdk}/`, { recursive: true });

  for (const service of SERVICES) {
    const url = `https://appwrite.io/docs/references/cloud/${sdk}/${service}`;
    const response = await fetch(url);

    const html = await response.text();
    if (!html) continue;

    // Ignore the header and footer
    const matches = html.match(/<main class="u-contents">(.|\n)*<\/main>/);
    if (!matches || !matches[0]) continue;

    const markdown = NodeHtmlMarkdown.translate(matches[0]);
    await writeFile(`./sources/references/${sdk}/${service}.md`, markdown);
  }
}
