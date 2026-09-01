// Reusable page components.
//
// These are the pieces that appear on more than one page — the section header,
// the photograph slot, the engagement card, the founder note, the Incoterms
// diagram. They were inline in _generate-static.mjs, which meant the only way
// to find out whether a component already existed was to scroll 2,600 lines.
//
// Each one returns an HTML string. None of them touch the filesystem, so they
// are safe to call from any page module, in any order.
//
// A note on why these are functions and not a template language: the site has
// no runtime and no build step to deploy, so the "framework" is string
// concatenation. Keeping the seams honest — one function per component, real
// parameters, no shared mutable state — is what stops that being a problem.

import { icon } from './icons.js';
import { t } from './i18n.js';
import { srcsetAttrs } from './image-variants.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, EYEBROW, H2, LEAD, SHELL } from './tokens.js';
import { images, industryImages } from '../_content/images.js';
import { founder } from '../_content/founder.js';
import { journey, terms as handoverTerms, defaultTerm } from '../_content/handover.js';
import { testimonials, caseStudies } from '../_content/proof.js';

// Centred section header — eyebrow, heading, lead. Repeated ~30 times across
// the site; having it in one function is what keeps the vertical rhythm
// identical everywhere instead of drifting a few pixels per section.
// Centred is the default because it suits a hero-adjacent statement, but it is
// NOT the default for every band. Ten of fourteen homepage sections opening
// with the identical eyebrow -> heading -> centred lead was the single loudest
// "assembled from a template" signal on the page: real sites vary their
// alignment because different content wants different emphasis.
//
// `align: 'start'` puts the heading hard left with the lead beside it, which
// reads as an editor's decision rather than a component default.
export function sectionHead(eyebrow, title, lead, { align = 'center', index = null } = {}) {
  const idx = index ? `<span class="section-index">${index}</span>` : '';
  if (align === 'start') {
    return `
      <div class="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
        <div class="lg:col-span-6">
          ${idx}
          ${eyebrow ? `<p class="${EYEBROW}">${eyebrow}</p>` : ''}
          <h2 class="${H2} mt-4">${title}</h2>
        </div>
        ${lead ? `<div class="lg:col-span-6"><p class="${LEAD}">${lead}</p></div>` : ''}
      </div>`;
  }
  const wrap = align === 'center' ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl';
  return `
      <div class="${wrap}">
        ${idx}
        ${eyebrow ? `<p class="${EYEBROW}">${eyebrow}</p>` : ''}
        <h2 class="${H2} mt-4">${title}</h2>
        ${lead ? `<p class="${LEAD} mt-5">${lead}</p>` : ''}
      </div>`;
}

// The Incoterms handover diagram — see _content/handover.js for the reasoning.
//
// Server-rendered in its default state, with every stage, both tracks and the
// note already correct. Script only re-points the selection, so with no
// JavaScript this is a complete, accurate diagram of FOB rather than an empty
// shell waiting to be filled.
export function handoverDiagram(lang) {
  const active = handoverTerms.find((x) => x.code === defaultTerm) || handoverTerms[0];

  const stages = journey
    .map((stg, i) => {
      const cost = i <= active.costTo ? 'seller' : 'buyer';
      const risk = i <= active.riskTo ? 'seller' : 'buyer';
      const isHandover = i === active.costTo;
      return `<div class="handover-stage" data-stage="${i}" data-cost="${cost}" data-risk="${risk}"${isHandover ? ' data-handover="true"' : ''}>
            <span class="handover-node" aria-hidden="true"></span>
            <span class="handover-seg handover-seg-cost" aria-hidden="true"></span>
            <span class="handover-seg handover-seg-risk" aria-hidden="true"></span>
            <span class="handover-label">${stg.label}</span>
          </div>`;
    })
    .join('');

  const buttons = handoverTerms
    .map(
      (tm) => `<button type="button" class="handover-term" data-term="${tm.code}"
              aria-pressed="${tm.code === active.code}"
              data-cost-to="${tm.costTo}" data-risk-to="${tm.riskTo}"
              data-summary="${escapeAttr(tm.summary)}" data-watch="${escapeAttr(tm.watch)}">
              <span class="t-code">${tm.code}</span>
              <span class="t-name">${tm.name}</span>
            </button>`
    )
    .join('');

  return `
      <div class="handover" data-handover-diagram>
        <div class="handover-terms" role="group" aria-label="${t(lang, 'handoverPick')}">${buttons}</div>

        <div class="handover-track" data-handover-track>${stages}</div>

        <div class="handover-legend">
          <span class="handover-key handover-key-cost"><i></i>${t(lang, 'handoverCost')}</span>
          <span class="handover-key handover-key-risk"><i></i>${t(lang, 'handoverRisk')}</span>
          <span class="handover-key handover-key-yours"><i></i>${t(lang, 'handoverYours')}</span>
        </div>

        <div class="handover-note" role="status" aria-live="polite">
          <p><strong data-handover-code>${active.code}</strong> — <span data-handover-summary>${active.summary}</span></p>
          <p class="mt-2" data-handover-watch>${active.watch}</p>
        </div>
      </div>`;
}

