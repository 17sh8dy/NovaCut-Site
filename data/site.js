/**
 * ── THE ONE FILE YOU EDIT WHEN A VERSION SHIPS ────────────────────────────────────────
 *
 * Every version number, file size, download link, platform claim and system requirement on
 * the website is read from here. No page, template or stylesheet hard-codes any of it, so a
 * release is one edit in one file followed by `npm run build`.
 *
 * The rule this file exists to enforce: THE SITE MAY ONLY CLAIM WHAT IS TRUE. A platform with
 * `available: false` renders as "planned" and cannot produce a download button; a build with a
 * null `url` renders as "not yet published" and cannot pretend to be downloadable. Making the
 * claim requires supplying the evidence, which is exactly the coupling you want between what
 * the product does and what the marketing says.
 *
 * TO PUBLISH A RELEASE:
 *   1. `releaseStatus` -> 'released'
 *   2. `version` / `releaseDate` -> the real values
 *   3. platforms.windows.builds[*].url -> the real, tested URLs
 *   4. platforms.windows.builds[*].sizeBytes -> the real artifacts' byte sizes
 *   5. Add the release to data/changelog.js (its `status` drives the Updates page badge)
 *   6. npm run build
 */

export const site = {
  name: 'Open Cut',
  tagline: 'Powerful editing. Made open.',
  description:
    'Open Cut is a powerful desktop video and photo editor built for creators. Every core editing feature will always be free.',
  /**
   * Used to build absolute URLs for Open Graph and canonical tags. Set this to the real domain
   * before deploying — relative OG images are ignored by most crawlers.
   */
  origin: 'https://opencut.app',
  /** Set at build time so the footer year can never go stale. */
  year: new Date().getFullYear(),
  license: 'MIT',
  /**
   * Open Cut is an independent project. There is deliberately no company name, legal entity or
   * address here, because the repository does not record one and inventing one would be a lie
   * with legal consequences. `author` is package.json's author field, verbatim.
   */
  author: 'Open Cut',
  /**
   * Contact and issue reporting. `null` means "no channel exists yet", and the Help page then
   * renders an honest explanation instead of a dead link. Fill these in when they are real.
   *
   * `community` is the Discord invite — the one live channel today, so it is what the "where do
   * I report a bug" answer points at and what the footer links to. That answer composes itself
   * from whichever of these fields exist (see `report` in src/pages/help.mjs), so adding an
   * issue tracker later changes the wording everywhere without editing any prose.
   */
  contact: {
    email: null,
    community: 'https://discord.gg/XBhER9Z6EB',
    issues: null,
    repository: null,
  },
};

/**
 * ── RELEASE STATE ────────────────────────────────────────────────────────────────────
 *
 * 'unreleased' — a build exists and has been tested locally, but nothing has been published
 *                to a public URL. Download buttons render disabled with an explanation.
 * 'released'   — the URLs below are live. Download buttons become real links.
 */
export const releaseStatus = 'unreleased';

export const version = '0.1.0';

/** ISO date, or null while unreleased. Never guess this. */
export const releaseDate = null;

/**
 * The date the current Windows artifacts were produced locally. This is a BUILD date, not a
 * release date, and every surface that shows it labels it as such.
 */
export const buildDate = '2026-07-22';

export const platforms = {
  windows: {
    name: 'Windows',
    /** A real, tested build of this version exists for this platform. */
    available: true,
    arch: 'x64',
    minimumOs: 'Windows 10 (64-bit) or later',
    builds: [
      {
        id: 'win-installer',
        label: 'Installer',
        format: 'NSIS installer (.exe)',
        filename: 'Open Cut-0.1.0-x64.exe',
        /** Exact byte size of the produced artifact. */
        sizeBytes: 82251466,
        /** null while unreleased — the button renders disabled rather than 404ing. */
        url: null,
        recommended: true,
        note: 'Lets you choose the install location, adds Start menu and desktop shortcuts, and associates .opencut project files.',
      },
      {
        id: 'win-portable',
        label: 'Portable',
        format: 'Portable executable (.exe)',
        filename: 'Open Cut-0.1.0-portable.exe',
        sizeBytes: 81999980,
        url: null,
        recommended: false,
        note: 'Runs without installing. Useful on machines where you cannot install software.',
      },
    ],
  },
  macos: {
    name: 'macOS',
    available: false,
    /**
     * electron-builder.yml *configures* dmg and zip targets for macOS, but no macOS build of
     * Open Cut has been produced or tested. "Configured" is not "available", so the site says
     * planned until an artifact exists.
     */
    status: 'Build targets are configured, but no macOS build has been produced or tested yet.',
  },
  linux: {
    name: 'Linux',
    available: false,
    status: 'AppImage and .deb targets are configured, but no Linux build has been produced or tested yet.',
  },
};

