import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, X, Bell, User, Wallet, Shield } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, logout, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      "/dashboard": "Dashboard",
      "/marketplace": "Find projects",
      "/escrow": "Safe holding",
      "/profile": "My profile",
      "/kyc": "Verification",
      "/contracts": "Active projects",
      "/proposals": user?.role === "CLIENT" ? "Received bids" : "My bids",
      "/analytics": "Reports",
      "/messages": "Messages",
      "/disputes": "Support",
      "/create-project": "New project"
    };

    if (titles[path]) return titles[path];
    if (path.startsWith("/project/")) return "Project details";
    if (path.startsWith("/dispute/")) return "Resolution center";
    if (path.startsWith("/admin")) return "Solution center";
    return "Management";
  };

  if (user?.role?.toUpperCase() === "ADMIN" && location.pathname === "/dashboard") {
    navigate("/admin");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white relative">
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-zinc-900/50"
          />

          <div className="absolute top-0 left-0 h-screen z-[110]">
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="hidden lg:block fixed top-0 left-0 h-screen z-[110]">
        <Sidebar />
      </div>

      <div className="flex-grow flex flex-col lg:ml-56 min-h-screen relative w-full overflow-x-hidden">

        <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 px-4 py-3 lg:px-8 lg:py-5 flex justify-between items-center">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-zinc-50 rounded-xl transition-colors"
            >
              <Menu size={18} className="text-zinc-900" />
            </button>
            <div className="space-y-0.5 truncate">
              <h2 className="text-sm lg:text-base font-bold text-zinc-900 leading-none truncate tracking-tight">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {user?.role?.toUpperCase() === "CLIENT" && (
              <Link
                to="/create-project"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-[13px] font-bold rounded-lg hover:bg-black transition-all border border-zinc-900"
              >
                Post a project
              </Link>
            )}

            {user?.role?.toUpperCase() === "FREELANCER" && (
              <Link
                to="/marketplace"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-[13px] font-bold rounded-lg hover:bg-emerald-700 transition-all border border-emerald-600"
              >
                Find work
              </Link>
            )}

            {/* Hide Wallet for Admin */}
            {user?.role?.toUpperCase() !== "ADMIN" && (
              <Link
                to="/escrow"
                className="flex items-center gap-2.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-lg border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all bg-white"
              >
                <Wallet size={14} className="text-zinc-400 group-hover:text-zinc-900" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[8px] font-bold text-zinc-400 mb-0.5">Wallet</span>
                  <span className="text-[12px] font-bold text-zinc-900">
                    ${user?.walletBalance?.toLocaleString() || "0"}
                  </span>
                </div>
              </Link>
            )}

            <div className="hidden sm:flex w-10 h-10 rounded-lg border border-zinc-200 bg-white items-center justify-center cursor-pointer relative hover:bg-zinc-50 transition-colors">
              <Bell size={16} className="text-zinc-400" />
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute top-2.5 right-2.5 border-2 border-white"></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex pointer-events-none">
                <span className="text-[11px] font-bold text-zinc-900 tracking-tight leading-none uppercase">
                  {user?.name}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-[13px] font-bold hover:bg-black transition-colors"
                >
                  {user?.name?.[0] || "A"}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 py-2 overflow-hidden">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-b border-zinc-50"
                    >
                      <User size={14} />
                      My profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 w-full text-left"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-10 w-full overflow-x-hidden">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
