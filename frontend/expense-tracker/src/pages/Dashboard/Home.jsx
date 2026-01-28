import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate, groupLast30Days } from "../../utils/helper";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { FaArrowUpRightDots, FaArrowDown, FaArrowUp } from "react-icons/fa6";

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.SUMMARY);
      setDashboardData(response.data);
    } catch (error) {
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const summary = dashboardData?.summary || {
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0
  };

  const pieData = [
    { name: "Total Balance", value: summary.totalBalance, color: "#7C3AED" },
    { name: "Total Expenses", value: summary.totalExpense, color: "#EF4444" },
    { name: "Total Income", value: summary.totalIncome, color: "#F97316" }
  ];

  const last30DaysChart = groupLast30Days(dashboardData?.last30DaysExpenses || []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-slate-600">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(summary.totalBalance)}
          icon={<FaArrowUpRightDots />}
          color="bg-purple-100 text-purple-600"
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={<FaArrowUp />}
          color="bg-orange-100 text-orange-500"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpense)}
          icon={<FaArrowDown />}
          color="bg-red-100 text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">Recent Transactions</h4>
          </div>
          <div className="mt-5 space-y-4">
            {(dashboardData?.recentTransactions || []).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                    {item.icon || "💰"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    item.type === "income" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h4 className="text-sm font-semibold text-slate-800">Financial Overview</h4>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={95}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
            {pieData.map((item) => (
              <span key={item.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h4 className="text-sm font-semibold text-slate-800">Expenses</h4>
          <div className="mt-4 space-y-4">
            {(dashboardData?.expenseList || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                    {item.icon || "🛍️"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.category}</p>
                    <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-500">
                  -{formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h4 className="text-sm font-semibold text-slate-800">Last 30 Days Expenses</h4>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last30DaysChart}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="amount" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h4 className="text-sm font-semibold text-slate-800">Last 60 Days Income</h4>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dashboardData?.last60DaysIncome || []} dataKey="amount" outerRadius={95}>
                  {(dashboardData?.last60DaysIncome || []).map((entry, index) => (
                    <Cell
                      key={`${entry.title}-${index}`}
                      fill={["#7C3AED", "#EF4444", "#F97316", "#10B981"][index % 4]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-600 flex flex-wrap gap-3">
            {(dashboardData?.last60DaysIncome || []).map((item, index) => (
              <span key={`${item.title}-${index}`} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: ["#7C3AED", "#EF4444", "#F97316", "#10B981"][index % 4] }}
                />
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h4 className="text-sm font-semibold text-slate-800">Income</h4>
          <div className="mt-4 space-y-4">
            {(dashboardData?.incomeList || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                    {item.icon || "💼"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  +{formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;

const SummaryCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <h4 className="text-xl font-semibold text-slate-800 mt-1">{value}</h4>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  );
};
