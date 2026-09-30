/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import FilterSection from "./FilterSection";

import PropertyFormModal from "./PropertyFormModal";

import type { TProperty } from "../../../shared/utils/allTypes";
import {
  deleteProperty,
  getErrorMessage,
  getProperties,
} from "../service/propertyService";
import type { TPageDetails } from "../../../shared/utils/contents";

import AssignManagersModal from "./AssignManagersModal ";
import PaginationSection from "../../../shared/components/PaginationSection";
import { Link } from "react-router-dom";
import TableSkeleton from "../../../shared/components/TableSkeleton";

type Props = {
  isAdmin: boolean;
  refreshKey: number;
};

const PropertyTable = ({ isAdmin, refreshKey }: Props) => {
  const [allProperties, setAllProperties] = useState<TProperty[]>([]);
  const [pageDetails, setPageDetails] = useState<TPageDetails>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const [page, setPage] = useState(1);
  const limit = 8;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editProperty, setEditProperty] = useState<TProperty | null>(null);
  const [assignProperty, setAssignProperty] = useState<TProperty | null>(null);

  const getAllProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProperties({
        searchTerm: name || undefined,
        city: city || undefined,
        page,
        limit,
      });

      setAllProperties(response.data);
      setPageDetails(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProperties();
  }, [name, city, page, refreshKey]);

  const totalPage = pageDetails?.totalPage || 1;

  const handleDelete = async (propertyId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete property",
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await deleteProperty(propertyId);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Property has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        getAllProperties();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: getErrorMessage(err),
      });
    }
  };

  const columns = isAdmin ? 6 : 5;

  return (
    <div>
      <div className="bg-white md:px-6 px-4 md:py-3 border border-gray-300 rounded-xl mt-6 overflow-hidden">
        <FilterSection
          name={name}
          setName={setName}
          city={city}
          setCity={setCity}
          setPage={setPage}
        />

        <div className="w-full min-h-[54vh] md:py-2 py-2 mt-1.5 overflow-x-auto customescroll">
          <table className="w-full text-left border-collapse min-w-275 ">
            <thead>
              <tr className="bg-[#F3F5F6] text-[#464255] md:text-[16px] text-[13px] font-bold">
                <th className="md:p-4 truncate p-2">Name</th>
                <th className="md:p-4 truncate p-2">Address</th>
                <th className="md:p-4 truncate p-2">City</th>
                <th className="md:p-4 truncate p-2">Managers</th>
                {isAdmin && <th className="md:p-4 truncate p-2">Assign</th>}
                {isAdmin && <th className="md:p-4 p-2 rounded-r-lg">Action</th>}
                <th className="md:p-4 truncate p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton columns={columns} rows={10} />
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns}
                    className="p-6 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : allProperties.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns}
                    className="p-6 text-center text-sm text-gray-500"
                  >
                    No properties found
                  </td>
                </tr>
              ) : (
                allProperties.map((property) => (
                  <tr
                    key={property._id}
                    className="border-b md:text-[16px] text-[13px] text-[#464255] border-[#E1E1E1] hover:bg-gray-50"
                  >
                    <td className="md:p-4 truncate p-2">{property.name}</td>
                    <td className="md:p-4 truncate p-2">{property.address}</td>
                    <td className="md:p-4 truncate p-2">{property.city}</td>
                    <td className="md:p-4 truncate p-2">
                      {property.managers?.length ?? 0}
                    </td>
                    {isAdmin && (
                      <td className="md:p-4 truncate p-2">
                        {" "}
                        <button
                          onClick={() => setAssignProperty(property)}
                          className="px-2 rounded cursor-pointer text-sm bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-1 transition duration-200"
                        >
                          Managers
                        </button>
                      </td>
                    )}
                    {isAdmin && (
                      <td className=" truncate ">
                        <div className="space-y-2 py-2">
                          <div>
                            <button
                              onClick={() => setEditProperty(property)}
                              className="px-7.5   rounded cursor-pointer text-sm bg-[#4640DE] hover:bg-blue-600 text-white font-medium py-1 transition duration-200"
                            >
                              Edit
                            </button>
                          </div>

                          <button
                            onClick={() => handleDelete(property._id)}
                            className="px-5.5 cursor-pointer rounded bg-red-500 hover:bg-red-600 text-white font-medium py-1 text-sm transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                    <td className="md:p-4 truncate p-2">
                      <Link
                        to={`/properties/${property._id}`}
                        className="inline-block px-3 rounded cursor-pointer text-sm bg-[#4640DE] hover:opacity-90 text-white font-medium py-1 transition duration-200"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationSection page={page} setPage={setPage} totalPage={totalPage} />

      {editProperty && (
        <PropertyFormModal
          property={editProperty}
          onClose={() => setEditProperty(null)}
          onSuccess={getAllProperties}
        />
      )}

      {assignProperty && (
        <AssignManagersModal
          property={assignProperty}
          onClose={() => setAssignProperty(null)}
          onSuccess={() => {
            toast.success("Managers assigned successfully");
            getAllProperties();
          }}
        />
      )}
    </div>
  );
};

export default PropertyTable;
