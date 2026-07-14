# DASTUR Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, responsive, bilingual (EN/AR-RTL) one-page marketing site for DASTUR, a contemporary Emirati cloud kitchen, matching the brand guidelines PDF.

**Architecture:** Astro static site (near-zero client JS). Bespoke CSS design tokens drive every surface. Two statically-generated routes (`/` en, `/ar/` ar) compose the same section components with a `lang` prop; strings live in i18n JSON, business/menu data in typed config modules. A single deferred GSAP module adds scroll/loader/micro animation over content that is fully usable without JS. Real packaging photos are extracted from the PDF; dish/gallery imagery is AI-generated demo (flagged, replaceable).

**Tech Stack:** Astro 7, TypeScript (strict), GSAP 3 + ScrollTrigger, self-hosted fonts via `@fontsource(-variable)`, `sharp` (Astro `<Image>`), Vitest for logic units, `poppler` (`pdfimages`/`pdftoppm`) for asset extraction.

## Global Constraints

- **Cloud kitchen only** — NO dine-in reservations, table booking, or dining-room availability anywhere.
- **No invented business data.** phone, WhatsApp, email, hours, service areas, min order, delivery ETA, socials, delivery-platform URLs, menu items, prices = configurable placeholders, each flagged, all collected in the README "Verify Before Launch" list.
- **No fabricated** ratings, testimonials attributed to real people, awards, or delivery partnerships. Testimonials are clearly-editable placeholders.
- **Palette (exact):** `--indigo #1C2630`, `--palm #354F40`, `--oud #3B2A1E`, `--sand #E6D7C3`; decorative accent `--brass #B08D57` (never a text-contrast dependency). No unrelated bright colors.
- **Fonts:** Cormorant Garamond (headings/wordmark ← Antique), Alexandria (body + Arabic body), Tajawal (Arabic display ← GE SS Two). Self-hosted only; no external font requests.
- **Tagline (verbatim):** `Heritage Inspiration. Modern Experience.`
- **Animation rules:** transform/opacity only; no layout shift; fully honor `prefers-reduced-motion`; simplify on small screens; content visible with JS disabled.
- **A11y:** WCAG 2.1 AA; single `h1`; keyboard-operable nav/drawer/modal; visible focus; icon+label (never color alone); descriptive alt text.
- **Perf:** Lighthouse ≥ 90 target; images WebP/AVIF responsive + lazy below fold; GSAP deferred; no autoplay AV.
- **Demo assets:** every AI/demo image carries `data-demo` and appears in the README placeholder list.
- **Commit** after every task with a Conventional-Commit message ending:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Branch: `feat/dastur-website` (already created; spec already committed there).

**Note on task steps:** Logic units (i18n resolver, WhatsApp/order-link builder, structured-data builder, content validation) are built test-first with real Vitest code. Visual components (`.astro` + scoped CSS) are specified by a component contract (props, structure, styling direction, animation hooks) plus explicit acceptance criteria and a build/visual verification step — this is the appropriate test cycle for static presentational markup.

---

## File Structure

```
dastur/
  astro.config.mjs            # Astro config: site, image service, i18n-ish routing
  tsconfig.json               # strict TS
  vitest.config.ts            # unit tests for logic
  package.json
  public/
    favicon.svg  favicon-32.png  apple-touch-icon.png  robots.txt  og-image.jpg
  scripts/
    extract-pdf-assets.sh     # one-shot: pull packaging/skyline/texture from the PDF
  src/
    assets/                   # ORIGINAL high-res images (packaging, skyline, textures, ai-demo)
      packaging/  textures/  illustration/  menu/  gallery/
    styles/
      tokens.css              # ALL design tokens (color/type/space/motion)
      base.css                # reset, element defaults, typography, utilities, fonts
    lib/
      i18n.ts                 # locale types + string resolver (tested)
      links.ts                # whatsapp/tel/mailto/order builders (tested)
      seo.ts                  # meta + JSON-LD builders (tested)
    config/
      site.ts                 # brand, contact, hours, areas, platforms, socials, seo (placeholders)
      nav.ts                  # nav sections
      menu.ts                 # categories + dishes (demo)
      testimonials.ts         # placeholder guest experiences
      gallery.ts              # gallery items (asymmetry spans)
    i18n/
      en.json  ar.json        # every UI/section string
    components/
      ui/  Emblem.astro Motif.astro Button.astro Section.astro Reveal.astro
           LangSwitch.astro PlatformButton.astro DishCard.astro
      shell/ Loader.astro Nav.astro Footer.astro
      sections/ Hero.astro Story.astro Menu.astro Experience.astro Packaging.astro
                WhyDastur.astro Delivery.astro Testimonials.astro Gallery.astro
    layouts/
      Layout.astro            # <head>, fonts preload, seo, skip link, lang/dir, tokens
    pages/
      index.astro             # en page (composes sections, lang="en")
      ar/index.astro          # ar page (lang="ar", dir rtl)
    scripts/
      animations.ts           # GSAP module (deferred), reduced-motion + fallback aware
  docs/superpowers/...        # spec + this plan
  README.md                   # setup, editing guide, Verify-Before-Launch list
```

---

## Phase A — Foundation

### Task 1: Scaffold Astro project + tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `src/pages/index.astro` (temporary placeholder), `src/env.d.ts`

**Interfaces:**
- Produces: a building Astro app; `npm run build`, `npm run dev`, `npm run test`, `npm run check` scripts.

- [ ] **Step 1: Initialize package + install deps**

Run in repo root (non-interactive; do NOT use `create astro` wizard):
```bash
npm init -y
npm install astro@^7 gsap@^3
npm install -D typescript @astrojs/check vitest @fontsource-variable/cormorant-garamond @fontsource/alexandria @fontsource/tajawal sharp
```

- [ ] **Step 2: Write `package.json` scripts**

Merge these scripts:
```json
{
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check && tsc --noEmit",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dastur.example', // PLACEHOLDER canonical origin — verify before launch
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: true },
  vite: { ssr: { noExternal: ['gsap'] } },
});
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vitest/globals"]
  },
  "include": ["src", "vitest.config.ts"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Write `vitest.config.ts` and `.gitignore`**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  test: { globals: true, environment: 'node', include: ['src/**/*.test.ts'] },
});
```
`.gitignore`:
```
node_modules/
dist/
.astro/
.DS_Store
*.log
```

