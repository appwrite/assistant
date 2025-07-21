import { glob } from "glob";
import { readFile } from "fs/promises";
import { Document } from "langchain/document";
import { MarkdownTextSplitter } from "langchain/text_splitter";

/**
 * @returns {Promise<Document[]>}
 */
const getDocumentation = async () => {
  const filenames = await glob([
    "./sources/website/src/routes/docs/**/*.markdoc",
    "./sources/website/src/routes/docs/**/*.md",
    "./sources/website/src/partials/**/*.md",
  ]);

  return Promise.all(
    filenames.map(async (filename) => {
      const contents = await readFile(filename, { encoding: "utf8" });

      const url =
        filename.startsWith("sources/website/src/routes/") &&
        filename.endsWith("+page.markdoc")
          ? `https://appwrite.io/${filename
              .replace("sources/website/src/routes/", "")
              .replace("+page.markdoc", "")}`
          : null;

      const metadata = {
        filename,
        url,
        ...parseMarkdownFrontmatter(contents),
      };

      return new Document({
        metadata,
        pageContent: cleanMarkdoc(contents, metadata.url),
      });
    }),
  );
};

/**
 * @returns {Promise<Document[]>} Array of Document objects containing processed references
 */
const getReferences = async () => {
  const filenames = await glob(["./sources/references/**/*.md"]);
  const version = process.env._BUILD_WEBSITE_VERSION ?? "cloud";

  return Promise.all(
    filenames.map(async (filename) => {
      const contents = await readFile(filename, { encoding: "utf8" });

      const { sdk, service } = parseReferenceData(filename);
      const metadata = {
        filename,
        url: `https://appwrite.io/docs/references/${version}/${sdk}/${service}`,
      };

      return new Document({
        metadata,
        pageContent: cleanMarkdoc(contents, metadata.url),
      });
    }),
  );
};

export const getDocuments = async () => {
  const [documentation, references] = await Promise.all([
    getDocumentation(),
    getReferences(),
  ]);

  return await splitDocuments([...documentation, ...references]);
};

/**
 * @param {Document[]} documents
 * @returns {Promise<Document<Record<string, any>>[]>}
 */
async function splitDocuments(documents) {
  const splitter = new MarkdownTextSplitter({
    chunkSize: 1024,
    chunkOverlap: 64,
  });

  const texts = documents.map((document) => document.pageContent);
  const metadatas = documents.map((document) => document.metadata);

  return await splitter.createDocuments(texts, metadatas);
}

/**
 * @param {string} contents
 * @returns {Object.<string, string>}
 */
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

/**
 * @param {string} filename
 * @returns {{sdk: string, service: string}}
 */
function parseReferenceData(filename) {
  const [sdk, service] = filename
    .replace("sources/references/", "")
    .replace(".md", "")
    .split("/");
  return { sdk, service };
}

/**
 * Clean up markdoc contents to make them more suitable for search.
 *
 * @param {string} contents
 * @param {string|null} currentUrl
 */
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
      .replace(/!\[[^\]]*\]\((?!http)([^)]*)\)/g, "")
      // Replace relative heading links with absolute links
      // e.g. [Getting Started](#getting-started) -> [Getting Started](https://appwrite.io/docs/current-page#getting-started)
      .replace(/\[([^\]]*)\]\((?!http)([^)]*)\)/g, (_, p1, p2) => {
        if (!currentUrl) return "";
        return `[${p1}](${currentUrl}#${p2})`;
      })
      // Replace relative links with absolute links
      // e.g. [Databases](/docs/products/databases) -> [Databases][(https://appwrite.io/docs/products/databases)
      .replace(/\[([^\]]*)\]\((?!http)([^)]*)\)/g, (_, p1, p2) => {
        if (!currentUrl) return "";
        return `[${p1}](${new URL(currentUrl).origin}/${p2})`;
      })
  );
}
