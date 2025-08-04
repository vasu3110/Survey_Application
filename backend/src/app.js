// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: 'https://survey-application-xo62.onrender.com', // Your React dev server
    credentials: true
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

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
