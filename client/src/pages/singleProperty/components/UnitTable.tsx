/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";

import Swal from "sweetalert2";
import UnitFilter from "./UnitFilter";
import UnitFormModal from "./UnitFormModal";

import PaymentFormModal from "../../payment/components/PaymentFormModal";

import type { TUnit } from "../../../shared/utils/allTypes";
import { formatMoney } from "../../../shared/utils/format";
import { deleteUnit, getErrorMessage, getUnits } from "../service/unitService";
import type { TPageDetails } from "../../../shared/utils/contents";
import PaginationSection from "../../../shared/components/PaginationSection";
import TenantFormModal from "../../tenantService/components/TenantFormModal";
import TableSkeleton from "../../../shared/components/TableSkeleton";

type Props = {
  propertyId: string;
  refreshKey: number;
  onChanged: () => void;
};

const COLUMNS = 8;

const UnitTable = ({ propertyId, refreshKey, onChanged }: Props) => {
  const [allUnits, setAllUnits] = useState<TUnit[]>([]);
  const [pageDetails, setPageDetails] = useState<TPageDetails>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editUnit, setEditUnit] = useState<TUnit | null>(null);
  const [tenantUnit, setTenantUnit] = useState<TUnit | null>(null);
  const [paymentUnit, setPaymentUnit] = useState<TUnit | null>(null);

  const getAllUnits = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getUnits({
        property: propertyId,
        status: status || undefined,
        page,
        limit,
      });

      setAllUnits(response.data);
      setPageDetails(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUnits();
  }, [propertyId, status, page, refreshKey]);

  const totalPage = pageDetails?.totalPage || 1;

  const handleDelete = async (unitId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete unit",
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

      const response = await deleteUnit(unitId);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Unit has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onChanged();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: getErrorMessage(err),
      });
    }
  };

  const actionBtn =
    "px-3 rounded cursor-pointer text-sm bg-[#4640DE] text-white font-medium py-1 transition duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div>
      <div className="bg-white md:px-6 px-4 md:py-3 border border-gray-300 rounded-xl mt-6 overflow-hidden">
        <UnitFilter status={status} setStatus={setStatus} setPage={setPage} />

        <div className="w-full min-h-[40vh] md:py-2 py-2 mt-1.5 overflow-x-auto customescroll">
          <table className="w-full text-left border-collapse min-w-275 ">
            <thead>
              <tr className="bg-[#F3F5F6] text-[#464255] md:text-[16px] text-[13px] font-bold">
                <th className="md:p-4 truncate p-2">Unit No</th>
                <th className="md:p-4 truncate p-2">Floor</th>
                <th className="md:p-4 truncate p-2">Monthly Rent</th>
                <th className="md:p-4 truncate p-2">Status</th>
                <th className="md:p-4 truncate p-2">Tenant</th>
                <th className="md:p-4 truncate p-2">Add Tenant</th>
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
              ) : allUnits.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS}
                    className="p-6 text-center text-sm text-gray-500"
                  >
                    No units found
                  </td>
                </tr>
              ) : (
                allUnits.map((unit) => (
                  <tr
                    key={unit._id}
                    className="border-b md:text-[16px] text-[13px] text-[#464255] border-[#E1E1E1] hover:bg-gray-50"
                  >
                    <td className="md:p-4 truncate p-2">{unit.unitNumber}</td>
                    <td className="md:p-4 truncate p-2">{unit.floor}</td>
                    <td className="md:p-4 truncate p-2">
                      {formatMoney(unit.monthlyRent)}
                    </td>
                    <td className="md:p-4 truncate p-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          unit.status === "occupied"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {unit.status}
                      </span>
                    </td>
                    <td className="md:p-4 truncate p-2">
                      {unit.currentTenant?.name ?? "-"}
                    </td>
                    <td className="md:p-4 truncate p-2">
                      <button
                        onClick={() => setTenantUnit(unit)}
                        disabled={unit.status === "occupied"}
                        className={actionBtn}
                      >
                        Add Tenant
                      </button>
                    </td>
                    <td className="md:p-4 truncate p-2">
                      <button
                        onClick={() => setPaymentUnit(unit)}
                        disabled={!unit.currentTenant}
                        className={actionBtn}
                      >
                        Add Payment
                      </button>
                    </td>
                    <td className="md:p-4 truncate p-2">
                      <div className="space-y-2">
                        <button
                          onClick={() => setEditUnit(unit)}
                          className="px-7 rounded cursor-pointer text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 transition duration-200"
                        >
                          Edit
                        </button>
                        <br />
                        <button
                          onClick={() => handleDelete(unit._id)}
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

      {editUnit && (
        <UnitFormModal
          propertyId={propertyId}
          unit={editUnit}
          onClose={() => setEditUnit(null)}
          onSuccess={onChanged}
        />
      )}

      {tenantUnit && (
        <TenantFormModal
          unit={tenantUnit}
          onClose={() => setTenantUnit(null)}
          onSuccess={onChanged}
        />
      )}

      {paymentUnit && paymentUnit.currentTenant && (
        <PaymentFormModal
          tenantId={paymentUnit.currentTenant._id}
          tenantName={paymentUnit.currentTenant.name}
          unitNumber={paymentUnit.unitNumber}
          amount={paymentUnit.monthlyRent}
          onClose={() => setPaymentUnit(null)}
          onSuccess={onChanged}
        />
      )}
    </div>
  );
};

export default UnitTable;
