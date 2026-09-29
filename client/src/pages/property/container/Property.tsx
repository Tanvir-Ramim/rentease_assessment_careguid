// pages/property/container/Property.tsx
import { useState } from "react";
import { FaBuilding } from "react-icons/fa";

import useGetMe from "../../../shared/hooks/useGetMe";
import PropertyTable from "../components/PropertyTable";
import PropertyFormModal from "../components/PropertyFormModal";

const Property = () => {
  const { user } = useGetMe();
  const isAdmin = user?.role === "admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="@container">
      <div className="flex mt-2   @sm:flex-row flex-col @sm:items-center justify-between">
        <div className="flex items-center gap-3    w-fit">
          <div className="md:px-3  px-2 border border-gray-300 md:py-3 py-2 bg-white   rounded-xl flex items-center justify-center">
            <FaBuilding className="text-primary" />
          </div>

          <p className="md:text-xl text-lg font-bold text-gray-900 leading-tight">
            Property List
          </p>
        </div>

        {isAdmin && (
          <div className="flex justify-end h-fit @xl:mt-0 mt-3 gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`
        flex items-center  sm:gap-2 gap-0.5 rounded-lg  font-medium    cursor-pointer
     bg-[#4640DE]   text-white
      sm:px-4 px-2  sm:py-2 py-1.5
        transition-all duration-200 
        hover:opacity-90
    
      `}
            >
              <span className=" md:text-base text-sm ">+ Add Property</span>
            </button>
          </div>
        )}
      </div>

      <PropertyTable isAdmin={isAdmin} refreshKey={refreshKey} />

      {isModalOpen && (
        <PropertyFormModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default Property;
