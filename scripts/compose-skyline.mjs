// Composite a base JPEG with its grayscale soft-mask into a transparent PNG.
// Usage: node scripts/compose-skyline.mjs <base.jpg> <mask.png> <out.png>
import sharp from 'sharp';

const [, , basePath, maskPath, outPath] = process.argv;

const base = sharp(basePath).ensureAlpha();
const { width, height } = await base.metadata();

const mask = await sharp(maskPath)
  .resize(width, height, { fit: 'fill' })
  .greyscale()
  .toColourspace('b-w')
  .raw()
  .toBuffer();

await base
  .joinChannel(mask, { raw: { width, height, channels: 1 } })
  .png()
  .toFile(outPath);

console.log(`Wrote ${outPath} (${width}x${height}, alpha applied)`);
