// src/routes/submission.routes.js
import { Router } from "express";
import {
    createSubmission,
    getSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    getMySubmissions
} from "../controllers/submission.controller.js";
import { verifyJWT, verifyUserType } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // All routes are protected

// Employee routes
router.route("/create").post(createSubmission);
router.route("/my-submissions").get(getMySubmissions);

// Group head and coordinator routes
router.route("/").get(verifyUserType(['grouphead', 'coordinator']), getSubmissions);
router.route("/:submissionId").get(verifyUserType(['grouphead', 'coordinator']), getSubmissionById);
router.route("/:submissionId/status").patch(verifyUserType(['grouphead', 'coordinator']), updateSubmissionStatus);

export default router;
