# DASTUR — Contemporary Emirati Cloud Kitchen — Website Design Spec

**Date:** 2026-07-14
**Status:** Approved (design), pending implementation plan
**Source of truth for visuals:** `DASTUR Brand Guidelines D3.pdf` (12 pages, studied in full)

---

## 1. Goal & Constraints

Build a premium, production-ready, fully responsive **one-page marketing site** for DASTUR, a
contemporary Emirati **cloud kitchen**. The site introduces the brand, tells its story, presents
menu categories, showcases premium packaging, and converts visitors into orders.

**It is a cloud kitchen** — therefore: **no dine-in reservations, no table booking, no dining-room
availability.** Primary actions are: **Order Now**, **View Menu**, **Order via WhatsApp**,
**Choose a Delivery Platform**.

**Honesty constraints (hard):**
- Do not invent business details. All business data (phone, WhatsApp, email, hours, service areas,
  minimum order, delivery ETA, socials, delivery-platform links, menu items, prices) are
  **configurable placeholders**, clearly flagged, and collected in a "Verify Before Launch" list.
- No fake ratings, no falsely attributed testimonials, no unverified awards, no unconfirmed
  delivery partnerships. Testimonials are clearly-editable placeholder data.
- Demo imagery (AI-generated dishes/gallery) is tagged `data-demo` and listed as replaceable.
- Do not present invented menu data as final/approved.

## 2. Confirmed Decisions

| Decision | Choice |
|---|---|
| Framework | **Astro 5 + TypeScript** |
| Styling | Hand-crafted **CSS + design tokens** (CSS custom properties), scoped per component |
| Animation | **GSAP + ScrollTrigger**, single deferred client module |
| Imagery | **AI-generated demo** dish/gallery images (flagged, replaceable) + **real packaging photos extracted from the PDF** |
| Bilingual | **EN + Arabic RTL**; route-based (`/` en, `/ar/` ar); English final; Arabic = clearly-marked placeholder ("verify before launch") |

## 3. Brand System (extracted from the PDF — authoritative)

### 3.1 Emblem
Islamic **ogee arch** framing three heritage symbols: a **palm tree**, a **dhow** on a water line,
and a **wind tower (barjeel)** — rendered as fine line art. Beneath it the **DASTUR** wordmark
(elegant high-contrast serif) with a small **diamond ornament** divider flourish, and the tagline
`CONTEMPORARY EMIRATI CUISINE` in letter-spaced caps. Three lockups exist: **vertical**,
**wordmark-only**, **icon-only**. Designed to sit on all four brand colors.

- The logo/wordmark are **vector** in the PDF (font-drawn). We **rebuild the emblem as clean SVG**
  (recolorable + line-draw animatable) and set the wordmark in Cormorant Garamond. Official
  licensed Antique/logo files should replace these for pixel-perfect final.
- Rule: never stretch, crop, recolor outside the palette, or distort the logo.

### 3.2 Palette (PDF page 6 — matches brief exactly)
| Token | Name | Hex | Usage |
|---|---|---|---|
| `--indigo` | Midnight Indigo | `#1C2630` | Dark premium sections, nav (scrolled), footer |
| `--palm` | Palm Green | `#354F40` | Buttons, active states, packaging refs, key accents |
| `--oud` | Oud Brown | `#3B2A1E` | Body typography, heritage illustration, overlays, warm contrast |
| `--sand` | Desert Sand | `#E6D7C3` | Primary backgrounds, cards, soft neutral surfaces |

Derived neutrals (paper/cream lighter surfaces, tints/shades of the above) allowed. One decorative
warm accent `--brass #B08D57` for hairlines / diamond ornament / fine detail — **decorative only,
never a text-contrast dependency**. No unrelated bright colors. Maintain **WCAG AA** contrast.

### 3.3 Typography (PDF page 7)
| Role | Brand font | Web implementation (self-hosted woff2) |
|---|---|---|
| Headings / wordmark | Antique (high-contrast serif) | **Cormorant Garamond** |
| Body (Latin) | Alexandria | **Alexandria** (exact; on Google Fonts) |
| Arabic display | GE SS Two | **Tajawal** (nearest free) |
| Arabic body | Alexandria | **Alexandria** (Arabic subset) |

Editorial large headings, comfortable measure, generous spacing, refined letter-spacing, strong
hierarchy, correct RTL rendering. Self-hosted for LCP + no external requests + no CLS
(`font-display: swap`, preload primary faces).

### 3.4 Heritage illustration (PDF page 8)
Detailed monochrome (oud) engraving-style skyline: wind towers, domes, minarets, forts, palms,
dhows on water. Has a transparency mask → **extractable** as a decorative line-art band. We also
build lightweight SVG motifs (arch, diamond, dhow, wind tower, palm) for icons/decoration.
**Do not** paste a PDF page as one flat background — reinterpret the visual language.

### 3.5 Packaging (PDF pages 9–11)
Real photographic mockups — **extracted and optimized** for the Packaging Showcase:
green bento carry-box; cream rope-handle truncated-pyramid boxes; cream spoon carry-box; kraft bag
with green band. Page 10 is a 300 ppi asset. All feature the engraved skyline.

