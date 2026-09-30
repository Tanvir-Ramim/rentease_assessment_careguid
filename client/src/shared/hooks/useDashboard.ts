
import { useEffect, useState } from "react";
import Api from "../utils/api";

export type TSummary = {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  activeTenants: number;
  rentCollectedThisMonth: number;
  month: string;
};
export type TMonthlyRent = { month: string; total: number; payments: number };
export type TOccupancy = {
  propertyId: string;
  name: string;
  totalUnits: number;
  occupiedUnits: number;
};
export type TTopUnpaid = {
  propertyId: string;
  name: string;
  unpaidTenants: number;
  amountDue: number;
};

export type TDashboardData = {
  summary: TSummary;
  monthlyRent: TMonthlyRent[];
  occupancy: TOccupancy[];
  topUnpaid: TTopUnpaid[];
};

const useDashboard = () => {
  const [data, setData] = useState<TDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      Api.get("/dashboard/summary"),
      Api.get("/dashboard/monthly-rent"),
      Api.get("/dashboard/occupancy"),
      Api.get("/dashboard/top-unpaid"),
    ])
      .then(([summary, monthlyRent, occupancy, topUnpaid]) => {
        setData({
          summary: summary.data.data,
          monthlyRent: monthlyRent.data.data,
          occupancy: occupancy.data.data,
          topUnpaid: topUnpaid.data.data,
        });
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

export default useDashboard;