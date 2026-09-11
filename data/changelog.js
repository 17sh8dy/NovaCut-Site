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
 * The 1.0.0 entry below describes work that is actually in the tree and was verified in the
 * running application. Where an item was measured, the measurement is included, because a
 * changelog that says "improved export reliability" tells a user nothing they can check.
 */

export const releases = [
  {
    version: '1.0.0',
    name: 'First public release',
    status: 'unreleased',
    date: null,
    summary:
      'The first release of Nova Cut: a multi-track video editor and a layer-based photo editor in one desktop ' +
      'application, packaged as a Windows installer with FFmpeg included, so importing and exporting work on a clean ' +
      'machine with nothing else to install. This entry describes the build as it stands; it is written here so the ' +
      'release notes are ready the day the download is.',
    sections: {
      new: [
        'When an export finishes, Nova Cut opens the folder it was written to with the file selected. Only on success — a failed or cancelled export opens nothing.',
        'Cancel now actually stops an export that is running, rather than only closing the window while the render carried on in the background.',
        'New projects are named for the time they were created — "Nova Cut Video File at 1.42 PM", or "Nova Cut Photo File at…" in the photo editor — instead of every one of them being called Untitled. Renaming works as before and a name you choose is kept.',
        'FFmpeg ships inside the installer, so importing, thumbnails and export all work on a clean machine with nothing else to install. The bundled build is LGPL-licensed; its licence text is included, and OPENCUT_FFMPEG lets you point Nova Cut at your own build instead.',
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
        'A native Windows application: frameless window with app-drawn chrome, native menus, persisted window geometry, single-instance handling, an unsaved-changes guard on quit, and .novacut file associations.',
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
        'Exports are about 20% faster. The render loop now reads each finished frame off the GPU asynchronously and starts the next frame’s decode before draining the current one, so work that used to happen one after another overlaps. Measured over repeated runs on the same project: 52.2s to 41.0s, and the resulting file is byte-for-byte identical to the one the previous build produced — this is the same export, done sooner, not a lower-quality one.',
        'A note on export speed generally: most of the time goes into seeking the source video, so footage with widely spaced keyframes exports several times slower than the same footage with a normal keyframe interval. On this machine the identical project measured 66ms per frame against an 8-second keyframe interval and 19ms against a 1-second one.',
      ],
      fixed: [
        'Turning on hardware-accelerated export asked for an NVIDIA encoder on machines that had no NVIDIA card, and the export failed outright. Nova Cut previously chose from the encoders FFmpeg was BUILT with, which on a full build is every vendor’s at once; it now tests that an encoder actually opens on this machine before choosing it, and falls back to software when none does.',
        'In the light theme, the success, warning and error colours were the ones tuned for the dark theme and were close to illegible on white — warning text measured 2.0:1 against its background where 4.5:1 is the standard. All three, and the muted label colour, are now tuned for light surfaces.',
        'A transition froze the picture for the rest of the export. Rendering a transition asks each clip for frames outside its own range, and that seek was never acknowledged, so the source stopped decoding and every later frame waited out a timeout. One cross dissolve took an eight-second export from 22 seconds to about 190, and left the second half of the video a still image.',
        'Exports carried no colour information at all, so every player guessed — and they do not all guess alike. Output is now converted and tagged as BT.709, and round-trips within one value of 255 against the source.',
        'Autosave stopped for the rest of the session after a single failed write, silently, while the interface went on implying it was running.',
        'Edits made while a save was in progress were marked as already saved. Since the quit guard reads that same flag, the window could close without warning and lose them.',
        'A failed save reported nothing at all — no message, no warning — so a save that had not happened looked exactly like one that had.',
        'Importing without FFmpeg installed reported success and produced a zero-length clip with invented dimensions. It now says what went wrong and what to do about it.',
        'Hardware-accelerated export always asked for an NVIDIA encoder, so the option failed outright on AMD and Intel machines. It now uses whichever encoder the machine actually has.',
        'A failed export left FFmpeg running with the output file still open, so the part-written file could not be deleted or overwritten.',
        'Text was silently dropped from every export. Titles and captions were drawn as HTML over the preview canvas, and the exporter — which reads pixels back from that canvas — could not see them. Text is now rasterised into the compositor, so preview and export are the same image by construction.',
        'The preview could freeze on the first frame while the timecode kept advancing. Ranged reads of local media were answered with the whole file, which Chromium treats as "this source cannot seek", permanently downgrading the video element to a non-seekable stream. Media is now served with correct partial-content responses.',
        'Exports could contain long runs of black frames. The exporter waited a fixed interval for asynchronous seeks and wrote a black frame whenever a decode missed the window — measured at 746 of 1569 frames on one test render. Seeks are now awaited on the decoder’s own events; the same render measured 0 black frames afterwards.',
        'Applying an odd number of effects flipped the picture upside down. The compositor’s quad sampled top-down while frame buffer textures are bottom-up, so the error cancelled itself at even effect counts and was invisible in casual testing.',
        'An export could hang forever if FFmpeg was missing or rejected the codec, instead of reporting the failure.',
        'A photo document larger than the preview cap exported at preview resolution rather than document resolution.',
      ],
      known: [
        'Builds are not code-signed, so Windows SmartScreen warns the first time you run the installer.',
        'Exporting from a 4K source costs roughly four times as much per second of output as a 1080p source, because every frame is decoded at full resolution before being scaled down. A 1080p project renders at around three seconds per second of output.',
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
