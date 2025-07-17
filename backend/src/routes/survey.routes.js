// src/routes/survey.routes.js
import { Router } from "express";
import {
    createSurvey,
    getAllSurveys,
    getSurveyByType,
    updateSurvey,
    deleteSurvey
} from "../controllers/survey.controller.js";
import { verifyJWT, verifyUserType } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getAllSurveys);


// Protected routes - only coordinators can manage surveys
router.use(verifyJWT);
router.route("/create").post(verifyUserType(['coordinator']), createSurvey);
console.log("Inside survey.routes")
router
  .route("/:formType")
  .get(getSurveyByType)
  .patch(verifyUserType(['coordinator']), updateSurvey)
  .delete(verifyUserType(['coordinator']), deleteSurvey);

export default router;
