/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        100: "100px",
        200: "200px",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "0rem", 
        sm: "1rem",      
        md: "2rem",      
        lg: "200px",     
        xl: "200px",
        "2xl": "200px",
      },
    },
  },
  plugins: [],
}