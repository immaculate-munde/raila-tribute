module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#c7a17a",
          dark: "#8f6f4f",
          light: "#f3e6d9",
        },
        royal: "#0b1220",
      },
      boxShadow: {
        'gold-glow': '0 10px 30px rgba(199,161,122,0.12)',
      }
    }
  },
  plugins: [],
};
