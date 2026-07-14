# DASTUR — Contemporary Emirati Cuisine (Cloud Kitchen)

A premium, bilingual (English / Arabic-RTL), fully responsive one-page marketing
site for **DASTUR**, a contemporary Emirati cloud kitchen. Built to the DASTUR
brand guidelines: heritage emblem, palette, typography and packaging.

> **Heritage Inspiration. Modern Experience.**

---

## Tech stack

- **Astro 7** (static output, near-zero client JS) + **TypeScript**
- Hand-crafted **CSS design tokens** (no utility framework) — `src/styles/tokens.css`
- **GSAP-free** progressive-enhancement animation (`src/scripts/animations.ts`) —
  reveals, parallax, magnetic buttons, tilt; all `prefers-reduced-motion` aware
- Self-hosted fonts via `@fontsource` (Cormorant Garamond, Alexandria, Tajawal)
- **Vitest** unit tests for the logic layer (i18n, links, SEO)
- Images optimized to WebP/AVIF at build via `sharp`

## Commands

```bash
npm install       # install dependencies
npm run dev       # local dev server (http://localhost:4321)
npm run build     # production build → dist/
npm run preview   # serve the production build
npm run check     # astro check + tsc typecheck
npm run test      # run unit tests (Vitest)
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

---

## Project structure

```
src/
  config/        # ← edit business data & content here
    site.ts        contact, hours, areas, delivery platforms, socials, SEO
    menu.ts        menu categories + dishes (demo)
    testimonials.ts guest experiences (demo)
    gallery.ts     gallery items (real packaging photos + demo tiles)
    nav.ts         navigation sections
  i18n/
    en.json        ← final English copy
    ar.json        ← PLACEHOLDER Arabic (needs native review)
  assets/          images (packaging extracted from the brand PDF, textures, illustration)
  styles/          tokens.css (brand tokens) + base.css
  components/
    ui/            Emblem, Motif, Button, DishCard, PlatformButton, LangSwitch, Section
    shell/         Loader, Nav, Footer
    sections/      Hero, Story, Menu, Experience, Packaging, WhyDastur, Delivery, Testimonials, Gallery
    Page.astro     one-page composition (rendered by both routes)
  layouts/Layout.astro   <head>, SEO, JSON-LD, fonts, skip-link, lang/dir
  lib/             i18n.ts, links.ts, seo.ts (tested)
  pages/
    index.astro    English (/)
    ar/index.astro Arabic (/ar/)
scripts/
  extract-pdf-assets.sh   re-extract brand assets from the guidelines PDF
```

## How to edit content

| I want to change… | Edit |
|---|---|
| Any on-screen text | `src/i18n/en.json` (and `ar.json` for Arabic) |
| Phone / WhatsApp / email / hours / areas / platforms / socials | `src/config/site.ts` |
| Menu categories, dishes, prices, dietary tags | `src/config/menu.ts` |
| Testimonials | `src/config/testimonials.ts` |
| Gallery images | `src/config/gallery.ts` + add files to `src/assets/` |
| Brand colors, type scale, spacing, motion | `src/styles/tokens.css` |
| Dish / gallery photos | drop real images into `src/assets/menu` / `src/assets/gallery` and reference them (`image:` field). Demo tiles render automatically when no image is set. |

### Language / RTL

Two static routes are generated from the same components: `/` (English) and
`/ar/` (Arabic, `dir="rtl"`). The switcher in the header links between them.
Layout mirrors automatically via CSS logical properties. Arabic display text uses
**Tajawal** (a licensed-friendly stand-in for GE SS Two).

### Logo & fonts

The emblem is a faithful **SVG reconstruction** (`src/components/ui/Emblem.astro`)
so it scales, recolors and animates (loader line-draw). For pixel-perfect final
production, drop in the official licensed logo files and the licensed **Antique**
and **GE SS Two** fonts, then point the font stacks in `tokens.css` at them.

---

## ⚠️ Verify Before Launch (placeholder data)

Everything below is a **placeholder** and must be replaced with verified business
information. Nothing here is confirmed or approved.

**Business details** (`src/config/site.ts`)
- [ ] Phone number (`contact.phone`)
- [ ] WhatsApp number (`contact.whatsapp`) — drives every "Order Now" / order link
- [ ] Email (`contact.email`)
- [ ] Service / delivery areas (`serviceAreas`)
- [ ] Operating hours (`hours`)
- [ ] Minimum order (`minOrder`)
- [ ] Expected delivery time (`deliveryEta`)
- [ ] Direct online-ordering URL (`orderOnlineUrl`)
- [ ] Social links (`socials`) — set `enabled` per confirmed account
- [ ] Delivery platforms (`deliveryPlatforms`) — **only enable confirmed partnerships**
      (Talabat / Deliveroo / Careem / Noon are scaffolded, `enabled` + `demo`)
- [ ] Canonical origin — `site` in `astro.config.mjs`, `ORIGIN` in `src/lib/seo.ts`,
      and the Sitemap URL in `public/robots.txt`

**Content**
- [ ] Final menu: dishes, descriptions, prices, dietary tags (`src/config/menu.ts`) —
      all currently marked `demo: true`
- [ ] Approved Arabic translations (`src/i18n/ar.json` — currently machine-assisted draft)
- [ ] Approved Arabic dish names
- [ ] Real testimonials (`src/config/testimonials.ts`) — do **not** publish the
      samples as verified reviews
- [ ] Legal pages: Privacy Policy, Terms & Conditions, Allergen Notice
      (links in `src/config/site.ts → legal`)

**Media**
- [ ] Replace all `data-demo` imagery (menu cards, gallery tiles) with real photography
- [ ] Official logo files + licensed Antique / GE SS Two fonts
- [ ] Open Graph share image (`public/og-image.jpg`) — currently a packaging photo

**Structured data** (`src/lib/seo.ts`)
- [ ] `FoodEstablishment` JSON-LD omits address/geo/telephone by design (cloud
      kitchen). Add verified fields (and `Organization`/`LocalBusiness`) only once
      confirmed.

---

## Accessibility & performance notes

- Semantic landmarks, single `h1`, keyboard-operable nav drawer + menu tabs + dish
  modal (native `<dialog>` with focus trap), visible focus rings, skip link.
- Dietary/spice indicators use **icon + text** (never color alone).
- `prefers-reduced-motion` fully honored; the site is completely usable with
  JavaScript disabled (content is visible by default; JS only enhances).
- Images are responsive + lazy-loaded below the fold; fonts self-hosted.

## Re-extracting brand assets

```bash
bash scripts/extract-pdf-assets.sh "/path/to/DASTUR Brand Guidelines D3.pdf"
```
Pulls packaging photos, the heritage skyline (transparent PNG) and textures into
`src/assets/`. Requires `poppler` (`brew install poppler`).
