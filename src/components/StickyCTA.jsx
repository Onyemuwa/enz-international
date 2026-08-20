import { useEffect, useState } from 'react';
import Icon from './Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';

/**
 * Appears after the visitor scrolls past the hero, nudging toward booking.
 * Dismissible per session (not shown again after being closed).
 */
const StickyCTA = () => {
  const { t } = useLanguage();
  const { openBooking } = useModal();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-navy border-t border-gold/30 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <p className="text-white text-sm hidden sm:block">{t('ctaBannerTitle')}</p>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={openBooking}
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-5 py-2.5 rounded-full text-sm transition flex items-center gap-2"
          >
            <Icon name="calendar" className="w-4 h-4" /> {t('ctaBooking')}
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="text-white/50 hover:text-white p-2"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;