- [ ] **Step 6: Temporary placeholder page**

`src/pages/index.astro`:
```astro
---
---
<html lang="en"><head><meta charset="utf-8" /><title>DASTUR</title></head>
<body><h1>DASTUR — scaffold OK</h1></body></html>
```

- [ ] **Step 7: Verify build + typecheck**

Run: `npm run build && npm run check`
Expected: build writes `dist/`, check reports 0 errors.

- [ ] **Step 8: Commit**
```bash
git add -A && git commit -m "chore: scaffold Astro 7 + TypeScript + Vitest tooling

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Extract brand assets from the PDF

**Files:**
- Create: `scripts/extract-pdf-assets.sh`, populates `src/assets/packaging/`, `src/assets/illustration/`, `src/assets/textures/`

**Interfaces:**
- Produces: optimized source images consumed by Packaging, Story, Hero, Footer. Filenames: `packaging/green-bento.jpg`, `packaging/rope-boxes.jpg` (300ppi hero packaging), `packaging/spoon-box.jpg`, `packaging/kraft-bag.jpg`, `illustration/skyline.png` (transparent), `textures/oud-texture.jpg`, `textures/sand-hero.jpg`.

- [ ] **Step 1: Write extraction script**

`scripts/extract-pdf-assets.sh` (PDF path is an arg; default to the Downloads copy):
```bash
#!/usr/bin/env bash
set -euo pipefail
PDF="${1:-$HOME/Downloads/dastur brand guidelines d3.pdf}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/src/assets"
TMP="$(mktemp -d)"
mkdir -p "$OUT/packaging" "$OUT/illustration" "$OUT/textures"
# Extract every embedded image with original encoding.
pdfimages -all "$PDF" "$TMP/img"
ls -la "$TMP"
# Map by page inventory (see pdfimages -list): copy + rename the ones we use.
# Object IDs verified from the guidelines: p10 rope boxes = highest-res packaging.
echo "Raw images in $TMP — inspect and copy the packaging/illustration/texture ones to $OUT."
```

- [ ] **Step 2: Run extraction and inspect**

Run:
```bash
bash scripts/extract-pdf-assets.sh
pdfimages -list "$HOME/Downloads/dastur brand guidelines d3.pdf"
```
Expected: raw `img-*.{jpg,png}` in the temp dir. Cross-reference the `-list` table (page → object) to identify: page 9 → green bento; page 10 (3517×2186) → rope boxes; page 11 → spoon box + kraft bag; page 8 (with smask) → skyline (rebuild as PNG-with-alpha via `pdfimages -all` which pairs the smask); page 12 → oud texture; page 1/2 → sand hero texture.

- [ ] **Step 3: Copy + normalize the chosen assets**

Copy the identified files into `src/assets/{packaging,illustration,textures}` with the target names above. For the skyline, ensure the alpha (smask) is applied — if `pdfimages -all` emits a separate `.png` smask, composite so the result is transparent PNG (`sharp`/ImageMagick), else keep the paired PNG. Acceptance: each target file exists, opens, and looks correct (packaging photos crisp; skyline has transparent background).

- [ ] **Step 4: Record provenance**

Append a short `src/assets/SOURCES.md` noting each file's PDF page origin and that packaging photos are official brand assets (do not distort), skyline is reinterpreted decoratively.

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "feat: extract packaging/skyline/texture assets from brand PDF

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Design tokens, base styles, self-hosted fonts

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`

**Interfaces:**
- Produces: CSS custom properties consumed by every component; `.font-display`, fluid type scale, `--space-*`, `--ease-*`, `.container`, `.u-reveal` defaults, focus-visible ring, `.sr-only`, skip-link styles, RTL-safe logical-property defaults.

- [ ] **Step 1: Write `tokens.css`**

Full token set (color primitives + semantic aliases; fluid `clamp()` type scale `--fs-1..--fs-8`; `--space-2xs..--space-3xl`; radii `--r-sm 4px / --r-md 8px` (restrained); shadows restrained; `--measure 66ch`; `--container 1200px`; motion `--dur-1..3`, `--ease-out: cubic-bezier(.22,.61,.36,1)`, `--ease-inout: cubic-bezier(.65,.05,.36,1)`). Include semantic pairs: `--bg`, `--surface`, `--text`, `--text-muted`, `--on-dark`. Provide `[data-theme="dark"]` scoping helper class `.section--dark { --bg: var(--indigo); --text: var(--sand); ... }` and `.section--oud`.

- [ ] **Step 2: Write `base.css`**

Import fonts at top:
```css
@import '@fontsource-variable/cormorant-garamond';
@import '@fontsource/alexandria/400.css';
@import '@fontsource/alexandria/500.css';
@import '@fontsource/alexandria/300.css';
@import '@fontsource/tajawal/500.css';
@import '@fontsource/tajawal/700.css';
```
Then: modern reset; `html{scroll-behavior:smooth}` gated by `@media (prefers-reduced-motion: no-preference)`; body uses Alexandria; headings use Cormorant Garamond via `--font-display`; set `[lang="ar"] --font-display: 'Tajawal'`; logical-property helpers; `:focus-visible` ring using `--brass`/outline; `.sr-only`; `.skip-link`; `img,svg{max-width:100%;display:block}`; prevent horizontal overflow (`overflow-x:clip` on `html`); default `.u-reveal{opacity:1}` (visible without JS) with `[data-animate] ` opt-in hooks that JS drives.

- [ ] **Step 3: Wire into a smoke page**

Temporarily import both in `src/pages/index.astro` frontmatter (`import '@/styles/tokens.css'; import '@/styles/base.css';`) and render a heading + paragraph.

- [ ] **Step 4: Verify**

Run: `npm run build` then `npm run dev` and load `/`. Acceptance: Cormorant heading + Alexandria body render; no console errors; no horizontal scrollbar; fonts served locally (Network shows `/_astro` font files, no fonts.googleapis).

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "feat: design tokens, base styles, self-hosted brand fonts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Content model + i18n resolver (test-first)

