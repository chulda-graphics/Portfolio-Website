import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("non-scrolling homepage server-renders the portfolio index and intro shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");

  const html = await response.text();
  for (const [label, href] of [
    ["Work", "/work"],
    ["Process", "/process"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ]) {
    assert.match(html, new RegExp(`href=["']${href}["']`, "i"));
    assert.match(html, new RegExp(`>${label}<`, "i"));
  }
  assert.match(html, /class=["']site-loader["']/i);
  assert.match(html, /class=["']loader-wordmark["']/i);
  assert.match(html, /class=["']route-transition["']/i);
  assert.equal((html.match(/class=["']navigation-preview["']/gi) ?? []).length, 4);
  assert.doesNotMatch(html, /MacBook|loading-screen|carousel|custom-cursor/i);
  assert.doesNotMatch(html, /<video|Motion gives software|Selected projects/i);
});

for (const [route, title] of [
  ["/work", "Motion gives"],
  ["/process", "Process"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/work/stillsearch", "StillSearch"],
  ["/work/demo-reel-2026", "Demo Reel"],
]) {
  test(`${route} destination is directly available`, async () => {
    const response = await render(route);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(`>${title}<`, "i"));
  });
}

test("work pages include both existing project films", async () => {
  const response = await render("/work");
  const html = await response.text();
  assert.match(html, /StillSearch%20Launch%20Video\.mp4/i);
  assert.match(html, /Video%20Demo%20Reel%202026\.mp4/i);
  assert.match(html, /href=["']\/work\/stillsearch["']/i);
  assert.match(html, /href=["']\/work\/demo-reel-2026["']/i);
});

test("project films render with mobile-safe autoplay attributes", async () => {
  for (const route of ["/work/stillsearch", "/work/demo-reel-2026"]) {
    const response = await render(route);
    const html = await response.text();
    assert.match(html, /<video\b[^>]*autoplay/i);
    assert.match(html, /<video\b[^>]*loop/i);
    assert.match(html, /<video\b[^>]*muted/i);
    assert.match(html, /<video\b[^>]*playsinline/i);
    assert.match(html, /<video\b[^>]*preload=["']metadata["']/i);
  }
});

test("process stages expose an accessible disclosure state", async () => {
  const response = await render("/process");
  const html = await response.text();
  assert.match(html, /<button\b[^>]*aria-expanded=["']true["']/i);
  assert.match(html, /aria-controls=["']process-panel-01["']/i);
  assert.match(html, /id=["']process-panel-01["']/i);
});

test("Cloudflare bindings are emitted", async () => {
  const config = JSON.parse(
    await readFile(new URL("../dist/server/wrangler.json", import.meta.url), "utf8"),
  );
  assert.equal(config.assets?.binding, "ASSETS");
  assert.equal(config.images?.binding, "IMAGES");
});
