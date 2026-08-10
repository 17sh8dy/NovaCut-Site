import { page as shell } from '../layout.mjs';
import { button, icons } from '../components.mjs';

/**
 * 404. Written into dist/404.html, which most static hosts serve automatically for an unknown
 * path. It wears the full site shell so a wrong URL still looks like Open Cut, and it offers
 * the routes people actually mistype their way toward rather than a lone "go home" link.
 */
export function page() {
  return shell({
    title: 'Page not found — Open Cut',
    description:
      'That page does not exist. Open Cut is a desktop video and photo editor whose core editing features will always be free.',
    path: '/404.html',
    body: `
    <section class="section" style="min-height:52vh;display:grid;align-content:center">
      <div class="wrap">
        <p class="eyebrow">404</p>
        <h1 style="font-size:var(--t-h1);max-width:16ch">This page doesn’t exist.</h1>
        <p class="lede" style="margin-top:var(--s5);max-width:52ch">The link may be out of date, or the
          address may have a typo in it. Everything on the site is one of these:</p>
        <div class="btn-row" style="margin-top:var(--s6)">
          ${button({ href: '/', label: 'Home', variant: 'secondary' })}
          ${button({ href: '/features/', label: 'Features', variant: 'secondary' })}
          ${button({ href: '/download/', label: 'Download', icon: icons.download })}
          ${button({ href: '/updates/', label: 'Updates', variant: 'secondary' })}
          ${button({ href: '/help/', label: 'Help', variant: 'secondary' })}
          ${button({ href: '/about/', label: 'About', variant: 'secondary' })}
        </div>
      </div>
    </section>`,
  });
}