### 3.6 Closing atmosphere (PDF page 12)
Oud-brown textured field, centered emblem, diamond divider, tagline
**"HERITAGE INSPIRATION. MODERN EXPERIENCE."**, faded skyline + drifting dhow, palm shadow.
Tagline used as the footer's final line.

## 4. Information Architecture (section order)

1. **Loader** — SVG emblem line-draw + mask reveal (~1.2s), non-blocking, shown once per session
   (`sessionStorage`), instant under reduced-motion.
2. **Sticky Nav** — logo; Home, Our Story, Menu, Experience, Delivery, Contact; EN/AR switcher;
   prominent **Order Now**. Transparent over hero → blurred/solid after scroll; active-section
   indication; accessible mobile drawer (focus-trap, ESC, keyboard).
3. **Hero** — eyebrow *Contemporary Emirati Cuisine*; H1 *Emirati Heritage, Reimagined for Today*;
   supporting copy; CTAs **Order Now** + **Explore the Menu**. Layered depth: sand texture, drifting
   palm-shadow overlay, subtle skyline/dhow/wind-tower line-art layers, sparing grain. Logo line
   reveal + staggered headline + soft image scale-in.
4. **Brand Story** — *A Story Shaped by Land and Sea*; editorial layout; skyline draws in on scroll;
   dhow drifts along a waterline; palm layers at depth; arched image mask. Land-and-sea symbolism.
5. **Signature Menu** — configurable categories: Signature Rice Dishes, Emirati Favorites, Grills &
   Mains, Sides & Starters, Desserts, Beverages, Family & Sharing Boxes. Dish card: image, name
   (+ Arabic name when bilingual), short description, price, dietary/spice indicator (icon **and**
   label), Add-to-order (WhatsApp prefilled) / View Details (modal). Editorial + spacious on desktop;
   optional mobile carousel per category. Sample content clearly marked demo.
6. **The DASTUR Experience** — 4 steps: Select favorites → Prepared fresh in the DASTUR kitchen →
   Packed in premium secure packaging → Delivered to your door. Custom SVG line icons; sequential
   reveal.
7. **Packaging Showcase** — *Crafted Beyond the Kitchen*; real extracted photos; tasteful layered
   parallax / 3D tilt; **no logo distortion**.
8. **Why DASTUR** — concise value props (authentic inspiration, contemporary presentation, selected
   ingredients, freshly prepared, premium packaging, reliable ordering, suits individuals/families).
   Minimal editorial treatment — **not** repetitive three-column cards.
9. **Delivery & Ordering** — WhatsApp order (prefilled message), direct order, and **only-enabled**
   platforms (Talabat, Deliveroo, Careem, Noon Food — config-gated, no unconfirmed partnerships).
   Config fields: delivery locations, minimum order, operating hours, expected delivery time, contact
   number. Strong CTA on branded (indigo/oud) background with skyline motif.
10. **Guest Experiences** — small refined testimonial section; clearly-editable placeholder data;
    **no** fabricated ratings or real-person attribution.
11. **Gallery** — asymmetric editorial masonry (not an equal grid): meals, packaging, prep,
    ingredients, family boxes, delivery presentation. Lazy-loaded.
12. **Contact / Footer** — logo; short brand statement; WhatsApp, phone, email; service area; hours;
    Instagram + configured socials; delivery-platform links; Privacy Policy, Terms, Allergen notice;
    copyright; final line **"Heritage Inspiration. Modern Experience."**

## 5. Content Model (centralized; all demo data flagged)

- `src/config/site.ts` — brand meta; contact (phone, WhatsApp, email); serviceAreas[]; hours;
  minOrder; deliveryEta; socials[]; deliveryPlatforms[] (`{ name, url, enabled }`); SEO defaults;
  OG image. All values placeholders.
- `src/i18n/en.json`, `src/i18n/ar.json` — **every** UI string and section copy, keyed. EN final;
  AR placeholder (flagged verify).
- `src/config/menu.ts` — categories → dishes `{ id, name{en,ar}, desc{en,ar}, price, currency,
  tags[], image, demo:true }`.
- `src/config/testimonials.ts` — `{ quote{en,ar}, author, location, demo:true }`.
- `src/config/gallery.ts` — `{ image, alt{en,ar}, tag, span }` (span drives asymmetry).
- `src/config/nav.ts` — sections + labels (i18n keys).

## 6. Component Inventory

**Layout/shell:** `Layout.astro` (head: SEO/meta/OG/Twitter/canonical/favicon/JSON-LD, font preload,
tokens, `lang`/`dir`, skip-link, reduced-motion), `Loader.astro`, `Nav.astro`, `Footer.astro`.

**Sections:** `Hero`, `Story`, `Menu`, `Experience`, `Packaging`, `WhyDastur`, `Delivery`,
`Testimonials`, `Gallery`, `Contact` (Contact may fold into Footer).

