// src/routes/auth.routes.js
import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    updateProfile,
    getCurrentUser
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator
} from "../validators/authValidator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(registerValidator,registerUser);
router.route("/login").post(loginValidator,loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-profile").patch(verifyJWT,updateProfileValidator, updateProfile);

export default router;
