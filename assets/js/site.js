// Shared vanilla-JS behavior for every page: mobile menu, modals (with focus
// trap), cookie consent, exit-intent popup, sticky CTA, FAQ accordion, tabs,
// and form submissions against ENZ_API. No framework, no build step.
(function () {
  'use strict';

  var FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  // ---------- Mobile menu ----------
  var menuToggle = document.getElementById('mobile-menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = !mobileNav.hidden;
      mobileNav.hidden = isOpen;
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // ---------- Generic modal open/close with focus trap ----------
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
      var exitPopup = document.getElementById('exit-intent-popup');
      if (exitPopup) exitPopup.style.display = 'none';
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

  // ---------- Booking form ----------
  var bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = bookingForm.querySelector('button[type="submit"]');
      var data = {
        name: bookingForm.name.value,
        email: bookingForm.email.value,
        phone: bookingForm.phone.value,
        company: bookingForm.company.value,
        date: bookingForm.date.value,
        service: bookingForm.service.value,
        message: bookingForm.message.value,
      };
      submitBtn.disabled = true;
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = submitBtn.getAttribute('data-submitting-label') || 'Sending…';
      window.ENZ_API.submitBooking(data)
        .then(function () {
          bookingForm.hidden = true;
          var success = document.getElementById('booking-success');
          if (success) {
            success.hidden = false;
            var nameSpan = success.querySelector('[data-success-name]');
            var emailSpan = success.querySelector('[data-success-email]');
            if (nameSpan) nameSpan.textContent = data.name;
            if (emailSpan) emailSpan.textContent = data.email;
          }
        })
        .catch(function () {
          var errorEl = document.getElementById('booking-error');
          if (errorEl) errorEl.hidden = false;
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }

  // ---------- Portal login form ----------
  var portalForm = document.getElementById('portal-login-form');
  if (portalForm) {
    portalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.ENZ_API.portalLogin(portalForm.email.value, portalForm.password.value).then(function () {
        portalForm.hidden = true;
        var success = document.getElementById('portal-success');
        if (success) success.hidden = false;
      });
    });
  }

  // ---------- Newsletter form ----------
  var newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.ENZ_API.subscribeNewsletter(newsletterForm.email.value).then(function () {
        newsletterForm.hidden = true;
        var success = document.getElementById('newsletter-success');
        if (success) success.hidden = false;
      });
    });
  }

  // ---------- Careers CV form ----------
  var careersForm = document.getElementById('careers-form');
  if (careersForm) {
    careersForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(careersForm);
      window.ENZ_API.submitCvApplication(fd).then(function () {
        careersForm.hidden = true;
        var success = document.getElementById('careers-success');
        if (success) success.hidden = false;
      });
    });
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.hidden = isOpen;
      var icon = btn.querySelector('.faq-chevron');
      if (icon) icon.style.transform = isOpen ? '' : 'rotate(180deg)';
    });
  });

  // ---------- Service tabs (home page) ----------
  document.querySelectorAll('[data-tab-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('[data-tab-group]');
      if (!group) return;
      group.querySelectorAll('[data-tab-btn]').forEach(function (b) {
        var active = b === btn;
        b.setAttribute('aria-selected', String(active));
        b.classList.toggle('bg-navy', active);
        b.classList.toggle('text-white', active);
        b.classList.toggle('shadow-md', active);
        b.classList.toggle('bg-white', !active);
        b.classList.toggle('text-navy/70', !active);
      });
      group.querySelectorAll('[data-tab-panel]').forEach(function (panel) {
        // Inline style, not the `hidden` attribute: panels also carry Tailwind's
        // `.grid` class, which ties `[hidden]{display:none}` on specificity and
        // wins on source order (Tailwind's stylesheet loads after the UA one).
        // Only an inline style is guaranteed to beat a stylesheet class.
        var isActive = panel.getAttribute('data-tab-panel') === btn.getAttribute('data-tab-btn');
        panel.style.display = isActive ? '' : 'none';
      });
    });
  });

  // ---------- Cookie consent ----------
  var CONSENT_KEY = 'enz_cookie_consent';
  var cookieBanner = document.getElementById('cookie-consent');
  if (cookieBanner) {
    var existing = localStorage.getItem(CONSENT_KEY);
    if (existing) {
      cookieBanner.hidden = true;
    } else {
      var acceptAll = document.getElementById('cookie-accept-all');
      var essentialOnly = document.getElementById('cookie-essential-only');
      if (acceptAll)
        acceptAll.addEventListener('click', function () {
          localStorage.setItem(CONSENT_KEY, 'all');
          cookieBanner.hidden = true;
        });
      if (essentialOnly)
        essentialOnly.addEventListener('click', function () {
          localStorage.setItem(CONSENT_KEY, 'essential');
          cookieBanner.hidden = true;
        });
    }
  }

  // ---------- Sticky CTA ----------
  var stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    var dismissed = false;
    var dismissBtn = document.getElementById('sticky-cta-dismiss');
    if (dismissBtn)
      dismissBtn.addEventListener('click', function () {
        dismissed = true;
        stickyCta.hidden = true;
      });
    window.addEventListener(
      'scroll',
      function () {
        if (dismissed) return;
        stickyCta.hidden = window.scrollY <= 720;
      },
      { passive: true }
    );
  }

  // ---------- Exit-intent popup (desktop only, once per tab session) ----------
  var exitPopup = document.getElementById('exit-intent-popup');
  if (exitPopup) {
    var SESSION_KEY = 'enz_exit_intent_shown';
    if (!sessionStorage.getItem(SESSION_KEY)) {
      var handleMouseOut = function (e) {
        var leavingTop = e.clientY <= 0 && !e.relatedTarget;
        if (!leavingTop) return;
        var bookingModal = document.getElementById('booking-modal');
        var portalModal = document.getElementById('portal-modal');
        var bookingOpen = bookingModal && bookingModal.style.display !== 'none';
        var portalOpen = portalModal && portalModal.style.display !== 'none';
        if (bookingOpen || portalOpen) return;
        exitPopup.style.display = 'flex';
        sessionStorage.setItem(SESSION_KEY, '1');
        document.removeEventListener('mouseout', handleMouseOut);
      };
      document.addEventListener('mouseout', handleMouseOut);
    }
    var exitClose = exitPopup.querySelector('[data-close-exit-intent]');
    if (exitClose)
      exitClose.addEventListener('click', function () {
        exitPopup.style.display = 'none';
      });
  }

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

  // Scroll reveal, animated counters, and hero entrance are handled by
  // motion-effects.js (Motion — motion.dev), loaded separately.
})();
