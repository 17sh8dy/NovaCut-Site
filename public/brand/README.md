# Nova Cut brand assets

## Where the mark is authored

**`assets/NovaCut.svg` and `assets/NovaCut-small.svg` in the application repository
(`D:\Dev\NovaCut`) are the single source of truth for every icon Nova Cut ships**, and
`npm run icon` there rasterises them into the Windows `.ico`, the macOS `.icns`, the Linux
icon-theme set and the two in-app logos.

The website is a separate project and cannot rebuild those. Everything in this folder is a copy
or a derivative, which is exactly why the next paragraph matters.

**If the mark ever changes, change it in the application repository, re-run `npm run icon`
there, then copy the two SVGs here and regenerate the rasters and lockups below from them.**
Never hand-edit an output, and never let this folder become the place the mark is edited — the
two repositories would drift with nothing to say which one is right.

---

## The mark

The **Nova Mark**: an angular N built from three planes, a blue diagonal slab, a purple lower-left
stem and a detached violet upper-right segment, on a dark navy rounded square (corner radius 228 on
a 1024 viewBox). Full geometry, colour variants and the generator live in the application repository
at `assets/brand/nova-mark/` (see its README); the files here are copies of its **default** variant.

## Two drawings, not one

`symbol-small.svg` is a separate drawing for **32px and below**: the same shapes with a wider channel
between the planes, the glyph slightly larger and no edge hairline, so the detail survives at 16px.
The website's 26px header and footer mark inline it, and `favicon.svg` is the same file. Anything at
48px or larger uses `symbol.svg`.

## The colour

Cyan to blue to indigo down the slab (`#17C3FF`, `#2F7DFF`, `#4B2EFF`), violet for the two detached
planes (`#A87DFF` to `#6A48F7`, `#B58BFF` to `#8458F8`), on a `#0A0E22` to `#0F1531` tile.

The site's UI accent (`#1565FF`) and `--brand-*` tokens predate this mark and are **not** its
colours; they are left alone on purpose. Never apply an accent colour to a brand asset.

---

## Files

| File | Use |
| --- | --- |
| `symbol.svg` | The full mark. Anywhere it appears at **48px or larger**. |
| `symbol-small.svg` | The simplified mark, for **32px and below**. See "Two drawings, not one" above. |
| `symbol-mono.svg` | Single-colour mark using `currentColor` for the body. Inherits the surrounding text colour when inlined, so one file covers light and dark. |
| `lockup-dark.svg` | Full logo — symbol plus wordmark — for **dark** backgrounds. |
| `lockup-light.svg` | Full logo for **light** backgrounds. |
| `lockup-mono.svg` | Full logo in a single `currentColor`, for one-colour reproduction (print, embroidery, an installer bitmap). |
| `favicon.svg` | The browser tab icon. Identical to `symbol-small.svg`. |
| `icon-192.png`, `icon-512.png` | Web app manifest icons. |
| `apple-touch-icon.png` | 180×180, for iOS home screens. |
| `../og-image.png`, `../og-image.webp` | 1200×630 social sharing card. |

The wordmark in the lockups is **live text** (Inter, falling back to the system UI font), because the
old stroked-path wordmark spelled "Open Cut" and has not been redrawn. Convert to outlines before
using a lockup anywhere the font may be missing.

The website header does not use a lockup file — it inlines the **simplified** symbol next to real
HTML text, so the wordmark stays selectable, searchable and correctly sized at every breakpoint,
and the 26px mark beside it stays legible.

---

## Using it

- Give the mark clear space of at least **one quarter of its own width** on every side.
- Minimum size: **16 px** for the simplified symbol, **48 px** for the full one, **110 px** wide
  for the lockup. Below those the frames stop separating and the mark reads as a blue square.
- Put the light lockup on dark surfaces and the dark lockup on light ones. On a photograph or a
  screenshot, use `lockup-mono.svg` in white over a scrim.
- **Shadows on the mark must use `filter: drop-shadow`, never `box-shadow`.** The artwork has
  transparent rounded corners, and a box-shadow traces the element's square box — showing through
  those corners as four bright triangles.
- Do not recolour the gradient, rotate the mark, add an outline, place it on a coloured tile, or
  stretch it to a non-square aspect ratio.

## Regenerating the rasters

The PNGs here were rendered from `symbol.svg` at their exact target sizes rather than downscaled
from one large export, so each size is sharp. Render them from the SVG at the size you need; do
not resample an existing PNG.
