/**
 * ── THE FEATURE CATALOG ──────────────────────────────────────────────────────────────
 *
 * Everything the website says Open Cut can do lives here, and every entry carries a `status`.
 *
 *   'stable'   — implemented, wired end to end, and exercised in the running application.
 *   'beta'     — implemented and usable, but with a stated limitation the user should know
 *                about before they rely on it.
 *   'planned'  — designed for, NOT built. Rendered in a separate, clearly-labelled section
 *                and never counted in a feature total.
 *
 * The rule: a feature only appears here after being confirmed in the code AND, where possible,
 * in the running app. A model field with no consumer is not a feature. Several plausible-looking
 * capabilities are deliberately absent for exactly that reason, and the omissions are documented
 * at the foot of this file so nobody re-adds them by accident.
 *
 * `requires` marks a feature that needs something the installer does not currently provide, so
 * the UI can badge it rather than let a user discover the dependency mid-project.
 */

export const featureGroups = [
  {
    id: 'video',
    title: 'Video editing',
    lede: 'A real non-linear timeline: multi-track, non-destructive, and undoable all the way down.',
    image: {
      src: 'editor',
      width: 1600,
      height: 984,
      alt: 'The Open Cut video editor: a multi-track timeline with text clips, a live preview, and the text inspector open on the right.',
    },
    features: [
      {
        title: 'Multi-track timeline',
        status: 'stable',
        body: 'Stack video and audio tracks, drag clips between them, and reorder as you go. Tracks can be renamed, muted, soloed, locked and hidden individually.',
      },
      {
        title: 'Split, trim and ripple delete',
        status: 'stable',
        body: 'Split at the playhead, drag either edge of a clip to trim it, duplicate, or ripple delete to close the gap behind you. Trimming is non-destructive: the source media is never modified.',
      },
      {
        title: 'Snapping and magnetic edges',
        status: 'stable',
        body: 'Clips snap to the playhead, to the sequence start and to neighbouring clip edges, so cuts land exactly where you mean them to.',
      },
      {
        title: 'Scrubbing, zoom and playback speed',
        status: 'stable',
        body: 'Scrub the ruler, zoom the timeline from a whole project down to individual frames, and preview at speeds other than realtime.',
      },
      {
        title: 'Undo and redo',
        status: 'stable',
        body: 'Every edit is a command with a full undo history. Continuous edits such as dragging a slider coalesce into one step, so undo removes the whole gesture rather than a hundred pixels of it.',
      },
      {
        title: 'Clip speed and reverse',
        status: 'stable',
        body: 'Change a clip’s rate or play it backwards. Speed is applied to picture and sound together, and the timeline length follows.',
      },
      {
        title: 'Transform with keyframes',
        status: 'stable',
        body: 'Position, scale, rotation and opacity can each be animated with keyframes, using linear, hold, ease or custom bezier interpolation.',
      },
      {
        title: 'Frame-accurate timing',
        status: 'stable',
        body: 'Positions are stored as integer ticks rather than floating-point seconds, so thousands of edits never accumulate drift and cuts stay on exact frame boundaries.',
      },
    ],
  },
  {
    id: 'effects',
    title: 'Effects and transitions',
    lede: 'Every effect and every transition is a real GPU shader — what you see in the preview is what lands in the file.',
    image: {
      src: 'transitions',
      width: 1600,
      height: 984,
      alt: 'The Open Cut transitions browser, showing the full list of available transitions alongside the timeline.',
    },
    stats: [
      { value: '53', label: 'effects' },
      { value: '18', label: 'transitions' },
      { value: '7', label: 'effect categories' },
    ],
    features: [
      {
        title: '53 effects across seven categories',
        status: 'stable',
        body: 'Blur, colour, light, stylise, distort, glitch and layer-style effects — including Gaussian and motion blur, exposure and white balance, glow, vignette, film grain, VHS, glitch, tilt shift, kaleidoscope and chromatic aberration.',
      },
      {
        title: 'Stacked, parameterised effect chains',
        status: 'stable',
        body: 'Apply as many effects to a clip as you like and reorder them. Each exposes real parameters, and those parameters can be keyframed over time.',
      },
      {
        title: '18 transitions',
        status: 'stable',
        body: 'Cross dissolve, fade through, wipe, circle reveal, slide, push, zoom punch, spin, whip pan, impact shake, blur dissolve, flash, glitch, luma burn, pixelize, 3D flip, cube and page turn.',
      },
      {
        title: 'Transitions that never shorten your edit',
        status: 'stable',
        body: 'A transition window is centred on the cut and clamped to a third of the shorter clip, so adding one changes how the cut looks without changing how long the sequence is.',
      },
      {
        title: 'One renderer for preview and export',
        status: 'stable',
        body: 'The preview and the exporter run the same GPU compositor over the same shaders. There is no separate "render quality" path that can disagree with what you were looking at.',
      },
    ],
  },
  {
    id: 'audio',
    title: 'Audio',
    lede: 'Sound is edited on the same timeline as picture, with automation that follows the clip.',
    features: [
      {
        title: 'Audio tracks',
        status: 'stable',
        body: 'Dedicated audio tracks alongside your video tracks, each with its own mute, solo and lock.',
      },
      {
        title: 'Volume with automation',
        status: 'stable',
        body: 'Set a clip’s level, or keyframe it so the volume moves across the clip. Automation is sampled per frame during playback and during export.',
      },
      {
        title: 'Fade in and fade out',
        status: 'stable',
        body: 'Per-clip fades in seconds, applied on top of the volume automation rather than instead of it.',
      },
      {
        title: 'Audio stays in sync through speed changes',
        status: 'stable',
        body: 'Changing a clip’s speed retimes its audio with it, and the exported file carries the same mix you heard in the preview.',
      },
    ],
  },
  {
    id: 'photo',
    title: 'Photo editing',
    lede: 'A full layer-based image editor in the same application — for thumbnails, banners and social posts.',
    image: {
      src: 'photo',
      width: 1600,
      height: 984,
      alt: 'The Open Cut photo editor: a layer list, the tool rail, and a composed thumbnail on the canvas with the inspector open.',
    },
    features: [
      {
        title: 'Layers, groups and masks',
        status: 'stable',
        body: 'A real layer tree with groups, per-layer opacity, 27 blend modes, and painted layer masks. Masks apply after the layer’s effects, which is what makes "add a blur, then paint its mask" a non-destructive blur brush.',
      },
      {
        title: 'Selection tools',
        status: 'stable',
        body: 'Rectangle, ellipse, lasso, polygon lasso and magic wand, with boolean combines, feather, expand and invert. Selections are stored as geometry, so they survive undo and are restored with the edit that used them.',
      },
      {
        title: 'Paint tools',
        status: 'stable',
        body: 'Brush, eraser, paint bucket and gradient, with pen-pressure support and smoothing. A whole stroke is a single undo step no matter how many points it contains.',
      },
      {
        title: 'Vector shapes and text',
        status: 'stable',
        body: 'Rectangles, rounded rectangles, ellipses, triangles, lines, arrows, stars, polygons, hearts, diamonds, chevrons, speech bubbles and callouts, plus editable text with styled presets.',
      },
      {
        title: 'Adjustment layers',
        status: 'stable',
        body: 'Non-destructive adjustments that affect the layers beneath them, and which can themselves be masked.',
      },
      {
        title: 'Asset library',
        status: 'stable',
        body: 'One-click annotations, shapes, styled text presets and emoji stickers, so a thumbnail can be assembled without drawing anything from scratch.',
      },
      {
        title: 'Canvas tools',
        status: 'stable',
        body: 'Rotate the canvas by 90 or 180 degrees, flip it horizontally or vertically, crop, and resize — with rulers, smart guides and snapping.',
      },
      {
        title: 'Export PNG, JPG and WebP',
        status: 'stable',
        body: 'Export at full document resolution with format, quality and transparency options, or use the one-click PNG export. Exports composite off-screen at document size, so a scaled-down preview never becomes a scaled-down file.',
      },
    ],
  },
  {
    id: 'export',
    title: 'Export',
    lede: 'A real encoder pipeline: frames stream from the GPU compositor straight into FFmpeg.',
    image: {
      src: 'export',
      width: 1600,
      height: 1042,
      alt: 'The Open Cut export dialog, showing resolution, frame rate, container, codec, quality and bitrate controls with live size and render-time estimates.',
    },
    features: [
      {
        title: 'Resolutions from 480p to 8K',
        status: 'stable',
        requires: 'ffmpeg',
        body: '480p, 720p, 1080p, 1440p, 4K and 8K, at 24, 25, 30, 50, 60, 120, 144 or 240 frames per second.',
      },
      {
        title: 'Container and codec matrix',
        status: 'stable',
        requires: 'ffmpeg',
        body: 'MP4, MOV, MKV, AVI and animated GIF, with H.264, H.265, VP9, AV1 and ProRes offered only where the container actually supports them.',
      },
      {
        title: 'Quality, bitrate and hardware acceleration',
        status: 'stable',
        requires: 'ffmpeg',
        body: 'Four quality presets or an explicit bitrate, configurable audio bitrate, and an option to use GPU encoding when the machine offers it.',
      },
      {
        title: 'Live size and render-time estimates',
        status: 'stable',
        body: 'The export dialog predicts the output size and how long the render will take before you commit to it.',
      },
      {
        title: 'Export the whole sequence or a range',
        status: 'stable',
        requires: 'ffmpeg',
        body: 'Render everything, or only the in/out range you marked on the timeline.',
      },
    ],
  },
  {
    id: 'workflow',
    title: 'Creator workflow',
    lede: 'The parts that are not glamorous but decide whether you lose an afternoon of work.',
    image: {
      src: 'home',
      width: 1600,
      height: 984,
      alt: 'The Open Cut launcher, offering the video editor and the photo editor, with recent projects below.',
    },
    features: [
      {
        title: 'Autosave and crash recovery',
        status: 'stable',
        body: 'Work is saved automatically as you go, and if the application closes unexpectedly Open Cut offers to restore the session — timeline, media, effects, playhead, zoom and selection.',
      },
      {
        title: 'Project files',
        status: 'stable',
        body: 'Projects are saved as .opencut files. Double-clicking one opens it, and an already-running Open Cut takes it over rather than starting a second copy.',
      },
      {
        title: 'Rebindable keyboard shortcuts',
        status: 'stable',
        body: 'Play/pause, split, undo, redo, delete, ripple delete, duplicate, new, open and save all have shortcuts, and every one of them can be rebound with conflict detection.',
      },
      {
        title: 'Media library',
        status: 'stable',
        requires: 'ffmpeg',
        body: 'Import video and audio, search what you have imported, and drag it onto the timeline. Thumbnails and durations are read from the files themselves.',
      },
      {
        title: 'Native desktop application',
        status: 'stable',
        body: 'A real Windows application with native menus, window state that persists between sessions, an unsaved-changes guard on quit, and file associations — not a web page in a wrapper.',
      },
      {
        title: 'System, Light and Dark themes',
        status: 'stable',
        body: 'A neutral interface that follows your operating system’s light/dark setting by default, with a choosable accent colour for controls.',
      },
      {
        title: 'Settings that tell you the truth',
        status: 'stable',
        body: 'Every preference is searchable, and anything not yet wired up is shown disabled with the reason — rather than as a switch that flips and does nothing.',
      },
    ],
  },
];

