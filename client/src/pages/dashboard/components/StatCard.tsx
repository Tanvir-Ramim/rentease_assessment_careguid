import type { IconType } from "react-icons";
type StatCardProps = {
  title: string;
  value: string | number;
  icon: IconType;
  color: string;
};
export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) => (
  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${color}`}
    >
      <Icon />
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm text-gray-500">{title}</p>
      <p className="truncate text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);
