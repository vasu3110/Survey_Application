import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .isString().withMessage("Username must be a string")
    .trim().escape(),

  body("email")
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("userType")
    .isIn(["admin", "grouphead", "respondent"]) // adjust as per your user types
    .withMessage("Invalid user type"),

  body("groupname")
    .optional()
    .isString().withMessage("Group name must be a string")
    .trim().escape()
];

export const loginValidator = [
  body("username")
    .isString().withMessage("Username is required")
    .trim().escape(),

  body("password")
    .notEmpty().withMessage("Password is required"),

  body("userType")
    .isIn(["admin", "grouphead", "respondent"])
    .withMessage("Invalid user type"),

  body("groupname")
    .optional()
    .isString().trim().escape()
];

export const updateProfileValidator = [
  body("profileData").isObject().withMessage("Profile data must be an object")
];
