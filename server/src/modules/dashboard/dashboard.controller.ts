
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { dashboardServices } from "./dashboard.service";

const getSummary = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;

  const data = await dashboardServices.getSummaryService(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard summary retrieved successfully",
    data,
  });
});

const getMonthlyRent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;

  const data = await dashboardServices.getMonthlyRentService(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monthly rent retrieved successfully",
    data,
  });
});

const getOccupancy = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;

  const data = await dashboardServices.getOccupancyService(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Occupancy retrieved successfully",
    data,
  });
});

const getTopUnpaid = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const query = req.query as Record<string, string | undefined>;

  const data = await dashboardServices.getTopUnpaidService(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top unpaid properties retrieved successfully",
    data,
  });
});

export const DashboardControllers = {
  getSummary,
  getMonthlyRent,
  getOccupancy,
  getTopUnpaid,
};