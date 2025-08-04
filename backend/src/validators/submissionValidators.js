import { body, param, query } from "express-validator";

// Validator for submission creation
export const createSubmissionValidator = [
  body("formType")
    .isString().withMessage("formType must be a string")
    .trim().escape(),

  body("systemId")
    .isMongoId().withMessage("Invalid systemId"),

  body("profileData").isObject().withMessage("profileData must be an object"),

  body("profileData.name")
    .optional()
    .isString().withMessage("Name must be a string")
    .trim().escape(),

  body("profileData.groupName")
    .optional()
    .isString().trim().escape(),

  body("profileData.grpname")
    .optional()
    .isString().trim().escape(),

  body("responses").isObject().withMessage("responses must be an object")
];

// Validator for status update
export const updateSubmissionStatusValidator = [
  param("submissionId")
    .isMongoId().withMessage("Invalid submissionId"),

  body("status")
    .isIn(["pending", "approved", "not approved"])
    .withMessage("Invalid status value")
];

// Validator for getting by ID
export const getSubmissionByIdValidator = [
  param("submissionId")
    .isMongoId().withMessage("Invalid submission ID")
];

// Validator for optional query filters (getSubmissions)
export const getSubmissionsValidator = [
  query("formType").optional().isString().trim().escape(),
  query("groupName").optional().isString().trim().escape(),
  query("networkName").optional().isString().trim().escape(),
  query("status").optional().isString().trim().escape(),
  query("employeeName").optional().isString().trim().escape(),
  query("deviceType").optional().isString().trim().escape(),
  query("ipAddress").optional().isString().trim().escape(),
  query("macAddress").optional().isString().trim().escape(),
  query("os").optional().isString().trim().escape(),
  query("serialNo").optional().isString().trim().escape(),
  query("coordinatorStatus").optional().isString().trim().escape(),
  query("deviceName").optional().isString().trim().escape(),
  query("model").optional().isString().trim().escape(),
  query("page").optional().isInt().toInt(),
  query("limit").optional().isInt().toInt()
];

// Validator for my submissions
export const getMySubmissionsValidator = [
  query("page").optional().isInt().toInt(),
  query("limit").optional().isInt().toInt()
];
