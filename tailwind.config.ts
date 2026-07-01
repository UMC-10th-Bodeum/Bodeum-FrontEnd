import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          500: "#0669D2",
          400: "#1984F7",
          300: "#91C3F9",
          200: "#E4F1FF",
          150: "#F3F9FF",
          100: "#F2F4F8",
        },

        sub: {
          yellow: "#FCBD25",
          "yellow-2": "#FFF7E4",

          red: "#F24346",
          "red-2": "#FDF2F8",

          green: "#25C35F",
          "green-2": "#F0FFF6",

          purple: "#76568F",
          "purple-2": "#F4EEFF",
        },

        background: {
          600: "#2E2E2E",
          500: "#888C96",
          400: "#C4C6CE",
          300: "#D9DCE2",
          250: "#ECEEF3",
          200: "#F9F9FB",
          100: "#FFFFFF",
        },
      },
    },
  },
} satisfies Config;