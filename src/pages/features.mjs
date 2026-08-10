import { featureGroups, planned } from '../../data/features.js';
import { ffmpeg } from '../../data/site.js';
import { page } from '../layout.mjs';
import { button, icons, shot, esc, statusBadge, notice, reveal } from '../components.mjs';

/**
 * The Features page renders data/features.js verbatim. It has no feature list of its own, which
 * is the point: the catalog is audited once, in one file, against the code — and the page cannot
 * quietly grow a claim the catalog does not make.
 *
 * The "designed for, not built" section is rendered from the same file and sits at the bottom
 * under its own heading, so a reader can see the direction without any risk of reading a plan as
 * a promise.
 */

function featureCard(f) {
  const requiresBadge =
    f.requires === 'ffmpeg' && !ffmpeg.bundled ? `<span class="badge">Needs FFmpeg</span>` : '';
  return `<article class="feature">
      <div class="feature__title">
        <h3>${esc(f.title)}</h3>${statusBadge(f.status)}${requiresBadge}
      </div>
      <p>${esc(f.body)}</p>
    </article>`;
}

function group(g) {
  const stats = g.stats
    ? `<div class="stats">${g.stats
        .map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`)
        .join('')}</div>`
    : '';

  const image = g.image
    ? `<div class="feature-block__shot">${shot({
        ...g.image,
        title: `Open Cut — ${g.title.toLowerCase()}`,
      })}</div>`
    : '';

  return `<section class="feature-block" id="${esc(g.id)}">
      <div class="feature-block__head">
        <div>
          <h2>${esc(g.title)}</h2>
          <p class="lede">${esc(g.lede)}</p>
        </div>
        ${stats}
      </div>
      ${image}
      ${reveal(`<div class="feature-list">${g.features.map(featureCard).join('')}</div>`)}
    </section>`;
}

export function featuresPage() {
  const total = featureGroups.reduce((n, g) => n + g.features.length, 0);

  const body = `
    <section class="section section--tight">
      <div class="wrap">
        <p class="eyebrow">Features</p>
        <h1 style="font-size:var(--t-h1);max-width:18ch">Everything in the box.</h1>
        <p class="lede" style="margin-top:var(--s5);max-width:64ch">${total} capabilities across the video
          editor, the photo editor and the export pipeline — each one confirmed in the running application
          before it was written down here. What isn’t built yet is listed at the bottom, separately.</p>
        <nav class="btn-row" style="margin-top:var(--s6)" aria-label="Jump to a section">
          ${featureGroups
            .map((g) => `<a class="btn btn--secondary" href="#${esc(g.id)}">${esc(g.title)}</a>`)
            .join('')}
        </nav>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        ${featureGroups.map(group).join('')}
      </div>
    </section>

    ${
      ffmpeg.bundled
        ? ''
        : `<section class="section section--tight section--surface">
      <div class="wrap">
        ${notice({
          tone: 'warn',
          icon: icons.alert,
          title: 'Features marked “Needs FFmpeg”',
          body: [ffmpeg.summary, ffmpeg.detail],
        })}
      </div>
    </section>`
    }

    <section class="section section--tight">
      <div class="wrap">
        <div class="section-head">
          <p class="eyebrow eyebrow--muted">Not built yet</p>
          <h2>Designed for, but not delivered.</h2>
          <p class="lede">These are places the architecture leaves room for. None of them exists in the
            current build, and none of them has a date. They are listed so that nothing above has to be
            read with a pinch of salt.</p>
        </div>
        <div class="feature-list">
          ${planned
            .map(
              (p) => `<article class="feature">
                <div class="feature__title"><h3>${esc(p.title)}</h3><span class="badge">Planned</span></div>
                <p>${esc(p.body)}</p>
              </article>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="wrap">
        <h2>Try it yourself</h2>
        <p class="lede">The fastest way to judge an editor is to open it.</p>
        <div class="btn-row">
          ${button({ href: '/download/', label: 'Download Open Cut', icon: icons.download, large: true })}
          ${button({ href: '/help/', label: 'Read the FAQ', variant: 'secondary', large: true })}
        </div>
      </div>
    </section>`;

  return page({
    title: 'Features — Open Cut',
    description:
      'Multi-track video editing, 53 GPU effects, 18 transitions, a layer-based photo editor and export to 8K. Every feature listed is confirmed in the running application.',
    path: '/features/',
    current: '/features/',
    body,
  });
}
