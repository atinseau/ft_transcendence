/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: '#__next',
  theme: {
    extend: {
      backgroundImage: {
        '42logo': "url('/42logo.png')",
        'googlelogo': "url('/google.png')",
        'pp': "url('/gear5.jpeg')",
      }
    }
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
