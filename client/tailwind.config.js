// client/tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        "drive-loop": {
          "0%": { left: "-160px" },
          "100%": { left: "calc(100% + 160px)" },
        },
        "dash-scroll": {
          "0%": { backgroundPosition: "0px 0" },
          "100%": { backgroundPosition: "-40px 0" },
        },
      },
      animation: {
        "drive-loop": "drive-loop 6s linear infinite",
        "dash-scroll": "dash-scroll 1s linear infinite",
      },
    },
  },
  plugins: [],
};