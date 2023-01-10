/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        retailRows: 'minmax(150px,15%),auto',
        retailWraper: '50px,auto',
      },
      gridTemplateColumns: {
        retailColumns: 'auto minmax(20%,170px)',
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')],
}
