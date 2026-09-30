
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyServices } from "./property.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const data = await propertyServices.createPropertyService(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Property created successfully",
    data,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const query = req.query as Record<string, string | undefined>;

  const result = await propertyServices.getAllPropertiesService(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user!;

  const data = await propertyServices.getSinglePropertyService(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property retrieved successfully",
    data,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;

  const data = await propertyServices.updatePropertyService(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property updated successfully",
    data,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await propertyServices.deletePropertyService(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property deleted successfully",
  });
});

const assignManagers = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { managerIds } = req.body;

  const data = await propertyServices.assignManagersService(id, managerIds);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Managers assigned successfully",
    data,
  });
});

export const PropertyControllers = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  assignManagers,
};