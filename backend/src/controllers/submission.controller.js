// src/controllers/submission.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Submission } from "../models/Submission.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSubmission = asyncHandler(async (req, res) => {
    const { formType, responses, profileData } = req.body;

    if (!formType || !responses || !profileData) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already submitted this form type
    const existingSubmission = await Submission.findOne({
        employeeId: req.user._id,
        formType
    });

    if (existingSubmission) {
        throw new ApiError(409, "You have already submitted this survey");
    }

    const submission = await Submission.create({
        employeeId: req.user._id,
        employeeName: profileData.name || req.user.username,
        groupName: profileData.groupName || profileData.grpname,
        networkName: profileData.network,
        deviceType: profileData.os || 'Unknown',
        formType,
        responses: new Map(Object.entries(responses))
    });

    return res.status(201).json(
        new ApiResponse(201, submission, "Survey submitted successfully")
    );
});

const getSubmissions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, formType, groupName, networkName, status } = req.query;
    
    let matchStage = {};

    // For group heads, only show submissions from their group
    if (req.user.userType === 'grouphead') {
        matchStage.groupName = req.user.profileData?.groupName;
    }

    // Apply filters
    if (formType && formType !== 'all') {
        matchStage.formType = formType;
    }
    if (groupName && groupName !== 'all') {
        matchStage.groupName = groupName;
    }
    if (networkName && networkName !== 'all') {
        matchStage.networkName = networkName;
    }

    const aggregateQuery = Submission.aggregate([
        { $match: matchStage },
        { $sort: { submissionDate: -1 } }
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };

    const submissions = await Submission.aggregatePaginate(aggregateQuery, options);
    console.log(submissions);
    return res.status(200).json(
        new ApiResponse(200, submissions, "Submissions fetched successfully")
    );
});

const getSubmissionById = asyncHandler(async (req, res) => {
    const { submissionId } = req.params;

    let matchStage = { _id: submissionId };

    // For group heads, only allow viewing submissions from their group
    if (req.user.userType === 'grouphead') {
        matchStage.groupName = req.user.profileData?.groupName;
    }

    const submission = await Submission.findOne(matchStage);

    if (!submission) {
        throw new ApiError(404, "Submission not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, submission, "Submission fetched successfully")
    );
});

const updateSubmissionStatus = asyncHandler(async (req, res) => {
    const { submissionId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'not approved'].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    let updateField = {};
    let matchStage = { _id: submissionId };

    if (req.user.userType === 'grouphead') {
        updateField.statusGroupHead = status;
        matchStage.groupName = req.user.profileData?.groupName;
    } else if (req.user.userType === 'coordinator') {
        updateField.statusCoordinator = status;
    } else {
        throw new ApiError(403, "Access denied");
    }

    const submission = await Submission.findOneAndUpdate(
        matchStage,
        { $set: updateField },
        { new: true }
    );

    if (!submission) {
        throw new ApiError(404, "Submission not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, submission, "Submission status updated successfully")
    );
});

const getMySubmissions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const aggregateQuery = Submission.aggregate([
        { $match: { employeeId: req.user._id } },
        { $sort: { submissionDate: -1 } }
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };

    const submissions = await Submission.aggregatePaginate(aggregateQuery, options);

    return res.status(200).json(
        new ApiResponse(200, submissions, "Your submissions fetched successfully")
    );
});

export {
    createSubmission,
    getSubmissions,
    getSubmissionById,
    updateSubmissionStatus,
    getMySubmissions
};
