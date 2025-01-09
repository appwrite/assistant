import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import { execa } from "execa";

console.log(process.env)

const GIT_URL =
  process.env._BUILD_GIT_URL ?? "https://github.com/appwrite/website.git";
if (!GIT_URL) {
  console.warn(`No environment variable _BUILD_GIT_URL - using ${GIT_URL}`);
}

const GIT_BRANCH = process.env._BUILD_GIT_BRANCH ?? "main";
if (!GIT_BRANCH) {
  console.warn(
    `No environment variable _BUILD_GIT_BRANCH - using ${GIT_BRANCH}`
  );
}

const LOCAL_PATH = "./sources/website";
const FILES = [
  "src/routes/docs/**/*.markdoc",
  "src/routes/docs/**/*.md",
  "src/partials/**/*.md",
];

await execa("rm", ["-rf", LOCAL_PATH]);
await mkdir(LOCAL_PATH, { recursive: true });

await execa(
  "git",
  ["clone", "--no-checkout", "--depth", "1", GIT_URL, LOCAL_PATH],
  {
    stdio: "inherit",
  }
);

await mkdir(`${LOCAL_PATH}/.git/info`, { recursive: true });
await writeFile(`${LOCAL_PATH}/.git/info/sparse-checkout`, FILES.join("\n"));
await execa("git", ["config", "core.sparseCheckout", "true"], {
  cwd: LOCAL_PATH,
});

await execa("git", ["checkout", GIT_BRANCH], { cwd: LOCAL_PATH });
