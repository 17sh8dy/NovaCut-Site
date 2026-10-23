/**
 * ── THE NOVA SWITCHER'S PRODUCT LIST ───────────────────────────────────────────────────
 *
 * Every Nova-family product that embeds the switcher (this site, the Nova Cut app, Replay.GG,
 * Atlas, ...) carries its own copy of a list shaped like this one. There's no shared package to
 * pull it from, so keep this in sync with the other repos' copies by hand when the roster
 * changes.
 *
 * This is deliberately NOT every Nova product — Nova, Nova.Help and NovaLegal are left out
 * because each of those already has its own way to switch between the products it fronts, so
 * adding a second, redundant switcher to them (or listing them here as a destination) would just
 * duplicate that. Online Earth isn't in scope for this rollout either. Only add a row here for a
 * product that's actually getting this switcher built into it.
 *
 * `id` must match the `current` id passed to `novaSwitcher()` in layout.mjs so the switcher can
 * mark "you are here" instead of linking a product back to itself.
 *
 * Every `url` here is a real, deployed address except Nova Games, which has none and renders as
 * "Soon". Nova Cut's own row goes to the download page.
 */
export const novaProducts = [
  // ── Apps ──
  { id: 'nova-cut', group: 'Apps', label: 'Nova Cut', tagline: 'Create and edit', icon: 'scissors', url: '/download/' },
  {
    id: 'replay-gg',
    group: 'Apps',
    label: 'Replay.GG',
    tagline: 'Record and clip gameplay',
    icon: 'gamepad',
    url: 'https://replay-gg-site.shadylabs.workers.dev/',
  },
  {
    id: 'atlas',
    group: 'Apps',
    label: 'Atlas',
    tagline: 'Your desktop assistant',
    icon: 'sparkle',
    url: 'https://atlas-website.shadylabs.workers.dev/',
  },
  /** No games are published yet, so this renders disabled instead of guessing a destination. */
  { id: 'nova-games', group: 'Apps', label: 'Nova Games', tagline: 'Coming soon', icon: 'gamepad', url: null },

  // ── Websites ──
  {
    id: 'nova-help',
    group: 'Websites',
    label: 'Nova.Help',
    tagline: 'Support and guides',
    icon: 'lifebuoy',
    url: 'https://nova-help.shadylabs.workers.dev/',
  },
  {
    id: 'atlas-site',
    group: 'Websites',
    label: 'Atlas Website',
    tagline: 'Download and learn about Atlas',
    icon: 'sparkle',
    url: 'https://atlas-website.shadylabs.workers.dev/',
  },
  { id: 'nova', group: 'Websites', label: 'Nova', tagline: 'The Nova home page', icon: 'earth', url: 'https://nova-780.pages.dev/' },
  {
    id: 'nova-legal',
    group: 'Websites',
    label: 'Nova Legal',
    tagline: 'Terms and privacy',
    icon: 'file',
    url: 'https://nova-legal.shadylabs.workers.dev/',
  },
  {
    id: 'nova-review',
    group: 'Websites',
    label: 'Nova.Review',
    tagline: 'Reviews and suggestions',
    icon: 'star',
    url: 'https://nova-review.shadylabs.workers.dev/',
  },
  /** This site. It is the current page, so it renders as "You're here". */
  {
    id: 'nova-cut-site',
    group: 'Websites',
    label: 'Nova Cut Website',
    tagline: 'Nova Cut download site',
    icon: 'scissors',
    url: 'https://novacut.app',
  },
];
