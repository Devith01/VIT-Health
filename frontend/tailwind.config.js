/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slush Color Tokens
        carbon: '#000000',
        'paper-white': '#ffffff',
        'sky-wash': '#dceeff',
        'concrete-gray': '#cccccc',
        'soft-mist': '#e9e9e9',
        'electric-blue': '#4da2ff',
        'mint-pop': '#55db9c',
        lavender: '#e9ccff',
        ember: '#fb4903',
        sunburst: '#ffd731',
        'voltage-violet': '#5c4ade',
        
        // Ventriloc & App Tokens
        graphite: '#202020',
        ash: '#efefef',
        fog: '#f5f5f5',
        ivory: '#ebe6dd',
        steel: '#4d4d4d',
        'slate-muted': '#828282',
        mist: '#e8e8e8',
        'ember-orange': '#ff682c',
        brass: '#816729',
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          900: '#0c4a6e',
        },
        emergency: {
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        lateral: ['Lateral', 'Druk', 'Bowlby One', 'sans-serif'],
        aeonik: ['Aeonik Pro', 'Inter', 'Satoshi', 'sans-serif'],
        polysans: ['PolySans', 'Space Grotesk', 'Inter Tight', 'sans-serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill-full': '1600px',
        'card-soft': '20px',
        'card-elevated': '40px',
        'nav-pill': '200px',
        'asymmetric': '6px 0px 0px 0px',
      }
    },
  },
  plugins: [],
}
