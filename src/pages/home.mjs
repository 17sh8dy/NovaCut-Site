import { site, version, platforms, releaseStatus, ffmpeg } from '../../data/site.js';
import { featureGroups } from '../../data/features.js';
import { page } from '../layout.mjs';
import { button, icons, shot, esc, reveal } from '../components.mjs';

/**
 * The home page.
 *
 * Order is deliberate and matches how a reader decides whether to care:
 *   hero → what it is · the promise → why it exists · what it does → proof · download → action.
 *
 * The hero's meta row states the release state in plain words rather than implying a shipped
 * product. That single line is what keeps the whole page honest while it still reads as a
 * launch site.
 */

/** The things that are, and remain, free. Every one is a shipped capability, not a plan. */
const FREE = [
  'Video editing',
  'Photo editing',
  'Timeline tools',
  'Audio tools',
  'Transitions',
  'Effects',
  'Export',
  'Future editing improvements',
];

/** Three groups lifted from the catalog for the home summary; Features has all six. */
const HIGHLIGHT_IDS = ['video', 'effects', 'photo'];

function highlights() {
  return featureGroups
    .filter((g) => HIGHLIGHT_IDS.includes(g.id))
    .map((g) => {
      const top = g.features.slice(0, 3);
      return `<article class="card">
          <h3>${esc(g.title)}</h3>
          <p class="muted" style="margin-top:var(--s3);font-size:var(--t-small)">${esc(g.lede)}</p>
          <ul class="freelist" style="grid-template-columns:1fr;margin-top:var(--s4)">
            ${top.map((f) => `<li>${icons.check}<span>${esc(f.title)}</span></li>`).join('')}
          </ul>
        </article>`;
    })
    .join('');
}

export function homePage() {
  const win = platforms.windows;
  const releaseLine =
    releaseStatus === 'released'
      ? `Version ${version} for ${win.name} ${win.arch}`
      : `Version ${version} — first public release in preparation`;

  const body = `
    <section class="hero">
      <div class="wrap">
        <div class="hero__inner">
          <p class="eyebrow">Nova Cut</p>
          <h1>Powerful editing.<br>Made open.</h1>
          <p class="lede">Nova Cut is a powerful desktop video and photo editor built for creators who want
            professional tools without putting essential editing features behind a subscription.</p>
          <div class="btn-row">
            ${button({ href: '/download/', label: 'Download Nova Cut', icon: icons.download, large: true })}
            ${button({ href: '/features/', label: 'Explore features', variant: 'secondary', large: true })}
          </div>
          <p class="hero__meta">
            <span>${icons.windows} ${esc(win.name)} ${esc(win.arch)}</span>
            <span>${icons.clock} ${esc(releaseLine)}</span>
            <span>${icons.shield} Free &middot; ${esc(site.license)} licence</span>
          </p>
        </div>
      </div>
      <div class="wrap hero__shot">
        ${shot({
          src: 'editor',
          width: 1600,
          height: 984,
          eager: true,
          title: 'Nova Cut — video editor',
          alt: 'The Nova Cut video editor. A multi-track timeline holds several text clips, the preview shows the composited frame, and the inspector on the right edits the selected clip’s text.',
          caption: 'The Nova Cut video editor running on Windows.',
        })}
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="promise">
          <div>
            <p class="eyebrow">The core promise</p>
            <h2>Editing shouldn’t be locked behind a subscription.</h2>
            <div class="promise__claim">
              <strong>Every editing feature will always be free.</strong>
              <p>No trial period, no watermark, no feature that stops working when you stop paying.</p>
            </div>
            <ul class="freelist">
              ${FREE.map((f) => `<li>${icons.check}<span>${esc(f)}</span></li>`).join('')}
            </ul>
            <p class="muted" style="margin-top:var(--s5);font-size:var(--t-small);max-width:52ch">
              These are what an editor <em>is</em>. They stay part of the free Nova Cut experience, and so do
              the improvements made to them.
            </p>
          </div>
          <aside class="aside-note">
            <p class="eyebrow eyebrow--muted">A note on AI</p>
            <h3>AI is different.</h3>
            <p><strong>Nova Cut has no AI features today.</strong> Nothing in the current build uses AI, and
              nothing on this site describes an AI feature that exists.</p>
            <p>It may gain them later, and they are genuinely a different kind of thing: removing a
              background or upscaling a shot can mean running a model on hardware that costs money every
              single time it runs. That cost does not go away after the download.</p>
            <p>So if AI-powered features arrive, they may be offered as <strong>optional paid services</strong>
              priced to cover that processing — additions alongside the editor, never a fence around it.
              The editing features listed here stay free either way.</p>
          </aside>
        </div>
      </div>
    </section>

    <section class="section section--surface">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">What’s inside</p>
          <h2>Two editors. One application.</h2>
          <p class="lede">Cut the video and design its thumbnail without leaving the app — or paying for two
            of them.</p>
        </div>
        ${reveal(`<div class="grid grid--3">${highlights()}</div>`, { stagger: true })}
        <div class="btn-row" style="margin-top:var(--s7)">
          ${button({ href: '/features/', label: 'See everything Nova Cut does', variant: 'secondary', icon: icons.arrowRight, iconEnd: true })}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">Photo editor</p>
          <h2>Layers, masks and selections — built in.</h2>
          <p class="lede">A real image editor for thumbnails, banners and social posts: a layer tree with
            groups and 27 blend modes, painted masks, selection tools, brushes, vector shapes and text.</p>
        </div>
        ${reveal(
          shot({
            src: 'photo',
            width: 1600,
            height: 984,
            title: 'Nova Cut — photo editor',
            alt: 'The Nova Cut photo editor. A layer list shows five layers, the tool rail runs down the left, and a composed thumbnail sits on the canvas with the inspector open on the right.',
            caption: 'A thumbnail composed from the built-in asset library — annotations, shapes, styled text and stickers.',
          })
        )}
      </div>
    </section>

    <section class="section section--surface">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow">Export</p>
          <h2>What you preview is what you get.</h2>
          <p class="lede">The preview and the exporter run the same GPU compositor over the same shaders,
            so there is no second render path that can quietly disagree with what you were watching.</p>
        </div>
        ${reveal(
          shot({
            src: 'export',
            width: 1600,
            height: 1042,
            title: 'Nova Cut — export',
            alt: 'The Nova Cut export dialog, with resolution, frame rate, container, codec, quality and bitrate controls and live estimates of the output size and render time.',
            caption: `Resolutions to 8K, up to 240 fps, five containers and five codecs. ${
              ffmpeg.bundled ? '' : 'Video export requires FFmpeg — see the download page.'
            }`,
          })
        )}
      </div>
    </section>

    <section class="cta">
      <div class="wrap">
        <h2>Get Nova Cut</h2>
        <p class="lede">${
          releaseStatus === 'released'
            ? `Version ${esc(version)} for ${esc(win.name)} ${esc(win.arch)}. Free, and free to keep using.`
            : `Version ${esc(
                version
              )} is built and being prepared for its first public release. The download page has the full build details and system requirements.`
        }</p>
        <div class="btn-row">
          ${button({ href: '/download/', label: 'Go to downloads', icon: icons.download, large: true })}
          ${button({ href: '/updates/', label: 'Read the release notes', variant: 'secondary', large: true })}
        </div>
      </div>
    </section>`;

  return page({
    title: 'Nova Cut — Powerful Editing. Made Open.',
    description:
      'Nova Cut is a powerful desktop video and photo editor built for creators. Every core editing feature will always be free.',
    path: '/',
    current: '/',
    body,
  });
}
