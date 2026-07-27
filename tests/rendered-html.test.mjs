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

test("Version 2 foundation server-renders", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");

  const html = await response.text();
  assert.match(html, /Foundation ready/i);
  assert.match(html, /Version 2/i);
  assert.doesNotMatch(html, /MacBook|StillSearch|Demo Reel|Calendly/i);
});

for (const retiredRoute of [
  "/about",
  "/contact",
  "/work/demo-reel-2026",
  "/work/stillsearch",
]) {
  test(`retired route ${retiredRoute} is absent`, async () => {
    const response = await render(retiredRoute);
    assert.equal(response.status, 404);
  });
}

test("Cloudflare bindings are emitted", async () => {
  const config = JSON.parse(
    await readFile(new URL("../dist/server/wrangler.json", import.meta.url), "utf8"),
  );
  assert.equal(config.assets?.binding, "ASSETS");
  assert.equal(config.images?.binding, "IMAGES");
});
