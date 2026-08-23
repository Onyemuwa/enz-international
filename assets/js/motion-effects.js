// Count-up stat numbers, powered by Motion (motion.dev) — the same team and
// engine as Framer Motion, but framework-free: a native ES module import, no
// React, no bundler.
//
// This file deliberately does NOT do scroll reveals or entrance animations.
// Four separate attempts at "hide, then reveal" each shipped invisible content
// when the reveal step didn't run — the observer never fired, the animation
// never advanced, or a `transition-all` pinned the element at its start value.
// Motion is now only ever used to make ALREADY-VISIBLE content nicer, never to
// decide whether content is visible at all. That distinction is the whole fix.
//
// The stat markup ships with its final value already in the HTML, so with no
// JS at all — or a failed CDN import — the correct numbers still render.
(async function () {
  'use strict';

  var counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // HTML already shows the final value

  var motion = null;
  try {
    motion = await import('https://cdn.jsdelivr.net/npm/motion@11/+esm');
  } catch (e) {
    return; // CDN blocked/offline — HTML already shows the final value
  }

  counters.forEach(function (el) {
    var value = parseInt(el.getAttribute('data-counter'), 10) || 0;
    var suffix = el.getAttribute('data-counter-suffix') || '';
    var started = false;

    var showFinal = function () {
      started = true;
      el.textContent = value + suffix;
    };

    var runCountUp = function () {
      if (started) return;
      started = true;
      var driver = { v: 0 };
      motion.animate(driver, { v: value }, {
        duration: 1.2,
        easing: [0.22, 1, 0.36, 1],
        onUpdate: function () {
          el.textContent = Math.round(driver.v) + suffix;
        },
      });
    };

    motion.inView(el, runCountUp, { amount: 0.5 });

    // Unconditional: whatever happened above, the real number is on screen by
    // now. A counter frozen mid-tween at "0+" is worse than no animation.
    setTimeout(showFinal, 2500);
  });
})();
