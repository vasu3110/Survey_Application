import { Router } from "express";
import {
  createSystem,
  getUserSystems,
  getSystemById,
  deleteSystem,
  updateSystem,
  checkSystemAndSubmission
} from "../controllers/system.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // IMPORT AUTH MIDDLEWARE

const router = Router();

// All routes below this line require authentication!
// (Order matters: this line affects all subsequent routes)
router.use(verifyJWT);

router.route("/check-system-submission").post(checkSystemAndSubmission);
// Route to create a new system
router.route("/create").post(createSystem);

// Route to get all systems for the authenticated user
router.route("/").get(getUserSystems);

// Route to get a specific system by ID
router.route("/:systemId").get(getSystemById);

// Route to delete a system (soft-delete)
router.route("/:systemId").delete(deleteSystem);

// Route to update system details
router.route("/:systemId").patch(updateSystem);

export default router;
