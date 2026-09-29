export  const DashboardSkeleton = () => (
  <div className=" animate-pulse space-y-6 ">
    <div className="h-8 w-48 rounded-lg bg-gray-200" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-gray-200" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="h-80 rounded-2xl bg-gray-200" />
      <div className="h-80 rounded-2xl bg-gray-200" />
    </div>
    <div className="h-64 rounded-2xl bg-gray-200" />
  </div>
);
