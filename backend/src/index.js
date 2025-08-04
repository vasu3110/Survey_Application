// src/index.js
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
    path: './.env'
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load SSL key and certificate
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../ssl/server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../ssl/server.cert'))
};

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        https.createServer(sslOptions, app).listen(PORT, () => {
            console.log(`🚀 HTTPS server is running at https://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ MongoDB connection failed:", err);
    });
