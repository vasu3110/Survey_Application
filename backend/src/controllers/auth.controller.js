// src/controllers/auth.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

// Controller:
const registerUser = asyncHandler(async (req, res) => {
  // Validate input errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("❌ Login validation failed:", errors.array());
    throw new ApiError(422, "Invalid inputs", errors.array());
  }
  const { username, email, password, userType, groupname } = req.body;

  // Extra manual sanitization if needed (e.g., lowercase)
  const safeUsername = username.toLowerCase();

  const existedUser = await User.findOne({
    $or: [{ username: safeUsername }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, 'User with email or username already exists');
  }

  const user = await User.create({
    username: safeUsername,
    email,
    password,
    userType,
    profileData: {
      groupName: groupname,
    },
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res.status(201).json(new ApiResponse(200, createdUser, 'User registered Successfully'));
});


const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("❌ Login validation failed:", errors.array());
        throw new ApiError(422, "Invalid login inputs", errors.array());
    }
  const { username, password, userType, groupname } = req.body;
  const safeUsername = username.toLowerCase();
    if (!username || !password || !userType) {
            throw new ApiError(400, "Username, password and userType are required");
    }
  const user = await User.findOne({ username: safeUsername, userType });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  if (userType === 'grouphead' && groupname && user.profileData?.groupName !== groupname) {
    throw new ApiError(401, 'Invalid group name');
  }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    );
});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        };
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken},
                "Access token refreshed"
            )
        );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const updateProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(422, "Invalid profile data", errors.array());
    }
    const { profileData } = req.body;

    if (!profileData) {
        throw new ApiError(400, "Profile data is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                profileData: {
                    ...req.user.profileData,
                    ...profileData
                }
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateProfile,
    getCurrentUser
};
