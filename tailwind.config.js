/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    'sans': ['roboto', 'sans-serif' ]
     },
    extend: {
      backgroundImage:{ 
        "home":"url('/restaurante/bg.png')"
      
    },
  },
  plugins: [],
}
