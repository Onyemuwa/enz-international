import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { portalLogin } from '../lib/api';
import { CONTACT_EMAIL } from '../lib/siteConfig';

const PortalLoginForm = ({ onSuccess }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const result = await portalLogin(email, password);
      setStatus('idle');
      onSuccess?.(result);
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-sm text-gray-500">{t('portalIntro')}</p>
      <div>
        <label htmlFor="portal-email" className="block text-sm font-medium text-navy/80">
          {t('portalEmailLabel')}
        </label>
        <input
          id="portal-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
          placeholder="client@enz.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="portal-password" className="block text-sm font-medium text-navy/80">
          {t('portalPassLabel')}
        </label>
        <input
          id="portal-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          {t('bookingErrorTitle')}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-navy hover:bg-slate-blue disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition shadow-md"
      >
        {t('portalLogin')}
      </button>
      <p className="text-xs text-gray-400 text-center">
        {t('portalAccessHelp')}{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:underline">
          {CONTACT_EMAIL}
        </a>
      </p>
    </form>
  );
};

export default PortalLoginForm;
