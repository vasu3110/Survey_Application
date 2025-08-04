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
import {
  createSubmissionValidator,
  updateSubmissionStatusValidator,
  getSubmissionByIdValidator,
  getSubmissionsValidator,
  getMySubmissionsValidator
} from "../validators/submissionValidators.js";

const router = Router();

router.use(verifyJWT); // All routes are protected

// Employee routes
router.route("/create").post(createSubmissionValidator,createSubmission);
router.route("/my-submissions").get(getMySubmissionsValidator,getMySubmissions);

// Group head and coordinator routes
router.route("/").get(verifyUserType(['grouphead', 'coordinator']),getSubmissionsValidator, getSubmissions);
router.route("/:submissionId").get(verifyUserType(['grouphead', 'coordinator']),getSubmissionByIdValidator, getSubmissionById);
router.route("/:submissionId/status").patch(verifyUserType(['grouphead', 'coordinator']), updateSubmissionStatusValidator,updateSubmissionStatus);

export default router;
