// Social proof: testimonials and case studies.
//
// ---------------------------------------------------------------------------
// BOTH ARRAYS SHIP EMPTY ON PURPOSE.
// ---------------------------------------------------------------------------
// A live business site that shows invented client quotes or invented project
// results is lying to real visitors, and the people most likely to notice are
// the buyers you actually want. So the sections are fully built and styled,
// but they render NOTHING until there is something true to put in them.
//
// To turn them on: add real entries below and re-run `node _generate-static.mjs`.
// The homepage and about page pick them up automatically — no markup to touch.
//
// Get permission in writing before publishing a client's name or logo. If a
// client will vouch but not be named, `company` and `name` can be generalised
// ("Operations lead, agricultural importer — Tanzania") and it still works.
// ---------------------------------------------------------------------------

/**
 * @type {Array<{
 *   quote: string,        // Their words. Don't polish them into marketing copy.
 *   name: string,         // "Amina Hassan" — or a role, if they prefer.
 *   role: string,         // "Head of Procurement"
 *   company: string,      // "Company Ltd" — or "agricultural importer, Tanzania"
 *   initials: string,     // 2 letters for the avatar chip, e.g. "AH"
 * }>}
 */
export const testimonials = [];

/**
 * @type {Array<{
 *   sector: string,       // "Agricultural machinery"
 *   market: string,       // "Tanzania"
 *   challenge: string,    // One sentence: what they came to you with.
 *   approach: string,     // One sentence: what you actually did.
 *   outcome: string,      // One sentence: the result, in plain language.
 *   metrics: Array<{ value: string, label: string }>, // 2-3 max. Only real figures.
 * }>}
 */
export const caseStudies = [];

// ---------------------------------------------------------------------------
// Service commitments — the honest substitute for testimonials.
//
// Unlike a quote, every line here is a promise the business makes and can be
// held to, and each one is already stated elsewhere on the site (the booking
// modal's "what happens next", the QC page, the process page). Restating them
// as commitments is not a new claim — it is the same claim, made checkable.
// ---------------------------------------------------------------------------
export const commitments = [
  {
    icon: 'clock',
    title: 'A reply within one business day',
    body: 'Every enquiry is read by a person and answered within one working day, not routed into an automated drip sequence.',
  },
  {
    icon: 'mail',
    title: 'One named point of contact',
    body: 'The same person owns your project from the first call to final delivery. No handoffs between departments, no re-explaining your brief.',
  },
  {
    icon: 'shield',
    title: 'A written scope before anything is signed',
    body: 'What we will do, what it costs and how long it takes, in writing, before you commit to anything.',
  },
  {
    icon: 'check',
    title: 'Inspection reports you can actually read',
    body: 'Photographed findings against your specification at each inspection point, in plain language, not a pass/fail stamp.',
  },
];

export default { testimonials, caseStudies, commitments };
