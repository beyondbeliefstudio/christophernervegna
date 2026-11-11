// Captures homepage screenshots for the Work section.
// Usage:  npm run shots          (only projects with no image yet)
//         npm run shots -- --all (retake every screenshot)
// Saves 1440x1080 (4:3) JPGs to public/images/work/<id>.jpg and fills in each project's `image` in src/data/work.json.
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const all = process.argv.includes("--all");
const file = new URL("../src/data/work.json", import.meta.url);
const outDir = new URL("../public/images/work/", import.meta.url);
const work = JSON.parse(await readFile(file, "utf8"));
const slug = s =>
  s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Use Playwright's own Chromium if it's installed, otherwise fall back to a browser already on this Mac.
async function launch() {
  const fallbacks = [
    {},
    { channel: "chrome" },
    { executablePath: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" },
    { executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" },
  ];
  for (const opts of fallbacks) {
    if (opts.executablePath && !existsSync(opts.executablePath)) continue;
    try {
      return await chromium.launch(opts);
    } catch {}
  }
  console.error(
    "Could not start a browser. Run `npx playwright install chromium` once, then `npm run shots` again."
  );
  process.exit(1);
}

const todo = work.filter(w => w.url && (all || !w.image));
if (!todo.length) {
  console.log(
    "Every project already has a screenshot. Use `npm run shots -- --all` to retake them."
  );
  process.exit(0);
}
console.log(`Capturing ${todo.length} screenshot(s)...`);

await mkdir(outDir, { recursive: true });
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
let saved = 0;

for (const item of todo) {
  const name = `${item.id || slug(item.name)}.jpg`;
  process.stdout.write(`  ${item.name} ... `);
  try {
    await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(4000); // let sliders, fonts and fade-ins settle
    await page.screenshot({ path: new URL(name, outDir).pathname, type: "jpeg", quality: 82 });
    item.image = `/images/work/${name}`;
    saved++;
    console.log(`saved public/images/work/${name}`);
  } catch (e) {
    console.log(`skipped (${e.message.split("\n")[0]})`);
  }
}

await browser.close();
await writeFile(file, JSON.stringify(work, null, 2) + "\n");
console.log(
  `Done: ${saved} of ${todo.length} saved. Check public/images/work/ for any cookie banners or popups.`
);
