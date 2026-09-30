import httpStatus from "http-status";
import { Types } from "mongoose";
import appError from "../../utils/appError";
import { checkPropertyAccess, propertyScopeMatch } from "../../utils/roleScope";
import { Tenant } from "../tenant/tenant.model";
import { Payment } from "./payment.model";

type AuthUser = { id: string; role: "admin" | "manager" };

const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

const getPaging = (query: Record<string, string | undefined>) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const createPaymentService = async (
  payload: {
    tenant: string;
    month: string;
    amount: number;
    paidDate?: Date;
    status: "paid" | "unpaid";
  },
  user: AuthUser,
) => {
  if (!Types.ObjectId.isValid(payload.tenant)) {
    throw new appError("Tenant not found", httpStatus.NOT_FOUND);
  }

  const tenant = await Tenant.findById(payload.tenant);
  if (!tenant) {
    throw new appError("Tenant not found", httpStatus.NOT_FOUND);
  }

  await checkPropertyAccess(tenant.property.toString(), user);

  const exists = await Payment.exists({
    tenant: tenant._id,
    month: payload.month,
  });
  if (exists) {
    throw new appError(
      "A payment for this tenant and month already exists",
      httpStatus.CONFLICT,
    );
  }

  try {
    return await Payment.create({
      tenant: tenant._id,
      unit: tenant.unit,
      property: tenant.property,
      month: payload.month,
      amount: payload.amount,
      status: payload.status,
      paidDate:
        payload.status === "paid" ? (payload.paidDate ?? new Date()) : null,
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new appError(
        "A payment for this tenant and month already exists",
        httpStatus.CONFLICT,
      );
    }
    throw error;
  }
};

const currentMonth = () => new Date().toISOString().slice(0, 7);

const getAllPaymentsService = async (
  user: AuthUser,
  query: Record<string, string | undefined>,
) => {
  const { page, limit, skip } = getPaging(query);

  const month = query.month || currentMonth();
  if (!monthRegex.test(month)) {
    throw new appError("Month must be like 2026-10", httpStatus.BAD_REQUEST);
  }

  const [year, mon] = month.split("-").map(Number);
  const monthStart = new Date(Date.UTC(year!, mon! - 1, 1));
  const nextMonthStart = new Date(Date.UTC(year!, mon!, 1));

  const filter: Record<string, unknown> = {
    moveInDate: { $lt: nextMonthStart },
    $or: [{ moveOutDate: null }, { moveOutDate: { $gte: monthStart } }],
  };
  if (query.property) {
    if (!Types.ObjectId.isValid(query.property)) {
      throw new appError("Property not found", httpStatus.NOT_FOUND);
    }
    filter.property = new Types.ObjectId(query.property);
  }

  const statusMatch = query.status
    ? [{ $match: { status: query.status } }]
    : [];

  const result = await Tenant.aggregate([
    await propertyScopeMatch(user),
    { $match: filter },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "tenant",
        pipeline: [{ $match: { month } }],
        as: "payment",
      },
    },
    { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
    { $addFields: { status: { $ifNull: ["$payment.status", "unpaid"] } } },
    ...statusMatch,
    {
      $facet: {
        data: [
          { $sort: { "payment.createdAt": -1, name: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "units",
              localField: "unit",
              foreignField: "_id",
              as: "unit",
            },
          },
          {
            $lookup: {
              from: "properties",
              localField: "property",
              foreignField: "_id",
              as: "property",
            },
          },
          { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$property", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              tenant: "$name",
              unit: "$unit.unitNumber",
              property: "$property.name",
              month: { $literal: month },
              amount: { $ifNull: ["$payment.amount", "$unit.monthlyRent"] },
              paidDate: "$payment.paidDate",
              status: 1,
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = result[0].total[0]?.count || 0;

  return {
    data: result[0].data,
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
  };
};

const getUnpaidTenantsService = async (
  user: AuthUser,
  query: Record<string, string | undefined>,
) => {
  const { page, limit, skip } = getPaging(query);

  if (!query.month || !monthRegex.test(query.month)) {
    throw new appError(
      "Month is required, like 2026-10",
      httpStatus.BAD_REQUEST,
    );
  }
  const month = query.month;

  const filter: Record<string, unknown> = { moveOutDate: null };
  if (query.property) {
    if (!Types.ObjectId.isValid(query.property)) {
      throw new appError("Property not found", httpStatus.NOT_FOUND);
    }
    filter.property = new Types.ObjectId(query.property);
  }

  const result = await Tenant.aggregate([
    await propertyScopeMatch(user),
    { $match: filter },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "tenant",
        pipeline: [{ $match: { month, status: "paid" } }],
        as: "payments",
      },
    },
    { $match: { payments: { $size: 0 } } },
    {
      $facet: {
        data: [
          { $sort: { name: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "units",
              localField: "unit",
              foreignField: "_id",
              as: "unit",
            },
          },
          {
            $lookup: {
              from: "properties",
              localField: "property",
              foreignField: "_id",
              as: "property",
            },
          },
          { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
          { $unwind: { path: "$property", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              name: 1,
              phone: 1,
              unit: "$unit.unitNumber",
              property: "$property.name",
              rentDue: "$unit.monthlyRent",
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = result[0].total[0]?.count || 0;

  return {
    data: result[0].data,
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
  };
};

export const paymentServices = {
  createPaymentService,
  getAllPaymentsService,
  getUnpaidTenantsService,
};
