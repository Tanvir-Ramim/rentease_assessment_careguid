
const UnitTableSkeleton = ({
  columns,
  rows,
}: {
  columns: number;
  rows: number;
}) => (
  <>
    {Array.from({ length: rows }).map((_, r) => (
      <tr key={r} className="border-b border-[#E1E1E1]">
        {Array.from({ length: columns }).map((_, c) => (
          <td key={c} className="md:p-4 p-2">
            <div className="h-4 w-full max-w-30 animate-pulse rounded bg-gray-200" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default UnitTableSkeleton;