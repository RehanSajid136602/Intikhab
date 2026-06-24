import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#FBF7F0',
          surface: '#FFFDF8',
          elevated: '#FFFFFF',
          dark: '#1D1A17',
          charcoal: '#1D1A17',
          gray: '#746C62',
          muted: '#EDE4D8',
          sand: '#D8C5AA',
          'light-gray': '#F6EFE5',
          border: '#E4D8C8',
          red: '#B42318',
          cta: '#B42318',
          'cta-hover': '#8F1C13',
          green: '#177A4A',
          warning: '#B7791F',
          error: '#B42318',
          sale: '#B42318',
          gold: '#C69238',
        },
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(29, 26, 23, 0.06), 0 8px 24px rgba(29, 26, 23, 0.04)',
        drawer: '0 18px 60px rgba(29, 26, 23, 0.22)',
        sticky: '0 10px 30px rgba(29, 26, 23, 0.08)',
      },
      borderRadius: {
        control: '0.375rem',
        card: '0.5rem',
        drawer: '0.75rem',
        image: '0.5rem',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        blink: 'blink 1s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
