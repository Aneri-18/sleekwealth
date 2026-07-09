/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "600px",
        md: "900px",
      },
      colors: {
        aubergine: "#120818",
        bordeaux: "#4A0E1A",
        cognac: "#9C6B35",
        parchment: "#EDE8DC",
      },
      fontFamily: {
        vollkorn: ["var(--font-vollkorn)", "serif"],
        satoshi: ["var(--font-satoshi)", "sans-serif"],
      },
      borderRadius: {
        sw: "10px",
      },
      transitionTimingFunction: {
        sw: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
