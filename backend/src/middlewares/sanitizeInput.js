// src/middlewares/sanitizeInput.js
import sanitize from "mongo-sanitize";

function deepSanitize(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      deepSanitize(obj[key]);
    } else {
      obj[key] = sanitize(obj[key]);
    }
  }
  return obj;
}

export const sanitizeRequest = (req, res, next) => {
  // Sanitize only if they exist
  if (req.body) deepSanitize(req.body);
  if (req.params) deepSanitize(req.params);
  if (req.query) deepSanitize(req.query);

  next();
};
