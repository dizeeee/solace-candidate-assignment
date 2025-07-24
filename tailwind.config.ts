import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        solace: {
          white: "#fff",
          black: "#101010",
          primary: "#1d4339",
          "primary-focused": "#285e50",
          "primary-selected": "#347866",
          "accent-gold": "#e9cc95",
          gold: "#d7a13b",
          "neutral-dark-grey": "#5a5a5a",
          "neutral-grey": "#9a9a9a",
          "neutral-light-grey": "#e9e9e9",
          opal: "#d4e2dd",
          "green-100": "#f4f8f7",
          "accent-mid": "#3f937c",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
