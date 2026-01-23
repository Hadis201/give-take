import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
    try {


        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unauthenticated")
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "invalid access token")
        }

        req.user = user
        next()

    } catch (err) {
       throw new ApiError(401,err?.message ||"invalid access token")
    }

})

