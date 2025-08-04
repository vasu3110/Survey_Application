import { body, param } from "express-validator";

// Create system validator
export const createSystemValidator = [
  body("deviceType")
    .isString().withMessage("deviceType is required")
    .trim().escape(),

  body("deviceName")
    .isString().withMessage("deviceName is required")
    .trim().escape(),

  body("serialNo")
    .isString().withMessage("serialNo is required")
    .trim().escape(),

  body("model")
    .isString().withMessage("model is required")
    .trim().escape(),

  // OPTIONAL FIELDS
  body("os")
    .optional()
    .isString().withMessage("OS must be a string")
    .trim().escape(),

  body("ipAddress")
    .optional()
    .isIP().withMessage("ipAddress must be a valid IP"),

  body("macAddress")
    .optional()
    .matches(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i)
    .withMessage("Invalid MAC address"),

  body("antivirus")
    .optional()
    .isString().withMessage("antivirus must be a string")
    .trim().escape(),

  body("network")
    .optional()
    .isString().withMessage("network must be a string")
    .trim().escape(),

  body("roomNo")
    .isNumeric().withMessage("roomNo must be a number")
];

// Check system & submission
export const checkSystemAndSubmissionValidator = [
  body("serialNo").isString().withMessage("serialNo is required").trim().escape(),
  body("formType").isString().withMessage("formType is required").trim().escape()
];

// Get / delete / update system by ID
export const systemIdParamValidator = [
  param("systemId").isMongoId().withMessage("Invalid system ID")
];

// Optional: Update fields
export const updateSystemValidator = [
  param("systemId")
    .isMongoId().withMessage("Invalid system ID"),

  body().custom((body) => {
    if (Object.keys(body).length === 0) {
      throw new Error("Request body cannot be empty");
    }
    return true;
  }),

  body("deviceType")
    .optional()
    .isString().withMessage("deviceType must be a string")
    .trim().escape(),

  body("deviceName")
    .optional()
    .isString().withMessage("deviceName must be a string")
    .trim().escape(),

  body("serialNo")
    .optional()
    .isString().withMessage("serialNo must be a string")
    .trim().escape(),

  body("model")
    .optional()
    .isString().withMessage("model must be a string")
    .trim().escape(),

  body("os")
    .optional()
    .isString().withMessage("OS must be a string")
    .trim().escape(),

  body("ipAddress")
    .optional()
    .isIP().withMessage("Invalid IP address"),

  body("macAddress")
    .optional()
    .matches(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i)
    .withMessage("Invalid MAC address"),

  body("antivirus")
    .optional()
    .isString().withMessage("antivirus must be a string")
    .trim().escape(),

  body("network")
    .optional()
    .isString().withMessage("network must be a string")
    .trim().escape(),

  body("roomNo")
    .optional()
    .isNumeric().withMessage("roomNo must be a number")
];

