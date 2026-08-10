import { site, version, releaseStatus } from '../../data/site.js';
import { page } from '../layout.mjs';
import { button, icons, esc } from '../components.mjs';

/**
 * About.
 *
 * Grounded on purpose. No founding story, no mission statement, no team of people who may not
 * exist. What it does say is checkable: what the project is, how it is built, what it will not
 * do, and where it currently stands.
 */

export function aboutPage() {
  const body = `
    <section class="section section--tight">
      <div class="wrap">
        <p class="eyebrow">About</p>
        <h1 style="font-size:var(--t-h1);max-width:20ch">Software you can actually own.</h1>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap">
        <div class="prose">
          <blockquote>Open Cut is built around a simple idea: powerful creative software shouldn’t require
            a subscription just to reach the basic tools you need.</blockquote>

          <p style="margin-top:var(--s6)">Editing a video and designing its thumbnail are ordinary things to
            want to do. Somewhere along the way both became rented. You can find yourself paying monthly for
            the ability to cut a clip, add a title and export a file — and losing that ability the month you
            stop.</p>

          <p>Open Cut is a desktop video and photo editor built the other way round. You download it, it
            runs on your machine, it opens your files, and it keeps working. There is no account, no trial
            period, no watermark, and no feature in the editor that stops working when you stop paying.</p>

          <h2>What “always free” actually covers</h2>
          <p>Video editing. Photo editing. The timeline tools. Audio tools. Transitions. Effects. Export.
            And the improvements made to all of them from here on. These are what an editor <em>is</em>, and
            they stay part of the free Open Cut experience.</p>
          <p>The one honest asterisk is AI. Open Cut has no AI features today. If it gains them, they may be
            offered as <strong>optional paid services</strong>, because removing a background or upscaling a
            shot can mean running a model on hardware that costs money every time — a cost that keeps
            arriving long after a download. Anything like that would sit alongside the editor, never in
            front of it.</p>

          <h2>How it’s built</h2>
          <p>Open Cut is a native desktop application, not a web page in a wrapper. The preview and the
            exporter share one GPU compositor, so what you watch is what gets written to the file. Timeline
            positions are stored as integer ticks rather than floating-point seconds, so thousands of edits
            never accumulate drift. Every edit is a command with a real undo history behind it.</p>
          <p>The editor itself is deliberately separated from the layer that talks to the operating system,
            which is what makes builds for other platforms a matter of implementing that layer rather than
            rewriting the application.</p>

          <h2>What it isn’t</h2>
          <p>Open Cut is early. Version ${esc(version)} is its first release${
            releaseStatus === 'released' ? '' : ', and it has not been published yet'
          }. There is one platform with a build, a list of things that are designed for but not delivered,
            and a set of known issues written down in full rather than smoothed over.</p>
          <ul>
            <li>The <a href="/features/#video">Features</a> page marks what is planned separately from what
              is built.</li>
            <li>The <a href="/updates/">Updates</a> page lists the known issues for the current build.</li>
            <li>The <a href="/download/">Download</a> page states the prerequisites before you install
              anything.</li>
          </ul>
          <p>That is on purpose. An editor is a tool you trust with hours of work, and the fastest way to
            lose that trust is to be surprised by something the website could have told you.</p>

          <h2>Where it stands</h2>
          <p>Open Cut is under active development and improving. It is an independent project released
            under the ${esc(site.license)} licence — not a product of a company, and not something with a
            roadmap sold in advance.</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="wrap">
        <h2>Powerful editing. Made open.</h2>
        <p class="lede">See what’s in it, or read exactly what state it’s in.</p>
        <div class="btn-row">
          ${button({ href: '/download/', label: 'Download Open Cut', icon: icons.download, large: true })}
          ${button({ href: '/updates/', label: 'Read the release notes', variant: 'secondary', large: true })}
        </div>
      </div>
    </section>`;

  return page({
    title: 'About — Open Cut',
    description:
      'Open Cut is built around a simple idea: powerful creative software shouldn’t require a subscription to reach the basic tools you need. An independent, actively developed desktop editor.',
    path: '/about/',
    current: '/about/',
    body,
  });
}
