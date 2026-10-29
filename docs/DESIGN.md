# DESIGN.md: Pastel-retro reference (polymathapp.net)

## Source
- URL: https://www.polymathapp.net/
- Capture date: 2026-10-29
- Evidence: fetched HTML + compiled stylesheet (`.firecrawl/polymath.html`, `.firecrawl/polymath.css`). Firecrawl screenshot unavailable (no credits). No copy, images, logos or font files are reused — only the visual language.

## Design Summary
A friendly "pastel retro" look: white pages with very light grey alternating sections, hairline grey borders, almost no shadows, fully rounded pill buttons and tags, large extrabold tight-tracked Inter headlines, a Windows-95 style pixel font for secondary copy, and a handwriting font for tags and asides. Accents are soft lavender / pink / mint / steel-blue; status colours are saturated mint / amber / coral. Decoration = blurred pastel blobs floating behind the hero and a slowly spinning pixelated 3D cube.

## Design Tokens

### Colors (observed; oklch converted to approximate hex)
| Role | Value |
|---|---|
| base-100 (page/card) | `#ffffff` |
| base-200 (alt section) | `#f8fafc` |
| base-300 / border | `#e5e7eb` (border-gray-200), `#d1d5db` |
| text-strong | `#1f2937` |
| text-body | `#374151` (gray-700) |
| text-muted | `#4b5563` / `#6b7280` / `#9ca3af` |
| primary (lavender) | `#d6c3dd`, text on primary `#2a2330` |
| secondary (pink) | `#f8ccd4` |
| accent (mint) | `#bfe9db` |
| neutral (steel blue) | `#73abc5` |
| success | `#00ca92` · warning `#ffc22d` · error `#ff6f70` · info `#00b3f0` |
| blob tints | blue-50 `#eff6ff`, purple-50 `#faf5ff` (blur 24px, mix-blend-multiply, opacity .7) |

### Typography
- Display/UI: **Inter** (400/600/800). H1 `3.5rem → 4.5rem`, `font-weight:800`, `letter-spacing:-0.05em`, `line-height:1`. H2 `1.875rem → 2.25rem`, 800, `-0.05em`.
- Secondary copy: pixel/system font (site uses a W95 recreation). Open substitute: **Pixelify Sans** (or VT323). Used for subtitles, section paragraphs, eyebrow labels; `letter-spacing:normal`, `line-height:1.6`, `1.125rem`.
- Playful tags/asides: handwriting (site uses a custom hand font). Open substitute: **Caveat**. Used in pill tags (`text-sm`), by-lines, strike-through "before/after" lines.
- Body size `0.875rem` (text-sm) for controls; `text-gray-700`.

### Spacing And Layout
- Content width `max-w-4xl/5xl` (56–64rem) centred; sections `py-12 sm:py-20 px-8`.
- Sections alternate white / base-200; footer base-200 with `border-top 1px gray-200`, `py-12`.
- Radii: button/pill `9999px` (`--rounded-btn:1.9rem`), card `1.5rem` (rounded-3xl), inputs `0.5rem` (rounded-lg), tabs `0.7rem`.
- Shadows: buttons only `0 1px 2px rgba(0,0,0,.05)`; cards rely on border, not shadow.
- Gaps `0.5rem` (gap-2) between inline pills; `1rem` grid gaps.

## Components
- **Button**: inline-flex, height 3rem, padding 0 1rem (hero: 0 2.5rem), font 600 / 0.875rem, radius pill, 1px border same colour as bg, transition .2s, `button-pop` keyframe on mount, `transform:scale(.95)` on active. Primary = lavender bg, dark text. Ghost = base-200 bg.
- **Tag/pill**: `px-4 py-2 bg-base-100 rounded-full text-sm text-gray-700` in handwriting font; sits on base-200 sections.
- **Input**: `px-4 py-3 border rounded-lg`, focus border primary, no ring.
- **Card**: white, 1px `#e5e7eb` border, radius 1.5rem, padding 1.5rem.
- **Hero**: centred H1 + pixel-font subtitle + CTA pill; two blurred blobs absolutely positioned at `top:7.5rem left:25%` and `right:25%`, `w-72 h-44`, `animate-blob` (translate/scale drift ~7s).
- **Decor cube**: CSS 3D cube, faces `image-rendering:pixelated`, `polymath-cube-spin` rotateX/Y 360° ~20s linear infinite; `float` 6s ease-in-out translateY(-20px).

## Page Patterns
Header (logo + wordmark in pixel font + pill links) → hero → alternating feature sections (text left / visual right, `lg:flex-row`, `lg:gap-16`) → tag cloud of pills → CTA → footer. Mobile: single column, full-width buttons (`max-sm:w-full`).

## Content Style (style only)
Short lowercase-ish headlines, one-sentence pixel-font subtitles, handwriting "before → after" contrasts. Not reused here.

## Agent Build Instructions (for this project)
1. Load Inter, Pixelify Sans and Caveat with `next/font/google`; expose CSS vars `--font-ui`, `--font-pixel`, `--font-hand`.
2. Replace the current green palette in `web/app/globals.css` with the tokens above: page bg base-200, cards white rounded 1.5rem with `#e5e7eb` border and no shadow; `.control` → pill button 3rem tall, 600 weight; `.control.primary` → lavender; `.pill` → handwriting tag; `.pill.bad` coral tint `#ffe3e3/#b3261e`, `.pill.warn` amber tint `#fff3cc/#7a5a00`, safe mint tint `#dff7ee/#0f6b4f`.
3. Headings: `.heading` Inter 800 `-0.03em`; add `.display` for page H1 (3rem+, 800, `-0.05em`) and `.eyebrow` (pixel font, uppercase-free, gray-500).
4. Add a compact hero to both pages: wordmark + H1 + pixel-font subtitle + status tags; blurred blobs behind; small spinning pixel cube at right.
5. Tabs: pill group on base-200, active = white with border.
6. Chart colours: humidity lavender-dark `#8b6fa3`, temperature coral `#ff6f70`, safe band mint `#bfe9db`, thresholds amber.
7. Keep semantic wire colours in the hardware SVG; recolour board/labels to the grey/pastel palette.

## Rerun Inputs
workflow: firecrawl-website-design-clone
source_url: https://www.polymathapp.net/
target_stack: Next.js 15 + handwritten CSS (web/app/globals.css)
output: docs/DESIGN.md
