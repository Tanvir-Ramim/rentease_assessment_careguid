import { Types } from "mongoose";
import { Property } from "../modules/property/property.model";
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
