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

test("minimal homepage server-renders all destination links", async () => {
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
  assert.doesNotMatch(html, /MacBook|loading-screen|carousel|custom-cursor/i);
});

for (const [route, title] of [
  ["/work", "Work"],
  ["/process", "Process"],
  ["/about", "About"],
  ["/contact", "Contact"],
]) {
  test(`${route} destination is directly available`, async () => {
    const response = await render(route);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(`>${title}<`, "i"));
  });
}

test("Cloudflare bindings are emitted", async () => {
  const config = JSON.parse(
    await readFile(new URL("../dist/server/wrangler.json", import.meta.url), "utf8"),
  );
  assert.equal(config.assets?.binding, "ASSETS");
  assert.equal(config.images?.binding, "IMAGES");
});
