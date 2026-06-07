// Flattens the CritiCore logo SVG into a transparent PNG that Remotion can
// reliably load as both an <Img> and a CSS mask. Runs automatically before
// `npm run dev`, `npm run build` and `npm run render`.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "src/CritiCore Logonor.svg";
const OUT_DIR = "public";
const OUT = `${OUT_DIR}/CritiCore_Logonor.png`;

mkdirSync(OUT_DIR, { recursive: true });

const info = await sharp(SRC).png().toFile(OUT);
console.log(`Generated ${OUT} (${info.width}x${info.height})`);
