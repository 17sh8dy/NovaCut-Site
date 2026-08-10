import { releases } from '../../data/changelog.js';
import { formatDate, version } from '../../data/site.js';
import { page } from '../layout.mjs';
import { button, icons, esc, reveal } from '../components.mjs';

/**
 * The Updates page renders data/changelog.js. Adding a version is adding one object to the top
 * of that array — there is nothing here to edit.
 *
 * A release with `status: 'unreleased'` is badged as such and shows no date, which is the whole
 * reason the field exists: a changelog entry that quietly implies a ship date is the easiest
 * kind of fiction to publish by accident.
 */

const GROUPS = [
  { key: 'new', label: 'New', mod: 'new' },
  { key: 'improved', label: 'Improved', mod: 'improved' },
  { key: 'fixed', label: 'Fixed', mod: 'fixed' },
  { key: 'known', label: 'Known issues', mod: 'known' },
];

function release(r) {
  const when = formatDate(r.date);
  const badge =
    r.status === 'released'
      ? when
        ? `<span class="badge">${esc(when)}</span>`
        : ''
      : `<span class="badge badge--accent">Unreleased</span>`;

  const sections = GROUPS.filter((g) => r.sections?.[g.key]?.length)
    .map(
      (g) => `<div class="change-group change-group--${g.mod}">
          <h3>${esc(g.label)}</h3>
          <ul class="change-list">${r.sections[g.key].map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>`
    )
    .join('');

  return `<article class="release" id="v${esc(r.version.replace(/\./g, '-'))}">
      <div class="release__head">
        <h2>Open Cut ${esc(r.version)}</h2>
        <span class="release__name">${esc(r.name)}</span>
        ${badge}
      </div>
      <p class="release__summary">${esc(r.summary)}</p>
      ${sections}
    </article>`;
}

export function updatesPage() {
  const latest = releases[0];

  const body = `
    <section class="section section--tight">
      <div class="wrap wrap--article">
        <p class="eyebrow">Updates</p>
        <h1 style="font-size:var(--t-h1)">Release notes</h1>
        <p class="lede" style="margin-top:var(--s5)">Everything that changes in Open Cut, written down.
          Each release lists what is new, what improved, what was fixed — and the known issues that were
          still open when it shipped, because those matter more than the rest of it put together.</p>
        ${
          latest && latest.status !== 'released'
            ? `<p class="muted" style="margin-top:var(--s5);font-size:var(--t-small)">
                 Open Cut ${esc(version)} has not been published yet. These notes describe the build as it
                 stands and are kept up to date as it changes.
               </p>`
            : ''
        }
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap wrap--article">
        ${reveal(releases.map(release).join(''))}
      </div>
    </section>

    <section class="cta">
      <div class="wrap">
        <h2>Get the current build</h2>
        <p class="lede">Full build details, prerequisites and system requirements are on the download page.</p>
        <div class="btn-row">
          ${button({ href: '/download/', label: 'Download Open Cut', icon: icons.download, large: true })}
        </div>
      </div>
    </section>`;

  return page({
    title: 'Updates — Open Cut',
    description:
      'Release notes for Open Cut: what is new, what improved, what was fixed, and the known issues still open in each release.',
    path: '/updates/',
    current: '/updates/',
    body,
  });
}
