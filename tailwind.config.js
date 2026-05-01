/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      transitionTimingFunction: {
        'spring-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-sheet': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
}