**Files:**
- Create: `src/lib/i18n.ts`, `src/lib/i18n.test.ts`, `src/i18n/en.json`, `src/i18n/ar.json`, `src/config/site.ts`, `src/config/nav.ts`, `src/config/menu.ts`, `src/config/testimonials.ts`, `src/config/gallery.ts`

**Interfaces:**
- Produces:
  - `type Locale = 'en' | 'ar'`
  - `const LOCALES: Locale[]`
  - `function t(locale: Locale, key: string): string` — dot-path lookup into merged dictionary; returns the key itself if missing (so gaps are visible, never crash).
  - `function dir(locale: Locale): 'ltr' | 'rtl'`
  - `function localizedPath(locale: Locale, hash?: string): string` — `/` or `/ar/` (+ `#hash`).
  - Config exports: `site`, `nav`, `menuCategories`, `testimonials`, `galleryItems` with exported TS types (`SiteConfig`, `NavItem`, `MenuCategory`, `Dish`, `Testimonial`, `GalleryItem`). `Dish` has `{ id; name: Record<Locale,string>; desc: Record<Locale,string>; price: number; currency: string; tags: DishTag[]; image: string; demo: true }`. `DishTag = 'vegetarian'|'vegan'|'spicy'|'contains-nuts'|'dairy'|'gluten-free'|'chef-signature'`.

- [ ] **Step 1: Write failing tests** — `src/lib/i18n.test.ts`
```ts
import { describe, it, expect } from 'vitest';
import { t, dir, localizedPath, LOCALES } from './i18n';

describe('i18n', () => {
  it('resolves a nested EN key', () => {
    expect(t('en', 'nav.menu')).toBe('Menu');
  });
  it('resolves the AR counterpart', () => {
    expect(t('ar', 'nav.menu')).not.toBe('nav.menu'); // has a value
  });
  it('returns the key when missing (visible gap, no throw)', () => {
    expect(t('en', 'does.not.exist')).toBe('does.not.exist');
  });
  it('maps direction', () => {
    expect(dir('en')).toBe('ltr');
    expect(dir('ar')).toBe('rtl');
  });
  it('builds localized paths', () => {
    expect(localizedPath('en')).toBe('/');
    expect(localizedPath('ar')).toBe('/ar/');
    expect(localizedPath('ar', 'menu')).toBe('/ar/#menu');
  });
  it('exposes both locales', () => {
    expect(LOCALES).toEqual(['en', 'ar']);
  });
});
```

- [ ] **Step 2: Run — expect fail**

Run: `npm test`
Expected: FAIL (module/exports missing).

- [ ] **Step 3: Implement `src/lib/i18n.ts`**
```ts
import en from '@/i18n/en.json';
import ar from '@/i18n/ar.json';

export type Locale = 'en' | 'ar';
export const LOCALES: Locale[] = ['en', 'ar'];
const DICT: Record<Locale, unknown> = { en, ar };

export function dir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}
export function localizedPath(locale: Locale, hash?: string): string {
  const base = locale === 'ar' ? '/ar/' : '/';
  return hash ? `${base}#${hash}` : base;
}
export function t(locale: Locale, key: string): string {
  const val = key.split('.').reduce<unknown>(
    (acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined),
    DICT[locale],
  );
  return typeof val === 'string' ? val : key;
}
```

- [ ] **Step 4: Author `en.json` + `ar.json`**

Author complete dictionaries covering: `nav.*` (home, story, menu, experience, delivery, contact, orderNow, langLabel), `hero.*` (eyebrow, title, body, ctaOrder, ctaMenu), `story.*`, `menu.*` (heading, intro, category labels keyed by category id, demoNote, addToOrder, viewDetails, priceFrom, tag labels), `experience.*` (heading + 4 steps), `packaging.*` (heading, body), `why.*` (heading + value props), `delivery.*` (heading, whatsapp, direct, platformsLabel, fields: locations/minOrder/hours/eta/contact, demoNote), `testimonials.*` (heading, demoNote), `gallery.*` (heading), `footer.*` (statement, links, legal, tagline, copyright), `a11y.*` (skipLink, openMenu, closeMenu, langSwitch). EN = final copy. AR = reasonable placeholder translation, and every AR string that is unverified is acceptable as placeholder — add a top-level `"_note": "PLACEHOLDER ARABIC — verify before launch"` in `ar.json`.

- [ ] **Step 5: Author config modules**

Write `site.ts` (all placeholders; delivery platforms Talabat/Deliveroo/Careem/Noon each `{ name, url:'#', enabled:true, demo:true }`; socials Instagram/TikTok placeholders; `whatsapp:'9715XXXXXXXX'`; `phone`, `email`, `serviceAreas`, `hours`, `minOrder`, `deliveryEta`, `seo{titleEn,titleAr,descEn,descAr,ogImage}`). `nav.ts` (6 sections → `{ id, key }`). `menu.ts` (7 categories, 3–4 demo dishes each, every dish `demo:true`, bilingual names/desc, realistic Emirati dishes clearly demo: Machboos Laham, Harees, Thereed, Balaleet, Luqaimat, Khameer, Karak, etc., with placeholder AED prices). `testimonials.ts` (3–4 placeholder quotes, generic first-name + emirate, `demo:true`). `gallery.ts` (8–10 items with `span` values `'wide'|'tall'|'std'` for asymmetry, bilingual alt).

- [ ] **Step 6: Run tests — expect pass**

Run: `npm test && npm run check`
Expected: PASS, 0 type errors.

- [ ] **Step 7: Commit**
```bash
git add -A && git commit -m "feat: i18n resolver + centralized content config (tested)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Emblem + Motif SVG components

**Files:**
- Create: `src/components/ui/Emblem.astro`, `src/components/ui/Motif.astro`

