/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'youtube-red': '#FF0000',
        'dark-bg': '#0F0F0F',
        'darker-bg': '#0A0A0A',
        'card-bg': '#1A1A1A',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'particle': 'particle 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '1' },
          '100%': { transform: 'translateY(-1000px) translateX(1000px)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}