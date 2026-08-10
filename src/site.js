/*
 * The site's only script. Roughly 2 KB, deferred, and everything in it is an enhancement —
 * with JavaScript disabled the site is fully readable, fully navigable and correctly themed
 * (the inline head script handles the theme; the footer carries every nav link).
 *
 * Four jobs:
 *   1. theme control      — three states, matching the application's System / Light / Dark
 *   2. mobile navigation  — the only nav that needs JS, hence the footer fallback
 *   3. scroll reveal      — adds the hidden state itself, so it can never strand content
 *   4. header shadow      — a border that appears once the page has scrolled
 */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ── Theme ──────────────────────────────────────────────────────────────────────── */

  var media = window.matchMedia('(prefers-color-scheme: light)');

  function read() {
    try {
      return localStorage.getItem('oc-theme') || 'system';
    } catch (e) {
      return 'system';
    }
  }

  function apply(pref) {
    var resolved = pref === 'system' ? (media.matches ? 'light' : 'dark') : pref;
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-pref', pref);
    document.querySelectorAll('[data-theme-set]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-theme-set') === pref));
    });
  }

  document.querySelectorAll('[data-theme-set]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var pref = btn.getAttribute('data-theme-set');
      try {
        localStorage.setItem('oc-theme', pref);
      } catch (e) {
        /* private mode — the choice just won't persist */
      }
      apply(pref);
    });
  });

  /* Follow the OS live, but only while the preference is 'system'. */
  var onSystemChange = function () {
    if (read() === 'system') apply('system');
  };
  if (media.addEventListener) media.addEventListener('change', onSystemChange);
  else if (media.addListener) media.addListener(onSystemChange);

  apply(read());

  /* ── Mobile navigation ──────────────────────────────────────────────────────────── */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.setAttribute('data-open', String(open));
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    /* A tap on a link, Escape, or a resize past the breakpoint all close it. */
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  /* ── Deep links into a collapsed answer ─────────────────────────────────────────── */

  /*
   * The footer links to /help/#report-a-bug, and that id is on the <details> itself. A browser
   * will expand a <details> to reveal a target INSIDE it, but not one that IS it — so without
   * this, following that link scrolls to a question whose answer is still shut. Runs on load and
   * on every subsequent hash change, since an in-page link fires the latter only.
   */
  var openTarget = function () {
    if (!location.hash) return;
    var el;
    try {
      el = document.querySelector(location.hash);
    } catch (e) {
      return; /* a hash that isn't a valid selector */
    }
    if (el && el.tagName === 'DETAILS' && !el.open) {
      el.open = true;
      el.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  };

  window.addEventListener('hashchange', openTarget);
  openTarget();

  /* ── Header border on scroll ────────────────────────────────────────────────────── */

  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.setAttribute('data-scrolled', String(window.scrollY > 8));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Scroll reveal ──────────────────────────────────────────────────────────────── */

  /*
   * The hidden state comes from CSS rules scoped to `.js`, a class the inline head script adds.
   * So the only way an element is ever invisible is if a script was running to begin with — and
   * this block is what reveals it again. If IntersectionObserver is missing, or the visitor has
   * asked for reduced motion, everything is revealed immediately instead.
   */
  var targets = document.querySelectorAll('[data-reveal]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (targets.length && 'IntersectionObserver' in window && !reduced) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'shown');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    targets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    targets.forEach(function (el) {
      el.setAttribute('data-reveal', 'shown');
    });
  }
})();