**Interfaces:**
- Produces:
  - `Emblem` props: `{ variant?: 'lockup'|'wordmark'|'icon'; tone?: 'ink'|'sand'|'palm'|'brass'; animated?: boolean; class?: string; title?: string }`. Renders inline SVG: ogee arch + palm + dhow + waterline + wind tower; wordmark "DASTUR" in Cormorant (SVG `<text>` or drawn); tagline caps; diamond ornament. `animated` adds `data-draw` + `pathLength`-normalized strokes for the loader line-draw. `role="img"` + `<title>`.
  - `Motif` props: `{ name: 'arch'|'diamond'|'dhow'|'palm'|'windtower'; class?: string }` → decorative inline SVG (`aria-hidden`).

- [ ] **Step 1: Build `Emblem.astro`**

Inline, single-color SVG using `currentColor` (so `tone`→`color`). Emblem geometry: arch outline (ogee), palm fronds, wind-tower rectangle with vents, dhow hull + triangular sail, wavy waterline. Stroke-based (fill none) for line-draw compatibility; provide a filled fallback via `variant`. Wordmark via `<text font-family="'Cormorant Garamond'">` with letter-spacing; tagline `CONTEMPORARY EMIRATI CUISINE`. Add `stroke-linecap/linejoin round`. When `animated`, set `stroke-dasharray/offset` via CSS class `is-draw` that the GSAP module or a CSS keyframe reveals.

- [ ] **Step 2: Build `Motif.astro`** — small stroke SVGs for arch/diamond/dhow/palm/windtower, `aria-hidden="true"`, `fill="none" stroke="currentColor"`.

- [ ] **Step 3: Smoke-render** — drop `<Emblem variant="lockup" tone="ink" />`, `<Emblem variant="icon" tone="palm" />`, and each Motif into `index.astro`.

- [ ] **Step 4: Verify** — `npm run build && npm run dev`. Acceptance: emblem reads clearly at 64px and 240px; recolors via `tone`; icon-only crops to arch+scene; no raster; no console errors.

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "feat: recolorable SVG emblem + heritage motif components

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase B — Shell

### Task 6: Layout, routing, SEO head, structured data (test-first helpers)

**Files:**
- Create: `src/lib/links.ts`, `src/lib/links.test.ts`, `src/lib/seo.ts`, `src/lib/seo.test.ts`, `src/layouts/Layout.astro`, `src/pages/ar/index.astro`; Modify: `src/pages/index.astro`

**Interfaces:**
- Produces:
  - `links.ts`: `waLink(number: string, message: string): string` (→ `https://wa.me/<digits>?text=<enc>`), `telLink(n): string`, `mailto(e): string`, `orderMessage(locale, dishName?): string`.
  - `seo.ts`: `foodEstablishmentJsonLd(locale): object` (`@type: FoodEstablishment`, `servesCuisine:'Emirati'`, `hasDeliveryMethod`, `areaServed` from placeholders, only verified fields; adds `"_placeholder": true` marker note in a comment-safe way via a `disclaimer` field omitted from output — see impl), `pageMeta(locale): { title, description, canonical, ogImage, hreflang }`.
  - `Layout.astro` props: `{ locale: Locale; title?: string; description?: string }`.

- [ ] **Step 1: Write failing tests** — `links.test.ts`
```ts
import { describe, it, expect } from 'vitest';
import { waLink, telLink, mailto, orderMessage } from './links';

describe('links', () => {
  it('builds a wa.me link with encoded text and digits only', () => {
    const url = waLink('+971 5X XXX XXXX', 'Hello DASTUR');
    expect(url.startsWith('https://wa.me/9715XXXXXXXX')).toBe(true);
    expect(url).toContain('text=Hello%20DASTUR');
  });
  it('builds tel/mailto', () => {
    expect(telLink('+971 5')).toBe('tel:+9715');
    expect(mailto('a@b.co')).toBe('mailto:a@b.co');
  });
  it('order message mentions the dish when provided', () => {
    expect(orderMessage('en', 'Machboos Laham')).toContain('Machboos Laham');
  });
});
```
`seo.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { foodEstablishmentJsonLd, pageMeta } from './seo';

describe('seo', () => {
  it('emits FoodEstablishment with Emirati cuisine + delivery', () => {
    const ld = foodEstablishmentJsonLd('en') as any;
    expect(ld['@type']).toBe('FoodEstablishment');
    expect(ld.servesCuisine).toBe('Emirati');
  });
  it('page meta carries hreflang alternates', () => {
    const m = pageMeta('en');
    expect(m.hreflang.map((h:any)=>h.hreflang)).toEqual(expect.arrayContaining(['en','ar']));
  });
});
```

- [ ] **Step 2: Run — expect fail.** `npm test` → FAIL.

- [ ] **Step 3: Implement `links.ts` and `seo.ts`** to satisfy the tests (digits-only normalization via `replace(/\D/g,'')`; `encodeURIComponent`; JSON-LD builder reads `site` config; `pageMeta` builds absolute canonical from `astro` site + hreflang for en `/` and ar `/ar/`).

- [ ] **Step 4: Build `Layout.astro`**

`<!doctype html><html lang={locale} dir={dir(locale)}>`; `<head>`: charset, viewport, title, description, canonical, OG (`og:title/description/image/type=website/locale`), Twitter card, `hreflang` `<link rel="alternate">` ×2, favicon links, `<link rel="preload">` for the primary Cormorant + Alexandria woff2, theme-color, `<script type="application/ld+json" set:html={JSON.stringify(foodEstablishmentJsonLd(locale))} />`. Import `tokens.css` + `base.css`. `<body>`: skip-link (`a.skip-link` → `#main`), `<slot name="loader" />`, `<slot name="nav" />`, `<main id="main">`, `<slot />`, `<slot name="footer" />`. Deferred `<script>` importing `@/scripts/animations.ts` (added in Task 19; keep an empty module now).

- [ ] **Step 5: Wire pages**

`index.astro`: `<Layout locale="en">` with a placeholder `<h1>` inside `<main>`. `ar/index.astro`: `<Layout locale="ar">`. Create empty `src/scripts/animations.ts` (`export {}`).

