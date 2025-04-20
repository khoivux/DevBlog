/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        progressBar: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
      animation: {
        progressBar: 'progressBar 3s linear forwards',
      },
    },
  },
  plugins: [],
};
