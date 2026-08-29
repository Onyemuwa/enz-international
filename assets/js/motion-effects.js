// Motion (motion.dev) — the same team and engine behind Framer Motion, used
// here framework-free: a native ES module import, no React, no bundler.
//
// ---------------------------------------------------------------------------
// THE ONE RULE IN THIS FILE
// ---------------------------------------------------------------------------
// Motion may only ever *decorate* content that is already on screen. It must
// never be what decides whether content is visible.
//
// Four earlier attempts at "hide in CSS, reveal on scroll" each shipped
// invisible content when the reveal step didn't run — the observer never
// fired, the animation never advanced, or a `transition-all` pinned the
// element at its start value. So the order here is deliberate and load-bearing:
//
//   1. The HTML and CSS render everything fully visible. Always.
//   2. Motion is imported. If that import fails, we return — and because
//      nothing has been hidden yet, the page is simply un-animated, not blank.
//   3. Only AFTER a successful import do we hide anything, one element at a
//      time, immediately before animating it back in.
//   4. A watchdog clears every inline style we set, unconditionally, after a
//      few seconds. Whatever went wrong, the page ends up visible.
//
// Every step of that chain fails toward "visible", never toward "blank".
// ---------------------------------------------------------------------------
(async function () {
  'use strict';

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // The HTML already shows the finished state.

  var motion = null;
  try {
    // Vendored locally (assets/js/vendor/) rather than pulled from a public
    // CDN: no third-party runtime dependency, no extra DNS/TLS handshake, and
    // it keeps working on a network that blocks jsDelivr.
    motion = await import('./vendor/motion.min.js');
  } catch (e) {
    return; // Nothing was hidden. The page is complete and static.
  }
  if (!motion || !motion.animate || !motion.inView) return;

  var animate = motion.animate;
  var inView = motion.inView;
  var SPRING = [0.16, 1, 0.3, 1];

  // Everything this file touches, so the watchdog can hand it all back.
  var touched = [];
  function claim(el) {
    touched.push(el);
    return el;
  }
  function releaseAll() {
    for (var i = 0; i < touched.length; i++) {
      var el = touched[i];
      el.style.opacity = '';
      el.style.transform = '';
      el.style.filter = '';
    }
    touched.length = 0;
  }
  // Unconditional. Not in a .then(), not in a callback that might not run.
  setTimeout(releaseAll, 4000);

  // -------------------------------------------------------------------------
  // 1. Count-up statistics
  // -------------------------------------------------------------------------
  // The final value is already in the HTML, so a stat never renders as "0".
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    var value = parseInt(el.getAttribute('data-counter'), 10) || 0;
    var suffix = el.getAttribute('data-counter-suffix') || '';
    var done = false;

    function showFinal() {
      done = true;
      el.textContent = value + suffix;
    }

    inView(
      el,
      function () {
        if (done) return;
        var driver = { v: 0 };
        animate(driver, { v: value }, {
          duration: 1.4,
          easing: SPRING,
          onUpdate: function () {
            if (!done) el.textContent = Math.round(driver.v) + suffix;
          },
        });
      },
      { amount: 0.5 }
    );

    // A counter frozen mid-tween at "37+" is worse than no animation at all.
    setTimeout(showFinal, 2600);
  });

  // -------------------------------------------------------------------------
  // 2. Entrance reveals
  // -------------------------------------------------------------------------
  // Applied to whole groups, staggered by index, so a grid arrives as one
  // gesture instead of twelve unrelated pops. The hide happens inside the
  // observer callback — the latest possible moment — so an element that is
  // never scrolled to is never hidden in the first place.
  var groups = document.querySelectorAll('[data-reveal-group]');
  groups.forEach(function (group) {
    var children = Array.prototype.slice.call(group.children);
    if (!children.length) return;

    inView(
      group,
      function () {
        children.forEach(function (child, i) {
          claim(child);
          child.style.opacity = '0';
          child.style.transform = 'translateY(14px)';
          animate(
            child,
            { opacity: [0, 1], transform: ['translateY(14px)', 'translateY(0px)'] },
            { duration: 0.5, delay: Math.min(i * 0.06, 0.4), easing: SPRING }
          ).finished.then(function () {
            child.style.opacity = '';
            child.style.transform = '';
          }, function () {
            child.style.opacity = '';
            child.style.transform = '';
          });
        });
      },
      { amount: 0.15 }
    );
  });

  // -------------------------------------------------------------------------
  // 3. The checkpoint tracker
  // -------------------------------------------------------------------------
  // The four inspection stages fill along their rail as the section is
  // reached, the way a shipment clears checkpoints. This is the site's one
  // signature interaction, and it is built from what the business actually
  // does rather than from an effect looking for a home.
  //
  // Note the order, which is the same discipline as the reveals above:
  // `is-armed` (which empties the rail) is added INSIDE the observer, one
  // frame before `is-tracking` animates it back. Until the section is reached
  // the rail is drawn full and every checkpoint is legible, so a failure here
  // leaves a finished diagram rather than an empty one.
  document.querySelectorAll('[data-tracker]').forEach(function (tracker) {
    var run = false;
    inView(
      tracker,
      function () {
        if (run) return;
        run = true;
        tracker.classList.add('is-armed');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            tracker.classList.add('is-tracking');
          });
        });
      },
      { amount: 0.4 }
    );
    // Whatever happened, the rail ends up drawn.
    setTimeout(function () {
      tracker.classList.remove('is-armed');
      tracker.classList.add('is-tracking');
    }, 4000);
  });

  // -------------------------------------------------------------------------
  // 4. Image wipes
  // -------------------------------------------------------------------------
  // Photographs are uncovered rather than faded in. Armed inside the observer
  // for the same reason, so an image that is never scrolled to is never
  // clipped in the first place.
  document.querySelectorAll('.media > img').forEach(function (img) {
    var frame = img.parentElement;
    var run = false;
    inView(
      frame,
      function () {
        if (run) return;
        run = true;
        frame.classList.add('is-armed');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            frame.classList.add('is-revealed');
          });
        });
        setTimeout(function () {
          frame.classList.remove('is-armed', 'is-revealed');
        }, 1600);
      },
      { amount: 0.2 }
    );
  });

  // -------------------------------------------------------------------------
  // 5. Magnetic primary button
  // -------------------------------------------------------------------------
  // Transform only, so it can never move anything around it. Pointer-fine only
  // — on a touch screen there is no cursor to lean toward, and the listeners
  // would just be dead weight.
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn-primary').forEach(function (btn) {
      btn.classList.add('is-magnetic');
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = 'translate(' + dx * 5 + 'px,' + dy * 4 + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

})();