- [ ] **Step 6: Verify** — `npm test && npm run check && npm run build`. Acceptance: tests pass; `/` and `/ar/` build; view-source shows correct `lang`/`dir`, hreflang pair, one JSON-LD block, self-hosted font preloads.

- [ ] **Step 7: Commit**
```bash
git add -A && git commit -m "feat: layout, i18n routing, SEO meta + FoodEstablishment JSON-LD (tested)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Loading experience

**Files:** Create: `src/components/shell/Loader.astro`

**Interfaces:** Consumes `Emblem` (`animated`). Produces `#loader` element + an inline, tiny render-blocking-safe script that adds `.is-done` after first paint / on `window.load`, guarded by `sessionStorage` (`dastur.loaded`) and `prefers-reduced-motion` (instant).

- [ ] **Step 1: Build `Loader.astro`** — fixed full-screen overlay in `--oud`/`--sand`, centered `<Emblem variant="icon" animated />` with diamond divider; CSS line-draw keyframe (`stroke-dashoffset`) that runs only `@media (prefers-reduced-motion: no-preference)`; `.is-done` fades/masks it out and sets `pointer-events:none`. Inline script: if `sessionStorage.getItem('dastur.loaded')` OR reduced-motion → add `.is-done` immediately; else on `window.addEventListener('load')` add `.is-done` and set the flag; hard cap via `setTimeout(1400)`.

- [ ] **Step 2: Mount** — place `<Loader slot="loader" />` in both pages.

- [ ] **Step 3: Verify** — dev-load `/`; loader draws emblem then reveals hero; reload → no loader (session flag); with OS reduce-motion → no animation, content immediately visible; never blocks scroll. No CLS on the page behind it.

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "feat: premium emblem line-draw loader (session-once, reduced-motion safe)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Sticky navigation + mobile drawer + language switch

**Files:** Create: `src/components/shell/Nav.astro`, `src/components/ui/LangSwitch.astro`, `src/components/ui/Button.astro`

**Interfaces:** Consumes `nav` config, `t`, `Emblem`, `links`. Produces `<header>` with transparent→scrolled states, active-section indication, accessible drawer.

- [ ] **Step 1: Build `Button.astro`** — props `{ href?; variant:'primary'|'ghost'|'link'; size?; magnetic?; class? }`. Primary = `--palm` fill / `--sand` text; ghost = hairline `--brass`. `data-magnetic` hook for JS (desktop only). Real `<a>`/`<button>`; visible focus ring; ≥44px tap target.

- [ ] **Step 2: Build `LangSwitch.astro`** — two links EN | AR to `localizedPath('en')`/`localizedPath('ar')`; `aria-current` on active; keyboard focusable; `hreflang` on each.

- [ ] **Step 3: Build `Nav.astro`** — `<header data-nav>`: `Emblem variant="wordmark"` (home link) + desktop `<nav>` of `nav` items (anchor to `#id`, underline micro-interaction, `aria-current` when active) + `LangSwitch` + primary **Order Now** (WhatsApp `waLink`). Mobile: hamburger `<button aria-controls="drawer" aria-expanded>` → off-canvas `#drawer` (`role="dialog" aria-modal="true"`), focus-trap, ESC + backdrop close, body scroll-lock while open, labelled by `a11y.openMenu/closeMenu`. Small inline script handles: scrolled state (`IntersectionObserver` on a hero sentinel), active-section (`IntersectionObserver` over sections), drawer open/close + focus trap — all vanilla, ~40 lines, no framework. Transparent over hero using `.section--dark` context; solid/blurred (`backdrop-filter`) after scroll.

- [ ] **Step 4: Mount** — `<Nav slot="nav" locale={locale} />` both pages; add temporary section anchors so active-state can be observed.

- [ ] **Step 5: Verify** — desktop: transparent over hero, blurs on scroll, underline hover, active link updates, Order Now opens correct wa.me. Mobile (≤768): hamburger opens drawer, Tab cycles within, ESC closes, focus returns to trigger, no background scroll, no horizontal overflow. Keyboard-only reachable. `/ar/` mirrors (logo/nav/switch on correct sides). No console errors.

- [ ] **Step 6: Commit**
```bash
git add -A && git commit -m "feat: sticky nav, accessible mobile drawer, language switch, buttons

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Footer / Contact

**Files:** Create: `src/components/shell/Footer.astro`

**Interfaces:** Consumes `site`, `t`, `Emblem`, `Motif`, `links`. Produces `<footer>` with contact, socials, platform links, legal, tagline.

- [ ] **Step 1: Build `Footer.astro`** — `.section--dark` (indigo): `Emblem variant="lockup" tone="sand"`; brand statement; columns — Contact (WhatsApp/phone/email as `wa/tel/mailto` links), Service area + Hours + Min order + ETA (from `site`, each with a `data-placeholder` title), Follow (only enabled socials), Order (only `enabled` platforms). Legal row: Privacy Policy, Terms, Allergen notice (anchor to `#` placeholder pages), © line with year via `new Date().getFullYear()` rendered at build. Final centered line: Motif diamond + `Heritage Inspiration. Modern Experience.` (Cormorant). All contact values are placeholders.

- [ ] **Step 2: Mount** — `<Footer slot="footer" locale={locale} />` both pages.

- [ ] **Step 3: Verify** — build; links use correct schemes; disabled platforms/socials hidden; AA contrast sand-on-indigo; RTL mirrors; tagline present. No overflow at 320px.

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "feat: footer with contact, socials, platforms, legal, tagline

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Phase C — Sections (each builds the component, wires it into both pages, verifies)

Shared: create `src/components/ui/Section.astro` (semantic `<section id aria-labelledby>` + rhythm + optional `--dark`/`--oud`/`--sand` context) and `src/components/ui/Reveal.astro` (wrapper adding `data-animate` + `data-animate-delay`; renders visible by default) in Task 10, reused thereafter.

### Task 10: Page skeleton + Hero

**Files:** Create: `src/components/ui/Section.astro`, `src/components/ui/Reveal.astro`, `src/components/sections/Hero.astro`; Modify: both pages to compose sections.

