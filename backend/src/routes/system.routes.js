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
import {
  createSystemValidator,
  checkSystemAndSubmissionValidator,
  systemIdParamValidator,
  updateSystemValidator
} from "../validators/systemValidators.js";
const router = Router();

// All routes below this line require authentication!
// (Order matters: this line affects all subsequent routes)
router.use(verifyJWT);

router.route("/check-system-submission").post(checkSystemAndSubmissionValidator,checkSystemAndSubmission);
// Route to create a new system
router.route("/create").post(createSystemValidator,createSystem);

// Route to get all systems for the authenticated user
router.route("/").get(getUserSystems);

// Route to get a specific system by ID
router.route("/:systemId").get(systemIdParamValidator,getSystemById);

// Route to delete a system (soft-delete)
router.route("/:systemId").delete(systemIdParamValidator,deleteSystem);

// Route to update system details
router.route("/:systemId").patch(updateSystemValidator,updateSystem);

export default router;
