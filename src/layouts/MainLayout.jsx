import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import StickyCTA from '../components/StickyCTA';
import CookieConsent from '../components/CookieConsent';
import BookingModal from '../components/BookingModal';
import PortalModal from '../components/PortalModal';
import { useLanguage } from '../i18n/LanguageContext';

const MainLayout = () => {
  const { t } = useLanguage();
  return (
    <div className="font-inter antialiased bg-gray-bg min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        {t('skipToContent')}
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyCTA />
      <CookieConsent />
      <BookingModal />
      <PortalModal />
    </div>
  );
};

export default MainLayout;
