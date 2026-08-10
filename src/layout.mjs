/**
 * The document shell: head, metadata, header, footer.
 *
 * Every page goes through `page()`, so a metadata rule added here is applied everywhere at
 * once. Two things in this file are load-bearing:
 *
 * 1. THE THEME SCRIPT RUNS BEFORE THE STYLESHEET IS APPLIED TO THE BODY. It is inline and
 *    synchronous in <head> on purpose. Deferring it — or moving it into site.js — means the
 *    document paints in the default theme first and then snaps, which is exactly the flash the
 *    application's own `applyTheme` call before first render exists to prevent.
 *
 * 2. OPEN GRAPH URLS ARE ABSOLUTE. Crawlers ignore relative og:image values, so every social
 *    tag is built from site.origin. If origin is wrong, the previews are wrong.
 */

import { site, nav, footerLinks, version } from '../data/site.js';
import { esc, escJson, icons } from './components.mjs';

/*
 * The mark, inlined so the header needs no extra request.
 *
 * This is the SIMPLIFIED drawing (public/brand/symbol-small.svg), not the full artwork, because
 * the header and footer both render it at 26px — well inside the range where the full mark's two
 * translucent frames and 12px bracket strokes collapse into a blue smudge. The application draws
 * its 22px title-bar mark from the same simplified source for exactly the same reason. Anything
 * showing the mark at 48px or larger should use the full artwork instead.
 */
const SYMBOL = `<svg viewBox="0 0 1024 1024" aria-hidden="true"><rect width="1024" height="1024" rx="228" fill="#0A84FF"/><g transform="translate(512, 512)"><rect x="-288" y="-208" width="576" height="416" rx="56" fill="#FFFFFF"/><path d="M-72,-104 L-72,104 L104,0 Z" fill="#0A84FF"/></g></svg>`;

/**
 * Written inline in <head>, and it does two things that MUST happen before the first paint.
 *
 * 1. RESOLVES THE THEME. Reads the stored preference, falls back to 'system', and stamps the
 *    resolved value on <html>. Deferring this — or moving it into site.js — paints the document
 *    in the default theme and then snaps to the chosen one.
 *
 * 2. ADDS THE `js` CLASS. The scroll-reveal rules in styles.css are scoped to `.js`, so the
 *    hidden state only ever exists when there is a script able to remove it again. Without
 *    JavaScript the class is never added, the rules never match, and no content can be stranded
 *    invisible. It has to be set here rather than in the deferred script, or revealed content
 *    would flash into view on every load.
 *
 * The whole thing is wrapped in try/catch: a blocked localStorage (private mode, embedded
 * webview) must not stop the page rendering.
 */
const THEME_SCRIPT = `document.documentElement.classList.add('js');(function(){try{var t=localStorage.getItem('oc-theme')||'system';var m=t==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):t;document.documentElement.setAttribute('data-theme',m);document.documentElement.setAttribute('data-theme-pref',t)}catch(e){}})()`;

function header(current) {
  const link = (item) =>
    `<a href="${item.href}"${current === item.href ? ' aria-current="page"' : ''}>${esc(item.label)}</a>`;

  return `<div class="brandline" aria-hidden="true"></div>
  <header class="header" id="site-header">
    <div class="wrap header__inner">
      <a class="logo" href="/" aria-label="Open Cut — home">${SYMBOL}<span>Open Cut</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">
        <span class="icon-open">${icons.menu}</span><span class="icon-close">${icons.close}</span>
      </button>
      <nav class="nav" id="site-nav" aria-label="Primary">${nav.map(link).join('')}</nav>
      <div class="header__actions">
        <div class="theme" role="group" aria-label="Colour theme">
          <button type="button" data-theme-set="system" aria-pressed="false" aria-label="Match system theme" title="System">${icons.monitor}</button>
          <button type="button" data-theme-set="light" aria-pressed="false" aria-label="Light theme" title="Light">${icons.sun}</button>
          <button type="button" data-theme-set="dark" aria-pressed="false" aria-label="Dark theme" title="Dark">${icons.moon}</button>
        </div>
        <a class="btn btn--primary" href="/download/">Download</a>
      </div>
    </div>
  </header>`;
}

function footer() {
  /*
   * A link with no href is dropped rather than rendered as href="null". Some footer entries read
   * their target from site.contact, which is null until that channel exists — the footer has to
   * follow the same rule as the rest of the site: no destination, no link.
   */
  const item = (l) => {
    if (!l.href) return '';
    const attrs = l.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<li><a href="${l.href}"${attrs}>${esc(l.label)}</a></li>`;
  };

  const column = (col) => `<div>
      <h2>${esc(col.title)}</h2>
      <ul>${col.links.map(item).join('')}</ul>
    </div>`;

  return `<footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <a class="logo" href="/">${SYMBOL}<span>Open Cut</span></a>
          <p>${esc(site.tagline)} A desktop video and photo editor whose core editing features will always be free.</p>
        </div>
        ${footerLinks.map(column).join('')}
      </div>
      <div class="footer__bottom">
        <p>&copy; ${site.year} ${esc(site.name)}. Released under the ${esc(site.license)} licence.</p>
        <p class="mono">Version ${esc(version)}</p>
      </div>
    </div>
  </footer>`;
}

/**
 * Structured data. Only two types, both of which we can populate truthfully:
 *   SoftwareApplication — describes the product. `offers` is a genuine zero-price offer.
 *   WebSite             — gives the site a name for rich results.
 * Deliberately no aggregateRating and no downloadUrl: we have neither ratings nor a public
 * download, and inventing either is the kind of structured-data lie search engines penalise.
 */
function structuredData(extra) {
  const app = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: site.name,
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Video and photo editor',
    operatingSystem: 'Windows 10 (64-bit) or later',
    softwareVersion: version,
    description: site.description,
    license: 'https://opensource.org/licenses/MIT',
    url: site.origin,
    image: `${site.origin}/og-image.png`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const web = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.origin,
    description: site.description,
  };
  return [app, web, ...(extra ? [extra] : [])]
    .map((d) => `<script type="application/ld+json">${escJson(d)}</script>`)
    .join('\n    ');
}

/**
 * @param {object} opts
 * @param {string} opts.title       full <title>; already includes the brand where wanted
 * @param {string} opts.description meta description, ~150-160 chars
 * @param {string} opts.path        canonical path, e.g. '/features/'
 * @param {string} opts.body        page markup
 * @param {string} [opts.current]   nav item to mark aria-current
 * @param {object} [opts.jsonLd]    an extra structured-data object for this page
 */
export function page({ title, description, path, body, current, jsonLd }) {
  const url = `${site.origin}${path}`;
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#0f1115" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="color-scheme" content="dark light">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${site.origin}/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Open Cut — powerful editing, made open.">
  <meta property="og:locale" content="en_GB">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${site.origin}/og-image.png">
  <meta name="twitter:image:alt" content="Open Cut — powerful editing, made open.">

  <link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/brand/icon-192.png" sizes="192x192" type="image/png">
  <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css">

  <script>${THEME_SCRIPT}</script>
  ${structuredData(jsonLd)}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(current)}
  <main id="main">
${body}
  </main>
  ${footer()}
  <script src="/site.js" defer></script>
</body>
</html>
`;
}
