
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user!;

  const data = await paymentServices.createPaymentService(payload, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment recorded successfully",
    data,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const query = req.query as Record<string, string | undefined>;

  const result = await paymentServices.getAllPaymentsService(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getUnpaidTenants = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const query = req.query as Record<string, string | undefined>;

  const result = await paymentServices.getUnpaidTenantsService(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unpaid tenants retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const PaymentControllers = {
  createPayment,
  getAllPayments,
  getUnpaidTenants,
};