// Design system class aliases.
//
// Tech-premium (Stripe/Linear/Ramp): white canvas, hairline borders, one blue
// accent, near-black type — plus depth: gradient dark bands, glow, an
// engineering grid texture, and hover states that lift.
//
// These constants are thin aliases over real component classes compiled into
// assets/css/site.css (source: _build/tailwind.src.css). Anything with a
// gradient, a pseudo-element, or a state lives in CSS, because none of that
// can be expressed as utility classes in markup — and because a single class
// name here restyles all 76 pages at once.
//
// Hover states animate COLOR / SHADOW / TRANSFORM only — never opacity — so a
// stalled transition can never hide content.
//
// The indirection earns its place by making the swap cheap: changing what
// `CARD` means restyles every card on the site, and grep tells you honestly
// where a component is used because the alias is a word, not a class soup.

export const CARD = 'card';
export const CARD_MUTED = 'card card-muted';
export const CARD_FEATURE = 'card-feature';
export const BTN_PRIMARY = 'btn btn-primary';
export const BTN_SECONDARY = 'btn btn-secondary';
export const EYEBROW = 'eyebrow';
export const H2 = 'h2-section';
export const LEAD = 'lead';
export const SHELL = 'shell';