/**
 * ── DESIGNED FOR, NOT BUILT ──────────────────────────────────────────────────────────
 *
 * Shown on the Features page under its own heading so a reader can see where the product is
 * going without any chance of mistaking it for what the product does today. Nothing in this
 * list carries a date, because no date has been decided.
 */
export const planned = [
  {
    title: 'Captions',
    body: 'The captions panel exists in the interface but is a placeholder — automatic generation and SRT import are not built yet.',
  },
  {
    title: 'Audio library',
    body: 'A browser for background music and sound effects is stubbed out in the interface and has no content behind it yet.',
  },
  {
    title: 'Audio effects',
    body: 'EQ, pitch shifting and normalisation are modelled and appear in the inspector, but the audio engine does not apply them yet.',
  },
  {
    title: 'Clip blend modes in video',
    body: 'The photo editor has 27 working blend modes. The video compositor does not read blend modes yet, so a video clip always composites normally.',
  },
  {
    title: 'macOS and Linux builds',
    body: 'Build targets are configured for both, but no build has been produced or tested on either platform.',
  },
  {
    title: 'AI-assisted tools',
    body: 'Nothing AI-powered exists in Open Cut today. The architecture has a place for it, and if it arrives it will be optional.',
  },
];

/**
 * ── DELIBERATELY ABSENT FROM THE CATALOG ─────────────────────────────────────────────
 *
 * These exist somewhere in the data model or the interface but have no working implementation
 * behind them, so the website must not list them as features. Recorded here so that a future
 * pass over this file does not "helpfully" add them back:
 *
 *   · Video clip blend modes  — Clip.blendMode is defaulted and never read by the compositor.
 *   · Transform crop / anchor — modelled, never read.
 *   · Audio EQ, pitch, normalise — inspector controls exist; the audio graph applies none of them.
 *   · Shape and adjustment CLIPS in video — the compositor renders text and media only.
 *   · Stills and GIFs on the video timeline — deliberately refused; they belong to the photo editor.
 *   · Smudge, blur and sharpen BRUSHES — blocked on a sampleable raster surface.
 *   · PSD / PDF / SVG export, layer styles, smart objects — not modelled.
 */