**Shared UI:** `Button.astro` (magnetic primary), `Section.astro` (rhythm wrapper), `Reveal.astro`
(scroll-reveal wrapper), `Emblem.astro` (recolorable/animatable SVG logo), `Motif.astro`
(arch/diamond/dhow/palm/wind-tower SVGs), `DishCard`, `PlatformButton`, `LangSwitch`, `Modal`,
`Drawer`.

Each component: one clear purpose, well-defined props, independently understandable. No enormous
single component; no duplicated markup; no inline styles unless technically justified.

## 7. Bilingual / RTL

Route-based: `/` (en, default), `/ar/` (ar). Same components take a `lang` prop; strings from i18n
JSON. `<html lang dir>` set per route; layout mirrors via **CSS logical properties**
(`margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`). `hreflang` alternates +
switcher links between routes. Arabic display uses Tajawal, body Alexandria. No hard-coded
left/right that breaks RTL. Machine Arabic is **placeholder only**, clearly flagged.

## 8. Animation System

Single deferred GSAP module (loaded on idle / after paint). Master timeline handles loader→hero
handoff. ScrollTrigger drives: editorial text reveals, arched image-mask reveals, skyline
stroke-draw (`stroke-dashoffset`), dhow x-drift along waterline, palm parallax at depth, packaging
layer separation-and-return, section color/texture transitions. Micro-interactions: magnetic primary
buttons, nav-link underline, gentle card lift + image zoom, desktop-only custom cursor (fine-pointer
+ hover capable), refined focus/active/pressed states, smooth accordion/modal transitions.

**Rules:** animate deliberately (not everything); no bouncing/neon/spinning/generic template FX;
**transform + opacity only**; no layout shift; smooth on mid-range mobile; simplify/disable expensive
effects on small screens (no custom cursor, reduced parallax); fully honor `prefers-reduced-motion`;
site fully usable with **JS disabled** (IntersectionObserver fallback reveals content; if GSAP absent,
elements are visible by default).

## 9. Accessibility (WCAG 2.1 AA target)

Semantic landmarks; single `h1`; logical heading order; skip link; visible focus indicators;
keyboard-operable nav/drawer/modal with focus-trap + ESC; descriptive alt text; AA contrast (verify
oud-on-sand, sand-on-indigo/oud; brass decorative only); spice/dietary conveyed by **icon + text**
(never color alone); labeled form fields + error messaging where forms exist; ARIA only where
genuinely required; reduced-motion support; no text baked only into images.

## 10. SEO & Performance

**SEO:** page title, meta description, canonical (placeholder), Open Graph + Twitter cards,
`hreflang` en↔ar, favicon from emblem, social share image, descriptive anchor text.
**Structured data:** `FoodEstablishment` adapted to a delivery-focused cloud kitchen
(`servesCuisine: Emirati`, delivery available, `areaServed` placeholders); `Organization` /
`LocalBusiness` fields only when verified business data is supplied — otherwise clearly flagged
placeholders / omitted.

**Performance targets:** Lighthouse ≥ 90 (realistic); optimized Core Web Vitals; minimal CLS; fast
LCP. Astro static output, near-zero shipped JS, GSAP deferred; images WebP/AVIF, responsive
`srcset`, lazy below fold; self-hosted woff2 + preload + `font-display: swap`; no autoplay AV; no
unnecessary heavy dependencies.

## 11. Assets Pipeline

1. `pdfimages` extract packaging photos (pp. 9–11), skyline illustration (p. 8, w/ mask), closing
   texture (p. 12); keep originals in `src/assets/`, optimize to WebP/AVIF via Astro `<Image>`/sharp.
2. Rebuild emblem as SVG (`Emblem.astro`) + motif SVGs; wordmark in Cormorant.
3. Generate AI demo dish/gallery imagery (brand-toned) → tag `data-demo`, add to placeholder list;
   fallback = arch-framed branded placeholders.
4. Favicon set from emblem icon; composed OG/Twitter image.
5. All images: meaningful alt (bilingual), correct sizes, lazy below fold.

## 12. Design Quality Guardrails (do NOT)

Generic restaurant template · excessive rounded cards · bright gradients · glassmorphism everywhere ·
floating blobs · cartoon food icons · oversized badges · repetitive 3-col card walls · heavy
shadows/borders · distracting bg video · competing typefaces · fake stats/awards/partnerships ·
dine-in reservations. Preserve large negative space; contemporary + culturally grounded, not
over-ornamental.

## 13. Deliverables

Complete one-page site (responsive 320 → 1440px+), premium animation system, reusable components,
centralized tokens + content, EN + Arabic-ready layout, optimized assets, a11y + SEO + structured
data, **README** (setup + content-editing guide), and a **"Verify Before Launch" placeholder list**:
phone, WhatsApp, email, platform URLs, hours, service areas, min order, ETA, socials, final
menu/prices, testimonials, legal pages (Privacy/Terms/Allergen), official logo + licensed
Antique/GE SS Two font files, real photography.

## 14. Verification (post-implementation)

Run dev build; lint + typecheck; test every nav link + CTA; test 320/375/430/768/1024/1280/1440
layouts; keyboard nav; reduced-motion; console clean; image/loading performance; verify EN + Arabic
RTL. Fix all issues before final hand-off.
