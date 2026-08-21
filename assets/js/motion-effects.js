// Scroll-reveal, count-up stats, and hero entrance — powered by Motion
// (motion.dev), the same team/engine/API philosophy as Framer Motion, but
// framework-free: loaded here as a native ES module import, no React, no
// bundler. If the CDN import ever fails (offline, blocked), everything
// degrades to instantly visible content rather than staying hidden.
(async function () {
  'use strict';

  var motion = null;
  try {
    motion = await import('https://cdn.jsdelivr.net/npm/motion@11/+esm');
  } catch (e) {
    motion = null; // falls through to the plain-CSS fallback below
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var useMotion = motion && !prefersReducedMotion;

  // ---------- Scroll reveal ----------
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    if (!useMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }
    var done = false;
    var reveal = function () {
      if (done) return;
      done = true;
      motion.animate(el, { opacity: [0, 1], transform: ['translateY(24px)', 'translateY(0px)'] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1] });
    };
    motion.inView(el, reveal, { amount: 0.15 });
    // Safety net: some environments never fire IntersectionObserver (which
    // Motion's inView() is built on) at all. Content must never stay
    // permanently invisible because of that.
    setTimeout(function () {
      if (!done) {
        done = true;
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    }, 3000);
  });

  // ---------- Animated counters ----------
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    var value = parseInt(el.getAttribute('data-counter'), 10) || 0;
    var suffix = el.getAttribute('data-counter-suffix') || '';
    var started = false;

    var showFinal = function () {
      started = true;
      el.textContent = value + suffix;
    };

    if (!useMotion) {
      showFinal();
      return;
    }

    // Explicit, version-proof numeric tween: animate a plain object's value
    // and write it into the element ourselves on every tick.
    var driver = { v: 0 };
    var runCountUpSafe = function () {
      if (started) return;
      started = true;
      motion.animate(driver, { v: value }, {
        duration: 1.2,
        easing: [0.22, 1, 0.36, 1],
        onUpdate: function () {
          el.textContent = Math.round(driver.v) + suffix;
        },
      });
    };

    motion.inView(el, runCountUpSafe, { amount: 0.5 });
    // Safety net: skip straight to the final value if the observer (or the
    // animation engine) never fires — never leave a counter stuck at 0.
    setTimeout(showFinal, 3000);
  });

  // ---------- Hero entrance stagger ----------
  var heroItems = document.querySelectorAll('[data-hero-stagger] > *');
  if (heroItems.length) {
    var finalizeHero = function () {
      heroItems.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    };

    if (!useMotion) {
      finalizeHero();
    } else {
      motion.animate(
        heroItems,
        { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0px)'] },
        { duration: 0.6, delay: motion.stagger(0.12), easing: [0.22, 1, 0.36, 1] }
      );
      // Safety net: this is a fire-and-forget animation (nothing else waits
      // on it), so if it never actually progresses — e.g. an environment
      // that never runs animation frames at all — the hero must not stay
      // permanently invisible. ~2s comfortably covers the real animation's
      // own duration (0.6s clip + up to ~0.6s of stagger across ~5 items),
      // so this is a no-op in a normally-functioning browser.
      setTimeout(finalizeHero, 2000);
    }
  }
})();
