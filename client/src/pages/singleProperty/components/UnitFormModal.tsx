
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import type { TUnit } from "../../../shared/utils/allTypes";
import { createUnit, getErrorMessage, updateUnit } from "../service/unitService";

type Props = {
  propertyId: string;
  unit?: TUnit | null;
  onClose: () => void;
  onSuccess: () => void;
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none";

const UnitFormModal = ({ propertyId, unit, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    unitNumber: unit?.unitNumber || "",
    floor: unit ? String(unit.floor) : "",
    monthlyRent: unit ? String(unit.monthlyRent) : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.unitNumber.trim()) newErrors.unitNumber = "Unit number is required";

    if (form.floor === "") newErrors.floor = "Floor is required";
    else if (!Number.isInteger(Number(form.floor)))
      newErrors.floor = "Floor must be a whole number";

    if (form.monthlyRent === "") newErrors.monthlyRent = "Monthly rent is required";
    else if (Number(form.monthlyRent) <= 0)
      newErrors.monthlyRent = "Monthly rent must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    const payload = {
      unitNumber: form.unitNumber.trim(),
      floor: Number(form.floor),
      monthlyRent: Number(form.monthlyRent),
    };

    try {
      setSubmitting(true);
      if (unit) {
        await updateUnit(unit._id, payload);
        toast.success("Unit updated successfully");
      } else {
        await createUnit({ ...payload, property: propertyId });
        toast.success("Unit created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
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
          {unit ? "Edit Unit" : "Add Unit"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#464255]">Unit Number</label>
            <input
              name="unitNumber"
              value={form.unitNumber}
              onChange={handleChange}
              placeholder="A-302"
              className={inputClass}
              type="text"
            />
            {errors.unitNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.unitNumber}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-[#464255]">Floor</label>
            <input
              name="floor"
              value={form.floor}
              onChange={handleChange}
              placeholder="3"
              className={inputClass}
              type="number"
            />
            {errors.floor && (
              <p className="mt-1 text-xs text-red-500">{errors.floor}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-[#464255]">Monthly Rent</label>
            <input
              name="monthlyRent"
              value={form.monthlyRent}
              onChange={handleChange}
              placeholder="15000"
              className={inputClass}
              type="number"
            />
            {errors.monthlyRent && (
              <p className="mt-1 text-xs text-red-500">{errors.monthlyRent}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer bg-[#4640DE] text-white px-4 py-2 transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? "Uploading..." : unit ? "Update" : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnitFormModal;