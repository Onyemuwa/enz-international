import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import BookingForm from '../components/BookingForm';
import FAQAccordion from '../components/FAQAccordion';
import { useLanguage } from '../i18n/LanguageContext';
import { faqs } from '../data/faqs';
import { CONTACT_PHONE, CONTACT_EMAIL, WHATSAPP_NUMBER } from '../lib/siteConfig';

const Contact = () => {
  const { t } = useLanguage();
  const handleWhatsApp = () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer');

  return (
    <>
      <SEO title={t('contactTitle')} description={t('contactSubtitle')} path="/contact" />
      <Breadcrumbs items={[{ label: t('navContact') }]} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-navy">{t('contactTitle')}</h1>
          <p className="text-gray-600 text-lg mt-4">{t('contactSubtitle')}</p>
        </div>
      </section>

      <section className="pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl">
          <div>
            <div className="bg-gray-bg rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-navy text-lg mb-4">{t('contactDetailsTitle')}</h2>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <Icon name="mapPin" className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span>{t('contactAddress')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="phone" className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="hover:text-gold transition">
                    {CONTACT_PHONE}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="mail" className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold transition">
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
              <button
                onClick={handleWhatsApp}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full text-sm font-medium transition"
              >
                <Icon name="whatsapp" className="w-4 h-4" /> {t('footerWhatsapp')}
              </button>
            </div>

            {/* TODO: replace with the real HQ address once confirmed — see SETUP.md */}
            <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 h-64">
              <iframe
                title="ENZ INTERNATIONAL — Guangzhou HQ location"
                src="https://www.google.com/maps?q=Guangzhou%2C+China&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">{t('faqTitle')}</h2>
          <FAQAccordion items={faqs} />
        </div>
      </section>
    </>
  );
};

export default Contact;
