/**
 * The build. Zero dependencies, Node's standard library only.
 *
 * It renders each page module to a directory-per-route so the deployed URLs are clean
 * (`/features/` rather than `/features.html`), copies `public/` and the two source assets
 * through, and generates robots.txt, a sitemap, a web manifest and a 404.
 *
 * Why a 120-line script instead of a static-site generator: the site is eight pages of content
 * that all come from four data files. A framework would add a dependency tree, a config file
 * and a build cache in exchange for features this site does not use — and "do not add
 * unnecessary dependencies" is a requirement here, not a preference. Everything in `dist/` is
 * plain HTML, one stylesheet and one small script.
 *
 *   node build.mjs          build into dist/
 *   node build.mjs --check  build, then assert the output is internally consistent
 */

import { mkdir, rm, cp, writeFile, readdir, stat, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, nav } from './data/site.js';
import { homePage } from './src/pages/home.mjs';
import { featuresPage } from './src/pages/features.mjs';
import { downloadPage } from './src/pages/download.mjs';
import { updatesPage } from './src/pages/updates.mjs';
import { helpPage } from './src/pages/help.mjs';
import { aboutPage } from './src/pages/about.mjs';
import { privacyPage, termsPage } from './src/pages/legal.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

/**
 * Every route. `path` is both the URL and the output directory, and `priority` feeds the
 * sitemap. Adding a page means adding one row — the sitemap, the build and the link check all
 * read from here.
 */
const ROUTES = [
  { path: '/', render: homePage, priority: '1.0', changefreq: 'weekly' },
  { path: '/features/', render: featuresPage, priority: '0.9', changefreq: 'monthly' },
  { path: '/download/', render: downloadPage, priority: '0.9', changefreq: 'weekly' },
  { path: '/updates/', render: updatesPage, priority: '0.8', changefreq: 'weekly' },
  { path: '/help/', render: helpPage, priority: '0.7', changefreq: 'monthly' },
  { path: '/about/', render: aboutPage, priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy/', render: privacyPage, priority: '0.3', changefreq: 'yearly' },
  { path: '/terms/', render: termsPage, priority: '0.3', changefreq: 'yearly' },
];

const outPathFor = (route) => join(DIST, route.path === '/' ? '' : route.path, 'index.html');

async function write(file, contents) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, contents, 'utf8');
}

/* ── robots / sitemap / manifest ────────────────────────────────────────────────────── */

const robots = () => `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`;

