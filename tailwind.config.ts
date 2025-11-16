import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales: rojo, azul, dorado, negro, blanco
        red: {
          kings: '#DC2626', // Rojo principal
          light: '#EF4444',
          dark: '#B91C1C',
        },
        blue: {
          kings: '#2563EB', // Azul principal
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        gold: {
          kings: '#F59E0B', // Dorado principal
          light: '#FBBF24',
          dark: '#D97706',
        },
        black: {
          kings: '#000000',
          dark: '#111827',
        },
        white: {
          kings: '#FFFFFF',
          off: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

