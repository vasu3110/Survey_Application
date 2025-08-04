import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { System } from "../models/System.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new system specification
const createSystem = asyncHandler(async (req, res) => {
  const {
    deviceType,
    deviceName,
    serialNo,
    model,
    os,
    ipAddress,
    macAddress,
    antivirus,
    network,
    roomNo,
    
  } = req.body;

  // Validate required fields (additional server-side validation)
  if (
    !deviceType ||
    !deviceName ||
    !serialNo ||
    !model ||
    !os ||
    !ipAddress ||
    !macAddress ||
    !antivirus ||
    !network ||
    roomNo === undefined
  ) {
    throw new ApiError(400, "All fields except 'isActive' are required");
  }

  // Check if system with same serialNo (or combination) already exists - optional
  // Example uniqueness check (you can adjust based on your business logic)
  const existedSystem = await System.findOne({ serialNo, isActive: true });
  if (existedSystem) {
    throw new ApiError(409, "A system with this serial number already exists");
  }

  // Create system & assign owner from authenticated user
  const system = await System.create({
    deviceType,
    deviceName,
    serialNo,
    model,
    os,
    ipAddress,
    macAddress,
    antivirus,
    network,
    roomNo,
    user: req.user._id, // assuming req.user is set by auth middleware
  });

  if (!system) {
    throw new ApiError(500, "Failed to create system");
  }

  return res.status(201).json(
    new ApiResponse(201, system, "System specification created successfully")
  );
});
import { Submission } from "../models/Submission.model.js"; // import submission model

const checkSystemAndSubmission = asyncHandler(async (req, res) => {
  const {
    serialNo,
    formType,
  } = req.body;

  if (!serialNo || !formType) {
    throw new ApiError(400, "serialNo and formType are required");
  }

  // Check if system exists and is active for current user
  const system = await System.findOne({
    serialNo,
    user: req.user._id,
    isActive: true,
  });

  if (!system) {
    // System does not exist => client needs to create system then proceed
    return res.status(200).json(
      new ApiResponse(200, null, "System not found, needs creation")
    );
  }

  // System exists, now check if a submission already exists for this formType from this system
  const existingSubmission = await Submission.findOne({
    employeeId: req.user._id,
    systemId: system._id,
    formType,
  });

  if (existingSubmission) {
    // Submission exists for this system and formType — disallow duplicate submissions
    return res.status(409).json(
      new ApiResponse(409, existingSubmission, "Submission already exists for this system and form")
    );
  }

  // No submission found — allow user to proceed
  return res.status(200).json(
    new ApiResponse(200, { systemId: system._id }, "System found, no submission yet")
  );
});

// Get all active systems for the logged-in user
const getUserSystems = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const systems = await System.find({ user: userId, isActive: true });

  return res.status(200).json(
    new ApiResponse(200, systems, "User systems fetched successfully")
  );
});

// Optionally get single system by ID
const getSystemById = asyncHandler(async (req, res) => {
  const { systemId } = req.params;
  const userId = req.user._id;

  const system = await System.findOne({ _id: systemId, user: userId, isActive: true });
  if (!system) {
    throw new ApiError(404, "System not found");
  }

  return res.status(200).json(new ApiResponse(200, system, "System fetched successfully"));
});

// Soft-delete a system (mark inactive)
const deleteSystem = asyncHandler(async (req, res) => {
  const { systemId } = req.params;
  const userId = req.user._id;

  const system = await System.findOneAndUpdate(
    { _id: systemId, user: userId, isActive: true },
    { $set: { isActive: false } },
    { new: true }
  );

  if (!system) {
    throw new ApiError(404, "System not found or already deleted");
  }

  return res.status(200).json(new ApiResponse(200, {}, "System deleted successfully"));
});

// Optional: Update system details
const updateSystem = asyncHandler(async (req, res) => {
  const { systemId } = req.params;
  const userId = req.user._id;

  const updateData = req.body;

  // Optionally validate updateData fields here

  const system = await System.findOneAndUpdate(
    { _id: systemId, user: userId, isActive: true },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!system) {
    throw new ApiError(404, "System not found");
  }

  return res.status(200).json(new ApiResponse(200, system, "System updated successfully"));
});

export {
  createSystem,
  getUserSystems,
  getSystemById,
  deleteSystem,
  updateSystem,
  checkSystemAndSubmission
};
