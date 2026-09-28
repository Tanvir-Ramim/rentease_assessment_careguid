import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import config from "../config";
import { catchAsync } from "../utils/catchAsync";
import appError from "../utils/appError";
import { User } from "../modules/auth/auth.model";
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

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new appError(
        "You are not logged in. Please log in to access this resource",
        httpStatus.UNAUTHORIZED,
      );
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new appError("Invalid Token", httpStatus.UNAUTHORIZED);
    }

    const { id } = verifiedToken.data as JwtPayload;

    const user = await User.findById(id);

    if (!user) {
      throw new appError(
        "User not found. Please log in again",
        httpStatus.NOT_FOUND,
      );
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
