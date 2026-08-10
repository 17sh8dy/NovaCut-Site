/**
 * ── HELP CONTENT ─────────────────────────────────────────────────────────────────────
 *
 * Grouped question/answer pairs. `body` is an array of paragraphs; each may contain the small
 * inline markup subset that src/components.mjs understands (**bold**, `code`, [text](href)).
 *
 * Answers must be answerable — no "coming soon" where the honest answer is "no". Anything that
 * depends on release state or platform support reads it from data/site.js at build time rather
 * than restating it, so these answers cannot drift out of sync with the Download page.
 *
 * Questions also become FAQPage structured data on the Help page, which is why each answer's
 * first paragraph is written to stand alone as a complete reply.
 */

export const faqGroups = [
  {
    id: 'about-open-cut',
    title: 'About Open Cut',
    items: [
      {
        q: 'What is Open Cut?',
        body: [
          'Open Cut is a desktop video and photo editor. It combines a multi-track, non-linear video timeline and a layer-based image editor in one application, built for creators who need to cut a video and design its thumbnail without paying for two subscriptions.',
          'It is a native desktop application rather than a website — your media stays on your own machine, and editing does not require an internet connection.',
        ],
      },
      {
        q: 'Is Open Cut free?',
        body: [
          'Yes. Open Cut is free to download and use, and it is released under the MIT licence.',
          'There is no account to create, no trial period, no watermark on your exports, and no feature in the editor that is locked behind a payment.',
        ],
      },
      {
        q: 'Will editing features always be free?',
        body: [
          '**Yes. Open Cut’s core editing features are intended to remain free.**',
          'That covers video editing, photo editing, the timeline tools, audio tools, transitions, effects and export — and the improvements made to all of them over time. These are the things an editor *is*, and putting them behind a subscription would defeat the point of the project.',
        ],
      },
      {
        q: 'Will Open Cut have AI features?',
        body: [
          'Open Cut has no AI features today, and none are in the current build.',
          'It may gain them later. AI is genuinely different from the rest of the editor: a background removal or an upscale can mean running a model on someone else’s hardware, and that carries a real, ongoing cost per use that does not go away.',
          'So if AI-powered features are introduced, they may be offered as **optional paid services**, priced to cover that processing. They would be additions alongside the editor, never a fence around it — the editing features listed above stay free either way.',
        ],
      },
      {
        q: 'Who makes Open Cut?',
        body: [
          'Open Cut is an independent project under active development. It is not owned by a company, and there is no organisation behind it beyond the people writing it.',
        ],
      },
    ],
  },
  {
    id: 'installing',
    title: 'Downloading and installing',
    items: [
      {
        q: 'What platforms does Open Cut support?',
        /** Rendered from data/site.js so it can never contradict the Download page. */
        dynamic: 'platforms',
      },
      {
        q: 'Do I need anything else installed?',
        dynamic: 'ffmpeg',
      },
      {
        q: 'Why does Windows warn me about the installer?',
        dynamic: 'signing',
      },
      {
        q: 'What is the difference between the installer and the portable build?',
        body: [
          'The **installer** lets you choose where Open Cut goes, adds Start menu and desktop shortcuts, and associates `.opencut` project files so double-clicking one opens the editor. It can be removed from Windows’ normal Apps list.',
          'The **portable** build is a single executable that runs from wherever you put it, including a USB drive. It does not create shortcuts or file associations. It is the right choice on a machine where you cannot install software.',
          'Both contain the same application.',
        ],
      },
      {
        q: 'Does uninstalling delete my projects?',
        body: [
          'No. Uninstalling removes the application and leaves your projects, preferences and exports where they are. Your own files are never removed by the uninstaller.',
        ],
      },
    ],
  },
  {
    id: 'using',
    title: 'Using the editor',
    items: [
      {
        q: 'What formats can I export?',
        body: [
          'Video exports to MP4, MOV, MKV, AVI and animated GIF, using H.264, H.265, VP9, AV1 or ProRes where the container supports the codec. Resolutions run from 480p to 8K, at 24, 25, 30, 50, 60, 120, 144 or 240 frames per second.',
          'Images export from the photo editor to PNG, JPG and WebP at full document resolution.',
          'Video export requires FFmpeg — see the question above.',
        ],
      },
      {
        q: 'Can I put images or GIFs on the video timeline?',
        body: [
          'Not currently. The video timeline accepts video and audio; still images and GIFs are edited in the photo editor instead.',
        ],
      },
      {
        q: 'Is my work saved automatically?',
        body: [
          'Yes. Open Cut autosaves as you work, and if it closes unexpectedly it offers to restore the session on the next launch — including the timeline, imported media, effects, playhead position, zoom level and selection.',
          'Autosave is a safety net rather than a replacement for saving: use **Ctrl + S** to write a `.opencut` project file wherever you want it.',
        ],
      },
      {
        q: 'Does Open Cut work offline?',
        body: [
          'Yes. Everything happens on your machine. Open Cut does not need an account and does not need a connection to edit or export.',
        ],
      },
      {
        q: 'Where does Open Cut store my files?',
        body: [
          'Projects are saved wherever you choose to save them, as `.opencut` files. Preferences, autosaves and caches live in Open Cut’s own application data folder, which the Storage section of Settings can show you, measure and clear.',
        ],
      },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      {
        q: 'Where can I report a bug?',
        id: 'report-a-bug',
        dynamic: 'report',
      },
      {
        q: 'How do I find out what changed in a release?',
        body: [
          'Every release is written up on the [Updates](/updates/) page, including what is new, what improved, what was fixed, and the known issues that are still open at the time of release.',
        ],
      },
      {
        q: 'What information helps most when reporting a problem?',
        body: [
          'The version of Open Cut, your Windows version, and what you were doing when it went wrong — ideally the shortest sequence of steps that reproduces it.',
          'For an export or import problem, whether FFmpeg is installed and reachable on your PATH is almost always the first thing worth checking.',
          'The About section of Settings shows the version and system information you would need to include.',
        ],
      },
    ],
  },
];
