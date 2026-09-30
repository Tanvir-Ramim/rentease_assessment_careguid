
import type { Dispatch, SetStateAction } from "react";
import { CiFilter } from "react-icons/ci";
import useProperties from "../../../shared/hooks/useProperties";
import { currentMonth } from "../../../shared/utils/format";

export type TPaymentFilters = {
  month: string;
  property: string;
  status: string;
};

interface Props {
  filters: TPaymentFilters;
  setFilters: Dispatch<SetStateAction<TPaymentFilters>>;
  setPage: (page: number) => void;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none";
const labelClass = "mb-1 block text-xs font-medium text-[#464255]";

const PaymentFilter = ({ filters, setFilters, setPage }: Props) => {
  const properties = useProperties();

  const update = (key: keyof TPaymentFilters, value: string) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Reset Filters
  const handleResetFilters = () => {
    setFilters({ month: currentMonth(), property: "", status: "" });
    setPage(1);
  };

  return (
    <div className="w-full flex @6xl:flex-row flex-col @6xl:items-center justify-between sm:py-4 py-2.5">
      <h2 className="md:text-lg 6xl:pb-0 pb-2 pt-2 font-semibold text-[#0A0A0A]">
        Filters By:
      </h2>

      <div className="flex sm:flex-row flex-col sm:items-end items-center gap-3 relative">
        <div className="w-full">
          <label className={labelClass}>Month</label>
          <input
            value={filters.month}
            onChange={(e) => update("month", e.target.value)}
            className={inputClass}
            type="month"
          />
        </div>

        <div className="w-full">
          <label className={labelClass}>Property</label>
          <select
            className={`${inputClass} cursor-pointer`}
            value={filters.property}
            onChange={(e) => update("property", e.target.value)}
          >
            <option value="">All Properties</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className={labelClass}>Status</label>
          <select
            className={`${inputClass} cursor-pointer`}
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex w-full gap-2.5">
          <button
            onClick={handleResetFilters}
            className="rounded-md flex items-center gap-1 px-4 py-2 cursor-pointer border border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <CiFilter className="text-blue-500" />
            <span className="text-blue-500 text-sm">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilter;