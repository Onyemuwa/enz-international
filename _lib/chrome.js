// Page chrome - everything that wraps the content of a page.
//
// The header, the footer, the language switcher, the booking modal, the
// floating WhatsApp button and the breadcrumbs. These render identically on
// all 76 pages, so they are built once here and pulled in by the page shell.
//
// The booking success panel lives here too, and is deliberately ONE function
// used by both booking forms. It was previously two hand-written copies that
// drifted: the contact page's lost its <p data-sent-note> and the name/email
// spans site.js fills, so a successful submission showed a tick, a heading and
// no sentence. Two copies of anything in this file will do that again.
import { SITE_URL, WHATSAPP_NUMBER, CONTACT_PHONE, CONTACT_EMAIL } from './site-config.js';
import { urlPath } from './urls.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { BTN_PRIMARY, SHELL } from './tokens.js';
import { LANG_LABEL, NAV_ITEMS } from './nav.js';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from '../_content/translations.js';
import { hubs } from '../_content/regions.js';
import { images } from '../_content/images.js';
import { services } from '../_content/services.js';
import { insights } from '../_content/insights.js';
import { markets } from '../_content/markets.js';
import { industries, resources } from '../_content/pages.js';

export function langInline(lang, currentPage) {
  // A picker offering one language is dead UI: it costs a tap target in the
  // header, it implies translations that do not exist, and it is one more
  // thing for a screen-reader user to move through for no gain. It comes back
  // on its own the moment a second language is added to SUPPORTED_LANGUAGES.
  if (SUPPORTED_LANGUAGES.length < 2) return '';
  return `
          <div class="lang-inline">
            ${SUPPORTED_LANGUAGES.map(
              (l) =>
                `<a href="../${l}/${currentPage}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ''}>${LANGUAGE_LABELS[l]}</a>`
            ).join('')}
          </div>`;
}

// A <details> disclosure rather than a <select>, listing each language in its
// own name. See the .lang-menu block in tailwind.src.css for why: OS chrome,
// two-letter codes nobody scans for, and options that were not real links.
//
// `variant: 'dark'` styles it for the footer band and opens it upward.
export function langSwitcher(lang, currentPage, { variant = 'light', id = 'lang' } = {}) {
  // A picker offering one language is dead UI: it costs a tap target in the
  // header, it implies translations that do not exist, and it is one more
  // thing for a screen-reader user to move through for no gain. It comes back
  // on its own the moment a second language is added to SUPPORTED_LANGUAGES.
  if (SUPPORTED_LANGUAGES.length < 2) return '';
  const options = SUPPORTED_LANGUAGES.map((l) => {
    const current = l === lang;
    return `<a href="../${l}/${currentPage}" hreflang="${l}" lang="${l}"${current ? ' aria-current="true"' : ''}>
            <span>${LANGUAGE_LABELS[l]}</span><span class="lang-code">${l}</span>
          </a>`;
  }).join('');

  return `
        <details class="lang-menu${variant === 'dark' ? ' lang-menu-up' : ''}" data-lang-menu>
          <summary aria-haspopup="true" aria-label="${LANG_LABEL[lang] || 'Language'}: ${LANGUAGE_LABELS[lang]}">
            ${icon('globe', 'w-4 h-4')}
            <span>${LANGUAGE_LABELS[lang]}</span>
            ${icon('chevronDown', 'w-3.5 h-3.5 lang-caret')}
          </summary>
          <div class="lang-panel" role="menu" id="${id}-panel">${options}</div>
        </details>`;
}

export function headerHTML(lang, currentPage) {
  const links = NAV_ITEMS.map(
    (item) =>
      `<a href="${item.page}" class="nav-link"${item.page === currentPage ? ' aria-current="page"' : ''}>${t(lang, item.key)}</a>`
  ).join('\n');
  const mobileLinks = NAV_ITEMS.map(
    (item) =>
      `<a href="${item.page}" class="nav-link-mobile"${item.page === currentPage ? ' aria-current="page"' : ''}>${t(lang, item.key)}${icon('chevronRight', 'w-4 h-4 opacity-40')}</a>`
  ).join('\n');

  return `
  <header class="site-header" data-site-header>
    <div class="${SHELL} flex items-center justify-between gap-6 h-[4.25rem]">
      <a href="index.html" class="flex items-center shrink-0" aria-label="ENZ INTERNATIONAL — home">
        <img src="../assets/images/enz-logo-204.png" alt="ENZ INTERNATIONAL" width="51" height="36" class="h-9 w-auto object-contain" fetchpriority="high" />
      </a>
      <nav class="hidden xl:flex items-center gap-5 2xl:gap-7 min-w-0 text-[0.875rem] 2xl:text-[0.9375rem] font-medium" aria-label="Primary">
        ${links}
      </nav>
      <div class="hidden xl:flex items-center gap-2 2xl:gap-2.5 shrink-0">
        ${langSwitcher(lang, currentPage)}
        <button data-open-booking class="${BTN_PRIMARY} btn-sm">${t(lang, 'ctaBookingShort')}${icon('chevronRight', 'w-3.5 h-3.5 btn-arrow')}</button>
      </div>
      <div class="flex xl:hidden items-center gap-2">
        <button data-open-booking class="${BTN_PRIMARY} btn-sm hidden sm:inline-flex">${t(lang, 'ctaBookingShort')}</button>
        <button id="mobile-menu-toggle" aria-expanded="false" aria-controls="mobile-nav" class="inline-flex items-center justify-center w-10 h-10 -mr-2 rounded-lg text-ink hover:bg-gray-bg transition-colors" aria-label="Toggle menu">
          ${icon('menu', 'w-6 h-6')}
        </button>
      </div>
    </div>
    <nav id="mobile-nav" hidden aria-label="Primary" class="xl:hidden bg-white border-t border-line shadow-lg max-h-[calc(100vh-4.25rem)] overflow-y-auto">
      <div class="${SHELL} py-5 text-[0.9375rem]">
        ${mobileLinks}
        <div class="pt-5 space-y-3">
          <button data-open-booking class="${BTN_PRIMARY} w-full">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
          <div class="pt-4 mt-2 border-t border-line">
            <span class="block text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-slate mb-3">${LANG_LABEL[lang] || 'Language'}</span>
            ${langInline(lang, currentPage)}
          </div>
        </div>
      </div>
    </nav>
  </header>`;
}

// Rebuilt. The previous version put the newsletter — a primary action — as a
// subordinate item underneath a three-link column, in a 4/2/2/4 grid that left
// one column short and one overloaded. And on a phone it forced two columns,
// so the signup form ended up in a half-width cell.
//
// Now: the newsletter gets its own full-width band at the top, the link
// columns are evenly weighted, and the language switcher moves to the bottom
// bar where it belongs on a multilingual site.
export function footerHTML(lang, currentPage) {
  const fLink = (href, label) =>
    `<li><a href="${href}" class="footer-link">${label}</a></li>`;

  const column = (heading, links) => `
        <div>
          <h2 class="footer-heading">${heading}</h2>
          <ul class="mt-4 space-y-2.5">${links}</ul>
        </div>`;

  return `
  <footer class="section-feature">
    <!-- Newsletter, as its own band rather than an afterthought in a column. -->
    <div class="${SHELL} py-12 md:py-14 border-b border-line">
      <div class="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        <div class="lg:col-span-6">
          <h2 class="text-xl md:text-2xl font-semibold text-ink">${t(lang, 'footerNewsletterTitle')}</h2>
          <p class="text-sm text-slate mt-2 leading-relaxed max-w-md">${t(lang, 'footerNewsletterDesc')}</p>
        </div>
        <div class="lg:col-span-6">
          <form data-newsletter-form class="flex flex-col sm:flex-row gap-2.5 lg:justify-end">
            <label for="newsletter-email" class="sr-only">${t(lang, 'footerNewsletterTitle')}</label>
            <input id="newsletter-email" name="email" type="email" required autocomplete="email"
                   placeholder="${t(lang, 'footerNewsletterPlaceholder')}"
                   class="field sm:max-w-xs" />
            <button type="submit" class="${BTN_PRIMARY} shrink-0">${t(lang, 'ctaSubscribe')}</button>
          </form>
          <p data-error-slot role="alert" hidden class="text-sm text-red-600 mt-3 lg:text-right"></p>
          <p data-newsletter-success role="status" hidden class="text-sm text-brand mt-3 flex items-center gap-2 lg:justify-end">${icon('check', 'w-4 h-4')}${t(lang, 'footerNewsletterSuccess')}</p>
        </div>
      </div>
    </div>

    <!-- Brand block plus three evenly weighted link columns. -->
    <div class="${SHELL} py-12 md:py-16 grid gap-10 md:gap-8 md:grid-cols-2 lg:grid-cols-12">
      <div class="lg:col-span-4 lg:pr-8">
        <img src="../assets/images/enz-logo-204.png" alt="ENZ INTERNATIONAL" width="51" height="36" class="h-9 w-auto object-contain" loading="lazy" decoding="async" />
        <p class="text-sm leading-relaxed mt-5 text-slate max-w-xs">${t(lang, 'footerAbout')}</p>
        <ul class="mt-6 space-y-3 text-sm">
          <li><a href="tel:${CONTACT_PHONE.replace(/\s/g, '')}" class="footer-contact">${icon('phone', 'w-4 h-4')}<span>${CONTACT_PHONE}</span></a></li>
          <li><a href="mailto:${CONTACT_EMAIL}" class="footer-contact">${icon('mail', 'w-4 h-4')}<span>${CONTACT_EMAIL}</span></a></li>
          <li><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="footer-contact">${icon('whatsapp', 'w-4 h-4')}<span>${t(lang, 'footerWhatsapp')}</span></a></li>
        </ul>
      </div>

      <div class="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
        ${column(
          t(lang, 'footerServices'),
          [
            fLink('services.html', t(lang, 'tabSourcing')),
            fLink('quality-control.html', t(lang, 'qcEyebrow')),
            fLink('services.html', t(lang, 'tabFactory')),
            fLink('logistics.html', t(lang, 'logisticsEyebrow')),
            fLink('industries.html', t(lang, 'navIndustries')),
          ].join('')
        )}
        ${column(
          t(lang, 'footerCompany'),
          [
            fLink('about.html', t(lang, 'navAbout')),
            fLink('process.html', t(lang, 'navProcess')),
            fLink('pricing.html', t(lang, 'navPricing')),
            fLink('markets.html', t(lang, 'navMarkets')),
            fLink('careers.html', t(lang, 'navCareers')),
            fLink('contact.html', t(lang, 'navContact')),
          ].join('')
        )}
        ${column(
          t(lang, 'navResources'),
          [
            fLink('resources.html', t(lang, 'resourcesTitle')),
            fLink('insights.html', t(lang, 'navInsights')),
            fLink('faq.html', 'FAQ'),
            fLink('privacy.html', t(lang, 'footerPrivacy')),
            fLink('terms.html', t(lang, 'footerTerms')),
          ].join('')
        )}
      </div>
    </div>

    <!-- Bottom bar: attribution left, hubs centre, language right. -->
    <div class="${SHELL} py-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate">
      <p class="order-2 md:order-1">&copy; <span data-current-year>${new Date().getFullYear()}</span> ENZ INTERNATIONAL. ${t(lang, 'footerRights')}</p>
      <p class="order-3 md:order-2 hidden lg:flex items-center gap-2">${icon('mapPin', 'w-3.5 h-3.5')}<span>${hubs.join(' · ')}</span></p>
      <div class="order-1 md:order-3">${langSwitcher(lang, currentPage, { variant: 'dark', id: 'lang-footer' })}</div>
    </div>
  </footer>`;
}

// Shown after a successful enquiry. Answering "what now?" at the moment of
// submission is the cheapest way to stop a lead going cold — it replaces an
// ambiguous silence with a stated turnaround the sender can hold us to.
// The panel shown after a booking form is submitted.
//
// Both booking forms — the modal and the one on the contact page — render this
// same function. They used to be two hand-written copies, and they drifted:
// one lost its <p data-sent-note> and with it the [data-success-name] and
// [data-success-email] spans that site.js fills in. A visitor on that page saw
// a tick, a heading, and no sentence.
//
// It hid for a long time because the mail-client handoff was the default path,
// and that shows the OTHER note. As soon as submissions became automatic the
// gap became the normal case. One source removes the whole class of bug.
//
// Both notes are always present. site.js reveals whichever matches what
// actually happened: data-sent-note when the submission was delivered,
// data-handoff-note when it was handed to the visitor's mail app instead.
export function bookingSuccessBlock(lang) {
  return `<div data-booking-success role="status" hidden class="py-6">
        <div class="text-center">
          <div class="icon-chip w-12 h-12 rounded-full mx-auto">${icon('check', 'w-6 h-6')}</div>
          <p class="text-lg font-semibold text-ink mt-4">${t(lang, 'bookingSuccessTitle')}</p>
          <p data-sent-note class="text-sm text-slate mt-2">${t(lang, 'bookingSuccessDesc', {
            name: '<span data-success-name></span>',
            email: '<span data-success-email></span>',
          })}</p>
          <div data-handoff-note hidden>
            <p class="text-sm text-slate mt-2">${t(lang, 'bookingHandoffDesc')}</p>
            <p class="text-xs text-slate mt-3">${t(lang, 'bookingHandoffFallback')} <a href="mailto:${CONTACT_EMAIL}" class="text-brand underline underline-offset-2">${CONTACT_EMAIL}</a></p>
          </div>
        </div>
        ${nextStepsHTML(lang)}
      </div>`;
}

export function nextStepsHTML(lang) {
  const steps = [t(lang, 'bookingNext1'), t(lang, 'bookingNext2'), t(lang, 'bookingNext3')];
  return `
        <div class="mt-7 pt-6 border-t border-line text-left">
          <p class="eyebrow text-slate">${t(lang, 'bookingNextTitle')}</p>
          <ol class="mt-4 space-y-3">
            ${steps
              .map(
                (s, i) =>
                  `<li class="flex gap-3 text-sm text-slate"><span class="step-badge w-6 h-6">${i + 1}</span><span>${s}</span></li>`
              )
              .join('')}
          </ol>
        </div>`;
}

export function bookingModalHTML(lang) {
  const opts = [
    ['sourcing', 'bookingServiceOptSourcing'],
    ['factory', 'bookingServiceOptFactory'],
    ['market', 'bookingServiceOptMarket'],
    ['other', 'bookingServiceOptOther'],
  ]
    .map(([v, k]) => `<option value="${v}">${t(lang, k)}</option>`)
    .join('');
  return `
  <div id="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" style="display:none" data-modal-backdrop class="modal-backdrop">
    <div class="modal-panel">
      <button data-close-modal aria-label="Close dialog" class="modal-close">${icon('close', 'w-6 h-6')}</button>
      <h2 id="booking-modal-title" class="text-[1.375rem] font-semibold text-ink pr-8">${t(lang, 'bookingTitle')}</h2>
      <form data-booking-form class="space-y-5">
        <p class="text-sm text-slate">${t(lang, 'bookingIntro')}</p>
        <div>
          <label for="booking-name" class="field-label">${t(lang, 'bookingName')}</label>
          <input id="booking-name" name="name" type="text" required class="field" />
        </div>
        <div>
          <label for="booking-email" class="field-label">${t(lang, 'bookingEmail')}</label>
          <input id="booking-email" name="email" type="email" required class="field" />
        </div>
        <div data-reveal-group class="grid grid-cols-2 gap-4">
          <div>
            <label for="booking-phone" class="field-label">${t(lang, 'bookingPhone')}</label>
            <input id="booking-phone" name="phone" type="tel" class="field" />
          </div>
          <div>
            <label for="booking-company" class="field-label">${t(lang, 'bookingCompany')}</label>
            <input id="booking-company" name="company" type="text" class="field" />
          </div>
        </div>
        <div>
          <label for="booking-date" class="field-label">${t(lang, 'bookingDate')}</label>
          <input id="booking-date" name="date" type="date" class="field" />
        </div>
        <div>
          <label for="booking-service" class="field-label">${t(lang, 'bookingService')}</label>
          <select id="booking-service" name="service" class="field"><option value="">—</option>${opts}</select>
        </div>
        <div>
          <label for="booking-message" class="field-label">${t(lang, 'bookingMessage')}</label>
          <textarea id="booking-message" name="message" rows="3" class="field"></textarea>
        </div>
        <p data-booking-error data-error-slot role="alert" hidden class="text-sm text-red-600">${t(lang, 'bookingErrorTitle')} — ${t(lang, 'bookingErrorDesc')}</p>
        <button type="submit" data-submitting-label="${t(lang, 'bookingSubmitting')}" class="w-full ${BTN_PRIMARY} py-4">${t(lang, 'bookingSubmit')}</button>
        <p class="text-xs text-slate text-center">${t(lang, 'bookingDisclaimer')}</p>
      </form>
      ${bookingSuccessBlock(lang)}
    </div>
  </div>`;
}

export function whatsappButtonHTML(lang) {
  return `
  <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="fab-whatsapp no-print" aria-label="${t(lang, 'footerWhatsapp')}">
    ${icon('whatsapp', 'w-6 h-6')}<span class="fab-label" aria-hidden="true">${t(lang, 'footerWhatsapp')}</span>
  </a>
  <button type="button" data-to-top hidden class="to-top no-print" aria-label="${t(lang, 'backToTop')}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
  </button>`;
}

export function breadcrumbsHTML(lang, items) {
  const sep = `<span aria-hidden="true" class="text-line-strong">${icon('chevronRight', 'w-3.5 h-3.5')}</span>`;
  const parts = [`<a href="index.html" class="hover:text-brand transition-colors">${t(lang, 'breadcrumbHome')}</a>`];
  items.forEach((item) => {
    parts.push(sep);
    if (item.href) parts.push(`<a href="${item.href}" class="hover:text-brand transition-colors">${item.label}</a>`);
    else parts.push(`<span class="text-ink font-medium" aria-current="page">${item.label}</span>`);
  });
  return `<nav aria-label="Breadcrumb" class="${SHELL} pt-5 text-[0.8125rem] text-slate"><ol class="flex flex-wrap items-center gap-2">${parts
    .map((p) => `<li class="flex items-center gap-2">${p}</li>`)
    .join('')}</ol></nav>`;
}

// BreadcrumbList markup so Google renders the trail under the result instead
// of a bare URL. Built from the same items rendered above.
export function breadcrumbJsonLd(lang, page, items) {
  const list = [{ name: t(lang, 'breadcrumbHome'), url: `${SITE_URL}/${lang}/` }];
  items.forEach((item, i) => {
    list.push({ name: item.label, url: `${SITE_URL}/${urlPath(lang, item.href || page)}` });
    void i;
  });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: list.map((entry, i) => ({ '@type': 'ListItem', position: i + 1, name: entry.name, item: entry.url })),
  };
}

// Meta descriptions get about 160 characters in a search result before they
// are cut off mid-word. Several pages reuse a paragraph of body copy for the
// description — reasonable, since it is already the page's own summary — but
// body copy runs long: the About page's was 242 characters, so a third of it
// was never shown.
//
// This trims rather than rewrites, and prefers a boundary a reader would have
// chosen anyway: the last complete sentence, then a clause break, and only as
// a last resort a word boundary with an ellipsis. Nothing is invented, and a
// description already inside the budget is returned untouched.
