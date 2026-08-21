import { useState } from 'react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import PortalLoginForm from '../components/PortalLoginForm';
import { useLanguage } from '../i18n/LanguageContext';

const mockMilestones = [
  { label: 'Supplier shortlist confirmed', done: true },
  { label: 'Samples approved', done: true },
  { label: 'Production in progress', done: false },
  { label: 'Pre-shipment inspection', done: false },
  { label: 'Shipped', done: false },
];

const ClientPortal = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);

  return (
    <>
      <SEO title={t('navPortal')} description={t('portalIntro')} path="/portal" noindex />
      <Breadcrumbs items={[{ label: t('navPortal') }]} />

      <section className="py-16 bg-white min-h-[60vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          {!user ? (
            <div className="bg-gray-bg rounded-2xl border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-navy mb-2">{t('portalTitle')}</h1>
              <PortalLoginForm onSuccess={(result) => setUser(result.user)} />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-navy">Welcome back, {user.name}</h1>
                <button
                  onClick={() => setUser(null)}
                  className="text-sm font-medium text-navy border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50 transition"
                >
                  {t('portalLogout')}
                </button>
              </div>

              <div className="bg-gray-bg rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-navy mb-4">Project Milestones — Sample Order #ENZ-0142</h2>
                <ul className="space-y-3">
                  {mockMilestones.map((m) => (
                    <li key={m.label} className="flex items-center gap-3 text-sm">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          m.done ? 'bg-gold text-navy' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {m.done && <Icon name="check" className="w-3 h-3" />}
                      </span>
                      <span className={m.done ? 'text-navy' : 'text-gray-500'}>{m.label}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-6">Sample project shown for illustration.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ClientPortal;
