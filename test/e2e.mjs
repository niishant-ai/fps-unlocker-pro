import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:4173/";
const ALLOWED_EXTERNAL = new Set([
  "https://play.google.com/store/apps/details?id=tp.fps90",
  "https://t.me/pubgmi_gfx_tool",
]);

const out = ".test-shots";
fs.mkdirSync(out, { recursive: true });

const problems = [];
let browser;
try {
  browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
} catch {
  browser = await chromium.launch({ channel: "msedge", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
}

async function newPage(viewport, name) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") problems.push(`[${name}] console: ${m.text().slice(0, 200)}`);
  });
  page.on("pageerror", (e) => problems.push(`[${name}] pageerror: ${String(e).slice(0, 200)}`));
  page.on("requestfailed", (r) => {
    if (!r.url().includes("fonts")) problems.push(`[${name}] reqfail: ${r.url().slice(0, 120)} ${r.failure()?.errorText}`);
  });
  return { ctx, page };
}

async function auditRoute(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) problems.push(`[${label}] horizontal overflow: ${overflow}px`);

  const badLinks = await page.$$eval("a[href]", (anchors) =>
    anchors
      .map((a) => a.getAttribute("href") || "")
      .filter((h) => h.startsWith("http://") || h.startsWith("https://") || h.startsWith("mailto:"))
  );
  for (const href of badLinks) {
    if (!ALLOWED_EXTERNAL.has(href)) problems.push(`[${label}] disallowed external link: ${href}`);
  }

  const text = await page.evaluate(() => document.body.innerText);
  if (/\bSAF\b|Storage Access Framework/i.test(text)) {
    problems.push(`[${label}] leftover SAF text found`);
  }
}

/* ---------------- desktop ---------------- */
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 }, "desktop");
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(600);

  for (const id of ["top", "features", "screenshots", "guide", "faq", "community"]) {
    if (!(await page.$(`#${id}`))) problems.push(`missing section #${id}`);
  }
  if (await page.$("#demo")) problems.push("#demo simulator should be removed");
  if (await page.$("#compatibility")) problems.push("#compatibility section should be removed");

  const badImgs = await page.$$eval("img", (imgs) =>
    imgs.filter((i) => i.src && (!i.complete || i.naturalWidth === 0)).map((i) => i.src.slice(0, 80))
  );
  if (badImgs.length) problems.push("broken imgs: " + badImgs.join(", "));

  await auditRoute(page, "desktop-home");

  // Default dark theme + toggle to light theme + persistence
  const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  if (initialTheme !== "dark") problems.push(`expected default dark theme, got ${initialTheme}`);
  await page.click('header button[aria-label="Light theme"]');
  await page.waitForTimeout(300);
  const afterLight = await page.evaluate(() => document.documentElement.dataset.theme);
  if (afterLight !== "light") problems.push(`expected light theme after toggle, got ${afterLight}`);
  await auditRoute(page, "desktop-home-light");
  await page.click('header button[aria-label="Dark theme"]');
  await page.waitForTimeout(300);

  // Gallery + Tap-to-Zoom
  await page.click('header a[href="#screenshots"]');
  await page.waitForTimeout(700);
  await page.click('button:has-text("Tap to zoom")');
  await page.waitForTimeout(400);
  if (!(await page.$('div[role="dialog"][aria-modal="true"]'))) problems.push("desktop lightbox did not open");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // Shizuku page
  await page.click('header a[href="#/shizuku"]');
  await page.waitForTimeout(800);
  await auditRoute(page, "desktop-shizuku");
  if (await page.$('button[aria-label="Generate a new code"]')) problems.push("pairing code generator still present");

  // Privacy page
  await page.click('footer a[href="#/privacy"] >> nth=0');
  await page.waitForTimeout(800);
  await auditRoute(page, "desktop-privacy");

  await ctx.close();
}

/* ---------------- mobile 360px & 390px ---------------- */
for (const width of [360, 390]) {
  const { ctx, page } = await newPage({ width, height: 844 }, `mobile-${width}`);
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  await auditRoute(page, `mobile-${width}-home`);

  // Tap to zoom on mobile
  await page.evaluate(() => document.getElementById("screenshots").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(600);
  await page.click('button:has-text("Tap to zoom")');
  await page.waitForTimeout(400);
  if (!(await page.$('div[role="dialog"][aria-modal="true"]'))) problems.push(`mobile-${width} lightbox failed`);
  await page.click('button[aria-label="Close viewer"]');
  await page.waitForTimeout(300);

  // Shizuku guide on mobile
  await page.goto(`${BASE}#/shizuku`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await auditRoute(page, `mobile-${width}-shizuku`);

  // Privacy page on mobile
  await page.goto(`${BASE}#/privacy`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await auditRoute(page, `mobile-${width}-privacy`);

  await ctx.close();
}

await browser.close();
console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "ALL CHECKS PASSED");
process.exit(problems.length ? 1 : 0);
