import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const sourcePath = new URL("../src/App.jsx", import.meta.url);

describe("portfolio source", () => {
  it("contains the primary email action", async () => {
    const source = await readFile(sourcePath, "utf8");
    expect(source).toContain("mailto:chulda.graphics2022@gmail.com");
  });

  it("registers GSAP ScrollTrigger and reduced-motion support", async () => {
    const source = await readFile(sourcePath, "utf8");
    expect(source).toContain("gsap.registerPlugin(ScrollTrigger, useGSAP)");
    expect(source).toContain("prefers-reduced-motion: reduce");
  });
});
