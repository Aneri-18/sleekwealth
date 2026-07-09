/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      fontSize: {
        hero: ["96px", { lineHeight: "1.4" }],
        "hero-mobile": ["52px", { lineHeight: "1.4" }],
        section: ["64px", { lineHeight: "1.4" }],
        "section-mobile": ["36px", { lineHeight: "1.4" }],
        body: ["18px", { lineHeight: "1.7" }],
        "body-mobile": ["16px", { lineHeight: "1.7" }],
        label: ["13px", { lineHeight: "1.5" }],
      },
      borderRadius: {
        sw: "10px",
      },
    },
  },
  plugins: [],
};