/**
 * System requirements. Every line is derived from something checkable — the Electron version's
 * own support matrix, the WebGL2 requirement of the compositor, or the export pipeline's
 * dependency on FFmpeg — not from a guess about what sounds reasonable.
 */
export const requirements = {
  windows: [
    { label: 'Operating system', value: 'Windows 10 (64-bit) or later' },
    { label: 'Architecture', value: 'x64' },
    {
      label: 'Graphics',
      value: 'A GPU with WebGL 2 support. The preview and the exporter share one GPU compositor.',
    },
    {
      label: 'Disk space',
      value: 'About 300 MB for the application, plus room for your projects and exports.',
    },
  ],
};

/**
 * ── THE FFMPEG CAVEAT ────────────────────────────────────────────────────────────────
 *
 * Surfaced prominently on Download and Help rather than buried, because it is the single thing
 * most likely to make a first run look broken: without FFmpeg the editor opens and edits fine,
 * but media probing, thumbnails and export do not work.
 *
 * Set `bundled: true` the moment FFmpeg ships inside the installer and this notice disappears
 * from every page at once.
 */
export const ffmpeg = {
  bundled: false,
  summary:
    'FFmpeg is required for importing media, generating thumbnails and exporting video, and is not bundled with the current build.',
  detail:
    'Install FFmpeg and make sure ffmpeg and ffprobe are on your PATH before importing media. Open Cut also ' +
    'reads the OPENCUT_FFMPEG and OPENCUT_FFPROBE environment variables, and looks in a resources/ffmpeg ' +
    'folder inside the installed application. Everything else in the editor works without it.',
};

/** Unsigned builds are a real first-run experience, and users deserve the warning up front. */
export const codeSigning = {
  signed: false,
  note: 'Builds are not code-signed yet, so Windows SmartScreen shows a warning the first time you run the installer.',
};

export const nav = [
  { href: '/features/', label: 'Features' },
  { href: '/download/', label: 'Download' },
  { href: '/updates/', label: 'Updates' },
  { href: '/help/', label: 'Help' },
  { href: '/about/', label: 'About' },
];

export const footerLinks = [
  {
    title: 'Product',
    links: [
      { href: '/features/', label: 'Features' },
      { href: '/download/', label: 'Download' },
      { href: '/updates/', label: 'Updates' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/help/', label: 'Help & FAQ' },
      { href: '/download/#requirements', label: 'System requirements' },
      { href: '/help/#report-a-bug', label: 'Report a bug' },
      /* The one live channel. `external` makes the footer open it in a new tab. */
      { href: site.contact.community, label: 'Discord', external: true },
    ],
  },
  {
    title: 'Project',
    links: [
      { href: '/about/', label: 'About' },
      { href: '/privacy/', label: 'Privacy' },
      { href: '/terms/', label: 'Terms' },
    ],
  },
];

/** Bytes -> the string a download page should show. Binary MB, one decimal, as the OS reports. */
export function formatSize(bytes) {
  if (bytes == null) return null;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** ISO date -> "22 July 2026". Returns null for null so callers can branch on "unknown". */
export function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** True when a build object can be turned into a working download link. */
export function isDownloadable(build) {
  return releaseStatus === 'released' && typeof build.url === 'string' && build.url.length > 0;
}
