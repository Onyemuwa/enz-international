import { useEffect, useRef, useState } from 'react';

/**
 * Fades + slides a section into view the first time it scrolls into the
 * viewport. Pure CSS transition driven by IntersectionObserver — no
 * animation library. Respects prefers-reduced-motion.
 */
const Reveal = ({ children, className = '', delay = 0, as: Tag = 'div' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    // Progressive enhancement: without observer support (or reduced-motion),
    // show content immediately rather than leaving it permanently invisible.
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    // Safety net: some environments never fire IntersectionObserver callbacks
    // at all (e.g. headless contexts without real compositing). Content must
    // never stay invisible forever because of that.
    const fallback = setTimeout(() => setVisible(true), 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
