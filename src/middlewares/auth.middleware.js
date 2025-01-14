import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// to verify user is there or not

export const verifyJWT = asyncHandler(async (req, res, next) => {

  try {
    //get token
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");

    // verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // find user
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    // chck user
    if (!user) throw new ApiError(401, "Invalid Access Token");

    //add new obj in req
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || `invalid access token`)
  }
  
})