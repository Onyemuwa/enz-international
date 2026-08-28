/** Tailwind config for the compiled stylesheet.
 *
 *  The live site loads ONE plain file — assets/css/site.css — which is
 *  committed to the repo. This config exists only so that file can be
 *  regenerated (`npm run css` in _build/) after a markup change. Deploying
 *  still needs no build step of any kind.
 */
module.exports = {
  content: [
    '../en/**/*.html',
    '../sw/**/*.html',
    '../fr/**/*.html',
    '../zh/**/*.html',
    '../*.html',
    '../assets/js/**/*.js',
  ],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' } },
    extend: {
      colors: {
        /* Surfaces ------------------------------------------------------- */
        ink: '#1E2E40',
        navy: '#0B1A24',
        'navy-deep': '#060D13',
        slate: '#5A6A75',
        'slate-light': '#8A97A1',
        line: '#E4E9ED',
        'line-strong': '#D3DBE1',
        'gray-bg': '#F7F9FB',

        /* Brand scale, derived from the logo's own hue (199deg), sampled from
           assets/images/enz-logo.png: blue #2AA8E4, orange #FCAE42.
           The logo blue is only 2.7:1 on white — it FAILS WCAG AA, so it can
           never be body text or a button fill on a light background. `brand`
           (=600) is the darkened same-hue variant at 6.2:1 used for anything
           interactive on light; `brand-bright` (=400) is the exact logo colour,
           reserved for dark backgrounds and decorative fills. Same family,
           different jobs. */
        brand: {
          DEFAULT: '#0171BA',
          50: '#EAF6FD',
          100: '#D2EBFA',
          200: '#A9D8F4',
          300: '#6FC1EC',
          400: '#2AA8E4',
          500: '#0E8AD8',
          600: '#0171BA',
          700: '#015C96',
          800: '#0B4560',
          900: '#08303F',
          dark: '#015C96',
          bright: '#2AA8E4',
          tint: '#EAF6FD',
        },
        accent: { DEFAULT: '#FCAE42', 400: '#FCAE42', 500: '#F0980F', 600: '#C97A08', tint: '#FFF4E3' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: { '8xl': '88rem' },
      boxShadow: {
        xs: '0 1px 2px rgba(11,18,32,.05)',
        card: '0 1px 2px rgba(11,18,32,.04), 0 1px 3px rgba(11,18,32,.03)',
        lift: '0 1px 2px rgba(11,18,32,.05), 0 12px 32px -8px rgba(11,18,32,.14)',
        glow: '0 8px 28px -8px rgba(18,104,143,.55)',
      },
      transitionTimingFunction: { spring: 'cubic-bezier(.16,1,.3,1)' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.45', transform: 'scale(.8)' } },
      },
      animation: { marquee: 'marquee 42s linear infinite', pulseDot: 'pulseDot 2.4s ease-in-out infinite' },
    },
  },
  /* Classes that only ever appear inside assets/js/site.js string literals are
     scanned from that file too (see `content` above), so no safelist is needed
     for them. This safelist covers colours built at runtime only. */
  safelist: [],
  plugins: [],
};
