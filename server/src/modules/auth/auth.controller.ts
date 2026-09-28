import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authServices } from "./auth.service";
const registerController = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await authServices.registerAuthService(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Register Successfully",
    data: user,
  });
});

export const AuthControllers = {
  registerController,
};
