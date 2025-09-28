import path from "path"
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  base: '/pitanga',
  envPrefix: 'PITANGA_',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
