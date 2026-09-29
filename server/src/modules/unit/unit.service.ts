
import httpStatus from "http-status";
import { Types } from "mongoose";
import appError from "../../utils/appError";
import { propertyScopeMatch } from "../../utils/roleScope";
import { Property } from "../property/property.model";
import { Unit } from "./unit.model";
import { IUnit } from "./unit.interface";

type AuthUser = { id: string; role: "admin" | "manager" };


const checkPropertyAccess = async (propertyId: string, user: AuthUser) => {
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


const findUnitWithAccess = async (id: string, user: AuthUser) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new appError("Unit not found", httpStatus.NOT_FOUND);
  }

  const unit = await Unit.findById(id);
  if (!unit) {
    throw new appError("Unit not found", httpStatus.NOT_FOUND);
  }

  await checkPropertyAccess(unit.property.toString(), user);
  return unit;
};

const createUnitService = async (
  payload: Pick<IUnit, "unitNumber" | "floor" | "monthlyRent"> & {
    property: string;
  },
  user: AuthUser,
) => {
  await checkPropertyAccess(payload.property, user);

  const exists = await Unit.exists({
    property: payload.property,
    unitNumber: payload.unitNumber,
  });
  if (exists) {
    throw new appError(
      "This unit number already exists in the property",
      httpStatus.CONFLICT,
    );
  }

  return Unit.create(payload);
};

const getAllUnitsService = async (
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
  if (query.status) filter.status = query.status;

  const result = await Unit.aggregate([
    await propertyScopeMatch(user), 
    { $match: filter }, 
    {
      $facet: {
        data: [
          { $sort: { unitNumber: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              property: 1,
              unitNumber: 1,
              floor: 1,
              monthlyRent: 1,
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

const updateUnitService = async (
  id: string,
  payload: Partial<Pick<IUnit, "unitNumber" | "floor" | "monthlyRent">>,
  user: AuthUser,
) => {
  const unit = await findUnitWithAccess(id, user);

  if (payload.unitNumber && payload.unitNumber !== unit.unitNumber) {
    const exists = await Unit.exists({
      property: unit.property,
      unitNumber: payload.unitNumber,
    });
    if (exists) {
      throw new appError(
        "This unit number already exists in the property",
        httpStatus.CONFLICT,
      );
    }
  }

  const { unitNumber, floor, monthlyRent } = payload;

  return Unit.findByIdAndUpdate(
    id,
    { unitNumber, floor, monthlyRent },
    { new: true, runValidators: true },
  );
};

const deleteUnitService = async (id: string, user: AuthUser) => {
  const unit = await findUnitWithAccess(id, user);

  if (unit.status === "occupied") {
    throw new appError(
      "Cannot delete an occupied unit. Move the tenant out first",
      httpStatus.BAD_REQUEST,
    );
  }

  await unit.deleteOne();
};

export const unitServices = {
  createUnitService,
  getAllUnitsService,
  updateUnitService,
  deleteUnitService,
};