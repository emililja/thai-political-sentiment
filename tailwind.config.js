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
          navy: '#0A192F',
          dark: '#0d131f',
          card: '#162238',
          border: '#243452',
          red: '#E02424',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
          emerald: '#10B981',
          gold: '#FBBF24',
          rose: '#F43F5E'
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
