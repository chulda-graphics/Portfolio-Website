import assert from "node:assert/strict";
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

const routes = [
  ["/", /Clarity,|selected work/i],
  ["/about", /shape how people experience software/i],
  ["/contact", /Bring clarity to your product/i],
  ["/work/demo-reel-2026", /Demo Reel 2026/i],
  ["/work/stillsearch", /StillSearch/i],
];

for (const [route, expectation] of routes) {
  test(`server-renders ${route}`, async () => {
    const response = await render(route);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, expectation);
    assert.match(html, /Dhrex/i);
    assert.doesNotMatch(html, /codex-preview|Starter Project|Your site is taking shape/i);
  });
}

test("coming-soon work remains inert", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /Coming Soon/);
  assert.doesNotMatch(html, /href=["'][^"']*coming-soon/i);
});
