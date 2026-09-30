// pages/property/components/AssignManagersModal.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import type { TManager, TProperty } from "../../../shared/utils/allTypes";
import {
  assignManagers,
  getErrorMessage,
  getManagers,
} from "../service/propertyService";
import { RxCross2 } from "react-icons/rx";

type Props = {
  property: TProperty;
  onClose: () => void;
  onSuccess: () => void;
};

const AssignManagersModal = ({ property, onClose, onSuccess }: Props) => {
  const [managers, setManagers] = useState<TManager[]>([]);
  const [selected, setSelected] = useState<string[]>(property.managers || []);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getManagers()
      .then(setManagers)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoadingList(false));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      await assignManagers(property._id, selected);
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

        <h3 className="md:text-xl text-lg font-bold text-gray-900 pr-6">
          Assign Managers
        </h3>
        <p className="text-sm text-gray-500 mb-4">{property.name}</p>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {loadingList ? (
            <p className="text-sm text-gray-500">Loading managers...</p>
          ) : managers.length === 0 ? (
            <p className="text-sm text-gray-500">No managers found</p>
          ) : (
            managers.map((m) => (
              <label
                key={m._id}
                className="flex items-center gap-3 rounded-md border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(m._id)}
                  onChange={() => toggle(m._id)}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#464255] truncate">
                    {m.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{m.email}</p>
                </div>
              </label>
            ))
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={submitting || loadingList}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer bg-[#4640DE] text-white px-4 py-2 transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AssignManagersModal;
