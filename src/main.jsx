import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { watchConsentForAnalytics } from './lib/analytics';
import { watchConsentForMonitoring } from './lib/monitoring';
import './index.css';

// Both no-op until the visitor accepts cookies via the CookieConsent banner
// AND the relevant env var is set — safe to always call.
watchConsentForAnalytics();
watchConsentForMonitoring();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
