import {
  site,
  version,
  releaseStatus,
  releaseDate,
  buildDate,
  platforms,
  requirements,
  ffmpeg,
  codeSigning,
  formatSize,
  formatDate,
  isDownloadable,
} from '../../data/site.js';
import { page } from '../layout.mjs';
import { button, icons, notice, specList, esc, inline } from '../components.mjs';

/**
 * The Download page.
 *
 * Its whole job is to be accurate. Three rules it enforces, all driven by data/site.js rather
 * than by anything written here:
 *
 *   · A build with no URL renders a DISABLED control plus the reason. It never becomes a link
 *     that 404s, and it never becomes a "coming soon" that pretends a URL exists.
 *   · A platform with `available: false` gets a status line, not a button.
 *   · The FFmpeg dependency and the missing code signature are stated ON this page, before the
 *     download, because both change what the first run looks like.
 */

const OS_ICON = { windows: icons.windows, macos: icons.apple, linux: icons.linux };

function buildRow(build) {
  const size = formatSize(build.sizeBytes);
  const live = isDownloadable(build);

  const specs = [
    ['File', build.filename],
    ['Type', build.format],
    ['Architecture', platforms.windows.arch],
  ];
  if (size) specs.push(['Size', size]);

  return `<div class="dl-build">
      <div class="dl-build__top">
        <h3>${esc(build.label)}${build.recommended ? '' : ''}</h3>
        ${build.recommended ? '<span class="badge badge--accent">Recommended</span>' : ''}
      </div>
      <p>${esc(build.note)}</p>
      ${specList(specs)}
      <div style="margin-top:var(--s5)">
        ${
          live
            ? button({
                href: build.url,
                label: `Download for ${platforms.windows.name}`,
                icon: icons.download,
                large: true,
                variant: build.recommended ? 'primary' : 'secondary',
              })
            : button({
                label: `Download for ${platforms.windows.name}`,
                icon: icons.download,
                large: true,
                disabled: true,
                variant: build.recommended ? 'primary' : 'secondary',
                describedBy: 'not-published',
              })
        }
      </div>
    </div>`;
}

function otherPlatform(key) {
  const p = platforms[key];
  return `<div class="platform-row">
      <span class="dl-card__os">${OS_ICON[key]}</span>
      <div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.status)}</p>
      </div>
      <span class="badge">Planned</span>
    </div>`;
}

