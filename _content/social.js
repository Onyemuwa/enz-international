// Official social profiles.
//
// These feed the `sameAs` array on the Organization entity, which is how a
// search engine confirms that this website, your LinkedIn page and your
// WhatsApp Business number are the same organisation rather than three
// unrelated results. It is one of the cheapest ways to consolidate a brand's
// search presence, and it is what makes a Knowledge Panel possible.
//
// ===========================================================================
// FILL THESE IN — EMPTY ENTRIES ARE SKIPPED, WRONG ONES ARE WORSE THAN NONE
// ===========================================================================
// `sameAs` asserts ownership. Pointing it at a profile you do not control, or
// at a URL that 404s, is a bad signal — so anything blank below is simply left
// out of the schema rather than guessed at.
//
// Add the full public URL, exactly as it appears in a browser:
//
//   linkedin: 'https://www.linkedin.com/company/enz-international'
//
// Then run `node _generate-static.mjs` and redeploy. Nothing else to change.
//
// Priority for a B2B sourcing firm, highest value first:
//   1. LinkedIn company page — the single most valuable one for B2B trust
//   2. Google Business Profile — drives the map pack and local results
//   3. WhatsApp Business — you already publish the number, so link the profile
//   4. Everything else is optional
// ===========================================================================

export const socialProfiles = {
  linkedin: '',
  googleBusiness: '',
  whatsapp: '',
  facebook: '',
  instagram: '',
  x: '',
  youtube: '',
  alibaba: '',
};

/** Non-empty profile URLs, in the order above. Empty when none are set. */
export const sameAs = Object.values(socialProfiles).filter(Boolean);

/**
 * The X/Twitter handle for `twitter:site`, derived from the profile URL so
 * there is one place to change it. Returns '' when no X profile is set, and
 * the tag is then omitted entirely rather than shipped empty.
 */
export const twitterHandle = (() => {
  const m = socialProfiles.x.match(/(?:x\.com|twitter\.com)\/@?([A-Za-z0-9_]{1,15})/);
  return m ? `@${m[1]}` : '';
})();

export default socialProfiles;
