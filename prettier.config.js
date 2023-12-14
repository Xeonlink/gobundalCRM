module.exports = {
  printWidth: 100,
  plugins: [
    "prettier-plugin-tailwindcss",
    // "prettier-plugin-organize-imports",
    // "prettier-plugin-organize-attributes",
    "prettier-plugin-prisma",
  ],

  tailwindConfig: "./tailwind.config.js",
  tailwindFunctions: ["clsx"],
};
