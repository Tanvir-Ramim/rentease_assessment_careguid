import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authServices } from "./auth.service";
import appError from "../../utils/appError";
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

const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const { accessToken, refreshToken } =
    await authServices.loginAuthService(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 10,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged in successfully",
    data: { accessToken, refreshToken },
  });
});

const getMeController = catchAsync(async (req: Request, res: Response) => {
  const user = await authServices.getMeService(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("ramim vai", refreshToken);
    if (!refreshToken) {
      throw new appError("You are not logged in", httpStatus.UNAUTHORIZED);
    }
    const { accessToken } =
      await authServices.refreshTokenService(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Token Refreshed Successfully",
      data: {
        accessToken,
      },
    });
  },
);

const logoutController = catchAsync(async (req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged out successfully",
  });
});

const getManagersController = catchAsync(
  async (req: Request, res: Response) => {
    const data = await authServices.getManagersService();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Managers retrieved successfully",
      data,
    });
  },
);

export const AuthControllers = {
  registerController,
  loginUserController,
  getMeController,
  refreshTokenController,
  logoutController,
  getManagersController,
};
