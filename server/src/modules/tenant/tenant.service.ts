// tenant.service.ts
import httpStatus from "http-status";
import { Types } from "mongoose";
import appError from "../../utils/appError";
import { checkPropertyAccess, propertyScopeMatch } from "../../utils/roleScope";
import { Unit } from "../unit/unit.model";
import { Tenant } from "./tenant.model";
import { ITenant } from "./tenant.inteface";


type AuthUser = { id: string; role: "admin" | "manager" };

const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


const findTenantWithAccess = async (id: string, user: AuthUser) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new appError("Tenant not found", httpStatus.NOT_FOUND);
  }

  const tenant = await Tenant.findById(id);
  if (!tenant) {
    throw new appError("Tenant not found", httpStatus.NOT_FOUND);
  }

  await checkPropertyAccess(tenant.property.toString(), user);
  return tenant;
};

const createTenantService = async (
  payload: Pick<ITenant, "name" | "phone" | "email" | "moveInDate"> & {
    unit: string;
  },
  user: AuthUser,
) => {
  if (!Types.ObjectId.isValid(payload.unit)) {
    throw new appError("Unit not found", httpStatus.NOT_FOUND);
  }

  const unit = await Unit.findById(payload.unit);
  if (!unit) {
    throw new appError("Unit not found", httpStatus.NOT_FOUND);
  }

  await checkPropertyAccess(unit.property.toString(), user);

  const occupied = await Unit.findOneAndUpdate(
    { _id: unit._id, status: "vacant" },
    { status: "occupied" },
  );
  if (!occupied) {
    throw new appError("Unit is not vacant", httpStatus.BAD_REQUEST);
  }

  try {
    return await Tenant.create({ ...payload, property: unit.property });
  } catch (error) {
    await Unit.findByIdAndUpdate(unit._id, { status: "vacant" });
    throw error;
  }
};

const getAllTenantsService = async (
  user: AuthUser,
  query: Record<string, string | undefined>,
) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.property) {
    if (!Types.ObjectId.isValid(query.property)) {
      throw new appError("Property not found", httpStatus.NOT_FOUND);
    }
    filter.property = new Types.ObjectId(query.property);
  }

  if (query.moveInFrom || query.moveInTo) {
    const range: Record<string, Date> = {};
    if (query.moveInFrom) range.$gte = new Date(query.moveInFrom);
    if (query.moveInTo) range.$lte = new Date(query.moveInTo);

    if (Object.values(range).some((d) => isNaN(d.getTime()))) {
      throw new appError("Invalid date filter", httpStatus.BAD_REQUEST);
    }
    filter.moveInDate = range;
  }

  if (query.searchTerm) {
    const regex = { $regex: escapeRegex(query.searchTerm), $options: "i" };
    filter.$or = [{ name: regex }, { phone: regex }];
  }

  const result = await Tenant.aggregate([
    await propertyScopeMatch(user), 
    { $match: filter },
    {
      $facet: {
        data: [
          { $sort: { moveInDate: -1 } },
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
              email: 1,
              unit: "$unit.unitNumber",
              property: "$property.name",
              moveInDate: 1,
              moveOutDate: 1,
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

const updateTenantService = async (
  id: string,
  payload: Partial<Pick<ITenant, "name" | "phone" | "email" | "moveInDate">>,
  user: AuthUser,
) => {
  await findTenantWithAccess(id, user);

  const { name, phone, email, moveInDate } = payload;

  return Tenant.findByIdAndUpdate(
    id,
    { name, phone, email, moveInDate },
    { new: true, runValidators: true },
  );
};

const moveOutTenantService = async (
  id: string,
  payload: { moveOutDate?: Date },
  user: AuthUser,
) => {
  const tenant = await findTenantWithAccess(id, user);

  if (tenant.moveOutDate) {
    throw new appError("Tenant has already moved out", httpStatus.BAD_REQUEST);
  }

  const moveOutDate = payload.moveOutDate
    ? new Date(payload.moveOutDate)
    : new Date();

  if (moveOutDate < tenant.moveInDate) {
    throw new appError(
      "Move-out date cannot be before move-in date",
      httpStatus.BAD_REQUEST,
    );
  }

  tenant.moveOutDate = moveOutDate;
  await tenant.save();

  await Unit.findByIdAndUpdate(tenant.unit, { status: "vacant" }); // free the unit

  return tenant;
};

const deleteTenantService = async (id: string, user: AuthUser) => {
  const tenant = await findTenantWithAccess(id, user);

  if (!tenant.moveOutDate) {
    await Unit.findByIdAndUpdate(tenant.unit, { status: "vacant" });
  }

  await tenant.deleteOne();
};

export const tenantServices = {
  createTenantService,
  getAllTenantsService,
  updateTenantService,
  moveOutTenantService,
  deleteTenantService,
};