**Interfaces:** Consumes `t`, `Button`, `Emblem`, `Motif`, extracted `textures/sand-hero`, `illustration/skyline`. Produces `#home` hero + a `<Sections locale>` composition include used by both pages (DRY: put the section composition in a single `src/components/Page.astro` that both routes render with a `locale` prop).

- [ ] **Step 1: Build `Section.astro` + `Reveal.astro`** per contract above.

- [ ] **Step 2: Build `Hero.astro`** — full-viewport `.section--dark` over a warm indigo→oud gradient + `sand-hero` texture (very low opacity) + layered decorative `skyline`/`Motif` dhow & palm at depth (absolutely positioned, `aria-hidden`, `data-parallax` hooks). Content: eyebrow (`hero.eyebrow`), `h1` (`hero.title`, Cormorant, fluid `--fs-8`), lead (`hero.body`), CTAs: primary **Order Now** (`hero.ctaOrder` → wa.me) + ghost **Explore the Menu** (`hero.ctaMenu` → `#menu`). Palm-shadow overlay via CSS (`background` PNG or gradient) with slow `@media no-preference` drift. `data-animate` on eyebrow/h1/lead/cta for staggered JS entrance; readable without JS. Single `h1` on the page lives here.

- [ ] **Step 3: Create `Page.astro`** composing `<Hero/>` (and stubs for later sections as comments/placeholders) inside `<Layout>` slots already handled per-route; refactor `index.astro`/`ar/index.astro` to render `<Page locale=.. />`. Keep loader/nav/footer slots.

- [ ] **Step 4: Verify** — hero fills viewport at 320→1440; text readable over imagery (contrast AA); CTAs work; no CLS; `/ar/` mirrored; skyline decorative only (empty alt / aria-hidden). No overflow.

- [ ] **Step 5: Commit**
```bash
git add -A && git commit -m "feat: page composition, Section/Reveal primitives, cinematic hero

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

### Task 11: Brand Story

**Files:** Create `src/components/sections/Story.astro`; Modify `Page.astro`.
**Interfaces:** Consumes `t` (`story.*`), `illustration/skyline`, `Motif`.
- [ ] **Step 1:** Build `#story` (`--sand`): editorial two-column — left: eyebrow + `h2` "A Story Shaped by Land and Sea" + brand-story paragraphs (land-and-sea, palm/dhow/wind-tower symbolism, heritage + modern presentation + premium delivery); right: arched-masked composition using `skyline` with `Motif` dhow/palm layered at depth. `data-animate` reveals; `data-draw` on an inline skyline stroke path for scroll-draw; `data-drift` on dhow. Arched mask via CSS `clip-path`/SVG.
- [ ] **Step 2:** Wire into `Page.astro` after Hero.
- [ ] **Step 3:** Verify — reads as editorial (not a flat PDF page); AA contrast; RTL mirrors columns; responsive stack on mobile; no overflow.
- [ ] **Step 4:** Commit `feat: brand story section with heritage illustration reveal`.

### Task 12: Signature Menu (+ DishCard, details modal, order link)

**Files:** Create `src/components/sections/Menu.astro`, `src/components/ui/DishCard.astro`; Modify `Page.astro`.
**Interfaces:** Consumes `menuCategories`, `t`, `links.waLink/orderMessage`, `Motif`, demo `menu/*` images. Produces category navigation + dish grid + accessible details modal.
- [ ] **Step 1:** Build `DishCard.astro` — arch-framed image (`<Image>` responsive, lazy, `data-demo`), name (Cormorant) + Arabic name line, short desc, price (`priceFrom` + AED), dietary/spice indicators as **icon + visible label** chips (never color alone), actions: **Add to order** (wa.me with `orderMessage(locale, dishName)`) + **View details** (opens modal). Hover: gentle lift + image zoom (CSS, `no-preference`).
- [ ] **Step 2:** Build `Menu.astro` `#menu` (`--sand`): heading + intro + `demoNote` banner (visible "sample menu — replace" note). Category selector: accessible tablist (`role="tablist"`, arrow-key nav, `aria-selected`) OR anchored subsections; desktop = spacious editorial grid, mobile = horizontal snap carousel per category when it improves usability. Details modal: `role="dialog" aria-modal`, focus-trap, ESC/backdrop close, returns focus. All markup keyboard operable.
- [ ] **Step 3:** Wire into `Page.astro`.
- [ ] **Step 4:** Verify — all 7 categories render, tab/keyboard switch works, dish cards show demo badge, indicators have text labels, Add-to-order composes correct wa.me text (EN + AR), modal traps focus and restores it, mobile carousel scrolls without page overflow, images lazy-load. AA contrast.
- [ ] **Step 5:** Commit `feat: signature menu with dish cards, dietary indicators, order links, details modal`.

### Task 13: The DASTUR Experience

**Files:** Create `src/components/sections/Experience.astro`; Modify `Page.astro`.
**Interfaces:** Consumes `t` (`experience.*`), `Motif` (custom line icons).
- [ ] **Step 1:** Build `#experience` (`--oud` or `--sand`): heading + 4 steps (Select favorites → Prepared fresh → Premium packaging → Delivered). Each step: custom SVG line icon (Motif-style, not a generic icon set), number, title, one line. Sequential `data-animate` reveal along a connecting hairline. Not a heavy 3-col card wall — restrained editorial row that stacks on mobile.
- [ ] **Step 2:** Wire into `Page.astro`. 
- [ ] **Step 3:** Verify — 4 steps legible; icons custom/branded; reveals sequentially; stacks cleanly ≤430px; AA contrast; RTL order mirrors (step 1 starts on the inline-start).
- [ ] **Step 4:** Commit `feat: DASTUR experience journey with custom heritage icons`.

### Task 14: Packaging Showcase

