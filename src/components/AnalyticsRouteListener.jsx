import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '../lib/analytics';

/** Fires a GA4 virtual pageview on every client-side route change. Renders nothing. */
const AnalyticsRouteListener = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsRouteListener;
