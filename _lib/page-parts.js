// The two blocks every non-home page is built from.
//
// pageHero is the band under the header; closingCta is the band above the
// footer. Fourteen pages use both, which is what makes the site feel like one
// site rather than fourteen - and is why changing the call to action means
// editing one function instead of fourteen templates.
import { t } from './i18n.js';
import { icon } from './icons.js';
import { BTN_PRIMARY, BTN_SECONDARY, EYEBROW, LEAD, SHELL } from './tokens.js';

export function pageHero(lang, { eyebrow, title, lead }) {
  return `
  <section class="bg-white border-b border-line">
    <div class="shell max-w-3xl text-center pt-16 pb-14 md:pt-20 md:pb-16">
      <p class="${EYEBROW}">${eyebrow}</p>
      <h1 class="text-[2.25rem] leading-[1.1] md:text-[3.25rem] md:leading-[1.06] font-semibold text-ink mt-3">${title}</h1>
      <p class="${LEAD} mt-5">${lead}</p>
      <div class="flex flex-col sm:flex-row justify-center gap-3 mt-8">
        <button data-open-booking class="${BTN_PRIMARY} px-6 py-3 text-[0.9375rem]">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4')}</button>
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
  <section class="section section-feature">
    <div class="${SHELL}">
      <div class="gradient-border max-w-5xl mx-auto">
        <div class="bg-white px-6 py-14 md:px-16 md:py-20 text-center">
          <h2 class="h2-section">${t(lang, 'ctaBannerTitle')}</h2>
          <p class="lead mt-5 max-w-2xl mx-auto">${t(lang, 'ctaBannerDesc')}</p>
          <div class="flex flex-col sm:flex-row justify-center gap-3 mt-10">
            <button data-open-booking class="${BTN_PRIMARY} btn-lg">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
            <a href="contact.html" class="${BTN_SECONDARY} btn-lg">${t(lang, 'ctaTalkToUs')}</a>
          </div>
          <ul class="flex flex-wrap justify-center gap-x-7 gap-y-3 mt-10 text-sm list-none">
            ${[t(lang, 'bookingNext2'), t(lang, 'bookingDisclaimer')]
              .map((r) => `<li class="check-item">${icon('check', 'w-4 h-4')}<span>${r}</span></li>`)
              .join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;
}
