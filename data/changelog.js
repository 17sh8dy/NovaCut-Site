/**
 * ── THE CHANGELOG ────────────────────────────────────────────────────────────────────
 *
 * Newest release first. The Updates page renders this array directly, so adding a version is
 * adding one object to the top — no template edits.
 *
 * Shape:
 *   version   the version string, matching data/site.js when it is the current release
 *   name      a short title for the release
 *   status    'unreleased' | 'released'   — drives the badge and whether a date is shown
 *   date      ISO date, or null while unreleased. NEVER guess this.
 *   summary   one paragraph; what this release is
 *   sections  { new, improved, fixed, known } — omit any that is empty
 *
 * The 0.1.0 entry below describes work that is actually in the tree and was verified in the
 * running application. Where an item was measured, the measurement is included, because a
 * changelog that says "improved export reliability" tells a user nothing they can check.
 */

export const releases = [
  {
    version: '0.1.0',
    name: 'First public release',
    status: 'unreleased',
    date: null,
    summary:
      'The first release of Open Cut: a multi-track video editor and a layer-based photo editor in one desktop application, ' +
      'packaged as a real Windows installer. This entry describes the build as it stands; it is published here so the ' +
      'release notes are ready the day the download is.',
    sections: {
      new: [
        'Multi-track video and audio timeline with split, trim, ripple delete, duplicate, snapping, magnetic edges, zoom and per-track mute, solo, lock, hide and rename.',
        '53 GPU effects across seven categories, each with real parameters that can be keyframed.',
        '18 transitions, all implemented as shaders. A transition window is centred on the cut and clamped so that adding one never shortens the sequence.',
        'Text clips with 13 styled presets, rasterised into the compositor so they run through the effect chain and transitions like any other clip.',
        'Transform keyframes for position, scale, rotation and opacity, with linear, hold, ease and bezier interpolation.',
        'Clip speed and reverse, applied to picture and sound together.',
        'Export to MP4, MOV, MKV, AVI and animated GIF at up to 8K and up to 240 fps, with H.264, H.265, VP9, AV1 and ProRes, quality presets or explicit bitrate, optional hardware encoding, and live size and render-time estimates.',
        'A layer-based photo editor: layer tree with groups, 27 blend modes, layer masks, adjustment layers, and export to PNG, JPG and WebP.',
        'Photo selection tools — rectangle, ellipse, lasso, polygon lasso and magic wand — with boolean combines, feather, expand and invert, stored as geometry so they survive undo.',
        'Photo paint tools — brush, eraser, paint bucket and gradient — with pen pressure, smoothing, and one undo step per stroke.',
        'Vector shapes and text in the photo editor, plus an asset library of annotations, shapes, styled text presets and emoji stickers.',
        'Canvas rotate and flip, rulers, smart guides and snapping in the photo editor.',
        'A native Windows application: frameless window with app-drawn chrome, native menus, persisted window geometry, single-instance handling, an unsaved-changes guard on quit, and .opencut file associations.',
        'Autosave with crash recovery that restores the timeline, media, effects, playhead, zoom and selection.',
        'A searchable settings window with System, Light and Dark themes and a choosable accent colour, where anything not yet wired up is shown disabled with the reason.',
        'Rebindable keyboard shortcuts with conflict detection.',
        'An NSIS installer and a portable executable for Windows x64, with icons rendered from the project’s single source-of-truth vector logo.',
      ],
      improved: [
        'Transitions became real. Previously the interface listed and accepted transitions that the compositor never read; the compositor now renders both clips into separate buffers inside a transition window and blends them with a two-texture shader.',
        'The interface was rebuilt on a neutral design system. Surfaces are grey and charcoal, colour is reserved for things that are interactive or active, and the brand gradient is limited to the logo.',
        'Effects that declared parameters but rendered nothing were either implemented or removed, so the effect list no longer contains entries that do nothing.',
        'Export now streams frames from the same GPU compositor the preview uses, so there is no second render path that can disagree with what you were watching.',
      ],
      fixed: [
        'Text was silently dropped from every export. Titles and captions were drawn as HTML over the preview canvas, and the exporter — which reads pixels back from that canvas — could not see them. Text is now rasterised into the compositor, so preview and export are the same image by construction.',
        'The preview could freeze on the first frame while the timecode kept advancing. Ranged reads of local media were answered with the whole file, which Chromium treats as "this source cannot seek", permanently downgrading the video element to a non-seekable stream. Media is now served with correct partial-content responses.',
        'Exports could contain long runs of black frames. The exporter waited a fixed interval for asynchronous seeks and wrote a black frame whenever a decode missed the window — measured at 746 of 1569 frames on one test render. Seeks are now awaited on the decoder’s own events; the same render measured 0 black frames afterwards.',
        'Applying an odd number of effects flipped the picture upside down. The compositor’s quad sampled top-down while frame buffer textures are bottom-up, so the error cancelled itself at even effect counts and was invisible in casual testing.',
        'An export could hang forever if FFmpeg was missing or rejected the codec, instead of reporting the failure.',
        'A photo document larger than the preview cap exported at preview resolution rather than document resolution.',
      ],
      known: [
        'FFmpeg is not bundled with the installer. Importing media, generating thumbnails and exporting video all require FFmpeg to be installed separately and reachable on your PATH. Everything else in the editor works without it.',
        'Builds are not code-signed, so Windows SmartScreen warns the first time you run the installer.',
        'Windows x64 is the only platform with a build. macOS and Linux targets are configured but untested.',
        'The captions panel and the audio library panel are placeholders with no functionality behind them.',
        'EQ, pitch and normalise appear in the audio inspector but are not applied by the audio engine yet.',
        'Video clips always composite normally — the video compositor does not read blend modes yet. Blend modes do work in the photo editor.',
        'Still images and GIFs cannot be placed on the video timeline; they are edited in the photo editor.',
        'The interface is English only.',
      ],
    },
  },
];
