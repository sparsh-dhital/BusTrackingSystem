export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        "drive-loop": {
          // Changed to transform for GPU acceleration and to prevent conflicts with 'left-0'
          "0%": { transform: "translateX(-160px)" },
          "100%": { transform: "translateX(100vw)" },
        },
        "dash-scroll": {
          "0%": { backgroundPosition: "0px 0" },
          // Changed to -30px to perfectly match the 30px repeating gradient in LoginForm.jsx
          "100%": { backgroundPosition: "-30px 0" },
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