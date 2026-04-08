/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        bg: {
          base:     "#000000",
          elevated: "#0a0a0a",
          card:     "#0f0f0f",
          border:   "#1e1e1e",
        },
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        "orb-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%":      { transform: "translate(20px, -15px) scale(1.05)" },
          "66%":      { transform: "translate(-10px, 10px) scale(0.97)" },
        },
        downloadArrow: {
          "0%":     { marginTop: "-7px", opacity: "1" },
          "0.001%": { marginTop: "-15px", opacity: "0.4" },
          "50%":    { opacity: "1" },
          "100%":   { marginTop: "0", opacity: "0.4" },
        },
      },
      animation: {
        "fade-up":          "fade-up 0.6s ease-out forwards",
        "fade-up-delay-1":  "fade-up 0.6s 0.15s ease-out forwards",
        "fade-up-delay-2":  "fade-up 0.6s 0.3s ease-out forwards",
        "fade-up-delay-3":  "fade-up 0.6s 0.45s ease-out forwards",
        "fade-in":          "fade-in 0.4s ease-out forwards",
        shimmer:            "shimmer 2.5s linear infinite",
        float:              "float 5s ease-in-out infinite",
        "cursor-blink":     "cursor-blink 1s step-end infinite",
        "orb-drift":        "orb-drift 12s ease-in-out infinite",
        downloadArrow:      "none",
        downloadArrowRunning: "downloadArrow 1s linear infinite",
      },
    },
  },
  plugins: [],
};
