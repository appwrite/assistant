import { mkdir, writeFile } from "fs/promises";
import { execa } from "execa";

const REPOSITORY_URL = "https://github.com/appwrite/website.git";
const LOCAL_PATH = "./sources/website";
const FILES = [
  "src/routes/docs/**/*.markdoc",
  "src/routes/docs/**/*.md",
  "src/partials/**/*.md",
];

await execa("rm", ["-rf", LOCAL_PATH]);
await mkdir(LOCAL_PATH, { recursive: true });

console.log(`Cloning ${REPOSITORY_URL} to ${LOCAL_PATH}...`);

await execa("git", ["clone", "--no-checkout", REPOSITORY_URL, LOCAL_PATH]);

await mkdir(`${LOCAL_PATH}/.git/info`, { recursive: true });
await writeFile(`${LOCAL_PATH}/.git/info/sparse-checkout`, FILES.join("\n"));
await execa("git", ["config", "core.sparseCheckout", "true"], {
  cwd: LOCAL_PATH,
});

await execa("git", ["checkout"], { cwd: LOCAL_PATH });
