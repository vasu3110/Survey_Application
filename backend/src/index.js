import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
  path: './.env'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8000;

const isProduction = process.env.NODE_ENV === 'production';

connectDB()
  .then(() => {
    if (isProduction) {
      // Render expects HTTP server, not HTTPS
      http.createServer(app).listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 HTTP server running on http://0.0.0.0:${PORT}`);
      });
    } else {
      // Local development with HTTPS
      const sslOptions = {
        key: fs.readFileSync(path.join(__dirname, '../ssl/server.key')),
        cert: fs.readFileSync(path.join(__dirname, '../ssl/server.cert')),
      };

      https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`🚀 HTTPS dev server running at https://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
