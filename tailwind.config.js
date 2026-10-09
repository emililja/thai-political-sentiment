/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        thai: {
          offwhite: '#F8F9FA',
          card: '#FFFFFF',
          border: '#E2E8F0',
          blue: '#1D4ED8',
          royal: '#1E40AF',
          navy: '#0F172A',
          red: '#DC2626',
          crimson: '#B91C1C',
          amber: '#D97706',
          cyan: '#0284C7',
          purple: '#7C3AED',
          emerald: '#059669',
          gold: '#D97706',
          rose: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
