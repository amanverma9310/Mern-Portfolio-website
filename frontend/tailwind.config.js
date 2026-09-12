/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        bg: '#07080a',
        panel: '#0e1013',
        line: 'rgba(255,255,255,0.08)',
        accent: {
          pink: '#ff3d68',
          orange: '#ff8a3d',
          blue: '#3d7bff',
          purple: '#8b5cf6',
        },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        blink: 'blink 1s steps(2, start) infinite',
        'spin-slow': 'spin 40s linear infinite',
        'spin-slower': 'spin 70s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
