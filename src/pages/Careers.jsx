import { useState } from 'react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { submitCvApplication } from '../lib/api';

const Careers = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('cv', file);
      await submitCvApplication(fd);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <SEO title={t('navCareers')} description={t('careersSubtitle')} path="/careers" />
      <Breadcrumbs items={[{ label: t('navCareers') }]} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-navy">{t('careersTitle')}</h1>
          <p className="text-gray-600 text-lg mt-4">{t('careersSubtitle')}</p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl">
          <div className="bg-gray-bg rounded-2xl border border-dashed border-gray-300 p-6 text-center mb-8">
            <Icon name="briefcase" className="w-8 h-8 text-gold mx-auto mb-2" />
            <p className="text-sm text-gray-600">{t('careersNoOpenings')}</p>
          </div>

          {status === 'success' ? (
            <p className="text-center text-navy font-medium" role="status">
              {t('bookingSuccessTitle')}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-navy">{t('careersSendCv')}</h2>
              <div>
                <label htmlFor="careers-name" className="block text-sm font-medium text-navy/80">
                  {t('bookingName')}
                </label>
                <input
                  id="careers-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label htmlFor="careers-email" className="block text-sm font-medium text-navy/80">
                  {t('bookingEmail')}
                </label>
                <input
                  id="careers-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label htmlFor="careers-message" className="block text-sm font-medium text-navy/80">
                  {t('bookingMessage')}
                </label>
                <textarea
                  id="careers-message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label htmlFor="careers-cv" className="block text-sm font-medium text-navy/80 mb-1">
                  CV / Resume (PDF)
                </label>
                <label
                  htmlFor="careers-cv"
                  className="flex items-center gap-2 justify-center border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 text-sm text-gray-500 cursor-pointer hover:border-gold transition"
                >
                  <Icon name="upload" className="w-5 h-5" />
                  {file ? file.name : 'Choose a file'}
                </label>
                <input
                  id="careers-cv"
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gold hover:bg-gold-light disabled:opacity-60 text-navy font-semibold py-4 rounded-xl transition shadow-md"
              >
                {status === 'submitting' ? t('bookingSubmitting') : t('ctaSubmit')}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default Careers;
