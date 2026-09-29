
import httpStatus from "http-status";
import { Types } from "mongoose";
import appError from "../../utils/appError";

import { User } from "../auth/auth.model";
import { Property } from "./property.model";
import { IProperty } from "./property.interface";
import { roleScopeMatch } from "../../utils/roleScope";
import { Unit } from "../unit/unit.model";

type AuthUser = { id: string; role: "admin" | "manager" };

const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createPropertyService = async (
  payload: Pick<IProperty, "name" | "address" | "city">,
) => {
  return Property.create(payload);
};

const getAllPropertiesService = async (
  user: AuthUser,
  query: Record<string, string | undefined>,
) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (query.searchTerm) {
    filter.name = { $regex: escapeRegex(query.searchTerm), $options: "i" };
  }
  if (query.city) filter.city = query.city;

  const result = await Property.aggregate([
    roleScopeMatch(user),
    { $match: filter },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              name: 1,
              address: 1,
              city: 1,
              managers: 1,
              createdAt: 1,
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

const getSinglePropertyService = async (id: string, user: AuthUser) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new appError("Property not found", httpStatus.NOT_FOUND);
  }

  const filter: Record<string, unknown> = { _id: id };
  if (user.role === "manager") filter.managers = user.id;

  const property = await Property.findOne(filter)
    .populate("managers", "name email")
    .lean();

  if (!property) {
    throw new appError("Property not found", httpStatus.NOT_FOUND);
  }

  const units = await Unit.find({ property: id }).lean();
  const occupiedUnits = units.filter(
    (u: any) => u.status === "occupied",
  ).length;

  return {
    ...property,
    units,
    totalUnits: units.length,
    occupiedUnits,
  };
};
const updatePropertyService = async (
  id: string,
  payload: Partial<IProperty>,
) => {
  const property = await Property.findByIdAndUpdate(
    id,
    { name: payload.name, address: payload.address, city: payload.city },
    { new: true, runValidators: true },
  );
  if (!property) {
    throw new appError("Property not found", httpStatus.NOT_FOUND);
  }
  return property;
};

const deletePropertyService = async (id: string) => {
  const property = await Property.findByIdAndDelete(id);
  if (!property) {
    throw new appError("Property not found", httpStatus.NOT_FOUND);
  }
  return property;
};

const assignManagersService = async (id: string, managerIds: string[]) => {
  const uniqueIds = [...new Set(managerIds)];

  const count = await User.countDocuments({
    _id: { $in: uniqueIds },
    role: "manager",
  });
  if (count !== uniqueIds.length) {
    throw new appError(
      "One or more users are not valid managers",
      httpStatus.BAD_REQUEST,
    );
  }

  const property = await Property.findByIdAndUpdate(
    id,
    { managers: uniqueIds },
    { new: true },
  );
  if (!property) {
    throw new appError("Property not found", httpStatus.NOT_FOUND);
  }
  return property;
};

export const propertyServices = {
  createPropertyService,
  getAllPropertiesService,
  getSinglePropertyService,
  updatePropertyService,
  deletePropertyService,
  assignManagersService,
};
