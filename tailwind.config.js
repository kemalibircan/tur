export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#0F766E",
          600: "#0B625C",
          700: "#0A4F49",
        },
        amber: {
          500: "#F59E0B",
          600: "#D97706",
        },
        ink: "#0F172A",
        cloud: "#F8FAFC",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.10)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
