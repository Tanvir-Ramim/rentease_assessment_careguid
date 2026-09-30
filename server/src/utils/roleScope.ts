import { Types } from "mongoose";
import { Property } from "../modules/property/property.model";
import httpStatus from "http-status";

import appError from "./appError";

type ScopeUser = { id: string; role: "admin" | "manager" };

export const roleScopeMatch = (user: ScopeUser, field = "managers") => {
  if (user.role === "admin") return { $match: {} };
  return { $match: { [field]: new Types.ObjectId(user.id) } };
};

export const propertyScopeMatch = async (
  user: ScopeUser,
  field = "property",
) => {
  if (user.role === "admin") return { $match: {} };

  const properties = await Property.find({ managers: user.id })
    .select("_id")
    .lean();

  return { $match: { [field]: { $in: properties.map((p) => p._id) } } };
};

export const checkPropertyAccess = async (
  propertyId: string,
  user: ScopeUser,
) => {
  if (!Types.ObjectId.isValid(propertyId)) {
    throw new appError("Property not found", httpStatus.NOT_FOUND);
  }

  const filter: Record<string, unknown> = { _id: propertyId };
  if (user.role === "manager") filter.managers = user.id;

  const property = await Property.exists(filter);
  if (!property) {
    throw new appError("Property not found", httpStatus.NOT_FOUND);
  }
};