**Files:** Create `src/components/sections/Packaging.astro`; Modify `Page.astro`.
**Interfaces:** Consumes extracted `packaging/*` photos, `t` (`packaging.*`), `Image`.
- [ ] **Step 1:** Build `#packaging` (`--oud` dark, matching PDF closing mood): heading "Crafted Beyond the Kitchen" + supporting line; layered composition of the **real** packaging photos (`<Image>` responsive, quality-preserving, lazy). Tasteful slow parallax on layers and/or a subtle pointer-driven 3D tilt on the hero packaging image (`data-tilt`, desktop + `no-preference` only). **Never distort the package/logo** (no skew/stretch; only translate/scale/rotateX-Y within small bounds). Photos have descriptive alt.
- [ ] **Step 2:** Wire into `Page.astro`.
- [ ] **Step 3:** Verify — real photos crisp; parallax/tilt subtle and disabled on touch/reduced-motion; no distortion; AA contrast of text over dark; responsive; no overflow.
- [ ] **Step 4:** Commit `feat: packaging showcase using real brand photography with tasteful depth`.

### Task 15: Why DASTUR

**Files:** Create `src/components/sections/WhyDastur.astro`; Modify `Page.astro`.
**Interfaces:** Consumes `t` (`why.*`), `Motif`.
- [ ] **Step 1:** Build `#why` (`--sand`): concise value props (authentic Emirati inspiration, contemporary presentation, selected ingredients, freshly prepared, premium packaging, reliable ordering, suits individuals→families). Minimal editorial treatment — a refined 2-column list with hairline dividers + tiny motif marks, generous negative space. NOT repetitive equal cards.
- [ ] **Step 2:** Wire into `Page.astro`.
- [ ] **Step 3:** Verify — minimal, spacious, no card-wall; reveals on scroll; RTL mirrors; responsive.
- [ ] **Step 4:** Commit `feat: minimal editorial "Why DASTUR" value props`.

### Task 16: Delivery & Ordering (conversion)

**Files:** Create `src/components/sections/Delivery.astro`, `src/components/ui/PlatformButton.astro`; Modify `Page.astro`.
**Interfaces:** Consumes `site.deliveryPlatforms/hours/serviceAreas/minOrder/deliveryEta/whatsapp`, `t`, `links`.
- [ ] **Step 1:** Build `PlatformButton.astro` — `{ platform }`; renders only when `enabled`; brand-neutral pill with platform name + arrow (no unverified logos/partnership claims); `data-demo` when demo; external `rel="noopener"`.
- [ ] **Step 2:** Build `Delivery.astro` `#delivery` (`--dark`/branded, skyline motif bg): heading + two primary paths (**Order via WhatsApp** prefilled, **Order Online** direct) + platform grid (only enabled). Config panel: Delivery locations, Minimum order, Operating hours, Expected delivery time, Contact number — each from `site`, each visibly a placeholder (a small "sample" tag + README note). Strong CTA styling.
- [ ] **Step 3:** Wire into `Page.astro`.
- [ ] **Step 4:** Verify — only enabled platforms show; WhatsApp prefill correct (EN/AR); config fields render placeholders; AA contrast on branded bg; responsive; RTL mirrors; no overflow.
- [ ] **Step 5:** Commit `feat: delivery & ordering conversion section (WhatsApp + config-gated platforms)`.

### Task 17: Guest Experiences (testimonials)

**Files:** Create `src/components/sections/Testimonials.astro`; Modify `Page.astro`.
**Interfaces:** Consumes `testimonials`, `t`, `Motif`.
- [ ] **Step 1:** Build `#testimonials` (`--sand`): heading + `demoNote` ("sample guest experiences — replace before launch"). 3–4 refined quote cards (Cormorant quote, generic first-name + emirate, `data-demo`). Accessible; optional simple scroll-snap on mobile. **No** star ratings, no real-person attribution, no counts.
- [ ] **Step 2:** Wire into `Page.astro`.
- [ ] **Step 3:** Verify — clearly placeholder; no fabricated ratings; reveals on scroll; responsive; RTL mirrors.
- [ ] **Step 4:** Commit `feat: guest experiences placeholder testimonials (clearly editable)`.

### Task 18: Gallery

**Files:** Create `src/components/sections/Gallery.astro`; Modify `Page.astro`.
**Interfaces:** Consumes `galleryItems` (with `span`), `Image`, `t`.
- [ ] **Step 1:** Build `#gallery` (`--sand`/`--oud`): heading + **asymmetric editorial masonry** (CSS grid with varied `grid-row/column` spans from `item.span`; NOT an equal grid). Items: meals/packaging/prep/ingredients/family boxes/delivery (demo images, `data-demo`, descriptive bilingual alt, lazy). Gentle hover zoom. Optional lightweight lightbox (keyboard + ESC) — keep minimal; acceptable to link/expand without a heavy library.
- [ ] **Step 2:** Wire into `Page.astro`.
- [ ] **Step 3:** Verify — visibly asymmetric composition; lazy-loads; hover subtle; keyboard reachable; responsive collapse to 1–2 cols; no overflow; AA.
- [ ] **Step 4:** Commit `feat: asymmetric editorial gallery`.

---

## Phase D — Motion & Media

### Task 19: GSAP animation module

**Files:** Modify: `src/scripts/animations.ts`; ensure `Layout.astro` loads it deferred.
**Interfaces:** Consumes `data-animate`, `data-animate-delay`, `data-parallax`, `data-drift`, `data-draw`, `data-magnetic`, `data-tilt` hooks placed by components. Produces no DOM structure — progressive enhancement only.
- [ ] **Step 1: Implement** — dynamic-import GSAP + ScrollTrigger inside a guard:
```ts
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
if (reduce) { /* leave everything visible; do nothing */ }
else { const { gsap } = await import('gsap');
       const { ScrollTrigger } = await import('gsap/ScrollTrigger');
       gsap.registerPlugin(ScrollTrigger); /* build timelines */ }
```
Behaviors: batch `[data-animate]` fade/rise on enter (respect `data-animate-delay` stagger); `[data-parallax]`/`[data-drift]` `y`/`x` on scroll (small, transform-only); `[data-draw]` `strokeDashoffset`→0 tied to scroll; loader→hero handoff timeline; desktop-only (`fine`) `[data-magnetic]` pointer follow, `[data-tilt]` rotateX/Y clamp, and custom cursor element (create/append, hide on leave, none on touch). Everything transform/opacity; `ScrollTrigger.refresh()` on load; no layout writes in scroll handlers beyond transforms.
- [ ] **Step 2: Verify** — animations run on desktop; reduced-motion → none, content fully visible; touch/mobile → no cursor, minimal/no parallax; disabling JS entirely → content fully visible and usable; no CLS introduced (check Performance/Layout Shift); no console errors; Lighthouse still ≥90.
- [ ] **Step 3: Commit** `feat: deferred GSAP animation system (reduced-motion + no-JS safe)`.

