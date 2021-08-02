module.exports = {
  mode: "jit",
  purge: ["./components/**/*.tsx", "./pages/**/*.tsx", "./views/**/*.tsx"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: "#0C0F21",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
