import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import { execa } from "execa";
import { NodeHtmlMarkdown } from "node-html-markdown";

const WEBSITE_URL = process.env._BUILD_WEBSITE_URL ?? "https://appwrite.io";
if (!WEBSITE_URL) {
  console.warn(
    `No environment variable _BUILD_WEBSITE_URL - using ${WEBSITE_URL}`,
  );
}

const WEBSITE_VERSION = process.env._BUILD_WEBSITE_VERSION ?? "cloud";
if (!WEBSITE_VERSION) {
  console.warn(
    `No environment variable _BUILD_WEBSITE_VERSION - using ${WEBSITE_VERSION}`,
  );
}

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
  "server-go",
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
  "messaging",
  "sites",
  "storage",
  "teams",
  "users",
];

await execa("rm", ["-rf", LOCAL_PATH]);
await mkdir(LOCAL_PATH, { recursive: true });

await Promise.all(
  SDKS.map((sdk) => {
    return mkdir(`${LOCAL_PATH}/${sdk}/`, { recursive: true });
  }),
);

console.log("Downloading reference pages...");

const start = Date.now();

await Promise.all(
  SDKS.flatMap((sdk) =>
    SERVICES.map(async (service) => {
      const url = new URL(
        `/docs/references/${WEBSITE_VERSION}/${sdk}/${service}`,
        WEBSITE_URL,
      );

      try {
        const response = await fetch(url.toString());
        const html = await response.text();
        if (!html) {
          console.warn(`Skipping page ${url} - no content found`);
          return;
        }

        const matches = html.match(
          /<main class="contents" id="main">(.*?)<\/main>/s,
        );
        if (!matches || !matches[0]) {
          console.warn(`Skipping page ${url} - no <main> tag found`);
          return;
        }

        const markdown = NodeHtmlMarkdown.translate(matches[0]);
        await writeFile(`${LOCAL_PATH}/${sdk}/${service}.md`, markdown);
        console.log(`Created ./sources/references/${sdk}/${service}.md`);
      } catch (e) {
        console.warn(`Failed to download ${url}:`, e);
      }
    }),
  ),
);

console.log("References created in", (Date.now() - start) / 1000, "seconds");
