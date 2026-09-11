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
 * `url` is a TODO. None of these products has a confirmed public domain yet — these are the
 * names the products already use for themselves in their own config (Nova Cut's is `site.origin`
 * above), guessed to the same pattern for the others. CONFIRM THE REAL URL before this ships;
 * until then a wrong guess here just sends someone to an unregistered domain, not somewhere
 * unsafe, but it should still be fixed before launch.
 */
export const novaProducts = [
  {
    id: 'nova-cut',
    label: 'Nova Cut',
    tagline: 'Create and edit',
    icon: 'scissors',
    url: 'https://novacut.app', // matches data/site.js `origin` above
  },
  {
    id: 'replay-gg',
    label: 'Replay.GG',
    tagline: 'Record and clip gameplay',
    icon: 'gamepad',
    url: 'https://replay.gg', // TODO: confirm real domain
  },
  {
    id: 'atlas',
    label: 'Atlas',
    tagline: 'Your desktop assistant',
    icon: 'sparkle',
    url: 'https://atlas.app', // TODO: confirm real domain — Atlas may not have a public site yet
  },
  {
    id: 'nova-games',
    label: 'Nova Games',
    tagline: 'Coming soon',
    icon: 'gamepad',
    /**
     * No games are published under a Nova Games storefront yet — there's nothing to link to
     * honestly, so this row renders disabled instead of guessing a destination. Give it a `url`
     * once that's a real thing to open.
     */
    url: null,
  },
];
