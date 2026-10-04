/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: "#fff5f7",
          card: "#ffffff",
          primary: "#ff4d79",
          primaryHover: "#f43f5e",
          soft: "#ffe8ed",
          subtle: "#fff0f3",
          border: "#f8d7df",
          text: "#2b1c28",
          muted: "#8c7685",
          accentYellow: "#fef3c7",
          accentLavender: "#f3e8ff",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
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
