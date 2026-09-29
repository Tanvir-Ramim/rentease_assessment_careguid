
import { propertyScopeMatch, roleScopeMatch } from "../../utils/roleScope";
import { Property } from "../property/property.model";
import { Unit } from "../unit/unit.model";
import { Tenant } from "../tenant/tenant.model";
import { Payment } from "../payment/payment.model";

type AuthUser = { id: string; role: "admin" | "manager" };

const currentMonth = () => new Date().toISOString().slice(0, 7); // "2026-10"

const getSummaryService = async (user: AuthUser) => {
  const scope = await propertyScopeMatch(user);
  const month = currentMonth();

  const [properties, units, tenants, rent] = await Promise.all([
    Property.aggregate([roleScopeMatch(user), { $count: "count" }]),
    Unit.aggregate([
      scope,
      {
        $group: {
          _id: null,
          totalUnits: { $sum: 1 },
          occupiedUnits: {
            $sum: { $cond: [{ $eq: ["$status", "occupied"] }, 1, 0] },
          },
        },
      },
    ]),
    Tenant.aggregate([scope, { $match: { moveOutDate: null } }, { $count: "count" }]),
    Payment.aggregate([
      scope,
      { $match: { month, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const totalUnits = units[0]?.totalUnits || 0;
  const occupiedUnits = units[0]?.occupiedUnits || 0;

  return {
    totalProperties: properties[0]?.count || 0,
    totalUnits,
    occupiedUnits,
    vacantUnits: totalUnits - occupiedUnits,
    activeTenants: tenants[0]?.count || 0,
    rentCollectedThisMonth: rent[0]?.total || 0,
    month,
  };
};


const getMonthlyRentService = async (user: AuthUser) => {
  return Payment.aggregate([
    await propertyScopeMatch(user),
    { $match: { status: "paid" } },
    { $group: { _id: "$month", total: { $sum: "$amount" }, payments: { $sum: 1 } } },
    { $sort: { _id: -1 } },
    { $limit: 12 },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, month: "$_id", total: 1, payments: 1 } },
  ]);
};


const getOccupancyService = async (user: AuthUser) => {
  return Unit.aggregate([
    await propertyScopeMatch(user),
    {
      $group: {
        _id: "$property",
        totalUnits: { $sum: 1 },
        occupiedUnits: {
          $sum: { $cond: [{ $eq: ["$status", "occupied"] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "_id",
        as: "property",
      },
    },
    { $unwind: "$property" },
    { $sort: { "property.name": 1 } },
    {
      $project: {
        _id: 0,
        propertyId: "$_id",
        name: "$property.name",
        totalUnits: 1,
        occupiedUnits: 1,
      },
    },
  ]);
};


const getTopUnpaidService = async (
  user: AuthUser,
  query: Record<string, string | undefined>,
) => {
  const month =
    query.month && /^\d{4}-(0[1-9]|1[0-2])$/.test(query.month)
      ? query.month
      : currentMonth();

  return Tenant.aggregate([
    await propertyScopeMatch(user),
    { $match: { moveOutDate: null } },
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
      $lookup: {
        from: "units",
        localField: "unit",
        foreignField: "_id",
        as: "unit",
      },
    },
    { $unwind: "$unit" },
    {
      $group: {
        _id: "$property",
        unpaidTenants: { $sum: 1 },
        amountDue: { $sum: "$unit.monthlyRent" },
      },
    },
    { $sort: { unpaidTenants: -1, amountDue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "_id",
        as: "property",
      },
    },
    { $unwind: "$property" },
    {
      $project: {
        _id: 0,
        propertyId: "$_id",
        name: "$property.name",
        unpaidTenants: 1,
        amountDue: 1,
      },
    },
  ]);
};

export const dashboardServices = {
  getSummaryService,
  getMonthlyRentService,
  getOccupancyService,
  getTopUnpaidService,
};