// Shared vanilla-JS behavior for every page: mobile menu, modals (with focus
// trap), FAQ accordion, scroll-linked chrome (sticky header state, reading
// back-to-top, floating action), and form submissions against ENZ_API.
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
  // The booking modal is only ever opened by an explicit click on "Book
  // Consultation", never shown unprompted.
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

  // A booking trigger can carry data-quote-for="<product name>" — the
  // equipment page's "Request a Quote" buttons do this — so the enquiry
  // arrives already saying which product it is about instead of a generic
  // "I'd like a consultation" with the visitor left to type the name
  // themselves from memory two clicks later.
  //
  // It only ever PREPENDS to whatever the visitor goes on to type; it never
  // overwrites a message they already started, and a second click with a
  // different product replaces its own line rather than stacking duplicates.
  document.querySelectorAll('[data-open-booking]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.getElementById('booking-modal');
      var product = btn.getAttribute('data-quote-for');
      if (product) {
        var msg = modal && modal.querySelector('#booking-message, [name="message"]');
        if (msg) {
          var line = 'Quote request: ' + product;
          var rest = msg.value.replace(/^Quote request: .*(\r?\n)?/, '');
          msg.value = rest ? line + '\n' + rest : line;
        }
      }
      openModal(modal);
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
  // Every form is wired per INSTANCE, not by id. contact.html renders the
  // shared booking modal plus an inline copy of the same form, so the old
  // getElementById() lookups found only the first of the two and left the
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

      // Spam trap.
      //
      // Submissions now go straight to the inbox with nobody reviewing them,
      // so a public form on a public domain will collect bot mail. This is a
      // field a person can neither see nor tab into, so anything that fills it
      // is automated.
      //
      // It is injected here rather than written into each form's markup for
      // the same reason the success panel became one builder: three hand-kept
      // copies eventually become two.
      //
      // The name is deliberately dull and autocomplete is off. Password
      // managers cheerfully autofill anything called "website", "address" or
      // "company", and a false positive here silently discards a real
      // enquiry — the one outcome this whole file exists to prevent.
      var trap = document.createElement('input');
      trap.type = 'text';
      trap.name = '_trap_field';
      trap.tabIndex = -1;
      trap.setAttribute('autocomplete', 'off');
      trap.setAttribute('aria-hidden', 'true');
      trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
      form.appendChild(trap);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (errorEl) errorEl.hidden = true;

        // Trap filled: drop it without sending. An error message would tell a
        // bot exactly what to change next time, and there is no person on the
        // other side to mislead with the success panel.
        if (trap.value) {
          form.hidden = true;
          if (success) success.hidden = false;
          return;
        }

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = submitBtn.getAttribute('data-submitting-label') || originalLabel;
        }

        Promise.resolve(opts.submit(form))
          .then(function (result) {
            form.hidden = true;
            if (success) {
              success.hidden = false;
              // When the submission was handed to the visitor's mail client we
              // cannot know they pressed send, so the copy swaps to say so.
              // Claiming "we'll be in touch" would be a guess.
              if (result && result.handedOffToMailClient) {
                var handoff = success.querySelector('[data-handoff-note]');
                if (handoff) handoff.hidden = false;
                var sent = success.querySelector('[data-sent-note]');
                if (sent) sent.hidden = true;
              }
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

  // ---------- Handover diagram ----------
  // Switches which Incoterm the diagram is showing. The markup already holds a
  // complete, correct diagram of the default term, so this is enhancement: with
  // no JavaScript the reader still gets an accurate picture of FOB, just not a
  // switchable one.
  //
  // Every value it needs is on the buttons as data attributes, so the term
  // definitions live in exactly one place (_content/handover.js) and this file
  // never has to know what an Incoterm is.
  document.querySelectorAll('[data-handover-diagram]').forEach(function (root) {
    var buttons = root.querySelectorAll('[data-term]');
    var stages = root.querySelectorAll('[data-stage]');
    var codeEl = root.querySelector('[data-handover-code]');
    var summaryEl = root.querySelector('[data-handover-summary]');
    var watchEl = root.querySelector('[data-handover-watch]');

    function select(btn) {
      var costTo = parseInt(btn.getAttribute('data-cost-to'), 10);
      var riskTo = parseInt(btn.getAttribute('data-risk-to'), 10);

      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      stages.forEach(function (stage) {
        var i = parseInt(stage.getAttribute('data-stage'), 10);
        stage.setAttribute('data-cost', i <= costTo ? 'seller' : 'buyer');
        stage.setAttribute('data-risk', i <= riskTo ? 'seller' : 'buyer');
        // The node that marks the point of handover.
        if (i === costTo) stage.setAttribute('data-handover', 'true');
        else stage.removeAttribute('data-handover');
      });

      if (codeEl) codeEl.textContent = btn.getAttribute('data-term');
      if (summaryEl) summaryEl.textContent = btn.getAttribute('data-summary');
      if (watchEl) watchEl.textContent = btn.getAttribute('data-watch');
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        select(btn);
      });
    });
  });

  // ---------- Language menu / header "More" menu ----------
  // Both are a <details> containing real links, so they already open,
  // navigate and are keyboard-operable with no JavaScript at all. Everything
  // below is polish on top of that: close when you click elsewhere, close on
  // Escape, and never leave two menus open at once. They share one behaviour
  // because they share the same .lang-menu/.lang-panel markup — see
  // headerHTML() in _lib/chrome.js for why the header's "More" dropdown
  // reuses the language switcher's pill-with-chevron pattern.
  var langMenus = document.querySelectorAll('[data-lang-menu], [data-nav-more]');
  if (langMenus.length) {
    document.addEventListener('click', function (e) {
      langMenus.forEach(function (menu) {
        if (menu.open && !menu.contains(e.target)) menu.open = false;
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      langMenus.forEach(function (menu) {
        if (!menu.open) return;
        menu.open = false;
        var summary = menu.querySelector('summary');
        if (summary) summary.focus();
      });
    });
    langMenus.forEach(function (menu) {
      menu.addEventListener('toggle', function () {
        if (!menu.open) return;
        langMenus.forEach(function (other) {
          if (other !== menu) other.open = false;
        });
      });
    });
  }

  // ---------- Equipment search ----------
  // Client side only, filtering the 35 cards already in the page — there is
  // no search backend and nothing to index, so it can never return a result
  // that does not match what is actually published.
  //
  // A category section hides itself once every one of its own cards is
  // filtered out, rather than sitting there as an empty heading over nothing.
  // The per-category "N types" badge becomes "N of M" while a query is
  // active, so the count on screen is never a stale claim once filtering
  // starts changing what is visible under it.
  var equipSearch = document.querySelector('[data-equipment-search]');
  if (equipSearch) {
    var equipSections = Array.prototype.slice.call(document.querySelectorAll('[data-equipment-section]'));
    var equipEmpty = document.querySelector('[data-equipment-empty]');
    var ofLabel = equipSearch.getAttribute('data-of-label') || 'of';
    var typeLabel = equipSearch.getAttribute('data-type-label') || 'type';
    var typesLabel = equipSearch.getAttribute('data-types-label') || 'types';

    var filterEquipment = function () {
      var q = equipSearch.value.trim().toLowerCase();
      var anyVisible = false;

      equipSections.forEach(function (section) {
        var cards = Array.prototype.slice.call(section.querySelectorAll('[data-equipment-card]'));
        var visible = 0;
        cards.forEach(function (card) {
          var match = !q || (card.getAttribute('data-search') || '').indexOf(q) !== -1;
          card.hidden = !match;
          if (match) visible++;
        });
        section.hidden = visible === 0;
        if (visible > 0) anyVisible = true;

        var countEl = section.querySelector('[data-equipment-count]');
        if (countEl) {
          countEl.textContent = q
            ? visible + ' ' + ofLabel + ' ' + cards.length
            : cards.length + ' ' + (cards.length === 1 ? typeLabel : typesLabel);
        }
      });

      if (equipEmpty) equipEmpty.hidden = !q || anyVisible;
    };

    equipSearch.addEventListener('input', filterEquipment);

    // The homepage hero has its own search box that submits here as a plain
    // GET (?q=...) rather than duplicating this filter client-side a second
    // time. One filter, two entry points: land with a query already in the
    // URL and it runs immediately, exactly as if it had been typed here.
    var presetQuery = new URLSearchParams(window.location.search).get('q');
    if (presetQuery) {
      equipSearch.value = presetQuery;
      filterEquipment();
      var firstSection = document.querySelector('[data-equipment-section]:not([hidden])');
      if (firstSection) firstSection.scrollIntoView({ block: 'start' });
    }
  }

  // ---------- Footer year ----------
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Scroll-linked chrome ----------
  // The header border, the back-to-top button and the floating WhatsApp action
  // all read the same scroll position, so they share one throttled listener
  // rather than three competing ones.
  var header = document.querySelector('[data-site-header]');
  var toTop = document.querySelector('[data-to-top]');
  var fab = document.querySelector('.fab-whatsapp');

  if (header || toTop || fab) {
    var scrollTicking = false;

    var updateChrome = function () {
      var y = window.scrollY || document.documentElement.scrollTop || 0;

      // The header only earns its border once there is content behind it.
      if (header) header.classList.toggle('is-scrolled', y > 8);

      // Only worth offering once scrolling back is actually a chore.
      if (toTop) toTop.hidden = y < 900;

      // On phones the hero's full-width CTAs sit at the same height as the
      // floating action, so it covered "Book Consultation". Tuck it until the
      // hero is behind us. The CSS only honours `is-tucked` under 768px, so
      // this is inert on desktop where there is no collision.
      if (fab) fab.classList.toggle('is-tucked', y < 520);

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
