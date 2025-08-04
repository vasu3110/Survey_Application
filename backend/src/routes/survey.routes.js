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
import {
  createSurveyValidator,
  getSurveyByTypeValidator,
  updateSurveyValidator,
  deleteSurveyValidator,
  getAllSurveysValidator
} from "../validators/surveyValidators.js";
const router = Router();

// Public routes
router.route("/").get(getAllSurveysValidator,getAllSurveys);


// Protected routes - only coordinators can manage surveys
router.use(verifyJWT);
router.route("/create").post(verifyUserType(['coordinator']),createSurveyValidator, createSurvey);
router
  .route("/:formType")
  .get(getSurveyByTypeValidator,getSurveyByType)
  .patch(verifyUserType(['coordinator']),updateSurveyValidator, updateSurvey)
  .delete(verifyUserType(['coordinator']),deleteSurveyValidator, deleteSurvey);

export default router;
