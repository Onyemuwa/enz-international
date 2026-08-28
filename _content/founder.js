// Founder / leadership.
//
// ===========================================================================
// READ THIS BEFORE THE SITE GOES LIVE
// ===========================================================================
// Everything below except `name` is a DRAFT written from claims the site
// already makes about the business. None of it is biography, because there was
// no biographical information anywhere in this repo to work from — no bio, no
// dates, no track record, no photograph.
//
// So this section says how the business operates, in the founder's voice. It
// invents no history, no qualifications, no numbers. That is deliberate: a
// fabricated founder story is the fastest way to lose a buyer who checks, and
// on a sourcing firm's site the whole product is being someone you can trust.
//
// Before launch, either:
//   * rewrite `note` in your own words and confirm `name` / `role`, or
//   * set `name` to an empty string, which removes the section entirely.
//
// THE PORTRAIT IS AN INITIALS MONOGRAM ON PURPOSE
// Every other image on this site is stock, and that is fine — a stock photo of
// a container terminal still shows a container terminal. A stock photo of a
// person placed beside a real founder's name shows a stranger and says it is
// them. That is a different thing, and not something to ship. Set `photo` to a
// real portrait filename in assets/images/ and it replaces the monogram.
// ===========================================================================

export const founder = {
  // Surname still needed — only the first name was given, so the monogram
  // is a single letter. Add the surname here and update `initials` to match.
  name: 'Erick',
  role: 'Founder',
  initials: 'E',

  // '' renders the initials monogram. Point it at a file in assets/images/
  // once a real portrait exists, e.g. 'founder.webp' (800×800, square).
  photo: '',
  photoAlt: '',

  // Where the founder is based. Both are already stated across the site.
  location: 'Guangzhou, China',

  // DRAFT — see the header. Restates the site's existing commitments in the
  // first person. Contains no claim that is not made elsewhere on this site.
  note: [
    'Most buyers who come to us have already been burned once. A supplier that turned out to be a trading company, an order that passed its only inspection and still arrived wrong, or a quote that looked cheap until the freight and duties landed.',
    'None of that is bad luck. It happens because nobody on the buyer’s side is standing in the factory. So that is the job I built this business to do: verify who you are actually buying from, inspect the work while it can still be corrected, and stay the single point of contact until the goods are delivered.',
    'If a project is not a fit for us, we say so on the first call rather than quote for it. That costs us some work and saves everyone the expensive version of finding out later.',
  ],

  // Optional. Leave '' to hide. A real LinkedIn profile is one of the cheapest
  // trust signals available on a page like this, because it is checkable.
  linkedin: '',
};

export default founder;
