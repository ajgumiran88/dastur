#!/usr/bin/env bash
# Extract brand assets from the DASTUR brand guidelines PDF.
# Requires poppler (pdfimages, pdftoppm). Usage: bash scripts/extract-pdf-assets.sh [pdf-path]
set -euo pipefail

PDF="${1:-$HOME/Downloads/dastur brand guidelines d3.pdf}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/src/assets"
TMP="$(mktemp -d)"

mkdir -p "$OUT/packaging" "$OUT/illustration" "$OUT/textures" "$OUT/story"

echo "Extracting embedded images from: $PDF"
pdfimages -all "$PDF" "$TMP/img"

# Object → asset mapping (verified against `pdfimages -list`):
#   img-000 (p1)  → sand hero texture w/ palm shadow
#   img-001 (p2)  → brand-story sepia landscape (dhow + skyline)
#   img-006 (p8)  → heritage skyline illustration (has alpha smask → img-007)
#   img-008 (p9)  → green bento carry-box
#   img-010 (p10) → rope-handle pyramid boxes (300ppi hero packaging)
#   img-012 (p11) → cream spoon carry-box
#   img-013 (p11) → kraft delivery bag
#   img-015 (p12) → oud closing texture
cp "$TMP/img-000.jpg" "$OUT/textures/sand-hero.jpg"
cp "$TMP/img-001.jpg" "$OUT/story/heritage-landscape.jpg"
cp "$TMP/img-008.jpg" "$OUT/packaging/green-bento.jpg"
cp "$TMP/img-010.jpg" "$OUT/packaging/rope-boxes.jpg"
cp "$TMP/img-012.jpg" "$OUT/packaging/spoon-box.jpg"
cp "$TMP/img-013.jpg" "$OUT/packaging/kraft-bag.jpg"
cp "$TMP/img-015.jpg" "$OUT/textures/oud-texture.jpg"

# Skyline illustration: pair base image with its soft mask → transparent PNG.
if [ -f "$TMP/img-006.jpg" ] && [ -f "$TMP/img-007.png" ]; then
  node "$ROOT/scripts/compose-skyline.mjs" "$TMP/img-006.jpg" "$TMP/img-007.png" "$OUT/illustration/skyline.png"
else
  # Fallback: copy whatever page-8 asset exists.
  cp "$TMP/img-006".* "$OUT/illustration/" 2>/dev/null || true
fi

echo "Done. Extracted assets:"
find "$OUT" -type f \( -name '*.jpg' -o -name '*.png' \) | sort
rm -rf "$TMP"
