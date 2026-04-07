import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center pb-8 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name || "User"}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/create-project")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20"
            >
              Post a Project
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 hover:bg-red-600/20 hover:text-red-500 border border-gray-700 hover:border-red-500/50 rounded-lg transition-all"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Project Status
            </h3>
            <p className="mt-4 text-2xl font-bold italic text-blue-500">Active</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </h3>
            <p className="mt-4 text-2xl font-bold">$1,240.00</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Role
            </h3>
            <p className="mt-4 text-lg font-semibold text-gray-300">
               {user?.role || "CLIENT"}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
