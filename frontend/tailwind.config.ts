import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        header: "#292929",
        mainbg: "#222324",
        orange: "#ff5138",
        pastel_orange: "#FFB5A7",
        pastel_blue: "#BDE0FE",
        pastel_yellow: "#FFD6A5",
        pastel_green: "#B9FBC0",
        pastel_teal: "#C8E7E2",
        pastel_purple: "#D7BCF9",
        pastel_red: "#FFA8A8",
        pastel_pink: "#FFCCE5",
        pastel_lime: "#E6FAAA",
        pastel_cyan: "#A7E5FF",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.4s ease-out",
        "hover-scale": "hoverScale 0.3s ease-in-out",
        "hover-preview": "hoverPreview 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        "gradient-move": "gradientMove 6s ease infinite",
        "bounce": "bounce 2s infinite",
        "card-highlight": "cardHighlight 0.5s ease-in-out",
        "task-entry": "taskEntry 0.8s ease-out",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },  

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        hoverScale: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        hoverPreview: {
          "0%": { opacity: "0", transform: "translateY(-10px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        bounce: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
          "60%": { transform: "translateY(-5px)" },
        },
        cardHighlight: {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 rgba(0, 0, 0, 0)" },
          "50%": { transform: "scale(1.05)", boxShadow: "0 8px 15px rgba(255, 81, 56, 0.5)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 rgba(0, 0, 0, 0)" },
        },
        taskEntry: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
