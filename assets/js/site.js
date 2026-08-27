// Shared vanilla-JS behavior for every page: mobile menu, modals (with focus
// trap), FAQ accordion, scroll-linked chrome (sticky header state, reading
// progress, back-to-top), and form submissions against ENZ_API. No framework.
(function () {
  'use strict';

  var FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  // Renders a submission failure into an element. When the cause is that no
  // form backend is configured (see api.js), the message becomes a working
  // mailto link — so a deployed-but-unconfigured site still gives a visitor a
  // real way to reach the business instead of a dead end.
  function showSubmitError(el, err) {
    if (!el) return;
    if (err && err.notConfigured) {
      var cfg = window.ENZ_CONFIG || {};
      var email = cfg.CONTACT_EMAIL || '';
      var phone = cfg.CONTACT_PHONE || '';
      el.innerHTML =
        'This form is not connected yet. Please email us at ' +
        '<a href="mailto:' + email + '" style="text-decoration:underline">' + email + '</a>' +
        (phone ? ' or call <a href="tel:' + phone.replace(/\s/g, '') + '" style="text-decoration:underline">' + phone + '</a>' : '') +
        ' and we will come straight back to you.';
    }
    el.hidden = false;
  }

  // ---------- Mobile menu ----------
  var menuToggle = document.getElementById('mobile-menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    var setMenu = function (open) {
      mobileNav.hidden = !open;
      menuToggle.setAttribute('aria-expanded', String(open));
    };
    menuToggle.addEventListener('click', function () {
      setMenu(mobileNav.hidden);
    });
    // Tapping a nav link on a phone should navigate, not leave the panel
    // hanging open over the destination.
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileNav.hidden) {
        setMenu(false);
        menuToggle.focus();
      }
    });
    // Rotating a phone to landscape can cross the desktop breakpoint, where
    // the panel is display:none but still "open" as far as the toggle knows.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1280 && !mobileNav.hidden) setMenu(false);
    });
  }

  // ---------- Generic modal open/close with focus trap ----------
  // Modals here are only ever opened by an explicit click on "Book
  // Consultation" / "Client Login" — never shown unprompted.
  var lastFocused = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    // style.display, not the `hidden` attribute: these overlays also carry
    // Tailwind display classes (flex/grid), which tie `[hidden]` on CSS
    // specificity and win on source order. Only an inline style reliably wins.
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    var focusable = modal.querySelectorAll(FOCUSABLE);
    if (focusable[0]) focusable[0].focus();

    function handleKeydown(e) {
      if (e.key === 'Escape') {
        closeModal(modal);
        return;
      }
      if (e.key === 'Tab' && focusable.length) {
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    modal._keydownHandler = handleKeydown;
    document.addEventListener('keydown', handleKeydown);
  }

  function closeModal(modal) {
    if (!modal || modal.style.display === 'none') return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (modal._keydownHandler) document.removeEventListener('keydown', modal._keydownHandler);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-booking]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(document.getElementById('booking-modal'));
    });
  });
  document.querySelectorAll('[data-open-portal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(document.getElementById('portal-modal'));
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(btn.closest('[role="dialog"]'));
    });
  });
  document.querySelectorAll('[data-modal-backdrop]').forEach(function (backdrop) {
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  // ---------- Forms ----------
  // Every form is wired per INSTANCE, not by id. contact.html and portal.html
  // each render the shared modal plus an inline copy of the same form, so the
  // old getElementById() lookups found only the first of the two and left the
  // modal's form with no submit handler at all — the primary CTA on the
  // contact page silently did nothing when submitted.
  //
  // Success and error elements are resolved within the form's own container,
  // so two copies on one page never reach into each other's state.
  function wireForm(selector, opts) {
    document.querySelectorAll(selector).forEach(function (form) {
      var scope = form.parentElement || document;
      var success = opts.successSelector ? scope.querySelector(opts.successSelector) : null;
      var errorEl = form.querySelector('[data-error-slot]') || scope.querySelector('[data-error-slot]');

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (errorEl) errorEl.hidden = true;

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = submitBtn.getAttribute('data-submitting-label') || originalLabel;
        }

        Promise.resolve(opts.submit(form))
          .then(function () {
            form.hidden = true;
            if (success) {
              success.hidden = false;
              if (opts.onSuccess) opts.onSuccess(form, success);
            }
          })
          .catch(function (err) {
            showSubmitError(errorEl, err);
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalLabel;
            }
          });
      });
    });
  }

  wireForm('[data-booking-form]', {
    successSelector: '[data-booking-success]',
    submit: function (form) {
      return window.ENZ_API.submitBooking({
        name: form.name.value,
        email: form.email.value,
        phone: form.phone ? form.phone.value : '',
        company: form.company ? form.company.value : '',
        date: form.date ? form.date.value : '',
        service: form.service ? form.service.value : '',
        message: form.message ? form.message.value : '',
      });
    },
    onSuccess: function (form, success) {
      var nameSpan = success.querySelector('[data-success-name]');
      var emailSpan = success.querySelector('[data-success-email]');
      if (nameSpan) nameSpan.textContent = form.name.value;
      if (emailSpan) emailSpan.textContent = form.email.value;
    },
  });

  wireForm('[data-portal-form]', {
    successSelector: '[data-portal-success]',
    submit: function (form) {
      return window.ENZ_API.portalLogin(form.email.value, form.password.value);
    },
  });

  wireForm('[data-newsletter-form]', {
    successSelector: '[data-newsletter-success]',
    submit: function (form) {
      return window.ENZ_API.subscribeNewsletter(form.email.value);
    },
  });

  wireForm('[data-careers-form]', {
    successSelector: '[data-careers-success]',
    submit: function (form) {
      return window.ENZ_API.submitCvApplication(new FormData(form));
    },
  });

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.hidden = isOpen;
      // The chevron rotation lives in CSS, keyed off [aria-expanded="true"] —
      // one source of truth for the open state instead of two.
    });
  });

  // ---------- Language switcher ----------
  document.querySelectorAll('[data-lang-select]').forEach(function (select) {
    select.addEventListener('change', function () {
      var target = select.getAttribute('data-target-template');
      if (target) window.location.href = target.replace('__LANG__', select.value);
    });
  });

  // ---------- Footer year ----------
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Scroll-linked chrome ----------
  // Header border/shadow, reading-progress bar, and the back-to-top button all
  // read the same scroll position, so they share one throttled listener rather
  // than three competing ones.
  var header = document.querySelector('[data-site-header]');
  var progress = document.querySelector('[data-read-progress]');
  var toTop = document.querySelector('[data-to-top]');

  if (header || progress || toTop) {
    var scrollTicking = false;

    var updateChrome = function () {
      var y = window.scrollY || document.documentElement.scrollTop || 0;

      // The header only earns its border once there is content behind it.
      if (header) header.classList.toggle('is-scrolled', y > 8);

      if (progress) {
        var scrollable = document.documentElement.scrollHeight - window.innerHeight;
        var pct = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
        progress.style.width = pct * 100 + '%';
      }

      // Only worth offering once scrolling back is actually a chore.
      if (toTop) toTop.hidden = y < 900;

      scrollTicking = false;
    };

    var onScroll = function () {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(updateChrome);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateChrome();
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // Animated counters, entrance reveals, and the hero parallax are handled by
  // motion-effects.js (Motion — motion.dev), loaded separately as a module.
})();
