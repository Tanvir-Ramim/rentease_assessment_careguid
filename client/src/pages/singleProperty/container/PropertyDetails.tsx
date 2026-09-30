// pages/unit/container/PropertyDetails.tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaBuilding } from "react-icons/fa";

import type { TPropertyDetails } from "../../../shared/utils/allTypes";
import { getErrorMessage, getPropertyDetails } from "../service/unitService";

import UnitFormModal from "../components/UnitFormModal";
import UnitTable from "../components/UnitTable";

const PropertyDetails = () => {
  const { id } = useParams();
  const propertyId = id as string;

  const [details, setDetails] = useState<TPropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getPropertyDetails(propertyId)
      .then((data) => {
        setDetails(data);
        setError("");
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [propertyId, refreshKey]);

  if (loading) {
    return (
      <div className="mt-6 space-y-4 animate-pulse">
        <div className="h-10 w-64 rounded-lg bg-gray-200" />
        <div className="h-28 rounded-xl bg-gray-200" />
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <p className="text-red-500">{error || "Property not found"}</p>
        <Link
          to="/properties"
          className="rounded-lg bg-[#4640DE] px-4 py-2 text-white hover:opacity-90"
        >
          Back to properties
        </Link>
      </div>
    );
  }

  const vacantUnits = details.totalUnits - details.occupiedUnits;

  return (
    <div className="@container">
      <Link
        to="/properties"
        className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#4640DE]"
      >
        <FaArrowLeft /> Back to properties
      </Link>

      <div className="flex mt-3 @sm:flex-row flex-col @sm:items-center justify-between">
        <div className="flex items-center gap-3 w-fit">
          <div className="md:px-3 px-2 border border-gray-300 md:py-3 py-2 bg-white rounded-xl flex items-center justify-center">
            <FaBuilding className="text-[#4640DE]" />
          </div>

          <div>
            <p className="md:text-xl text-lg font-bold text-gray-900 leading-tight">
              {details.name}
            </p>
            <p className="text-sm text-gray-500">
              {details.address}, {details.city}
            </p>
          </div>
        </div>

        <div className="flex justify-end h-fit @xl:mt-0 mt-3 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`
        flex items-center  sm:gap-2 gap-0.5 rounded-lg  font-medium    cursor-pointer
     bg-[#4640DE]  text-white
      sm:px-4 px-2  sm:py-2 py-1.5
        transition-all duration-200 
        hover:opacity-90
    
      `}
          >
            <span className=" md:text-base text-sm text-white">+ Add Unit</span>
          </button>
        </div>
      </div>

      {/* Occupancy + managers */}
      <div className="mt-6 grid grid-cols-1 gap-4 @2xl:grid-cols-2">
        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <p className="text-sm text-gray-500">Occupancy</p>
          <p className="mt-1 text-lg font-bold text-gray-900">
            {details.occupiedUnits} of {details.totalUnits} units occupied
          </p>
          <p className="text-sm text-gray-500">{vacantUnits} vacant</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-[#4640DE]"
              style={{
                width: `${
                  details.totalUnits
                    ? (details.occupiedUnits / details.totalUnits) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl p-4">
          <p className="text-sm text-gray-500">Managers</p>
          {details.managers.length === 0 ? (
            <p className="mt-1 text-sm text-gray-500">No managers assigned</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {details.managers.map((m) => (
                <span
                  key={m._id}
                  className="rounded-full bg-[#F3F5F6] px-3 py-1 text-sm text-[#464255]"
                >
                  {m.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <UnitTable
        propertyId={propertyId}
        refreshKey={refreshKey}
        onChanged={() => setRefreshKey((k) => k + 1)}
      />

      {isModalOpen && (
        <UnitFormModal
          propertyId={propertyId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
