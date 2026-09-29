import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import z from "zod";
import appError from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return catchAsync((req: Request, res: Response, next: NextFunction) => {
    const payload = req.body ?? {};
    const result = zodSchema.safeParse(payload);
    if (!result.success) {
      throw new appError(
        result.error.issues[0]?.message!,
        httpStatus.BAD_REQUEST,
      );
    }

    req.body = result.data;
    next();
  });
};
