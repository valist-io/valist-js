const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': colors.sky,
        teal: colors.teal,
        violet: colors.violet,
        rose: colors.rose,
        slate: colors.slate,
      }
    }
  },
  plugins: [],
};