// Attribute-safe: these strings carry apostrophes and quotes.
export function escapeAttr(v) {
  return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// Renders an image slot from the manifest in _content/images.js.
//
// The slot is drawn whether or not the file exists. With no `src` it paints a
// branded gradient at the same aspect ratio and names what belongs there, so
// an unfilled slot reads as deliberate and the layout never shifts when the
// photograph is finally dropped in.
//
// `eager` is for above-the-fold images only — everything else is lazy, because
// a photo-led page with eager images would block first paint on all of them.
export function media(slot, { ratio = '16-9', className = '', eager = false, sizes = '' } = {}) {
  const conf = images[slot] || industryImages[slot];
  if (!conf) throw new Error(`Unknown image slot: ${slot}`);

  if (!conf.src) {
    return `<div class="media media-${ratio} media-empty ${className}" role="img" aria-label="${conf.alt}">
            <span class="media-note" aria-hidden="true">
              ${icon('image', 'w-6 h-6')}
              <span>${conf.file}</span>
            </span>
          </div>`;
  }

  // A slot image is laid out inside a card or a half-width column, never
  // full-bleed, so the default describes that: full width on a phone, about
  // half the viewport once the grids go multi-column. Callers pass `sizes`
  // when their slot is narrower than that.
  const sizeHint = sizes || '(min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw';
  return `<div class="media media-${ratio} ${className}">
            <img src="../assets/images/${conf.src}" alt="${conf.alt}"
                 loading="${eager ? 'eager' : 'lazy'}" decoding="async"
                 ${eager ? 'fetchpriority="high"' : ''}${srcsetAttrs(conf.src, sizeHint)} />
          </div>`;
}

// The hero photograph is a background rather than a slot, so it gets its own
// renderer. When there is no file the section falls back to a brand gradient
// via .is-empty and every layer above it is unchanged.
export function heroMedia() {
  const conf = images.hero;
  if (!conf.src) return '';
  return `
    <div class="hero-media" aria-hidden="true">
      <img src="../assets/images/${conf.src}" alt="" loading="eager" decoding="async" fetchpriority="high"${srcsetAttrs(conf.src, '100vw')} />
    </div>`;
}

// A note from the founder. Renders only when a name is set, so emptying
// `name` in _content/founder.js removes it site-wide rather than leaving a
// half-filled section behind.
//
// The portrait falls back to an initials monogram rather than a stock person:
// stock scenery is fine, but a stranger's face beside a real founder's name is
// presenting someone else as them.
export function founderSection(lang, { compact = false } = {}) {
  if (!founder.name) return '';

  const portrait = founder.photo
    ? `<img src="../assets/images/${founder.photo}" alt="${founder.photoAlt || founder.name}" width="112" height="112" loading="lazy" decoding="async" class="w-28 h-28 rounded-full object-cover" />`
    : `<span class="monogram" aria-hidden="true">${founder.initials}</span>`;

  const meta = `
          <div class="mt-5">
            <p class="font-semibold text-ink">${founder.name}</p>
            <p class="text-sm text-slate mt-0.5">${founder.role}${founder.location ? ` · ${founder.location}` : ''}</p>
            ${founder.linkedin ? `<a href="${founder.linkedin}" target="_blank" rel="noopener noreferrer" class="link-arrow text-sm mt-3">LinkedIn ${icon('chevronRight', 'w-4 h-4')}</a>` : ''}
          </div>`;

  const body = (compact ? founder.note.slice(0, 2) : founder.note)
    .map((para) => `<p>${para}</p>`)
    .join('');

  return `
  <section class="section section-feature">
    <div class="${SHELL} max-w-5xl">
      ${sectionHead(t(lang, 'founderEyebrow'), t(lang, 'founderTitle'), null, { align: 'start' })}
      <div class="card card-lg mt-12 grid md:grid-cols-12 gap-8 md:gap-12 items-start">
        <div class="md:col-span-3 text-center md:text-left">
          ${portrait}
          ${meta}
        </div>
        <blockquote class="md:col-span-9 space-y-4 text-slate leading-relaxed">${body}</blockquote>
      </div>
    </div>
  </section>`;
}

// One engagement model, as a card. Shared by the homepage summary and the
// dedicated pricing page so the two can never drift apart.
export function engagementCard(lang, m, { detailed = false } = {}) {
  const featured = m.featured
    ? 'border-brand-300'
    : '';
  return `
        <div class="${CARD} card-lg flex flex-col h-full ${featured}">
          ${m.featured ? `<span class="pill absolute -top-3 left-6">${t(lang, 'engagePopular')}</span>` : ''}
          <span class="icon-chip">${icon(m.icon, 'w-5 h-5')}</span>
          <h3 class="text-lg font-medium text-ink mt-5">${m.name}</h3>
          <p class="text-brand text-sm font-medium mt-1">${m.tagline}</p>
          <p class="text-slate text-sm mt-3 leading-relaxed">${m.body}</p>

          <p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-slate mt-6">${t(lang, 'engageIncludes')}</p>
          <ul class="mt-3 space-y-2 flex-1">
            ${(detailed ? m.includes : m.includes.slice(0, 3))
              .map((f) => `<li class="check-item text-[0.8125rem]">${icon('check', 'w-3.5 h-3.5')}<span>${f}</span></li>`)
              .join('')}
          </ul>

          <div class="mt-6 pt-5 border-t border-line">
            <p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-slate">${t(lang, 'engageBestFor')}</p>
            <p class="text-sm text-ink mt-1.5">${m.bestFor}</p>
          </div>
          ${detailed ? `<button data-open-booking class="${m.featured ? BTN_PRIMARY : BTN_SECONDARY} w-full mt-6">${t(lang, 'ctaBooking')}</button>` : ''}
        </div>`;
}

// Testimonials and case studies render ONLY when there is real content in
// _content/proof.js. Both arrays ship empty, so this returns an empty string
// and the page simply doesn't have the section — rather than shipping invented
// quotes to real visitors. Add entries and it appears, no markup to touch.
export function proofSection(lang) {
  if (!testimonials.length && !caseStudies.length) return '';

  const studyCards = caseStudies
    .map(
      (cs) => `
        <article class="${CARD} card-lg flex flex-col">
          <div class="flex flex-wrap items-center gap-2">
            <span class="pill">${cs.sector}</span><span class="pill pill-neutral">${cs.market}</span>
          </div>
          <h3 class="text-lg font-medium text-ink mt-5">${cs.challenge}</h3>
          <p class="text-slate text-sm mt-3 leading-relaxed flex-1">${cs.approach}</p>
          <p class="text-ink text-sm mt-3 leading-relaxed">${cs.outcome}</p>
          ${
            cs.metrics && cs.metrics.length
              ? `<div class="grid grid-cols-${Math.min(cs.metrics.length, 3)} gap-4 mt-6 pt-5 border-t border-line">
              ${cs.metrics.map((mt) => `<div><div class="text-xl font-semibold text-ink tabular">${mt.value}</div><div class="text-xs text-slate mt-1">${mt.label}</div></div>`).join('')}
            </div>`
              : ''
          }
        </article>`
    )
    .join('');

  const quoteCards = testimonials
    .map(
      (q) => `
        <figure class="${CARD} card-lg flex flex-col">
          <blockquote class="text-ink text-[1.0625rem] leading-relaxed flex-1">&ldquo;${q.quote}&rdquo;</blockquote>
          <figcaption class="flex items-center gap-3 mt-6 pt-5 border-t border-line">
            <span class="icon-chip rounded-full text-sm font-semibold">${q.initials}</span>
            <span class="text-sm">
              <span class="block font-medium text-ink">${q.name}</span>
              <span class="block text-slate">${q.role}${q.company ? `, ${q.company}` : ''}</span>
            </span>
          </figcaption>
        </figure>`
    )
    .join('');

  return `
  <section class="section bg-white">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'proofEyebrow'), t(lang, 'proofTitle'), null)}
      ${studyCards ? `<div data-reveal-group class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">${studyCards}</div>` : ''}
      ${quoteCards ? `<div data-reveal-group class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-${studyCards ? '5' : '14'}">${quoteCards}</div>` : ''}
    </div>
  </section>`;
}


// The word "Language", in each language — the mobile menu labels the switcher
// in the language the reader is already in, not in English.
