/* eslint-disable react-hooks/set-state-in-effect */
// pages/property/components/FilterSection.tsx
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { cities } from "../../../shared/utils/contents";


interface FilterSectionProps {
  name: string;
  setName: (name: string) => void;
  city: string;
  setCity: (city: string) => void;
  setPage: (page: number) => void;
}

const FilterSection = ({
  name,
  setName,
  city,
  setCity,
  setPage,
}: FilterSectionProps) => {
  const [searchValue, setSearchValue] = useState(name);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setName(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // 🔹 Reset Filters
  const handleResetFilters = () => {
    setSearchValue("");
    setName("");
    setCity("");
    setPage(1);
  };

  return (
    <div className="w-full flex @6xl:flex-row flex-col @6xl:items-center justify-between sm:py-4 py-2.5">
      <h2 className="md:text-lg 6xl:pb-0 pb-2 pt-2 font-semibold text-[#0A0A0A]">
        Filters By:
      </h2>

      <div className="flex sm:flex-row flex-col items-center gap-3 relative">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Property name"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none"
          type="text"
        />

        <select
          className="w-full cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm outline-none"
          value={city}
          onChange={(e) => {
            setPage(1);
            setCity(e.target.value);
          }}
        >
          <option value="">Select City</option>
          {cities?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

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

export default FilterSection;