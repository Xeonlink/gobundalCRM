module.exports = {
  printWidth: 100,
  plugins: [
    "prettier-plugin-tailwindcss",
    "prettier-plugin-organize-imports",
    "prettier-plugin-organize-attributes",
  ],

  tailwindConfig: "./tailwind.config.js",
  tailwindFunctions: ["clsx"],
};
