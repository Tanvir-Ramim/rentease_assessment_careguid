
import { CiFilter } from "react-icons/ci";

interface UnitFilterProps {
  status: string;
  setStatus: (status: string) => void;
  setPage: (page: number) => void;
}

const UnitFilter = ({ status, setStatus, setPage }: UnitFilterProps) => {
  const handleResetFilters = () => {
    setStatus("");
    setPage(1);
  };

  return (
    <div className="w-full flex @6xl:flex-row flex-col @6xl:items-center justify-between sm:py-4 py-2.5">
      <h2 className="md:text-lg 6xl:pb-0 pb-2 pt-2 font-semibold text-[#0A0A0A]">
        Units
      </h2>

      <div className="flex sm:flex-row flex-col items-center gap-3 relative">
        <select
          className="w-full cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm outline-none"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
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

export default UnitFilter;