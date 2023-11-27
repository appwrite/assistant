import { glob } from "glob";
import { readFile } from "node:fs/promises";

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

const markdocs = await glob("./website/src/routes/docs/**/*.markdoc");
export const documentation = await Promise.all(
  markdocs.map(async (filename) => {
    const contents = await readFile(filename, { encoding: "utf8" });

    const metadata = await parseFrontmatter(contents);
    metadata.url = `https://appwrite.io/${
      filename.split("website/src/routes/")[1]
    }`.replace(/\/\+page.markdoc$/, "");

    return {
      metadata,
      contents: contents
        // Remove the frontmatter
        .replace(/^---\n([\s\S]*?)\n---/, "")
        // Remove links to images
        .replace(
          /\[([^\]]*)\]\((?!http)([^\)]*)\.(jpg|png|webp|gif|svg|jpeg|avif)\)/g,
          ""
        )
        // Remove markdoc components
        .replace(/{% [\s\S]*? %}/g, "")
        // Replace markdoc relative links with absolute links e.g. /docs/products/databases -> https://appwrite.io/docs/products/databases
        .replace(/\[([^\]]*)\]\((?!http)([^\)]*)\)/g, (match, p1, p2) => {
          return `[${p1}](https://appwrite.io/${p2})`;
        }),
    };
  })
);
