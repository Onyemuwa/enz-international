import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../i18n/LanguageContext';
import { CONTACT_EMAIL } from '../lib/siteConfig';

/**
 * Generic legal-page template shared by Privacy and Terms.
 * TODO(legal): This copy is a structural placeholder, not legal advice.
 * Have it reviewed by counsel — especially the GDPR/data-processing sections —
 * before this site goes live. See SETUP.md "Legal & compliance".
 */
const Legal = ({ type }) => {
  const { t } = useLanguage();
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t('footerPrivacy') : t('footerTerms');

  return (
    <>
      <SEO title={title} path={isPrivacy ? '/privacy' : '/terms'} noindex />
      <Breadcrumbs items={[{ label: title }]} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-navy">
          <h1 className="text-3xl font-bold text-navy mb-2">{title}</h1>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-8">
            Placeholder text — not reviewed by counsel. Replace before launch.
          </p>

          {isPrivacy ? (
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                ENZ INTERNATIONAL (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects information you provide directly
                — such as your name, email, and project details submitted through our consultation and
                newsletter forms — in order to respond to your enquiry and, where you&rsquo;ve opted in, send
                occasional updates.
              </p>
              <h2 className="text-xl font-bold text-navy">What we collect</h2>
              <p>
                Contact-form and booking submissions (name, email, phone, company, message), newsletter
                sign-up emails, and — once analytics tooling is connected — standard usage data such as pages
                visited and approximate location derived from IP address.
              </p>
              <h2 className="text-xl font-bold text-navy">How we use it</h2>
              <p>
                To respond to consultation requests, operate the client portal, send newsletter updates
                you&rsquo;ve subscribed to, and improve this website. We do not sell personal data to third
                parties.
              </p>
              <h2 className="text-xl font-bold text-navy">Your rights</h2>
              <p>
                Depending on your location, you may have the right to access, correct, or delete your data, or
                to withdraw consent for marketing emails at any time via the unsubscribe link.
              </p>
              <h2 className="text-xl font-bold text-navy">Contact</h2>
              <p>
                Questions about this policy can be sent to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                These terms govern your use of the ENZ INTERNATIONAL website. By using this site, you agree to
                use it only for lawful purposes and not to misrepresent your identity when submitting forms.
              </p>
              <h2 className="text-xl font-bold text-navy">No binding offer</h2>
              <p>
                Content on this site, including service descriptions, is informational and does not constitute
                a binding offer. Consulting engagements, sourcing agreements, and pricing are governed by
                separately signed contracts.
              </p>
              <h2 className="text-xl font-bold text-navy">Intellectual property</h2>
              <p>
                Site content, logos, and branding are the property of ENZ INTERNATIONAL and may not be
                reproduced without permission.
              </p>
              <h2 className="text-xl font-bold text-navy">Limitation of liability</h2>
              <p>
                ENZ INTERNATIONAL is not liable for indirect or consequential losses arising from use of this
                website, to the extent permitted by applicable law.
              </p>
              <h2 className="text-xl font-bold text-navy">Contact</h2>
              <p>
                Questions about these terms can be sent to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Legal;
