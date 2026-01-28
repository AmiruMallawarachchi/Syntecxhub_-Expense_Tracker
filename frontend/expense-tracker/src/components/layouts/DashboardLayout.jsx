import { NavLink, useNavigate } from "react-router-dom";
import { FaChartPie, FaMoneyBillWave, FaWallet } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useUser } from "../../context/UserContext";

const DashboardLayout = ({ children }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="w-[260px] bg-white border-r border-slate-100 min-h-screen px-6 py-8">
          <h2 className="text-lg font-semibold text-slate-800">Expense Tracker</h2>

          <div className="flex items-center gap-3 mt-8">
            <img
              src={user?.profileImageUrl || "https://i.pravatar.cc/100?img=32"}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {user?.fullName || "User"}
              </p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <FaChartPie className="text-lg" />
              Dashboard
            </NavLink>
            <NavLink
              to="/income"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <FaWallet className="text-lg" />
              Income
            </NavLink>
            <NavLink
              to="/expense"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <FaMoneyBillWave className="text-lg" />
              Expense
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 w-full"
            >
              <FiLogOut className="text-lg" />
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
