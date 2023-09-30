/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "inset-2": "inset 0 0 0 2px var(--tw-shadow-color)",
      },
      animation: {
        scaleTo1: "scaleTo1 200ms linear 1",
        shake: "shake 300ms",
      },
      keyframes: {
        scaleTo1: {
          "0%": { transform: "scale(0.5)" },
          "100%": { transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%, 75%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    prefix: "dsy-",
    base: false,
    themes: [
      {
        mytheme: {
          primary: "rgba(248,111,21,0.85)",
          secondary: "#3cf213",
          accent: "#bcc6f4",
          neutral: "#3e283e",
          "base-100": "#ffffff",
          info: "#59ccf3",
          success: "#0b6030",
          warning: "#dc9609",
          error: "#ee2f36",
        },
      },
    ],
  },
};
