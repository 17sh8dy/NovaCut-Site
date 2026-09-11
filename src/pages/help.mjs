import { faqGroups } from '../../data/faq.js';
import { site, platforms, ffmpeg, codeSigning, version, releaseStatus } from '../../data/site.js';
import { page } from '../layout.mjs';
import { button, icons, notice, esc, inline, reveal } from '../components.mjs';

/**
 * The help centre.
 *
 * Four answers are marked `dynamic` in data/faq.js and are composed here from data/site.js
 * instead of being written out. That is deliberate: "what platforms are supported", "what else
 * do I need installed", "why does Windows warn me" and "where do I report a bug" are exactly the
 * answers that go stale first, and the only way they can stay true is to have a single origin
 * with the Download page.
 *
 * The same answers become FAQPage structured data. Search engines surface those directly, so a
 * wrong answer here is a wrong answer shown to people who never visit the site — which is why
 * the JSON-LD is generated from the same strings as the visible copy, never written twice.
 */

/** Composed answers. Each returns an array of paragraph strings in the same mini-markup. */
const DYNAMIC = {
  platforms() {
    const available = Object.values(platforms).filter((p) => p.available);
    const pending = Object.entries(platforms).filter(([, p]) => !p.available);
    const list = available.map((p) => `**${p.name}** (${p.arch})`).join(' and ');
    return [
      available.length
        ? `Nova Cut currently has a build for ${list}. It requires ${available[0].minimumOs}.`
        : 'No platform has a published build yet.',
      pending.length
        ? `${pending
            .map(([, p]) => p.name)
            .join(' and ')} are planned. ${pending
            .map(([, p]) => p.status)
            .join(' ')} No release date has been set for either.`
        : '',
      'The editor itself is written to be platform-agnostic — only the layer that talks to the operating system differs — but a platform is not listed as supported here until there is a build that has actually been tested on it.',
    ].filter(Boolean);
  },

  ffmpeg() {
    if (ffmpeg.bundled) {
      return ['No. Everything Nova Cut needs ships inside the installer.'];
    }
    return [
      `Yes — one thing. ${ffmpeg.summary}`,
      ffmpeg.detail,
      'In practice: install FFmpeg first, then import your media. If you have already imported a video and it shows a duration of zero, that is the symptom of FFmpeg not being found.',
    ];
  },

  signing() {
    if (codeSigning.signed) {
      return ['It should not. The installer is code-signed.'];
    }
    return [
      codeSigning.note,
      'Choose **More info** and then **Run anyway** to continue. Code signing is a certificate the project does not have yet, not a statement about the file.',
      'If you would rather not click through a SmartScreen warning, the portable build has the same behaviour — the warning comes from the missing signature, not from the installer format.',
    ];
  },

  report() {
    const { issues, email, community } = site.contact;
    /* The same closing advice whichever route exists — worth saying once, not three times. */
    const detail =
      'Whichever route you use, a useful report has three things in it: your Nova Cut version, your Windows version, and the shortest sequence of steps that reproduces the problem. The About section of Settings shows the version and system details to quote.';

    if (issues) {
      return [
        `Report bugs on the [issue tracker](${issues}).`,
        community ? `For questions, help and general chat there is also the [Discord](${community}).` : '',
        detail,
      ].filter(Boolean);
    }

    if (community) {
      return [
        `**On [Discord](${community}).** That is where bug reports, questions and feature requests go for now — post one there and it will be seen.`,
        `There is no public issue tracker yet. Nova Cut ${version} ${
          releaseStatus === 'released' ? 'is a very early release' : 'has not been publicly released yet'
        }, and one will be published alongside it rather than announced here before it exists.`,
        'It is worth checking the [Updates](/updates/) page first — the known issues for the current build are listed there in full, and the most common problems with it are already written down.',
        detail,
      ];
    }

    return [
      `**There is no public bug tracker yet.** Nova Cut ${version} ${
        releaseStatus === 'released' ? 'is a very early release' : 'has not been publicly released yet'
      }, and a reporting channel will be published alongside it rather than announced here before it exists.`,
      email
        ? `In the meantime, problems can be sent to [${email}](mailto:${email}).`
        : 'Until then, the known issues for the current build are listed in full on the [Updates](/updates/) page — it is worth checking there first, since the most common problems with this build are already written down.',
      detail,
    ].filter(Boolean);
  },
};

/** Resolve an item to its paragraph strings, whether static or composed. */
const bodyOf = (item) => (item.dynamic ? DYNAMIC[item.dynamic]() : item.body);

/** Markup -> plain text, for the structured-data copy of an answer. */
const plain = (paragraphs) =>
  paragraphs
    .join(' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1');

function faqItem(item, open) {
  const paragraphs = bodyOf(item);
  const id = item.id ? ` id="${esc(item.id)}"` : '';
  return `<details class="faq"${id}${open ? ' open' : ''}>
      <summary><span>${esc(item.q)}</span><span class="faq__chevron">${icons.chevronDown}</span></summary>
      <div class="faq__body">${paragraphs.map((p) => `<p>${inline(p)}</p>`).join('')}</div>
    </details>`;
}

export function helpPage() {
  let first = true;
  const groups = faqGroups
    .map((g) => {
      const items = g.items
        .map((item) => {
          const html = faqItem(item, first);
          first = false;
          return html;
        })
        .join('');
      return `<section class="faq-group" id="${esc(g.id)}">
          <h2>${esc(g.title)}</h2>
          ${items}
        </section>`;
    })
    .join('');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: plain(bodyOf(item)) },
      }))
    ),
  };

  const body = `
    <section class="section section--tight">
      <div class="wrap wrap--article">
        <p class="eyebrow">Help</p>
        <h1 style="font-size:var(--t-h1)">Help &amp; FAQ</h1>
        <p class="lede" style="margin-top:var(--s5);max-width:60ch">Straight answers about what Nova Cut is,
          what it costs, what it needs installed, and what it can’t do yet.</p>
        <nav class="btn-row" style="margin-top:var(--s6)" aria-label="Jump to a section">
          ${faqGroups
            .map((g) => `<a class="btn btn--secondary" href="#${esc(g.id)}">${esc(g.title)}</a>`)
            .join('')}
        </nav>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap wrap--article">
        ${reveal(groups)}
      </div>
    </section>

    <section class="section section--tight section--surface">
      <div class="wrap wrap--article">
        ${notice({
          tone: 'accent',
          icon: icons.info,
          title: 'Didn’t find it here?',
          body: [
            'The [Updates](/updates/) page lists the known issues for the current build in full, and the [Features](/features/) page marks what is planned but not built. Between them they cover most "is it me or the app?" questions.',
          ],
        })}
      </div>
    </section>

    <section class="cta">
      <div class="wrap">
        <h2>Ready to edit?</h2>
        <p class="lede">Free to download, free to keep using.</p>
        <div class="btn-row">
          ${button({ href: '/download/', label: 'Download Nova Cut', icon: icons.download, large: true })}
        </div>
      </div>
    </section>`;

  return page({
    title: 'Help & FAQ — Nova Cut',
    description:
      'Answers about Nova Cut: is it free, will editing features stay free, will there be AI features, what platforms are supported, and where to report a bug.',
    path: '/help/',
    current: '/help/',
    body,
    jsonLd,
  });
}
