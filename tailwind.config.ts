import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm farmhouse-bakery palette
        cream: {
          DEFAULT: "#faf5ea",
          50: "#fdfbf5",
          100: "#faf5ea",
          200: "#f3e9d2",
          300: "#e9d8b5",
        },
        flour: "#f6efe1",
        crust: "#8a6d3b",
        // Deep green accent
        green: {
          DEFAULT: "#2f4a3a",
          50: "#eef3ef",
          600: "#345240",
          700: "#2f4a3a",
          800: "#243a2d",
          900: "#1b2c22",
        },
        ink: "#2b2620",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(43, 38, 32, 0.18)",
        card: "0 2px 12px -4px rgba(43, 38, 32, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
