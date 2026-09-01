// Article authorship.
//
// ===========================================================================
// CONFIRM THIS BEFORE LAUNCH — IT IS A CLAIM ABOUT WHO WROTE SOMETHING
// ===========================================================================
// Search engines weight author identity heavily on advisory content (Google
// calls it E-E-A-T), and an article credited to a named, checkable person
// outranks the same article credited to a faceless brand. That is the reason
// this exists.
//
// But authorship is a factual claim. Crediting an article to a person who did
// not write it is not an SEO tactic, it is a false byline — and on a sourcing
// firm's site, where the entire product is being someone a buyer can trust,
// that is the worst possible place to be caught out.
//
// So `byline` below is the switch, and it ships set to the organisation,
// which is what the site already claimed and is true by default:
//
//   'organization'  every article is credited to ENZ INTERNATIONAL.
//                   Person schema and the bio box are not rendered.
//
//   'founder'       every article is credited to the founder named in
//                   _content/founder.js, with a Person entity and a visible
//                   bio box. Switch to this ONLY if the founder is genuinely
//                   the author or editorial owner of these articles.
//
// If different articles have different authors, add an `author` key to the
// individual entries in _content/insights.js and extend authorFor() below.
// ===========================================================================

import { founder } from './founder.js';

export const byline = 'organization';

/** Everything the site knows about the organisation as an author. */
export const ORGANIZATION_AUTHOR = {
  kind: 'organization',
  name: 'ENZ INTERNATIONAL',
};

/**
 * The author for a given post. Takes the post so per-article authors can be
 * added later without touching the page builder.
 */
export function authorFor(/* post */) {
  if (byline === 'founder' && founder.name) {
    return {
      kind: 'person',
      name: founder.name,
      role: founder.role,
      initials: founder.initials,
      photo: founder.photo,
      photoAlt: founder.photoAlt,
      location: founder.location,
      linkedin: founder.linkedin,
      // Reuses the founder note already published on the About page. Nothing
      // here is a new claim — no dates, no qualifications, no track record.
      bio: founder.note,
      // Topics the site actually covers, used for the Person `knowsAbout`
      // field. Every one of these has a page behind it.
      knowsAbout: [
        'China sourcing',
        'Supplier verification',
        'Quality control inspection',
        'Factory setup',
        'Freight forwarding and Incoterms',
      ],
    };
  }
  return ORGANIZATION_AUTHOR;
}

export default authorFor;
