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
        // Default Tailwind breakpoints:
        // sm: '640px'
        // md: '768px' 
        // lg: '1024px'
        // xl: '1280px'
        // 2xl: '1536px'
        
        // Custom breakpoints
        'tablet': '1024px',
        // Atau jika Anda ingin breakpoint yang berbeda:
        // 'tablet': '900px',
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