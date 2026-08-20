import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { team } from '../data/team';

const methodology = [
  { step: '01', title: 'Understand', desc: 'We start with your product, volume, and target market — not a generic pitch.' },
  { step: '02', title: 'Vet', desc: 'Every supplier or site is checked against our own diligence criteria before we recommend it.' },
  { step: '03', title: 'Execute', desc: 'A single point of contact manages sourcing, logistics, or construction through to delivery.' },
  { step: '04', title: 'Support', desc: 'Post-delivery support and ongoing sourcing relationships, not one-off transactions.' },
];

const About = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('navAbout')}
        description={t('aboutDesc')}
        path="/about"
      />
      <Breadcrumbs items={[{ label: t('navAbout') }]} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold text-navy">{t('aboutTitle')}</h1>
          <p className="text-gray-600 text-lg mt-6 leading-relaxed">{t('aboutDesc')}</p>
          <p className="text-gray-600 text-lg mt-4 leading-relaxed">
            We work as an extension of your team on the ground in China and East Africa — vetting suppliers,
            managing quality control, and coordinating the logistics that turn a purchase order or a factory
            blueprint into a delivered, working result.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">Our Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10 max-w-5xl mx-auto">
            {methodology.map((m) => (
              <div key={m.step} className="bg-white rounded-2xl p-6 border border-gray-200">
                <span className="text-gold font-bold text-sm">{m.step}</span>
                <h3 className="text-lg font-bold text-navy mt-2">{m.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">Meet the Team</h2>
          {team.length === 0 ? (
            <div className="max-w-lg mx-auto mt-8 text-center bg-gray-bg border border-dashed border-gray-300 rounded-2xl p-8">
              <Icon name="user" className="w-8 h-8 text-gold mx-auto mb-3" />
              <p className="text-gray-600 text-sm">
                Team profiles are coming soon. Reach out via the contact page if you&rsquo;d like to speak with a
                member of our team directly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <img
                    src={member.photo}
                    alt={member.name}
                    width="160"
                    height="160"
                    loading="lazy"
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                  <h3 className="font-bold text-navy mt-4">{member.name}</h3>
                  <p className="text-gold text-sm">{member.role}</p>
                  <p className="text-gray-600 text-sm mt-2">{member.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default About;
