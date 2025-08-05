// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sanitizeRequest } from "./middlewares/sanitizeInput.js";
import helmet from "helmet"; // Import helmet for security headers
const app = express();

app.use(cors({
    // origin: 'https://localhost:5173', // Your React dev server
    origin: 'https://survey-application-xo62.onrender.com', // Update this to your frontend URL
    credentials: true
}));
app.use(helmet()); // Use helmet to set security headers
app.use(sanitizeRequest);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind needs inline styles
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "data:"],
    },
  })
);

// Routes import
import authRouter from './routes/auth.routes.js';
import surveyRouter from './routes/survey.routes.js';
import submissionRouter from './routes/submission.routes.js';
import systemRouter from './routes/system.routes.js';
// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/surveys", surveyRouter);
app.use("/api/v1/submissions", submissionRouter);
app.use("/api/v1/systems", systemRouter);

export { app };
