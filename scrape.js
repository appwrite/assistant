import { glob } from "glob";
import { readFile } from "node:fs/promises";

const WEBSITE_DOMAIN = "https://appwrite.io";

async function parseFrontmatter(contents) {
  const frontmatter = contents.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    return {};
  }
  const frontmatterLines = frontmatter[1].split("\n");
  const metadata = {};
  for (const line of frontmatterLines) {
    const [key, value] = line.split(": ");
    metadata[key] = value;
  }
  return metadata;
}

const docpages = await glob("./website/src/routes/docs/**/*.markdoc");
const docreferences = await glob(
  "./website/src/routes/docs/references/**/*.md"
);
const partials = await glob("./website/src/partials/**/*.md");

export const documentation = await Promise.all(
  [...docpages, ...docreferences, ...partials].map(async (filename) => {
    const contents = await readFile(filename, { encoding: "utf8" });

    const metadata = await parseFrontmatter(contents);
    if (filename.includes("website/src/routes/docs")) {
      metadata.url = `${WEBSITE_DOMAIN}/${
        filename.split("website/src/routes/")[1]
      }`.replace(/\/\+page.markdoc$/, "");
    }

    return {
      metadata,
      contents: contents
        // Remove the frontmatter
        // e.g. ---
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
          if (!metadata.url) return "";
          return `[${p1}](${metadata.url}#${p2})`;
        })
        // Replace relative links with absolute links
        // e.g. [Databases](/docs/products/databases) -> [Databases][(https://appwrite.io/docs/products/databases)
        .replace(/\[([^\]]*)\]\((?!http)([^\)]*)\)/g, (_, p1, p2) => {
          return `[${p1}](${WEBSITE_DOMAIN}/${p2})`;
        }),
    };
  })
);
