/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { CiFilter } from "react-icons/ci";
import useProperties from "../../../shared/hooks/useProperties";

export type TTenantFilters = {
  searchTerm: string;
  property: string;
  moveInFrom: string;
  moveInTo: string;
};

interface Props {
  filters: TTenantFilters;
  setFilters: Dispatch<SetStateAction<TTenantFilters>>;
  setPage: (page: number) => void;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none";
const labelClass = "mb-1 block text-xs font-medium text-[#464255]";

const TenantFilter = ({ filters, setFilters, setPage }: Props) => {
  const properties = useProperties();
  const [searchValue, setSearchValue] = useState(filters.searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setFilters((prev) => ({ ...prev, searchTerm: searchValue }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const update = (key: keyof TTenantFilters, value: string) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // end date must be the same as or after the start date
  const dateError =
    filters.moveInFrom && filters.moveInTo && filters.moveInTo < filters.moveInFrom
      ? "End date must be the same as or after the start date"
      : "";

  const dateClass = `w-full rounded-md border px-4 py-2 text-sm outline-none ${
    dateError ? "border-red-400" : "border-gray-300"
  }`;

  // 🔹 Reset Filters
  const handleResetFilters = () => {
    setSearchValue("");
    setFilters({ searchTerm: "", property: "", moveInFrom: "", moveInTo: "" });
    setPage(1);
  };

  return (
    <div className="w-full flex @6xl:flex-row flex-col @6xl:items-center justify-between sm:py-4 py-2.5">
      <h2 className="md:text-lg 6xl:pb-0 pb-2 pt-2 font-semibold text-[#0A0A0A]">
        Filters By:
      </h2>

      <div>
        <div className="flex sm:flex-row flex-col sm:items-end items-center gap-3 relative">
          <div className="w-full">
            <label className={labelClass}>Search</label>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Name or phone"
              className={inputClass}
              type="text"
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
            <label className={labelClass}>Move-in from</label>
            <input
              value={filters.moveInFrom}
              max={filters.moveInTo || undefined}
              onChange={(e) => update("moveInFrom", e.target.value)}
              className={dateClass}
              type="date"
            />
          </div>

          <div className="w-full">
            <label className={labelClass}>Move-in to</label>
            <input
              value={filters.moveInTo}
              min={filters.moveInFrom || undefined}
              onChange={(e) => update("moveInTo", e.target.value)}
              className={dateClass}
              type="date"
            />
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

        {dateError && <p className="mt-2 text-xs text-red-500">{dateError}</p>}
      </div>
    </div>
  );
};

export default TenantFilter;