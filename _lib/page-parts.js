// The two blocks every non-home page is built from.
//
// pageHero is the band under the header; closingCta is the band above the
// footer. Fourteen pages use both, which is what makes the site feel like one
// site rather than fourteen - and is why changing the call to action means
// editing one function instead of fourteen templates.
import { t } from './i18n.js';
import { icon } from './icons.js';
import { BTN_PRIMARY, BTN_SECONDARY, EYEBROW, LEAD, SHELL } from './tokens.js';
import { media } from './components.js';

export function pageHero(lang, { eyebrow, title, lead }) {
  return `
  <section class="ph">
    <div class="shell max-w-3xl text-center pt-14 pb-12 md:pt-20 md:pb-16">
      <p class="${EYEBROW}">${eyebrow}</p>
      <h1 class="page-title text-ink mt-3">${title}</h1>
      <p class="${LEAD} mt-5">${lead}</p>
      <div class="flex flex-col sm:flex-row justify-center gap-3 mt-8">
        <a href="contact.html#contact-form" class="${BTN_PRIMARY} px-6 py-3 text-[0.9375rem]">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4')}</a>
        <a href="contact.html" class="${BTN_SECONDARY} px-6 py-3 text-[0.9375rem]">${t(lang, 'navContact')}</a>
      </div>
    </div>
  </section>`;
}

// The last thing a visitor sees on every page. It gets the gradient-border
// treatment and repeats the three reassurances that remove the reasons not to
// send the form — free, no obligation, answered by a person within a day.
export function closingCta(lang) {
  return `
  <section class="rc">
    <div class="rc-grid">
      <div class="rc-photo">${media('sourcing', { ratio: '16-10', sizes: '(min-width: 900px) 30vw, 100vw' })}</div>
      <div class="rc-body">
        <div>
          <h2>${t(lang, 'ctaBannerTitle')}</h2>
          <p>${t(lang, 'ctaBannerDesc')}</p>
          <div class="rc-actions">
            <a href="contact.html#contact-form" class="${BTN_PRIMARY} btn-lg">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a>
            <a href="contact.html" class="${BTN_SECONDARY} btn-lg">${t(lang, 'ctaTalkToUs')}</a>
          </div>
        </div>
        <ul class="rc-points list-none">
          <li>${icon('users', '')}One point of contact</li>
          <li>${icon('shield', '')}Inspected before shipping</li>
          <li>${icon('clock', '')}Reply within 24 hours</li>
        </ul>
      </div>
    </div>
  </section>`;
}
