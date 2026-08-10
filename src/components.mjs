/**
 * Shared markup helpers and the icon set.
 *
 * Every icon is inline SVG drawn from the same 24-unit grid at a 1.75 stroke, so they sit
 * together without an icon font, a sprite request, or a runtime dependency. `currentColor`
 * throughout, which is what lets one icon serve both themes.
 *
 * `esc` is applied to every value that reaches the page from data/. It is not optional
 * politeness — the data files are the only untrusted-shaped input this build has, and an
 * unescaped ampersand in a feature title is a broken page.
 */

/** HTML-escape. Used on every interpolated string that is not deliberate markup. */
export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Escape for a JSON-LD <script> body: only the sequence that could close the tag. */
export const escJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

/**
 * The tiny inline-markup subset the content files may use: **bold**, `code`, [text](href).
 * Deliberately small. Content that needs more than this wants a page, not a richer parser.
 * The input is escaped FIRST, so the markup can never smuggle a tag through.
 */
export function inline(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, label, href) => {
      /*
       * A link off the site opens in a new tab, so following one does not cost the reader the
       * page they were part-way through. `noopener` because a target=_blank link hands the new
       * page a reference back to this one otherwise.
       */
      const external = /^https?:/.test(href);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${attrs}>${label}</a>`;
    });
}

/*
 * `width`/`height` are on the element, not left to CSS. An inline <svg> with only a viewBox is a
 * replaced element with a default size of 300x150 — so any placement that forgets to size it
 * renders a giant icon rather than a slightly-wrong one. Shipping 24x24 attributes makes the
 * unstyled case correct by default; CSS still overrides it wherever a smaller size is wanted.
 */
const svg = (paths, extra = '') =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`;

export const icons = {
  download: svg('<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>'),
  check: svg('<path d="m4 12.5 5 5L20 6.5"/>'),
  arrowRight: svg('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'),
  chevronDown: svg('<path d="m5 9 7 7 7-7"/>'),
  alert: svg('<path d="M12 8v5"/><path d="M12 16.5v.5"/><path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.4h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8v.5"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
  sparkle: svg('<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9 12 3.5Z"/><path d="M18.5 4v3M20 5.5h-3"/>'),
  shield: svg('<path d="M12 3.5 5 6.2v5.1c0 4.2 2.9 7.6 7 9.2 4.1-1.6 7-5 7-9.2V6.2L12 3.5Z"/><path d="m9.3 12 1.9 1.9 3.6-3.6"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>'),
  moon: svg('<path d="M20 14.3A8.2 8.2 0 0 1 9.7 4a8.5 8.5 0 1 0 10.3 10.3Z"/>'),
  monitor: svg('<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8.5 20.5h7M12 17.5v3"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  windows: svg('<path d="M3.5 6.3 10 5.4v6.1H3.5V6.3Z" fill="currentColor" stroke="none"/><path d="M11.3 5.2 20.5 4v7.5h-9.2V5.2Z" fill="currentColor" stroke="none"/><path d="M3.5 12.5H10v6.1l-6.5-.9v-5.2Z" fill="currentColor" stroke="none"/><path d="M11.3 12.5h9.2V20l-9.2-1.2v-6.3Z" fill="currentColor" stroke="none"/>'),
  apple: svg('<path d="M16.3 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.15-2.8.85-3.5.85s-1.8-.83-3-.81c-1.5.02-2.9.9-3.7 2.27-1.6 2.75-.4 6.8 1.1 9 .75 1.1 1.6 2.3 2.8 2.25 1.1-.05 1.5-.72 2.9-.72s1.7.72 2.9.7c1.2-.02 2-1.1 2.7-2.2.85-1.26 1.2-2.48 1.2-2.55-.03-.01-2.3-.88-2.3-3.5Z"/><path d="M14.2 5.4c.6-.75 1-1.8.9-2.85-.87.04-1.93.58-2.56 1.32-.56.65-1.05 1.7-.92 2.7.97.08 1.96-.5 2.58-1.17Z"/>'),
  linux: svg('<path d="M12 2.6c-2.2 0-3.1 1.8-3 4 .05 1.3.1 2.2-.5 3.2-1 1.7-2.4 3.6-2.4 5.6 0 1 .4 1.6 1.1 1.9-.3 1.3.2 2.3 1.2 2.7 1.4.6 3-.3 3.6-.3s2.2.9 3.6.3c1-.4 1.5-1.4 1.2-2.7.7-.3 1.1-.9 1.1-1.9 0-2-1.4-3.9-2.4-5.6-.6-1-.55-1.9-.5-3.2.1-2.2-.8-4-3-4Z"/><path d="M10.4 7.5v.5M13.6 7.5v.5M10.7 10.4c.8.7 1.8.7 2.6 0"/>'),
};

/**
 * A screenshot in a window frame.
 *
 * `<picture>` with WebP first and a PNG fallback; explicit width/height so the browser reserves
 * the space and the page cannot shift as images arrive. `eager` + `fetchpriority=high` on the
 * hero shot only — everything below the fold is lazy.
 */
export function shot({ src, width, height, alt, caption, title, eager = false }) {
  const loading = eager
    ? ' loading="eager" fetchpriority="high" decoding="async"'
    : ' loading="lazy" decoding="async"';
  return `<figure class="shot">
      <div class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(title ?? 'Open Cut')}</span></div>
      <picture>
        <source type="image/webp" srcset="/img/${src}-1000.webp 1000w, /img/${src}-1600.webp 1600w" sizes="(max-width: 1140px) 100vw, 1100px">
        <img src="/img/${src}-1600.png" width="${width}" height="${height}" alt="${esc(alt)}"${loading}>
      </picture>
      ${caption ? `<figcaption>${inline(caption)}</figcaption>` : ''}
    </figure>`;
}

/** Status badge for a feature. 'stable' gets no badge — being finished is the baseline. */
export function statusBadge(status) {
  if (status === 'beta') return `<span class="badge badge--warn">Beta</span>`;
  if (status === 'planned') return `<span class="badge">Planned</span>`;
  return '';
}

/**
 * `iconEnd` puts the icon AFTER the label instead of before it.
 *
 * Which side an icon sits on is not a style preference, it follows the icon's meaning. A
 * download glyph labels the action and leads. A right arrow means "onwards from here" and has to
 * trail — leading, it points back at the very words it is supposed to lead you away from. That
 * reads as broken spacing even when the gap is identical on both sides, which is exactly how it
 * was reported.
 */
export function button({
  href,
  label,
  variant = 'primary',
  icon,
  iconEnd = false,
  large = false,
  disabled = false,
  describedBy,
}) {
  const cls = `btn btn--${variant}${large ? ' btn--lg' : ''}`;
  const glyph = icon ? `<span class="btn__icon">${icon}</span>` : '';
  const inner = iconEnd ? `${esc(label)}${glyph}` : `${glyph}${esc(label)}`;
  const described = describedBy ? ` aria-describedby="${describedBy}"` : '';
  if (disabled) {
    return `<span class="${cls}" role="button" aria-disabled="true"${described}>${inner}</span>`;
  }
  return `<a class="${cls}" href="${href}"${described}>${inner}</a>`;
}

/** A definition list of key/value specs. `prose` softens the monospace for sentence values. */
export function specList(rows, { prose = false } = {}) {
  return `<dl class="spec${prose ? ' spec--prose' : ''}">${rows
    .map(([dt, dd]) => `<dt>${esc(dt)}</dt><dd>${inline(dd)}</dd>`)
    .join('')}</dl>`;
}

/**
 * `level` sets the heading tag, because a notice's rank depends on where it sits: one that
 * follows the page <h1> directly is an h2, one inside a section that already has an h2 is an h3.
 * Hard-coding h3 skips a level on the first kind and fails a heading-order audit. The styling is
 * on `.notice__title`, so changing the level never changes the appearance.
 */
export function notice({ tone = 'default', icon = icons.info, title, body, level = 3 }) {
  const paragraphs = (Array.isArray(body) ? body : [body]).map((p) => `<p>${inline(p)}</p>`).join('');
  const heading = title ? `<h${level} class="notice__title">${esc(title)}</h${level}>` : '';
  return `<div class="notice${tone === 'default' ? '' : ` notice--${tone}`}">
      ${icon}
      <div>${heading}${paragraphs}</div>
    </div>`;
}

/**
 * Wrap a block so site.js can reveal it on scroll. No-ops entirely without JavaScript.
 *
 * `stagger` reveals the block's CHILDREN in sequence instead of the block as one piece — right
 * for a grid of cards, wrong for anything whose children are parts of a single object (a figure's
 * chrome bar, image and caption must never arrive separately), which is why it is opt-in.
 */
export const reveal = (html, { stagger = false } = {}) =>
  html.replace(/^(\s*<\w+)/, `$1 data-reveal${stagger ? ' data-stagger' : ''}`);