export function downloadPage() {
  const win = platforms.windows;
  const published = releaseStatus === 'released';
  const releaseWhen = formatDate(releaseDate);
  const builtWhen = formatDate(buildDate);

  const versionSpecs = [
    ['Version', version],
    ['Platform', `${win.name} ${win.arch}`],
    ['Minimum OS', win.minimumOs],
  ];
  if (published && releaseWhen) versionSpecs.push(['Released', releaseWhen]);
  else if (builtWhen) versionSpecs.push(['Build date', builtWhen]);
  versionSpecs.push(['Licence', `${site.license} — free to use`]);

  const body = `
    <section class="section section--tight">
      <div class="wrap">
        <p class="eyebrow">Download</p>
        <h1 style="font-size:var(--t-h1)">Download Open Cut</h1>
        <p class="lede" style="margin-top:var(--s5);max-width:58ch">Get the latest version of Open Cut for
          your desktop. It’s free, there’s no account to create, and there’s no watermark on anything you
          export.</p>
      </div>
    </section>

    <section class="section" style="padding-top:0">
      <div class="wrap">
        ${
          published
            ? ''
            : notice({
                tone: 'accent',
                icon: icons.info,
                /* Follows the page h1 with no section heading between, so it IS the h2 here. */
                level: 2,
                title: `Version ${version} is not published yet`,
                body: [
                  `The Windows build below is real: it has been produced and tested${
                    builtWhen ? ` (built ${builtWhen})` : ''
                  }, and the file details are the actual artifacts. What does not exist yet is a public download link, so the buttons on this page are inactive rather than pointing somewhere that would fail.`,
                  'Everything else on this page — the build details, the system requirements and the prerequisites — is accurate today and will not change when the link goes live.',
                ],
              })
        }

        <div class="dl-grid" style="margin-top:var(--s6)">
          <div class="dl-card dl-card--primary">
            <div class="dl-card__head">
              <span class="dl-card__os">${icons.windows}</span>
              <div>
                <h2>${esc(win.name)}</h2>
                <p>${esc(win.arch)} &middot; v${esc(version)}</p>
              </div>
            </div>
            <div class="dl-card__body">
              ${win.builds.map(buildRow).join('')}
              ${
                published
                  ? ''
                  : `<p id="not-published" class="muted" style="margin-top:var(--s5);font-size:var(--t-tiny)">
                       Downloads become active when version ${esc(version)} is published.
                     </p>`
              }
            </div>
          </div>

          <div style="display:grid;gap:var(--s5)">
            <div class="card">
              <h2 style="font-size:var(--t-h3);margin-bottom:var(--s4)">This release</h2>
              ${specList(versionSpecs)}
              <div class="btn-row" style="margin-top:var(--s5)">
                ${button({ href: '/updates/', label: 'Release notes', variant: 'secondary', icon: icons.arrowRight })}
              </div>
            </div>

            <div class="card" id="requirements">
              <h2 style="font-size:var(--t-h3);margin-bottom:var(--s4)">System requirements</h2>
              ${specList(requirements.windows.map((r) => [r.label, r.value]), { prose: true })}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight section--surface">
      <div class="wrap">
        <div class="section-head" style="margin-bottom:var(--s5)">
          <h2 style="font-size:var(--t-h3)">Before you install</h2>
          <p class="lede">Two things worth knowing, both of which change what your first run looks like.</p>
        </div>
        <div style="display:grid;gap:var(--s4)">
          ${
            ffmpeg.bundled
              ? ''
              : notice({
                  tone: 'warn',
                  icon: icons.alert,
                  title: 'FFmpeg is required, and is not bundled',
                  body: [ffmpeg.summary, ffmpeg.detail],
                })
          }
          ${
            codeSigning.signed
              ? ''
              : notice({
                  icon: icons.shield,
                  title: 'The installer is not code-signed yet',
                  body: [
                    codeSigning.note,
                    'To continue past it, choose **More info** and then **Run anyway**. This will stop happening once a code-signing certificate is in place.',
                  ],
                })
          }
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap">
        <div class="section-head" style="margin-bottom:var(--s3)">
          <h2 style="font-size:var(--t-h3)">Other platforms</h2>
          <p class="lede">More platforms are planned. Open Cut is built so that the editor itself is
            platform-agnostic — only the layer that talks to the operating system has to change — but a
            platform is not supported until there is a build that has been tested on it.</p>
        </div>
        <div class="card">
          ${Object.keys(platforms)
            .filter((k) => !platforms[k].available)
            .map(otherPlatform)
            .join('')}
        </div>
        <p class="muted" style="margin-top:var(--s4);font-size:var(--t-tiny)">No release date has been set
          for either platform.</p>
      </div>
    </section>

    <section class="cta">
      <div class="wrap">
        <h2>Questions before you install?</h2>
        <p class="lede">The help centre covers prerequisites, formats, where your files live and what is
          and isn’t built yet.</p>
        <div class="btn-row">
          ${button({ href: '/help/', label: 'Help & FAQ', large: true })}
          ${button({ href: '/features/', label: 'See the features', variant: 'secondary', large: true })}
        </div>
      </div>
    </section>`;

  return page({
    title: 'Download — Open Cut',
    description: `Download Open Cut ${version} for Windows. Free desktop video and photo editing, with no account, no watermark and no subscription.`,
    path: '/download/',
    current: '/download/',
    body,
  });
}
