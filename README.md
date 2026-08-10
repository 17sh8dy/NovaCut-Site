# Open Cut — website

The official website for Open Cut. Static, zero-dependency, and built so that shipping a new
version of the app is one edit in one file.

**This is a separate project from the application.** The website lives at `D:\Dev\OpenCutSite`
and the Open Cut application at `D:\Dev\OpenCut`; nothing here imports from there, and the build
never reads the application's source. Paths in this document that name application files —
`assets/OpenCut.svg`, `packages/ui/src/theme/tokens.css` — are relative to the **application**
repository.

```bash
npm run dev      # build, then serve on http://localhost:4321
npm run build    # build into dist/
npm run check    # build, then verify links, anchors, assets, alt text, metadata and escaping
npm run preview  # serve an existing dist/
```

There is nothing to `npm install`. The build is Node's standard library, and `dist/` is plain
HTML, one stylesheet, one ~3 KB script and a handful of images.

---

## Releasing a new version

**Everything version-related lives in [`data/site.js`](./data/site.js).** No page, template or
stylesheet hard-codes a version number, a file size, a download URL or a platform claim.

1. Set `releaseStatus` to `'released'`.
2. Set `version` and `releaseDate`.
3. Put the real, tested URLs in `platforms.windows.builds[*].url`.
4. Put the real byte sizes in `platforms.windows.builds[*].sizeBytes`.
5. Add the release to [`data/changelog.js`](./data/changelog.js).
6. `npm run check`.

The Download page, the Updates page, four FAQ answers, the footer, the structured data and the
page metadata all update from that.

### The safety property

The site is built so that **making a claim requires supplying the evidence**:

| Data state | What renders |
| --- | --- |
| `releaseStatus: 'unreleased'` | Download buttons are disabled, with the reason stated |
| A build with `url: null` | A disabled control — never a link that 404s |
| A platform with `available: false` | A "planned" status line — never a download button |
| `ffmpeg.bundled: false` | The prerequisite notice appears on Download, Features and Help |
| `codeSigning.signed: false` | The SmartScreen warning is explained before the download |
| `site.contact.issues: null` | "Where do I report a bug" answers honestly instead of linking nowhere |

Flip any of those and the corresponding copy disappears from every page at once. That is the
whole reason those fields exist rather than being written into the pages as prose.

---

## Layout

```
data/          the only files with content in them
  site.js        version, downloads, platforms, requirements, nav, footer   ← edit on release
  features.js    the feature catalog, each entry carrying a status
  changelog.js   releases, newest first
  faq.js         help content; four answers are composed from site.js
src/
  layout.mjs     the document shell: head, metadata, header, footer
  components.mjs shared markup helpers and the inline icon set
  pages/*.mjs    one module per route; they render data, they do not hold content
  styles.css     the whole design system
  site.js        the client script (theme, mobile nav, scroll reveal)
public/          images, brand assets, favicons — copied to dist/ as-is
build.mjs        the static build, plus `--check`
serve.mjs        a preview server for dist/
```

---

## The feature catalog is audited, not written

Every entry in `data/features.js` was confirmed against the application source **and**, where
possible, in the running application, before it was written down. Entries carry a `status`
(`stable`, `beta`, `planned`) and an optional `requires`.

The foot of that file records what was **deliberately left out** — capabilities that exist in the
data model or the interface but have no working implementation behind them, such as video clip
blend modes, `Transform.crop`, and the audio EQ / pitch / normalise controls. They are listed so
that a later pass over the file does not helpfully add them back.

If you add a feature to the catalog, confirm it works first. A model field with no consumer is
not a feature.

---

## `npm run check`

The build's self-check is not a linter — it asserts the things a reviewer would otherwise have to
click through:

- every internal link resolves to a page that was actually generated
- every `#anchor` exists on the page it points at, including cross-page anchors
- every image, stylesheet and script referenced actually exists in `dist/`
- every page has a title, a meta description ≥ 50 characters, a canonical URL, exactly one `<h1>`
  and an absolute `og:image`
- no `<img>` without `alt`, no empty `href`, no `href="#"` placeholder
- no double-escaped entities and no escaped HTML tags rendering as literal text

The last one exists because both of those bugs shipped once during the initial build and neither
is visible in the source.

---

## Design system

`src/styles.css` is the whole thing, and it mirrors the three rules the application's own
token file (`packages/ui/src/theme/tokens.css`, in the application repository) is held to:

1. **Surfaces are neutral.** The editor screenshots are the only saturated things on a page.
2. **The accent is a signal, not a decoration.** Primary actions, links, focus rings. Nothing
   large is painted in it.
3. **The brand is not the accent.** `--brand-deep / --brand-blue / --brand-cyan` are the logo's
   own gradient stops and appear only on the logo and the 2px rule at the top of the page.

Themes are **System** (default), **Light** and **Dark**, matching the application's own three.
The resolved theme is stamped on `<html>` by an inline script in `<head>` — moving that into the
deferred script would paint the wrong theme first and then snap.

That same inline script adds a `js` class, and the scroll-reveal rules are scoped to it. The
hidden state therefore only ever exists when a script is running to undo it, so a visitor without
JavaScript can never be shown a blank section.

Everything honours `prefers-reduced-motion`: reveals resolve instantly, transitions collapse and
smooth scrolling is switched off.

---

## Brand assets

See [`public/brand/README.md`](./public/brand/README.md). The symbol is the application's own
mark — `assets/OpenCut.svg` in the **application** repository remains the single source of truth
for every icon the app ships, and nothing here overrides it.

---

## Performance

Measured on the built output: 5–6 requests and 62–109 KB per page, with `DOMContentLoaded` under
30 ms locally. Screenshots are served as WebP with a PNG fallback and explicit dimensions, the
hero image is eager and everything below the fold is lazy. There are no web fonts, no third-party
scripts, no cookies and no analytics.

## Deploying

`dist/` is a plain static directory — any static host will serve it. Two things to configure:

- **`site.origin` in `data/site.js`** must be the real domain before you build. Canonical URLs and
  Open Graph images are absolute, and crawlers ignore relative ones.
- **`404.html`** should be set as the not-found document. Most static hosts do this automatically.
