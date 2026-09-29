import {
  FiAlertCircle,
  FiDollarSign,
  FiGrid,
  FiHome,
  FiLock,
  FiUnlock,
  FiUsers,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useDashboard from "../../../shared/hooks/useDashboard";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { StatCard } from "../components/StatCard";
import { Empty, Section } from "../components/SectionAndEmpy";

const formatMoney = (n: number) =>
  `৳${new Intl.NumberFormat("en-BD").format(n)}`;

const Dashboard = () => {
  const { data, loading, error } = useDashboard();

  if (loading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-4 text-center">
        <FiAlertCircle className="text-5xl text-red-500" />
        <p className="text-gray-700">{error || "Something went wrong"}</p>
      </div>
    );
  }

  const { summary, monthlyRent, occupancy, topUnpaid } = data;

  const occupancyData = occupancy.map((p) => ({
    name: p.name,
    Occupied: p.occupiedUnits,
    Vacant: p.totalUnits - p.occupiedUnits,
  }));

  return (
    <div className=" space-y-6  ">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Properties"
          value={summary.totalProperties}
          icon={FiHome}
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Total units"
          value={summary.totalUnits}
          icon={FiGrid}
          color="bg-sky-50 text-sky-600"
        />
        <StatCard
          title="Occupied units"
          value={summary.occupiedUnits}
          icon={FiLock}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Vacant units"
          value={summary.vacantUnits}
          icon={FiUnlock}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Active tenants"
          value={summary.activeTenants}
          icon={FiUsers}
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          title={`Rent collected (${summary.month})`}
          value={formatMoney(summary.rentCollectedThisMonth)}
          icon={FiDollarSign}
          color="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Monthly rent collected" subtitle="Last 12 months">
          {monthlyRent.length === 0 ? (
            <Empty text="No payments yet" />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRent}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    width={48}
                    tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                  />
                  <Tooltip formatter={(v) => formatMoney(Number(v))} />
                  <Bar
                    dataKey="total"
                    name="Collected"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Section>

        <Section
          title="Occupancy per property"
          subtitle="Occupied vs vacant units"
        >
          {occupancyData.length === 0 ? (
            <Empty text="No units yet" />
          ) : (
            <div className="w-full overflow-y-auto" style={{ maxHeight: 288 }}>
              <div style={{ height: Math.max(280, occupancyData.length * 34) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Occupied" stackId="a" fill="#10b981" />
                    <Bar
                      dataKey="Vacant"
                      stackId="a"
                      fill="#fbbf24"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </Section>
      </div>

      {/* Top unpaid */}
      <Section
        title="Top unpaid properties"
        subtitle={`Current tenants who have not paid for ${summary.month}`}
      >
        {topUnpaid.length === 0 ? (
          <Empty text="Everyone has paid this month" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="pb-3 pr-4 font-medium">#</th>
                  <th className="pb-3 pr-4 font-medium">Property</th>
                  <th className="pb-3 pr-4 font-medium">Unpaid tenants</th>
                  <th className="pb-3 text-right font-medium">Amount due</th>
                </tr>
              </thead>
              <tbody>
                {topUnpaid.map((p, i) => (
                  <tr
                    key={p.propertyId}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3 pr-4 text-gray-400">{i + 1}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                        {p.unpaidTenants}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-900">
                      {formatMoney(p.amountDue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
};

export default Dashboard;
