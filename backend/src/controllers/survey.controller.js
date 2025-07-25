// src/controllers/survey.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Survey } from "../models/Survey.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 

const createSurvey = asyncHandler(async (req, res) => {
    console.log("Inside create survey backend")
    const { formType, name, icon, questions } = req.body;

    if (!formType || !name || !icon || !questions) {
        throw new ApiError(400, "All fields are required");
    }

    const existingSurvey = await Survey.findOne({ formType });
    if (existingSurvey) {
        throw new ApiError(409, "Survey with this form type already exists");
    }
    const survey = await Survey.create({
        formType,
        name:req.user.profileData.name,
        icon,
        questions,
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, survey, "Survey created successfully")
    );
});

const getAllSurveys = asyncHandler(async (req, res) => {
    const surveys = await Survey.find({ isActive: true }).select("-createdBy");

    return res.status(200).json(
        new ApiResponse(200, surveys, "Surveys fetched successfully")
    );
});

const getSurveyByType = asyncHandler(async (req, res) => {
    const { formType } = req.params;
    if (!formType) {
        throw new ApiError(400, "Form type is required");
    }
    const survey = await Survey.findOne({ formType, isActive: true });

    if (!survey) {
        throw new ApiError(404, "Survey not found");
    }

    return res.status(200).json(
        new ApiResponse(200, survey, "Survey fetched successfully")
    );
});

const updateSurvey = asyncHandler(async (req, res) => {
    console.log("Inside update survey inside backend")
    const { formType } = req.params;
    const { name, icon, questions, isActive } = req.body;
    console.log(formType)
    const survey = await Survey.findOneAndUpdate(
        { formType },
        {
            $set: {
                ...(name && { name }),
                ...(icon && { icon }),
                ...(questions && { questions }),
                ...(isActive !== undefined && { isActive })
            }
        },
        { new: true , runValidators: true}
    );

    if (!survey) {
        throw new ApiError(404, "Survey not found");
    }

    return res.status(200).json(
        new ApiResponse(200, survey, "Survey updated successfully")
    );
});

const deleteSurvey = asyncHandler(async (req, res) => {
    console.log("Inside deletesurvey method in backend");
    const { formType } = req.params;
    console.log(formType);
    const survey = await Survey.findOneAndDelete({ formType, isActive: true });


    if (!survey) {
        throw new ApiError(404, "Survey not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Survey deleted successfully")
    );
});


export {
    createSurvey,
    getAllSurveys,
    getSurveyByType,
    updateSurvey,
    deleteSurvey
};
