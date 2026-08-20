import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { submitBooking } from '../lib/api';

const initialState = { name: '', email: '', phone: '', company: '', date: '', service: '', message: '' };

const BookingForm = ({ onSuccess }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleChange = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitBooking(formData);
      setStatus('success');
      onSuccess?.(formData);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-6" role="status">
        <div className="text-4xl mb-4" aria-hidden="true">✅</div>
        <p className="text-lg font-semibold text-navy">{t('bookingSuccessTitle')}</p>
        <p className="text-sm text-gray-600 mt-2">
          {t('bookingSuccessDesc', { name: formData.name, email: formData.email })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-sm text-gray-500">{t('bookingIntro')}</p>

      <div>
        <label htmlFor="booking-name" className="block text-sm font-medium text-navy/80">
          {t('bookingName')}
        </label>
        <input
          id="booking-name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange('name')}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
          placeholder="John Doe"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="booking-email" className="block text-sm font-medium text-navy/80">
          {t('bookingEmail')}
        </label>
        <input
          id="booking-email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange('email')}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
          placeholder="john@example.com"
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="booking-phone" className="block text-sm font-medium text-navy/80">
            {t('bookingPhone')}
          </label>
          <input
            id="booking-phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="booking-company" className="block text-sm font-medium text-navy/80">
            {t('bookingCompany')}
          </label>
          <input
            id="booking-company"
            type="text"
            value={formData.company}
            onChange={handleChange('company')}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
            autoComplete="organization"
          />
        </div>
      </div>

      <div>
        <label htmlFor="booking-date" className="block text-sm font-medium text-navy/80">
          {t('bookingDate')}
        </label>
        <input
          id="booking-date"
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          value={formData.date}
          onChange={handleChange('date')}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>

      <div>
        <label htmlFor="booking-service" className="block text-sm font-medium text-navy/80">
          {t('bookingService')}
        </label>
        <select
          id="booking-service"
          value={formData.service}
          onChange={handleChange('service')}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <option value="">—</option>
          <option value="sourcing">{t('bookingServiceOptSourcing')}</option>
          <option value="factory">{t('bookingServiceOptFactory')}</option>
          <option value="market">{t('bookingServiceOptMarket')}</option>
          <option value="other">{t('bookingServiceOptOther')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="booking-message" className="block text-sm font-medium text-navy/80">
          {t('bookingMessage')}
        </label>
        <textarea
          id="booking-message"
          rows={3}
          value={formData.message}
          onChange={handleChange('message')}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          {t('bookingErrorTitle')} — {t('bookingErrorDesc')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-gold hover:bg-gold-light disabled:opacity-60 text-navy font-semibold py-4 rounded-xl transition shadow-md"
      >
        {status === 'submitting' ? t('bookingSubmitting') : t('bookingSubmit')}
      </button>
      <p className="text-xs text-gray-400 text-center">{t('bookingDisclaimer')}</p>
    </form>
  );
};

export default BookingForm;
