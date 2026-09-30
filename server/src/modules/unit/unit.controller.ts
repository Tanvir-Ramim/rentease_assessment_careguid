
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { unitServices } from "./unit.service";

const createUnit = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user!;

  const data = await unitServices.createUnitService(payload, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Unit created successfully",
    data,
  });
});

const getAllUnits = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const query = req.query as Record<string, string | undefined>;

  const result = await unitServices.getAllUnitsService(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Units retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateUnit = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const user = req.user!;

  const data = await unitServices.updateUnitService(id, payload, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unit updated successfully",
    data,
  });
});

const deleteUnit = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user!;

  await unitServices.deleteUnitService(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unit deleted successfully",
  });
});

export const UnitControllers = {
  createUnit,
  getAllUnits,
  updateUnit,
  deleteUnit,
};