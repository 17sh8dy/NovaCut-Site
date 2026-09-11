import { site, version } from '../../data/site.js';
import { page } from '../layout.mjs';
import { esc } from '../components.mjs';

/**
 * Privacy and Terms.
 *
 * These are written as plain statements about how the application behaves, not as a legal
 * document, and they say so at the top. Nova Cut has no company, no registered address and no
 * legal counsel behind it, and dressing a hobby project's page up as a corporate policy — with
 * an invented entity to bind it — would be a fabrication with real consequences.
 *
 * What IS asserted here was verified in the source: the editor makes no outbound network
 * requests, contains no analytics or crash reporting, has no account system, and has no
 * auto-updater. If any of that changes, this page changes with it.
 *
 * The hosting paragraph is written as a conditional rather than a claim, because the site's
 * eventual host is not known at build time and a promise about server logs that nobody has
 * checked is exactly the kind of privacy statement that is worse than none.
 */

const wrapper = (title, eyebrow, lede, prose, path, description) =>
  page({
    title: `${title} — Nova Cut`,
    description,
    path,
    body: `
    <section class="section section--tight">
      <div class="wrap">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h1 style="font-size:var(--t-h1)">${esc(title)}</h1>
        <p class="lede" style="margin-top:var(--s5);max-width:62ch">${lede}</p>
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="wrap"><div class="prose">${prose}</div></div>
    </section>`,
  });

export function privacyPage() {
  return wrapper(
    'Privacy',
    'Privacy',
    'A plain description of what Nova Cut does with your data. It is short because the answer is mostly “nothing”.',
    `<h2>The application</h2>
     <p><strong>Nova Cut runs entirely on your computer.</strong> Your projects, your media and your exports
       stay on your own disk. The editor works with no internet connection at all.</p>
     <ul>
       <li>There is no account, no sign-in and no licence check.</li>
       <li>There is no analytics, usage tracking or crash reporting of any kind. None is collected, and
         none is sent anywhere.</li>
       <li>There is no auto-updater, so the application does not contact a server to check for versions.</li>
       <li>Your media is never uploaded. Import, editing, preview and export all happen locally.</li>
     </ul>
     <p>Nova Cut stores preferences, your recent-projects list, autosave snapshots and caches in its own
       application data folder on your machine. The Privacy section of Settings shows you exactly where that
       is and can open it, and the Storage section can measure and clear it.</p>

     <h2>This website</h2>
     <p>This site is static: pages, stylesheets, one small script and images. It sets no cookies, embeds no
       trackers, loads no third-party scripts or fonts, and runs no analytics.</p>
     <p>The only thing it stores in your browser is your colour-theme choice, kept in <code>localStorage</code>
       so the site does not flash the wrong theme on your next visit. It never leaves your browser, and
       clearing your site data removes it.</p>
     <p>Whoever hosts this site may keep ordinary server access logs, as essentially every web server does.
       That is outside what this project controls, and this page will not pretend otherwise.</p>

     <h2>If this changes</h2>
     <p>If Nova Cut ever gains a feature that sends data anywhere — an optional AI service being the obvious
       candidate — it will be opt-in, it will say what it sends before it sends it, and this page will be
       updated before the feature ships rather than after.</p>

     <h2>Questions</h2>
     <p>Nova Cut is an independent project with no published contact channel yet. When there is one, it will
       be listed on the <a href="/help/">Help</a> page.</p>`,
    '/privacy/',
    'Nova Cut runs entirely on your computer. No account, no analytics, no tracking, and no media ever leaves your machine.'
  );
}

export function termsPage() {
  return wrapper(
    'Terms',
    'Terms',
    'Nova Cut is free software released under the ' +
      esc(site.license) +
      ' licence. This page explains what that means in practice; the licence itself is the actual legal text.',
    `<h2>The licence</h2>
     <p>Nova Cut is released under the <strong>${esc(site.license)} licence</strong>. In practice that means
       you may use it for anything, including commercial work, without asking permission and without paying
       anything. You may copy it, modify it and redistribute it, provided the licence notice travels with
       it.</p>
     <p>The full licence text ships with the application and is the authoritative version. Nothing on this
       page adds to it or takes anything away from it.</p>

     <h2>Your work is yours</h2>
     <p>Nova Cut claims no rights over anything you make with it. Your projects, your media and your exports
       are yours. There is no watermark, no attribution requirement and no restriction on commercial use of
       what you produce.</p>

     <h2>No warranty</h2>
     <p>As the ${esc(site.license)} licence states, the software is provided “as is”, without warranty of
       any kind. Nova Cut ${esc(version)} is an early version with known issues, listed in full on the
       <a href="/updates/">Updates</a> page.</p>
     <p>Practical advice rather than legal language: keep backups of source media you cannot replace, and
       save your projects. Nova Cut autosaves and can recover a session after a crash, but no editor should
       be the only copy of something that matters.</p>

     <h2>What is free, and what might not be</h2>
     <p><strong>Every editing feature is free and is intended to remain free</strong> — video editing, photo
       editing, timeline tools, audio tools, transitions, effects, export, and the improvements made to
       them.</p>
     <p>Nova Cut has no AI features today. If AI-powered features are introduced in future, they may be
       offered as optional paid services, because the processing behind them carries an ongoing cost. Such
       features would be additions; they would not place any existing editing feature behind a payment.</p>

     <h2>Third-party software</h2>
     <p>Nova Cut can use <strong>FFmpeg</strong> for media import, thumbnails and video export. FFmpeg is a
       separate project with its own licence, and it is not included in the current build — you install it
       yourself. Nova Cut is also built on Electron, Chromium and Node.js, each under its own licence.</p>

     <h2>Changes</h2>
     <p>This page describes Nova Cut ${esc(version)}. If the terms change, the change will be described in
       the release notes for the version it takes effect in.</p>`,
    '/terms/',
    `Nova Cut is free software under the ${site.license} licence. Use it for anything, including commercial work. Your projects and exports are yours.`
  );
}
