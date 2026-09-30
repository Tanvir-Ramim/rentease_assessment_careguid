/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import TenantFilter, { type TTenantFilters } from "./TenantFilter";
import TenantFormModal from "./TenantFormModal";
import TableSkeleton from "../../../shared/components/TableSkeleton";

import type { TTenant } from "../../../shared/utils/allTypes";
import { formatDate } from "../../../shared/utils/format";
import {
  deleteTenant,
  getErrorMessage,
  getTenants,
  moveOutTenant,
} from "../service/tenantService";
import type { TPageDetails } from "../../../shared/utils/contents";
import PaginationSection from "../../../shared/components/PaginationSection";
import PaymentFormModal from "../../payment/components/PaymentFormModal";

const COLUMNS = 8;

const TenantTable = () => {
  const [allTenants, setAllTenants] = useState<TTenant[]>([]);
  const [pageDetails, setPageDetails] = useState<TPageDetails>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [payTenant, setPayTenant] = useState<TTenant | null>(null);
  const [filters, setFilters] = useState<TTenantFilters>({
    searchTerm: "",
    property: "",
    moveInFrom: "",
    moveInTo: "",
  });
  const [page, setPage] = useState(1);
  const limit = 8;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editTenant, setEditTenant] = useState<TTenant | null>(null);

  const getAllTenants = async () => {
    try {
      if (
        filters.moveInFrom &&
        filters.moveInTo &&
        filters.moveInTo < filters.moveInFrom
      )
        return;
      setLoading(true);
      setError("");
      const response = await getTenants({
        searchTerm: filters.searchTerm || undefined,
        property: filters.property || undefined,
        moveInFrom: filters.moveInFrom || undefined,
        moveInTo: filters.moveInTo || undefined,
        page,
        limit,
      });

      setAllTenants(response.data);
      setPageDetails(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTenants();
  }, [filters, page]);

  const totalPage = pageDetails?.totalPage || 1;

  const handleMoveOut = async (tenantId: string) => {
    const result = await Swal.fire({
      title: "Move out this tenant?",
      text: "The unit will become vacant.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4640DE",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, move out",
    });

    if (!result.isConfirmed) return;

    try {
      await moveOutTenant(tenantId);
      toast.success("Tenant moved out successfully");
      getAllTenants();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: getErrorMessage(err),
      });
    }
  };

  const handleDelete = async (tenantId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone! If this is a current tenant, the unit will become vacant.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete tenant",
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

      const response = await deleteTenant(tenantId);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Tenant has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        getAllTenants();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: getErrorMessage(err),
      });
    }
  };

  return (
    <div>
      <div className="bg-white md:px-6 px-4 md:py-3 border border-gray-300 rounded-xl mt-6 overflow-hidden">
        <TenantFilter
          filters={filters}
          setFilters={setFilters}
          setPage={setPage}
        />

        <div className="w-full min-h-[54vh] md:py-2 py-2 mt-1.5 overflow-x-auto customescroll">
          <table className="w-full text-left border-collapse min-w-275 ">
            <thead>
              <tr className="bg-[#F3F5F6] text-[#464255] md:text-[16px] text-[13px] font-bold">
                <th className="md:p-4 truncate p-2">Name</th>
                <th className="md:p-4 truncate p-2">Phone</th>
                <th className="md:p-4 truncate p-2">Unit</th>
                <th className="md:p-4 truncate p-2">Property</th>
                <th className="md:p-4 truncate p-2">Move-in</th>
                <th className="md:p-4 truncate p-2">Status</th>
                <th className="md:p-4 truncate p-2">Payment</th>
                <th className="md:p-4 p-2 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton columns={COLUMNS} rows={6} />
              ) : error ? (
                <tr>
                  <td
                    colSpan={COLUMNS}
                    className="p-6 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : allTenants.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS}
                    className="p-6 text-center text-sm text-gray-500"
                  >
                    No tenants found
                  </td>
                </tr>
              ) : (
                allTenants.map((tenant) => (
                  <tr
                    key={tenant._id}
                    className="border-b md:text-[16px] text-[13px] text-[#464255] border-[#E1E1E1] hover:bg-gray-50"
                  >
                    <td className="md:p-4 truncate p-2">{tenant.name}</td>
                    <td className="md:p-4 truncate p-2">{tenant.phone}</td>
                    <td className="md:p-4 truncate p-2">{tenant.unit}</td>
                    <td className="md:p-4 truncate p-2">{tenant.property}</td>
                    <td className="md:p-4 truncate p-2">
                      {formatDate(tenant.moveInDate)}
                    </td>
                    <td className="md:p-4 truncate p-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          tenant.moveOutDate
                            ? "bg-gray-100 text-gray-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {tenant.moveOutDate ? "Moved out" : "Current"}
                      </span>
                      {tenant.moveOutDate && (
                        <span className="block ml-0.5 mt-0.5 ">
                          {formatDate(tenant.moveOutDate)}
                        </span>
                      )}
                    </td>
                    <td className="md:p-4 truncate p-2">
                      <button
                        onClick={() => setPayTenant(tenant)}
                        disabled={!!tenant.moveOutDate || tenant.paidThisMonth}
                        className="px-3 rounded cursor-pointer text-sm bg-[#4640DE] text-white font-medium py-1 transition duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {tenant.paidThisMonth ? "Paid" : "Pay"}
                      </button>
                    </td>
                    <td className="md:p-4 truncate p-2">
                      <div className="space-y-2">
                        <button
                          onClick={() => setEditTenant(tenant)}
                          className="px-7 rounded cursor-pointer text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 transition duration-200"
                        >
                          Edit
                        </button>
                        <br />
                        {!tenant.moveOutDate && (
                          <>
                            <button
                              onClick={() => handleMoveOut(tenant._id)}
                              className="px-2.5 rounded cursor-pointer text-sm bg-amber-500 hover:bg-amber-600 text-white font-medium py-1 transition duration-200"
                            >
                              Move Out
                            </button>

                            <br />
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(tenant._id)}
                          className="px-5.5 cursor-pointer rounded bg-red-500 hover:bg-red-600 text-white font-medium py-1 text-sm transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationSection page={page} setPage={setPage} totalPage={totalPage} />

      {editTenant && (
        <TenantFormModal
          tenant={editTenant}
          onClose={() => setEditTenant(null)}
          onSuccess={getAllTenants}
        />
      )}
      {payTenant && (
        <PaymentFormModal
          tenantId={payTenant._id}
          tenantName={payTenant.name}
          unitNumber={payTenant.unit}
          amount={payTenant.monthlyRent}
          onClose={() => setPayTenant(null)}
          onSuccess={getAllTenants}
        />
      )}
    </div>
  );
};

export default TenantTable;
