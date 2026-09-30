
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { tenantServices } from "./tenant.service";

const createTenant = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user!;

  const data = await tenantServices.createTenantService(payload, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tenant created successfully",
    data,
  });
});

const getAllTenants = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const query = req.query as Record<string, string | undefined>;

  const result = await tenantServices.getAllTenantsService(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tenants retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateTenant = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const user = req.user!;

  const data = await tenantServices.updateTenantService(id, payload, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tenant updated successfully",
    data,
  });
});

const moveOutTenant = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const user = req.user!;

  const data = await tenantServices.moveOutTenantService(id, payload, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tenant moved out successfully",
    data,
  });
});

const deleteTenant = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user!;

  await tenantServices.deleteTenantService(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tenant deleted successfully",
  });
});

export const TenantControllers = {
  createTenant,
  getAllTenants,
  updateTenant,
  moveOutTenant,
  deleteTenant,
};