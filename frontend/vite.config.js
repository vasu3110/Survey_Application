import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/server.cert')),
    },
    port: 5173
  }
});
// https://vite.dev/config/