const sitemap = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ROUTES.map(
    (r) => `  <url>
    <loc>${site.origin}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

const manifest = () =>
  JSON.stringify(
    {
      name: site.name,
      short_name: site.name,
      description: site.description,
      start_url: '/',
      display: 'standalone',
      background_color: '#0f1115',
      theme_color: '#0f1115',
      icons: [
        { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/brand/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    null,
    2
  );

/* The 404 body reuses the shell so a wrong URL still looks like the site. */
async function notFound() {
  const { page } = await import('./src/pages/notFound.mjs');
  return page();
}

/* ── Build ──────────────────────────────────────────────────────────────────────────── */

async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  for (const route of ROUTES) {
    await write(outPathFor(route), route.render());
  }

  /*
   * public/ is copied verbatim EXCEPT for markdown, which is documentation for whoever is
   * working on the assets (public/brand/README.md) rather than something to publish at a URL.
   */
  await cp(join(ROOT, 'public'), DIST, {
    recursive: true,
    filter: (src) => !src.endsWith('.md'),
  });
  await cp(join(ROOT, 'src', 'styles.css'), join(DIST, 'styles.css'));
  await cp(join(ROOT, 'src', 'site.js'), join(DIST, 'site.js'));

  await write(join(DIST, 'robots.txt'), robots());
  await write(join(DIST, 'sitemap.xml'), sitemap());
  await write(join(DIST, 'site.webmanifest'), manifest());
  await write(join(DIST, '404.html'), await notFound());

  return ROUTES.length;
}

/* ── Self-check ─────────────────────────────────────────────────────────────────────── */

/**
 * A build that succeeds but ships a broken link is worse than one that fails, so `--check`
 * walks the generated HTML and asserts the things a human reviewer would otherwise have to
 * click through:
 *
 *   · every internal href resolves to a file that was actually generated
 *   · every <img src> and <source srcset> resolves to a file that exists
 *   · every in-page #anchor has a matching id on that page
 *   · every page has a title, a meta description, an h1, and a canonical URL
 *   · no page contains an empty href or a href="#" placeholder
 */
async function check() {
  const problems = [];
  const files = [];

  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name.endsWith('.html')) files.push(full);
    }
  }
  await walk(DIST);

  const exists = async (p) => {
    try {
      await stat(p);
      return true;
    } catch {
      return false;
    }
  };

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const label = file.replace(DIST, '').replace(/\\/g, '/') || '/index.html';
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

    const need = [
      [/<title>[^<]{8,}<\/title>/, 'missing or too-short <title>'],
      [/<meta name="description" content="[^"]{50,}"/, 'missing or too-short meta description'],
      [/<link rel="canonical" href="https?:\/\/[^"]+"/, 'missing canonical link'],
      [/<h1[^>]*>/, 'no <h1>'],
      [/<meta property="og:image" content="https?:\/\//, 'missing absolute og:image'],
    ];
    for (const [re, message] of need) if (!re.test(html)) problems.push(`${label}: ${message}`);

    if (/<h1[\s\S]*?<h1/.test(html)) problems.push(`${label}: more than one <h1>`);

    for (const m of html.matchAll(/href="([^"]*)"/g)) {
      const href = m[1];
      if (href === '' || href === '#') {
        problems.push(`${label}: placeholder href="${href}"`);
        continue;
      }
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;

      if (href.startsWith('#')) {
        if (!ids.has(href.slice(1))) problems.push(`${label}: anchor ${href} has no matching id`);
        continue;
      }

      const [path, hash] = href.split('#');
      const target = path.endsWith('/') ? join(DIST, path, 'index.html') : join(DIST, path);
      if (!(await exists(target))) {
        problems.push(`${label}: link ${href} -> missing ${target.replace(DIST, '')}`);
        continue;
      }
      if (hash && target.endsWith('.html')) {
        const targetHtml = await readFile(target, 'utf8');
        if (!new RegExp(`\\sid="${hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(targetHtml)) {
          problems.push(`${label}: link ${href} -> #${hash} does not exist on that page`);
        }
      }
    }

    const assets = [
      ...[...html.matchAll(/(?:src|href)="(\/[^"]+\.(?:png|webp|svg|css|js|webmanifest))"/g)].map((m) => m[1]),
      ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) =>
        m[1].split(',').map((part) => part.trim().split(/\s+/)[0])
      ),
    ];
    for (const asset of new Set(assets)) {
      if (!(await exists(join(DIST, asset)))) problems.push(`${label}: asset ${asset} does not exist`);
    }

    for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
      if (!/\salt="/.test(m[1])) problems.push(`${label}: <img> without alt`);
    }

    /*
     * Escaping mistakes, which are invisible in source and obvious on screen. Both of these
     * shipped once before this check existed:
     *   · `&amp;amp;` — an entity written into a value that is then escaped again, so the reader
     *     sees a literal "&amp;".
     *   · `&lt;strong&gt;` — raw HTML handed to a field that escapes, so the reader sees the tag.
     */
    if (html.includes('&amp;amp;')) problems.push(`${label}: double-escaped entity (&amp;amp;)`);
    const leakedTag = html.match(/&lt;\/?(strong|em|code|a|br|p)\b/);
    if (leakedTag) problems.push(`${label}: escaped HTML tag rendered as text (${leakedTag[0]})`);
  }

  /* The nav must point at pages that exist — the one link on every single page. */
  for (const item of nav) {
    if (!ROUTES.some((r) => r.path === item.href)) problems.push(`nav: ${item.href} is not a route`);
  }

  return { problems, pages: files.length };
}

/* ── Entry ──────────────────────────────────────────────────────────────────────────── */

const built = await build();
console.log(`Built ${built} pages into dist/`);

if (process.argv.includes('--check')) {
  const { problems, pages } = await check();
  if (problems.length) {
    console.error(`\n${problems.length} problem(s) found across ${pages} pages:\n`);
    for (const p of problems) console.error(`  · ${p}`);
    process.exit(1);
  }
  console.log(`Checked ${pages} pages: links, anchors, assets, alt text and metadata all resolve.`);
}
