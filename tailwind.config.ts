import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E53935',
          dark: '#1A1A1A',
          gray: '#6B7280',
          'light-gray': '#F7F7F7',
          border: '#E8E8E8',
          green: '#2ECC71',
          gold: '#F5A623',
        },
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
