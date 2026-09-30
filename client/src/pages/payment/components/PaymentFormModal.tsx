// pages/payment/components/PaymentFormModal.tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { currentMonth } from "../../../shared/utils/format";
import { createPayment, getErrorMessage } from "../service/paymentService";

type Props = {
  tenantId: string;
  tenantName: string;
  unitNumber: string;
  amount: number; // default amount (the unit's rent)
  onClose: () => void;
  onSuccess: () => void;
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none";

const PaymentFormModal = ({
  tenantId,
  tenantName,
  unitNumber,
  amount,
  onClose,
  onSuccess,
}: Props) => {
  const [form, setForm] = useState({
    month: currentMonth(),
    amount: String(amount),
    paidDate: new Date().toISOString().slice(0, 10),
    status: "paid",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.month) newErrors.month = "Month is required";
    if (!form.amount || Number(form.amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (form.status === "paid" && !form.paidDate)
      newErrors.paidDate = "Paid date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    try {
      setSubmitting(true);
      await createPayment({
        tenant: tenantId,
        month: form.month,
        amount: Number(form.amount),
        status: form.status as "paid" | "unpaid",
        paidDate: form.status === "paid" ? form.paidDate : undefined,
      });
      toast.success("Payment recorded successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error)); // e.g. duplicate month (409)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-black/50">
      <div className="bg-white rounded-lg p-6  modal-slide-down relative w-[90%] max-w-md">
        <button
          className="absolute cursor-pointer top-3 right-3 text-red-400"
          onClick={onClose}
          disabled={submitting}
        >
          <RxCross2 size={25} />
        </button>

        <h3 className="md:text-xl text-lg font-bold text-gray-900 mb-4 pr-8">
          Add Payment
        </h3>

        <div className="mb-4 rounded-md bg-[#F3F5F6] px-4 py-3 text-sm text-[#464255]">
          <p>
            Tenant: <span className="font-semibold">{tenantName}</span>
          </p>
          <p>
            Unit: <span className="font-semibold">{unitNumber}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#464255]">Month</label>
            <input
              name="month"
              value={form.month}
              onChange={handleChange}
              className={inputClass}
              type="month"
            />
            {errors.month && <p className="mt-1 text-xs text-red-500">{errors.month}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-[#464255]">Amount</label>
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className={inputClass}
              type="number"
            />
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-[#464255]">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {form.status === "paid" && (
            <div>
              <label className="text-sm font-medium text-[#464255]">Paid Date</label>
              <input
                name="paidDate"
                value={form.paidDate}
                onChange={handleChange}
                className={inputClass}
                type="date"
              />
              {errors.paidDate && (
                <p className="mt-1 text-xs text-red-500">{errors.paidDate}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer bg-[#4640DE] text-white px-4 py-2 transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentFormModal;