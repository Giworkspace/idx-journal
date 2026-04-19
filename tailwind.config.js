/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'binance-yellow': '#F0B90B',
        'binance-gold': '#FFD000',
        'light-gold': '#F8D12F',
        'active-yellow': '#D0980B',
        'focus-blue': '#1EAEDB',
        'dark': '#222126',
        'dark-card': '#2B2F36',
        'ink': '#1E2026',
        'slate-text': '#848E9C',
        'steel': '#686A6C',
        'muted': '#777E90',
        'hover-dark': '#1A1A1A',
        'crypto-green': '#0ECB81',
        'crypto-red': '#F6465D',
        'border-light': '#E6E8EA',
        'border-gold': '#FFD000',
        'snow': '#F5F5F5',
        'secondary-text': '#32313A',
      },
      fontFamily: {
        'binance': ['BinancePlex', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'btn': '6px',
        'input': '8px',
        'tag': '10px',
        'card': '12px',
        'container': '24px',
        'pill': '50px',
      },
      boxShadow: {
        'subtle': 'rgba(32, 32, 37, 0.05) 0px 3px 5px 0px',
        'medium': 'rgba(8, 8, 8, 0.05) 0px 3px 5px 5px',
        'pill': 'rgb(153,153,153) 0px 2px 10px -3px',
      },
      screens: {
        'xs': '425px',
        'sm': '600px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
}
