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

A rounded square in the brand blue holding two overlapping translucent frames — one tilted 12°
behind the other — with a white play triangle at the centre and two corner brackets marking
opposite corners.

It reads as the thing the product does: **frames** stacked on a **timeline**, a **play** control,
and framing **brackets** from a viewfinder. It is deliberately not a pair of scissors.

On a 1024 viewBox: the body is edge-to-edge with a corner radius of 228; the artwork sits in a
group translated to (512, 520); the back frame is 480×320 at radius 40 rotated −12° at 35%
opacity, the front frame 512×352 at radius 40 at 25%; the triangle spans (−56,−56) → (−56,56) →
(64,0); the brackets are 12px round-capped strokes at (−200,−136) and (200,104).

## Two drawings, not one

`symbol-small.svg` is a **separate, simplified drawing** for small sizes: one frame at full
opacity, a knocked-out triangle, no brackets, no rotation.

It exists because the full artwork does not survive being shrunk. At 16px the 25% and 35%
opacities converge on the background, the 12px bracket strokes fall below one pixel, and the
triangle merges into the frame behind it — the icon becomes a plain blue square. That was
rendered and compared before this was written, not assumed.

The threshold is **32px**: at or below it, use the simplified drawing. The application applies
this in `scripts/make-icons.cjs` (16/24/32) and again in CSS for the 22px title-bar mark; the
website applies it for the 26px header and footer mark. Anything at 48px or larger takes the
full artwork.

This is ordinary practice, and the reason `.ico` is a multi-image format in the first place: an
icon is not one drawing scaled, it is a family drawn per size.

## The colour

The mark is a **single flat blue**, `#0A84FF`.

`--brand-deep` and `--brand-sky` in the stylesheets are a shade and a tint of it at the same hue
(210°). They are **not in the artwork** — they exist only to give large brand type and the 2px
page rule somewhere to travel, and nothing meant to match the icon may use them.

| Token | Value | In the artwork? |
| --- | --- | --- |
| `--brand-blue` | `#0A84FF` | **Yes — this is the mark** |
| `--brand-deep` | `#0059B3` | No, a shade for gradients only |
| `--brand-sky` | `#70B8FF` | No, a tint for gradients only |

The frames and triangle are white, at 25% / 35% / 100% opacity.

**The brand is not the accent, and here they are different values.** The UI accent is `#1565FF`,
not the mark's `#0A84FF`, because the mark's blue measures **3.65:1** under white text — below
the 4.5:1 a button label needs. They were the same value until the logo changed. Never apply an
accent colour to a brand asset, and never assume the two should match: check the contrast first.

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
| `favicon.svg` | The browser tab icon. Identical to `symbol.svg`. |
| `icon-192.png`, `icon-512.png` | Web app manifest icons. |
| `apple-touch-icon.png` | 180×180, for iOS home screens. |
| `../og-image.png`, `../og-image.webp` | 1200×630 social sharing card. |

The wordmark in the lockups is drawn as **stroked paths**, not live text, so the files render
identically on a machine that has never heard of the site's font stack. Its round caps and joins
echo the symbol's corner radius.

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
