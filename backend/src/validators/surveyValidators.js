import { body, param } from "express-validator";

// Create survey
export const createSurveyValidator = [
  body("formType")
    .isString().withMessage("formType must be a string")
    .trim().escape(),

  body("name")
    .isString().withMessage("Name must be a string")
    .trim().escape(),

  body("icon")
    .isString().withMessage("Icon must be a string")
    .trim().escape(),

  body("questions")
    .isArray({ min: 1 }).withMessage("Questions must be a non-empty array")
];

// Get by formType
export const getSurveyByTypeValidator = [
  param("formType")
    .isString().withMessage("formType must be a string")
    .trim().escape()
];

// Update survey
export const updateSurveyValidator = [
  param("formType")
    .isString().withMessage("formType must be a string")
    .trim().escape(),

  body("name")
    .optional()
    .isString().withMessage("Name must be a string")
    .trim().escape(),

  body("icon")
    .optional()
    .isString().withMessage("Icon must be a string")
    .trim().escape(),

  body("questions")
    .optional()
    .isArray().withMessage("Questions must be an array"),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean")
];

// Delete survey
export const deleteSurveyValidator = [
  param("formType")
    .isString().withMessage("formType must be a string")
    .trim().escape()
];
import { query } from "express-validator";

export const getAllSurveysValidator = [
  query("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean"),

  query("name")
    .optional()
    .isString().withMessage("Name must be a string")
    .trim().escape(),

  query("formType")
    .optional()
    .isString().withMessage("formType must be a string")
    .trim().escape()
];

