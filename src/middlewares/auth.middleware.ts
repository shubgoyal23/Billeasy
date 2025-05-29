import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    let token = req.cookies.accessToken || req.headers.accesstoken;
    token = token?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "AccessToken not found");
    }
    const decodedToken: string | jwt.JwtPayload = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    );

    if (typeof decodedToken === "string") {
      throw new ApiError(401, "Invalid token");
    }
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "user not found");
    }
    user.password = undefined;
    user.refreshToken = undefined;
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "user not loggedin");
  }
});