### Task 20: AI demo imagery generation + integration

**Files:** Populate `src/assets/menu/*`, `src/assets/gallery/*`, `public/og-image.jpg`; Modify configs if filenames change.
**Interfaces:** Produces brand-toned demo dish/gallery images + OG share image; each flagged `data-demo` in components and listed in README.
- [ ] **Step 1: Generate** demo imagery via an available image-generation skill/tool (warm Emirati dishes: machboos, harees, luqaimat, karak, grills, family box, packaging-in-context, prep detail), brand-toned to sand/oud/palm. Target editorial food photography look. If generation is unavailable, **fallback**: render arch-framed branded placeholders (Emblem/Motif + "replace with photo" label) — components already support this via the demo image slot; document the fallback.
- [ ] **Step 2: Optimize + place** — convert to sized WebP/AVIF sources under `src/assets/menu|gallery`; wire filenames into `menu.ts`/`gallery.ts`; compose a 1200×630 `og-image.jpg`.
- [ ] **Step 3: Verify** — cards/gallery show imagery; `data-demo` present; alt text meaningful; lazy below fold; OG image referenced in head; no layout shift; sizes reasonable (Lighthouse image audits pass).
- [ ] **Step 4: Commit** `feat: demo food/gallery imagery (flagged replaceable) + OG image`.

---

## Phase E — Finalize

### Task 21: SEO finish, favicon, sitemap, robots

**Files:** Create `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png`, `public/robots.txt`; add `@astrojs/sitemap`.
- [ ] **Step 1:** Export emblem icon → `favicon.svg` (+ raster fallbacks + apple-touch). Install + configure `@astrojs/sitemap` in `astro.config.mjs`. `robots.txt` allowing all + sitemap URL (placeholder origin). Confirm canonical/OG/Twitter/hreflang present on both routes and JSON-LD only carries verified/placeholder-flagged fields.
- [ ] **Step 2: Verify** — `npm run build`; `dist/sitemap-index.xml` exists with both routes; favicons resolve; head audit clean; JSON-LD validates (structurally).
- [ ] **Step 3: Commit** `feat: favicon set, sitemap, robots, SEO finalization`.

### Task 22: Responsive + accessibility + cross-check QA pass

**Files:** Fixes across components as needed.
- [ ] **Step 1:** Test breakpoints 320/375/430/768/1024/1280/1440: no horizontal overflow, hero hierarchy, tap targets ≥44px, logo/type never clipped, images load. Fix issues.
- [ ] **Step 2:** A11y sweep: keyboard-only traverse (nav, drawer, menu tabs, modal, gallery, lang switch); visible focus everywhere; single `h1`; heading order; alt text; AA contrast spot-checks (sand/oud, sand/indigo, brass decorative only); reduced-motion path; indicators have text. Fix issues.
- [ ] **Step 2b:** Verify EN and `/ar/` RTL: mirrored layout, correct Arabic fonts, no clipped/broken alignment, switch links correct with `hreflang`.
- [ ] **Step 3: Verify** — `npm run build && npm run check && npm test` all green; manual dev pass clean; **zero console errors/warnings**; no broken internal links/anchors.
- [ ] **Step 4: Commit** `fix: responsive, accessibility, and RTL QA corrections`.

### Task 23: README + Verify-Before-Launch list + final verification

**Files:** Rewrite `README.md`.
- [ ] **Step 1:** Write `README.md`: overview; stack; `npm install/dev/build/preview/check/test`; content-editing guide (where to change strings `src/i18n`, business data `src/config/site.ts`, menu `src/config/menu.ts`, testimonials, gallery, images `src/assets`); how the loader/animations/i18n work; how to add the official logo/licensed fonts; deployment (static host) note. Then a prominent **"Verify Before Launch"** checklist enumerating every placeholder: phone, WhatsApp number, email, delivery-platform URLs + which to enable, operating hours, service areas, minimum order, delivery ETA, social links, final menu + prices + Arabic names, testimonials, Privacy/Terms/Allergen pages, official Antique + GE SS Two font licenses, official logo files, real photography (replace all `data-demo`), canonical `site` origin, OG image.
- [ ] **Step 2: Final verification** — run `npm run build && npm run check && npm test`; `npm run preview` and click every nav link + CTA on `/` and `/ar/`; confirm reduced-motion + no-JS behavior; confirm no console errors. Capture that everything passes.
- [ ] **Step 3: Commit** `docs: README setup/editing guide + verify-before-launch placeholder list`.

---

## Self-Review (spec coverage)

- Loader ✓T7 · Sticky nav/drawer/lang/order ✓T8 · Hero ✓T10 · Brand Story ✓T11 · Menu (+AR names, indicators, order, modal) ✓T12 · Experience ✓T13 · Packaging (real photos) ✓T14 · Why DASTUR ✓T15 · Delivery/ordering (WhatsApp + platforms + config fields) ✓T16 · Testimonials ✓T17 · Gallery ✓T18 · Footer/contact/legal/tagline ✓T9 · Animation system ✓T7/T10-18 hooks/T19 · Backgrounds/motifs ✓T5/T3/sections · Bilingual/RTL ✓T4/T6/T22 · Responsive ✓T22 · A11y ✓T22 + per-section · Perf ✓T1/T3/T19/T20 · SEO/structured data ✓T6/T21 · Assets ✓T2/T20 · Tokens ✓T3 · Content config ✓T4 · Deliverables/README ✓T23.
- Placeholder scan: business data intentionally placeholder + flagged; no plan-language TODOs left.
- Type consistency: `t/dir/localizedPath/Locale`, `waLink/orderMessage`, `Dish/DishTag`, `foodEstablishmentJsonLd/pageMeta`, component prop contracts consistent across tasks.
