// pages/tenant/components/TenantFormModal.tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import type { TTenant, TUnit } from "../../../shared/utils/allTypes";
import { createTenant, getErrorMessage, updateTenant } from "../service/tenantService";

type Props = {
  unit?: TUnit; 
  tenant?: TTenant; 
  onClose: () => void;
  onSuccess: () => void;
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none";

const fields = [
  { name: "name", label: "Name", type: "text", placeholder: "Karim Hossain" },
  { name: "phone", label: "Phone", type: "text", placeholder: "01711000000" },
  { name: "email", label: "Email", type: "email", placeholder: "karim@example.com" },
  { name: "moveInDate", label: "Move-in Date", type: "date", placeholder: "" },
] as const;

const TenantFormModal = ({ unit, tenant, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    name: tenant?.name || "",
    phone: tenant?.phone || "",
    email: tenant?.email || "",
    moveInDate: tenant ? tenant.moveInDate.slice(0, 10) : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.phone.trim().length < 5) newErrors.phone = "Valid phone is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      newErrors.email = "Valid email is required";
    if (!form.moveInDate) newErrors.moveInDate = "Move-in date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      moveInDate: form.moveInDate,
    };

    try {
      setSubmitting(true);
      if (tenant) {
        await updateTenant(tenant._id, payload);
        toast.success("Tenant updated successfully");
      } else if (unit) {
        await createTenant({ ...payload, unit: unit._id });
        toast.success("Tenant added successfully");
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
          {tenant ? "Edit Tenant" : `Add Tenant - Unit ${unit?.unitNumber}`}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="text-sm font-medium text-[#464255]">{f.label}</label>
              <input
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className={inputClass}
                type={f.type}
              />
              {errors[f.name] && (
                <p className="mt-1 text-xs text-red-500">{errors[f.name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer bg-[#4640DE] text-white px-4 py-2 transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? "Uploading..." : tenant ? "Update" : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TenantFormModal;