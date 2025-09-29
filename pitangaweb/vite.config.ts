import path from "path"
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { readFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: readFileSync(path.resolve(__dirname, 'certs', 'localhost-key.pem')),
      cert: readFileSync(path.resolve(__dirname, 'certs', 'localhost-cert.pem')),
    },
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
