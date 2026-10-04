/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          base: "#0c0a09", // Stone-950
          surface: "#1c1917", // Stone-900
          elevated: "#292524", // Stone-800
          border: "#44403c", // Stone-700
          muted: "#a8a29e", // Stone-400
          text: "#f5f5f4", // Stone-100
        },
        alert: {
          crimson: "#e11d48", // Rose-600
          dark: "#4c0519", // Rose-950
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
      },
      spacing: {
        'touch': '48px',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
