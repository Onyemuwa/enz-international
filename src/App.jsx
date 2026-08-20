import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import PageLoader from './components/PageLoader';
import { LanguageProvider } from './i18n/LanguageContext';
import { ModalProvider } from './context/ModalContext';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './i18n/translations';

// Route-level code splitting — each page ships as its own chunk.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Insights = lazy(() => import('./pages/Insights'));
const InsightPost = lazy(() => import('./pages/InsightPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Markets = lazy(() => import('./pages/Markets'));
const MarketLanding = lazy(() => import('./pages/MarketLanding'));
const ClientPortal = lazy(() => import('./pages/ClientPortal'));
const Careers = lazy(() => import('./pages/Careers'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Redirects unsupported/missing :lang segments to the default language. */
const LangGuard = ({ children }) => {
  const { lang } = useParams();
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return <Navigate to={`/${DEFAULT_LANGUAGE}`} replace />;
  }
  return children;
};

const App = () => (
  <HelmetProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ModalProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
            <Route
              path="/:lang"
              element={
                <LangGuard>
                  <LanguageProvider>
                    <MainLayout />
                  </LanguageProvider>
                </LangGuard>
              }
            >
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="insights" element={<Insights />} />
              <Route path="insights/:slug" element={<InsightPost />} />
              <Route path="contact" element={<Contact />} />
              <Route path="markets" element={<Markets />} />
              <Route path="markets/:marketSlug" element={<MarketLanding />} />
              <Route path="portal" element={<ClientPortal />} />
              <Route path="careers" element={<Careers />} />
              <Route path="privacy" element={<Legal type="privacy" />} />
              <Route path="terms" element={<Legal type="terms" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="*" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
          </Routes>
        </Suspense>
      </ModalProvider>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
