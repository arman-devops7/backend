import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// this is gonna used more 
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // find user
    const user = await User.findById(userId);

    //generate access token
    const accessToken = user.generateAccessToken()
    //generate refresh token
    const refreshToken = user.generateRefreshToken()

    // saving refreshToken in db
    user.refreshToken = refreshToken;
    // save user (only saving refresh token nothing else so no need of password)
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Validation
  if ([fullName, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check for existing user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Handle file uploads
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath =
    req.files?.coverImage?.[0]?.path || null;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload files to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }

  // Create user in database
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
    email,
    password,
  });

  // Fetch the created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Error creating user");
  }

  res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  // get data from req body
  const { username, email, password } = req.body;

  // username or email based login check for one thing
  if (!username && !email) throw new ApiError(400, "Username or email is required");

  // find the user
  const user = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (!user) throw new ApiError(404, "User does not exist");

  // password checking
  const isPassword = await user.isPasswordCorrect(password);
  if (!isPassword) throw new ApiError(401, "Password incorrect");

  // accesstoken and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  // send cookie
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser, accessToken, refreshToken
      },
        "User logged in Successfully"
      )
    )

});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    // wht to uodt
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  // cookies clear
  const options = {
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "user Logged Out successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  // access refresh from cookie
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized Request");

  try {
    // we need raw token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process_params.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiError(401, "Invalid Refresh Token");

    if (incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh Token is Expired or used");

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToke", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed successfully"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token")
  }

})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};
