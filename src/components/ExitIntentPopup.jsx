import { useEffect, useState } from 'react';
import Icon from './Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';

const SESSION_KEY = 'enz_exit_intent_shown';

/**
 * Desktop-only exit-intent nudge: fires once per browser tab session when the
 * cursor leaves toward the top of the viewport (the classic "closing the tab"
 * gesture). No mobile equivalent exists (no cursor to leave from), so this is
 * a no-op on touch devices — it simply never fires there.
 */
const ExitIntentPopup = () => {
  const { t } = useLanguage();
  const { openModal, openBooking } = useModal();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const handleMouseOut = (e) => {
      const leavingViewportTop = e.clientY <= 0 && !e.relatedTarget;
      if (!leavingViewportTop) return;
      if (openModal) return; // don't stack on top of an already-open modal

      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, '1');
      document.removeEventListener('mouseout', handleMouseOut);
    };

    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
    // Deliberately runs once per mount; `openModal` is read fresh inside the
    // handler via closure being recreated whenever it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  if (!visible) return null;

  return (
    // Backdrop click-to-dismiss is a mouse-only convenience; the visible close
    // button already gives keyboard/AT users an equivalent (same pattern as Modal.jsx).
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions
    <div
      role="dialog"
      aria-label={t('ctaBannerTitle')}
      className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setVisible(false)}
    >
      {/* stopPropagation keeps a click inside the card from dismissing it */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions */}
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-8 text-center relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <Icon name="close" className="w-5 h-5" />
        </button>
        <Icon name="calendar" className="w-10 h-10 text-gold mx-auto mb-4" />
        <h2 className="text-xl font-bold text-navy">{t('ctaBannerTitle')}</h2>
        <p className="text-sm text-gray-600 mt-2">{t('ctaBannerDesc')}</p>
        <button
          onClick={() => {
            setVisible(false);
            openBooking();
          }}
          className="mt-6 w-full bg-gold hover:bg-gold-light text-navy font-semibold py-3 rounded-full transition"
        >
          {t('ctaBooking')}
        </button>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
