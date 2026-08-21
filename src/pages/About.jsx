import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import Reveal from '../components/Reveal';
import { useLanguage } from '../i18n/LanguageContext';
import { team } from '../data/team';

const methodology = [
  { step: '01', title: 'Understand', desc: 'We start with your product, volume, and target market — not a generic pitch.', icon: 'mail' },
  { step: '02', title: 'Vet', desc: 'Every supplier or site is checked against our own diligence criteria before we recommend it.', icon: 'shield' },
  { step: '03', title: 'Execute', desc: 'A single point of contact manages sourcing, logistics, or construction through to delivery.', icon: 'briefcase' },
  { step: '04', title: 'Support', desc: 'Post-delivery support and ongoing sourcing relationships, not one-off transactions.', icon: 'award' },
];

const capabilities = [
  { title: 'Supplier Sourcing & Vetting', desc: 'Shortlisting, factory audits, and price benchmarking across Guangdong, Zhejiang, and Fujian manufacturing clusters.', icon: 'globe' },
  { title: 'Quality Control', desc: 'Staged inspection — incoming materials, in-process, and pre-shipment — so defects are caught before they ship.', icon: 'check' },
  { title: 'Factory Setup', desc: 'Site selection, machinery sourcing, assembly-line planning, and commissioning support from feasibility to first run.', icon: 'calendar' },
  { title: 'Freight & Customs', desc: 'Consolidated freight forwarding and customs documentation, door-to-port.', icon: 'mapPin' },
  { title: 'Commodity Trading', desc: 'Procurement of copper, cobalt, and select agricultural commodities with clear contract terms.', icon: 'trendingUp' },
  { title: 'Market Entry Support', desc: 'Competitor landscape briefings and introductions to vetted local partners.', icon: 'user' },
];

const engagementSteps = [
  { title: 'Book a Consultation', desc: 'A 30-minute call to understand your product, volume, timeline, and budget — no cost, no obligation.' },
  { title: 'Scoped Proposal', desc: 'You get a written scope: what we’ll do, what it costs, and how long it takes, before anything is signed.' },
  { title: 'Execution & Updates', desc: 'Your single point of contact runs the project and sends regular, plain-language status updates.' },
  { title: 'Delivery & Beyond', desc: 'Goods delivered or factory commissioned — with an open line for the next order or the next phase.' },
];

const About = () => {
  const { language, t } = useLanguage();

  return (
    <>
      <SEO title={t('navAbout')} description={t('aboutDesc')} path="/about" />
      <Breadcrumbs items={[{ label: t('navAbout') }]} />

      {/* ===== INTRO ===== */}
      <section className="relative bg-gradient-to-br from-navy via-slate-blue to-navy text-white py-20 overflow-hidden">
        <div aria-hidden="true" className="absolute -top-20 -right-20 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative">
          <h1 className="text-3xl md:text-5xl font-bold">{t('aboutTitle')}</h1>
          <p className="text-white/80 text-lg mt-6 leading-relaxed">{t('aboutDesc')}</p>
          <p className="text-white/70 text-lg mt-4 leading-relaxed">
            We work as an extension of your team on the ground in China and East Africa — vetting suppliers,
            managing quality control, and coordinating the logistics that turn a purchase order or a factory
            blueprint into a delivered, working result. One point of contact owns your project from first call
            to final delivery, so nothing gets lost between departments or vendors.
          </p>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy">What We Handle End-to-End</h2>
            <p className="text-gray-600 mt-3">Six capabilities that cover the full path from a first product brief to a shipped, working result.</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
            {capabilities.map((c, idx) => (
              <Reveal key={c.title} delay={idx * 60} className="bg-gray-bg rounded-2xl p-6 border border-gray-200 hover:border-gold/40 hover:shadow-md transition">
                <Icon name={c.icon} className="w-8 h-8 text-gold mb-3" />
                <h3 className="font-bold text-navy">{c.title}</h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{c.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== METHODOLOGY ===== */}
      <section className="py-16 bg-gray-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="text-2xl md:text-3xl font-bold text-navy text-center">
            Our Methodology
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10 max-w-5xl mx-auto">
            {methodology.map((m, idx) => (
              <Reveal key={m.step} delay={idx * 70} className="bg-white rounded-2xl p-6 border border-gray-200 relative">
                <Icon name={m.icon} className="w-6 h-6 text-gold mb-3" />
                <span className="absolute top-6 right-6 text-gray-200 font-bold text-3xl">{m.step}</span>
                <h3 className="text-lg font-bold text-navy mt-2">{m.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{m.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ENGAGEMENT TIMELINE ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy">What Working With Us Looks Like</h2>
            <p className="text-gray-600 mt-3">From the first call to ongoing delivery — what to expect at each stage.</p>
          </Reveal>
          <ol className="mt-12 max-w-3xl mx-auto space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
            {engagementSteps.map((step, idx) => (
              <Reveal key={step.title} delay={idx * 90} as="li" className="relative pl-16">
                <span className="absolute left-0 top-0 w-10 h-10 rounded-full bg-navy text-gold font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-navy">{step.title}</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </ol>
          <div className="text-center mt-10">
            <Link
              to={`/${language}/markets`}
              className="inline-flex items-center gap-2 text-navy font-medium border border-navy/20 rounded-full px-6 py-3 hover:bg-gray-bg transition"
            >
              See where we operate <Icon name="chevronRight" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section className="py-16 bg-gray-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">Meet the Team</h2>
          {team.length === 0 ? (
            <div className="max-w-lg mx-auto mt-8 text-center bg-white border border-dashed border-gray-300 rounded-2xl p-8">
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
