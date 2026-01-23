
import Expense from "../model/expense.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";  
import Group from "../model/group.model.js";
import User from "../model/user.model.js";

// Utility to generate and persist tokens for a user
export const generateAccessToken = async (userId) => {
   try {
      const user = await User.findById(userId);
      if (!user) {
         throw new ApiError(404, "user not found for token generation");
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
   } catch (err) {
      throw new ApiError(500, err.message || "something went wrong in token generation");
   }
};


export const registerUser = asyncHandler(async (req, res) => {
   const { name = "", email = "", password = "", phonenumber = "" } = req.body;

   // Validate all fields
   if ([name, email, password, phonenumber].some((field) => String(field).trim() === "")) {
      throw new ApiError(400, "All fields are required");
   }

   // Check if user already exists
   const existedUser = await User.findOne({
      $or: [{ name: name.toLowerCase() }, { email }]
   });
   
   if (existedUser) {
      throw new ApiError(400, "User with email or username already exists");
   }

   // Create user
   const user = await User.create({
      name: name.toLowerCase(),
      email,
      password,
      phonenumber
   });

   // Fetch created user without sensitive data
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );
   
   if (!createdUser) {
      throw new ApiError(500, "Something went wrong when creating user");
   }

   return res.status(201).json(
      new ApiResponse(201, createdUser, "User registered successfully")
   );
});

export const loginUser = asyncHandler(async (req, res) => {
   const { name, password } = req.body;

   if (!name) {
      throw new ApiError(400, "username is required");
   }

   const user = await User.findOne({ name: name.toLowerCase() });
   if (!user) {
      throw new ApiError(404, "user not found");
   }

   const isCorrect = await user.comparePassword(password);
   if (!isCorrect) {
      throw new ApiError(401, "incorrect password");
   }

   const { accessToken, refreshToken } = await generateAccessToken(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json(
         new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully"
         )
      );
});


export const logoutUser = asyncHandler(async (req, res,next) => {
   await User.findByIdAndUpdate(
      req.user._id, {
      $set: {
         refreshToken: undefined
      }
   },
      {
         new: true
      }
   )
   const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
   }
   return res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken", option).json(
      new ApiResponse(200, {}, "user logged out successfully")
   )
});

// export default{
//   registerUser,
//    loginUser,
//    logoutUser
// }
