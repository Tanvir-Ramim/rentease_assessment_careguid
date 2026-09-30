// pages/property/components/PropertyFormModal.tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

import type { TProperty } from "../../../shared/utils/allTypes";
import {
  createProperty,
  getErrorMessage,
  updateProperty,
} from "../service/propertyService";
import { cities } from "../../../shared/utils/contents";
import { RxCross2 } from "react-icons/rx";

type Props = {
  property?: TProperty | null;
  onClose: () => void;
  onSuccess: () => void;
};

const inputClass =
  "w-full rounded-md border border-gray-300 px-4 py-2 text-sm outline-none";

const PropertyFormModal = ({ property, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    name: property?.name || "",
    address: property?.address || "",
    city: property?.city || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    const payload = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city,
    };

    try {
      setSubmitting(true);
      if (property) {
        await updateProperty(property._id, payload);
        toast.success("Property updated successfully");
      } else {
        await createProperty(payload);
        toast.success("Property created successfully");
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

        <h3 className="md:text-xl text-lg font-bold text-gray-900 mb-4 pr-6">
          {property ? "Edit Property" : "Add Property"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#464255]">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Green View Apartments"
              className={inputClass}
              type="text"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-[#464255]">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="12 Main Road"
              className={inputClass}
              type="text"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-[#464255]">City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="mt-1 text-xs text-red-500">{errors.city}</p>
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
            {submitting ? "Uploading..." : property ? "Update" : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;
