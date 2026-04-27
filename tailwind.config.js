/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2969CD', dark: '#1E4FA0', light: '#E8EFFB', tint: '#F4F8FE' },
        accent:  { DEFAULT: '#0F6E56', dark: '#0A5642', light: '#E0F2EC' },
        warning: { DEFAULT: '#BA7517', light: '#FEF7E6' },
        urgent:  { DEFAULT: '#A32D2D', light: '#FCEEEE' },
        ink:     { DEFAULT: '#0E1A2B', 2: '#3A4A60', 3: '#5E6F84', 4: '#8A98AB' },
        line:    { DEFAULT: '#D7DDE5', 2: '#EAEEF3' },
        bg:      '#F7F9FB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
