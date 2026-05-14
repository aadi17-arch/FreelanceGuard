import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, X, Bell, User, Wallet } from "lucide-react";

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
      "/marketplace": user?.role === "CLIENT" ? "Marketplace" : "Find projects",
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
    return "Management";
  };

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* 1. Sidebar: Mobile (Drawer) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-zinc-900/50"
          />

          {/* Drawer */}
          <div className="absolute top-0 left-0 h-screen z-[110]">
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-[110]">
        <Sidebar />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-grow flex flex-col lg:ml-56 min-h-screen relative w-full overflow-x-hidden">

        {/* Global Header */}
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

          {/* Action Hub */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wallet Balance */}
            <Link
              to="/escrow"
              className="flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-zinc-200 hover:border-emerald-500 hover:bg-zinc-50 transition-all bg-white"
            >
              <Wallet size={14} className="text-zinc-400 group-hover:text-emerald-600" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] font-bold text-zinc-400 mb-0.5">Wallet</span>
                <span className="text-[12px] font-bold text-zinc-900">
                  ${user?.walletBalance?.toLocaleString() || "0"}
                </span>
              </div>
            </Link>

            <div className="hidden sm:flex w-10 h-10 rounded-xl border border-zinc-200 bg-white items-center justify-center cursor-pointer relative hover:bg-zinc-50 transition-colors">
              <Bell size={16} className="text-zinc-400" />
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute top-2.5 right-2.5 border-2 border-white"></div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 md:p-1.5 rounded-xl border border-zinc-200 bg-white hover:border-emerald-500 transition-all"
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-[11px] font-bold">
                  {user?.name?.[0] || "A"}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 py-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
                  >
                    <User size={14} />
                    My profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 w-full text-left"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="px-4 py-6 lg:px-8 lg:py-10 z-10 w-full overflow-x-hidden">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
