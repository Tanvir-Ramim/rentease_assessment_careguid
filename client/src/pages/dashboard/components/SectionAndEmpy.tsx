import type { ReactNode } from "react";
import { FiInbox } from "react-icons/fi";

export const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="mb-4 text-sm text-gray-500">{subtitle}</p>}
    {!subtitle && <div className="mb-4" />}
    {children}
  </div>
);

export const Empty = ({ text }: { text: string }) => (
  <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-400">
    <FiInbox className="text-3xl" />
    <p className="text-sm">{text}</p>
  </div>
);
