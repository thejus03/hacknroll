import type { Config } from "tailwindcss";

export default {
  // Define layout
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Define custom theme
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        header: "#292929",
        mainbg: "#222324",
        orange: "#ff5138",
      },

      // Define custom animations
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.4s ease-out",
        "hover-scale": "hoverScale 0.3s ease-in-out",
        "hover-preview": "hoverPreview 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
      },

      // Set Inter as the default sans font
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      
      // Define custom keyframes
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
      },
    },
  },
  plugins: [],
} satisfies Config;
