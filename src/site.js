/*
 * The site's only script. Roughly 2 KB, deferred, and everything in it is an enhancement —
 * with JavaScript disabled the site is fully readable, fully navigable and correctly themed
 * (the inline head script handles the theme; the footer carries every nav link).
 *
 * Five jobs:
 *   1. theme control      — three states, matching the application's System / Light / Dark
 *   2. mobile navigation  — the only nav that needs JS, hence the footer fallback
 *   3. scroll reveal      — adds the hidden state itself, so it can never strand content
 *   4. header shadow      — a border that appears once the page has scrolled
 *   5. motion             — scroll progress rule, hero parallax, reveal of untagged blocks
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
      if (window.innerWidth > 1100) setOpen(false);
    });
  }

  /* ── Nova switcher ─────────────────────────────────────────────────────────────── */

  var switcherTrigger = document.getElementById('nova-switcher-trigger');
  var switcherMenu = document.getElementById('nova-switcher-menu');

  if (switcherTrigger && switcherMenu) {
    /*
     * Hand visibility over from the native [hidden] the markup ships with to the animated
     * [data-open] state in styles.css — display:none can't transition, so JS has to be the one
     * to take the menu off [hidden] before anything can fade. Without this script the menu stays
     * [hidden] forever, which is correct: there'd be no way to open it anyway.
     */
    switcherMenu.hidden = false;
    switcherMenu.setAttribute('data-open', 'false');

    var setSwitcherOpen = function (open) {
      switcherTrigger.setAttribute('aria-expanded', String(open));
      switcherMenu.setAttribute('data-open', String(open));
    };

    switcherTrigger.addEventListener('click', function () {
      setSwitcherOpen(switcherTrigger.getAttribute('aria-expanded') !== 'true');
    });

    /* Anywhere outside the trigger or its menu closes it — the standard dropdown contract. */
    document.addEventListener('click', function (e) {
      if (switcherTrigger.getAttribute('aria-expanded') !== 'true') return;
      if (switcherTrigger.contains(e.target) || switcherMenu.contains(e.target)) return;
      setSwitcherOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && switcherTrigger.getAttribute('aria-expanded') === 'true') {
        setSwitcherOpen(false);
        switcherTrigger.focus();
      }
    });

    /* ── All products ──────────────────────────────────────────────────────────── */

    var viewAllBtn = document.getElementById('nova-switcher-viewall');
    var allProducts = document.getElementById('nova-all');

    if (viewAllBtn && allProducts) {
      /* Same [hidden] → [data-open] handover as the switcher menu above. */
      allProducts.hidden = false;
      allProducts.setAttribute('data-open', 'false');

      var closeBtn = document.getElementById('nova-all-close');

      var setAllProductsOpen = function (isOpen) {
        allProducts.setAttribute('data-open', String(isOpen));
        document.body.classList.toggle('nova-all-locked', isOpen);
      };

      viewAllBtn.addEventListener('click', function () {
        setSwitcherOpen(false);
        setAllProductsOpen(true);
        if (closeBtn) closeBtn.focus();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          setAllProductsOpen(false);
          viewAllBtn.focus();
        });
      }

      /* A click on the scrim itself (not a card, not the panel) closes it. */
      allProducts.addEventListener('click', function (e) {
        if (e.target === allProducts) setAllProductsOpen(false);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && allProducts.getAttribute('data-open') === 'true') {
          setAllProductsOpen(false);
          viewAllBtn.focus();
        }
      });
    }
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

  /* ── Scroll progress + hero parallax ───────────────────────────────────────────── */

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var heroShot = document.querySelector('.hero__shot');
    var ticking = false;
    var frame = function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty('--scroll', max > 0 ? String(Math.min(1, window.scrollY / max)) : '0');
      if (heroShot) root.style.setProperty('--parallax', String(Math.min(40, window.scrollY * 0.06)));
    };
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(frame);
        }
      },
      { passive: true }
    );
    frame();
  }

  /* ── Scroll reveal ──────────────────────────────────────────────────────────────── */

  /*
   * The hidden state comes from CSS rules scoped to `.js`, a class the inline head script adds.
   * So the only way an element is ever invisible is if a script was running to begin with — and
   * this block is what reveals it again. If IntersectionObserver is missing, or the visitor has
   * asked for reduced motion, everything is revealed immediately instead.
   */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*
   * Also reveal the common building blocks pages did not tag by hand: section headings, ledes,
   * cards, feature rows and the closing call to action. Anything inside something already tagged,
   * or inside the hero (which animates on load instead), is left alone.
   */
  if (!reduced && 'IntersectionObserver' in window) {
    document
      .querySelectorAll('.section-head, .card, .feature, .dl-card, .faq-group, .release, .cta .wrap > *')
      .forEach(function (el) {
        if (el.hasAttribute('data-reveal') || el.closest('[data-reveal], .hero')) return;
        el.setAttribute('data-reveal', '');
      });
  }

  var targets = document.querySelectorAll('[data-reveal]');

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
