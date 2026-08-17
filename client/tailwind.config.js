import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      color:{
        indigo: {
          600: '#4F46E5', //primary brand color
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
});