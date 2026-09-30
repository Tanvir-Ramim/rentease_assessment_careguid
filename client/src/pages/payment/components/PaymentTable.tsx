/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

import PaymentFilter, { type TPaymentFilters } from "./PaymentFilter";
import TableSkeleton from "../../../shared/components/TableSkeleton";

import type {  TPayment } from "../../../shared/utils/allTypes";
import { currentMonth, formatDate, formatMoney } from "../../../shared/utils/format";
import { getErrorMessage, getPayments } from "../service/paymentService";
import type { TPageDetails } from "../../../shared/utils/contents";
import PaginationSection from "../../../shared/components/PaginationSection";

const COLUMNS = 7;

const PaymentTable = () => {
  const [allPayments, setAllPayments] = useState<TPayment[]>([]);
  const [pageDetails, setPageDetails] = useState<TPageDetails>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const [filters, setFilters] = useState<TPaymentFilters>({
    month: currentMonth(),
    property: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const limit = 8;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAllPayments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getPayments({
        month: filters.month || undefined,
        property: filters.property || undefined,
        status: filters.status || undefined,
        page,
        limit,
      });

      setAllPayments(response.data);
      setPageDetails(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPayments();
  }, [filters, page]);

  const totalPage = pageDetails?.totalPage || 1;

  return (
    <div>
      <div className="bg-white md:px-6 px-4 md:py-3 border border-gray-300 rounded-xl mt-6 overflow-hidden">
        <PaymentFilter filters={filters} setFilters={setFilters} setPage={setPage} />

        <div className="w-full min-h-[54vh] md:py-2 py-2 mt-1.5 overflow-x-auto customescroll">
          <table className="w-full text-left border-collapse min-w-275 ">
            <thead>
              <tr className="bg-[#F3F5F6] text-[#464255] md:text-[16px] text-[13px] font-bold">
                <th className="md:p-4 truncate p-2">Tenant</th>
                <th className="md:p-4 truncate p-2">Unit</th>
                <th className="md:p-4 truncate p-2">Property</th>
                <th className="md:p-4 truncate p-2">Month</th>
                <th className="md:p-4 truncate p-2">Amount</th>
                <th className="md:p-4 truncate p-2">Paid Date</th>
                <th className="md:p-4 p-2 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton columns={COLUMNS} rows={6} />
              ) : error ? (
                <tr>
                  <td colSpan={COLUMNS} className="p-6 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              ) : allPayments.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS} className="p-6 text-center text-sm text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                allPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b md:text-[16px] text-[13px] text-[#464255] border-[#E1E1E1] hover:bg-gray-50"
                  >
                    <td className="md:p-4 truncate p-2">{payment.tenant}</td>
                    <td className="md:p-4 truncate p-2">{payment.unit}</td>
                    <td className="md:p-4 truncate p-2">{payment.property}</td>
                    <td className="md:p-4 truncate p-2">{payment.month}</td>
                    <td className="md:p-4 truncate p-2">{formatMoney(payment.amount)}</td>
                    <td className="md:p-4 truncate p-2">{formatDate(payment.paidDate)}</td>
                    <td className="md:p-4 truncate p-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          payment.status === "paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationSection page={page} setPage={setPage} totalPage={totalPage} />
    </div>
  );
};

export default PaymentTable;