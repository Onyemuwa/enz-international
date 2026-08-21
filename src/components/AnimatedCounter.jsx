import { useEffect, useRef, useState } from 'react';

/**
 * Counts up from 0 to `value` once the element scrolls into view.
 * `value` is the numeric part; `suffix` (e.g. "+", "%") is appended untouched.
 */
const AnimatedCounter = ({ value, suffix = '', duration = 1400, className = '' }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Progressive enhancement: without observer support (or reduced-motion,
    // or the ref not being attached yet), show the final value immediately
    // rather than leaving the counter stuck at 0.
    if (!el || reduceMotion || typeof IntersectionObserver === 'undefined') {
      setDisplay(value);
      return;
    }

    const runCountUp = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runCountUp();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);

    // Safety net: some environments never fire IntersectionObserver (or even
    // requestAnimationFrame) callbacks at all. Skip straight to the final
    // value rather than depending on either — the number must never stay
    // stuck at 0 because of that, even if it means losing the count-up.
    const fallback = setTimeout(() => {
      started.current = true;
      setDisplay(value);
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
