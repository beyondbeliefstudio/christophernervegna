import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Strips HTML comments from the built pages.
 *
 * The source files are heavily commented on purpose — the notes explain why a
 * band is laid out the way it is, and they should stay where the next person
 * editing the component will read them. They just should not be served to
 * every visitor, where they are dead weight in the payload and hand a reader
 * of view-source a tour of the build.
 *
 * Runs on `astro:build:done` only, so `npm run dev` still shows the comments
 * in the inspector where they are useful.
 *
 * Content inside <script>, <style>, <pre> and <textarea> is left untouched: a
 * "<!--" in there is data, not a comment. Conditional comments (<!--[if ...]>)
 * are preserved for the same reason — they are instructions to the browser.
 */

// Regions whose text is not markup, plus the comments themselves, matched in
// one pass so a comment inside a script is never the thing we replace.
const REGIONS =
  /<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<pre\b[^>]*>[\s\S]*?<\/pre>|<textarea\b[^>]*>[\s\S]*?<\/textarea>|<!--[\s\S]*?-->/g;

export function stripComments(html) {
  return html.replace(REGIONS, match => {
    if (!match.startsWith("<!--")) return match; // a skipped region
    if (match.startsWith("<!--[if")) return match; // conditional comment
    return "";
  });
}

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

export default function stripHtmlComments() {
  return {
    name: "strip-html-comments",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = await htmlFiles(root);
        let removed = 0;

        await Promise.all(
          files.map(async file => {
            const before = await readFile(file, "utf8");
            const after = stripComments(before);
            if (after === before) return;
            removed += before.length - after.length;
            await writeFile(file, after, "utf8");
          })
        );

        logger.info(`Stripped ${removed} bytes of comments from ${files.length} page(s)`);
      },
    },
  };
}
