/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
      'xs': '480px',  // Extra small devices
      'sm': '640px',  // Small devices
      'md': '768px',  // Medium devices
      'tablet': '1024px', // Large devices
      'xl': '1280px', // Extra large devices
      '2xl': '1536px', // 2X large devices
      '3xl': '1920px', // Custom breakpoint
    },
      fontFamily: {
        oswald: ['var(--font-oswald)'],
        handlee: ['var(--font-handlee)'],
        poppins: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [],
}