import { mkdir, writeFile } from "fs/promises";
import { execa } from "execa";

await mkdir("./sources", { recursive: true });

await gitClone("https://github.com/appwrite/website.git", "./sources/website", [
  "src/routes/docs/**/*.markdoc",
  "src/routes/docs/**/*.md",
  "src/partials/**/*.md",
]);

async function gitClone(repositoryUrl, localPath, files = "*") {
  await execa("rm", ["-rf", localPath]);

  console.log(`Cloning ${repositoryUrl} to ${localPath}`);
  try {
    await execa("git", ["clone", "--no-checkout", repositoryUrl, localPath]);

    if (files !== "*") {
      if (!Array.isArray(files)) {
        files = [files];
      }

      await mkdir(`${localPath}/.git/info`, { recursive: true });
      await writeFile(
        `${localPath}/.git/info/sparse-checkout`,
        files.join("\n")
      );

      await execa("git", ["config", "core.sparseCheckout", "true"], {
        cwd: localPath,
      });
    }

    await execa("git", ["checkout"], { cwd: localPath });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
