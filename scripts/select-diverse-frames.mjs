import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [inputDirectory, outputDirectory, contactSheetPath] = process.argv.slice(2);
if (!inputDirectory || !outputDirectory || !contactSheetPath) {
  throw new Error("Expected INPUT_DIRECTORY OUTPUT_DIRECTORY CONTACT_SHEET_PATH");
}

const files = (await readdir(inputDirectory))
  .filter((file) => /\.(jpe?g|png)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const samples = await Promise.all(
  files.map(async (file, index) => {
    const { data } = await sharp(path.join(inputDirectory, file))
      .resize(32, 18, { fit: "fill" })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = [...data];
    const mean = pixels.reduce((total, value) => total + value, 0) / pixels.length;
    const variance =
      pixels.reduce((total, value) => total + (value - mean) ** 2, 0) /
      pixels.length;
    let edge = 0;
    for (let y = 0; y < 18; y += 1) {
      for (let x = 0; x < 32; x += 1) {
        const position = y * 32 + x;
        if (x < 31) edge += Math.abs(pixels[position] - pixels[position + 1]);
        if (y < 17) edge += Math.abs(pixels[position] - pixels[position + 32]);
      }
    }

    return {
      file,
      index,
      pixels,
      quality: Math.sqrt(variance) + edge / 950,
      usable: mean > 7 && mean < 248 && variance > 25,
    };
  }),
);

function distance(a, b) {
  let total = 0;
  for (let index = 0; index < a.length; index += 1) {
    total += (a[index] - b[index]) ** 2;
  }
  return Math.sqrt(total / a.length);
}

const chosen = [];
const targetCount = 20;
for (let bucket = 0; bucket < targetCount; bucket += 1) {
  const start = Math.floor((bucket * samples.length) / targetCount);
  const end = Math.max(start + 1, Math.floor(((bucket + 1) * samples.length) / targetCount));
  const candidates = samples.slice(start, end);
  const usable = candidates.some((candidate) => candidate.usable)
    ? candidates.filter((candidate) => candidate.usable)
    : candidates;
  const winner = usable.reduce((best, candidate) => {
    const diversity = chosen.length
      ? Math.min(...chosen.map((selected) => distance(candidate.pixels, selected.pixels)))
      : 45;
    const score = candidate.quality + diversity * 0.7;
    return !best || score > best.score ? { candidate, score } : best;
  }, null).candidate;
  chosen.push(winner);
}

await mkdir(outputDirectory, { recursive: true });
const rendered = [];
for (const [index, frame] of chosen.entries()) {
  const output = path.join(outputDirectory, `frame-${String(index + 1).padStart(2, "0")}.webp`);
  await sharp(path.join(inputDirectory, frame.file))
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6, smartSubsample: true })
    .toFile(output);
  rendered.push(output);
}

const tiles = await Promise.all(
  rendered.map((file) => sharp(file).resize(320, 180, { fit: "cover" }).toBuffer()),
);
await sharp({
  create: { width: 1600, height: 720, channels: 3, background: "#050505" },
})
  .composite(
    tiles.map((input, index) => ({
      input,
      left: (index % 5) * 320,
      top: Math.floor(index / 5) * 180,
    })),
  )
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(contactSheetPath);

console.log(chosen.map((frame) => frame.file).join(", "));
