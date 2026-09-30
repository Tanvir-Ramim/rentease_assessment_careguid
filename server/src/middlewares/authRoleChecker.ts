
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import config from "../config";
import { catchAsync } from "../utils/catchAsync";
import appError from "../utils/appError";
import { User } from "../modules/auth/auth.model";
import { authServices } from "../modules/auth/auth.service";
import { jwtUtils } from "../utils/jwt";

type Role = "admin" | "manager";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
      };
    }
  }
}


const sessionExpired = (res: Response, message: string) => {
  res.status(httpStatus.UNAUTHORIZED).json({
    success: false,
    statusCode: httpStatus.UNAUTHORIZED,
    message,
    errorCode: "SESSION_EXPIRED",
  });
};


const getUserIdFromToken = (token?: string) => {
  if (!token) return null;

  const verified = jwtUtils.verifyToken(token, config.jwt_access_secret);
  if (!verified.success) return null;

  return (verified.data as JwtPayload).id as string;
};

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    let userId = getUserIdFromToken(token);


    if (!userId) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        sessionExpired(res, "You are not logged in. Please log in again");
        return;
      }

      try {
        const { accessToken } =
          await authServices.refreshTokenService(refreshToken);

        userId = getUserIdFromToken(accessToken);
        if (!userId) throw new Error("Invalid new access token");


        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 1000 * 60 * 60 * 24,
        });
      } catch {
        sessionExpired(res, "Session expired. Please log in again");
        return;
      }
    }

    const user = await User.findById(userId);

    if (!user) {
      sessionExpired(res, "User not found. Please log in again");
      return;
    }

    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new appError(
        "Forbidden. You don't have permission to access",
        httpStatus.FORBIDDEN,
      );
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  });
};