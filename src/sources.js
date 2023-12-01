import { glob } from "glob";
import { readFileSync } from "fs";

export const documentation = (
  await glob([
    "./sources/website/src/routes/docs/**/*.markdoc",
    "./sources/website/src/routes/docs/**/*.md",
    "./sources/website/src/partials/**/*.md",
  ])
).map((filename) => {
  const contents = readFileSync(filename, { encoding: "utf8" });

  const metadata = {
    filename,
    url:
      filename.startsWith("./sources/website/src/routes/") &&
      filename.endsWith("+page.markdoc")
        ? `https://appwrite.io/${filename
            .replace("./sources/website/src/routes/", "")
            .replace("+page.markdoc", "")}
      )}`
        : null,
    ...parseMarkdownFrontmatter(contents),
  };

  return {
    metadata,
    contents: cleanMarkdoc(contents, metadata.url),
  };
});

export const references = (await glob(["./sources/references/**/*.md"])).map(
  (filename) => {
    const contents = readFileSync(filename, { encoding: "utf8" });

    const metadata = {
      filename,
      url: `https://appwrite.io/docs/references/cloud/${
        filename.split("/")[2]
      }/${filename.split("/")[3].split(".")[0]}`,
    };

    return {
      metadata,
      contents: cleanMarkdoc(contents, metadata.url),
    };
  }
);

function parseMarkdownFrontmatter(contents) {
  const raw = contents.match(/^---\n([\s\S]*?)\n---/);
  if (!raw) {
    return {};
  }
  const frontmatterLines = raw[1].split("\n");
  const frontmatter = {};
  for (const line of frontmatterLines) {
    const [key, value] = line.split(": ");
    frontmatter[key] = value;
  }
  return frontmatter;
}

function cleanMarkdoc(contents, currentUrl = null) {
  return (
    contents
      // Remove the frontmatter
      // e.g.
      ///---
      // title: Getting Started
      // ---
      .replace(/^---\n([\s\S]*?)\n---/, "")
      // Remove markdoc components
      // e.g. {% component foo="bar" %}
      .replace(/{% [\s\S]*? %}/g, "")
      // Remove links to images
      // e.g. ![image](./image.png)
      .replace(/!\[[^\]]*\]\((?!http)([^\)]*)\)/g, "")
      // Replace relative heading links with absolute links
      // e.g. [Getting Started](#getting-started) -> [Getting Started](https://appwrite.io/docs/current-page#getting-started)
      .replace(/\[([^\]]*)\]\((?!http)([^\)]*)\)/g, (_, p1, p2) => {
        if (!currentUrl) return "";
        return `[${p1}](${currentUrl}#${p2})`;
      })
      // Replace relative links with absolute links
      // e.g. [Databases](/docs/products/databases) -> [Databases][(https://appwrite.io/docs/products/databases)
      .replace(/\[([^\]]*)\]\((?!http)([^\)]*)\)/g, (_, p1, p2) => {
        return `[${p1}](${new URL(currentUrl).origin}/${p2})`;
      })
  );
}
