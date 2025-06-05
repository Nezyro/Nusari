/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{js,ts}"],
  theme: {
    extend: {
      colors: {
        turquoise: '#1abc9c',    // turquesa oscuro
        dark: '#121212',         // negro profundo
        grayish: '#2c3e50',      // gris oscuro
      },
      aspectRatio: {
        'w-16': '16',
        'h-9': '9',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
