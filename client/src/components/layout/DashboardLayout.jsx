import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, X, Bell, User, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      "/dashboard": "Home",
      "/marketplace": user?.role === "CLIENT" ? "Marketplace" : "Find Work",
      "/escrow": "My Wallet",
      "/profile": "My Profile",
      "/kyc": "Verification",
      "/contracts": "My Contracts",
      "/proposals": user?.role === "CLIENT" ? "Received Bids" : "My Bids",
      "/analytics": "Reports & Stats",
      "/messages": "Messages",
      "/disputes": "Help",
      "/create-project": "Post Project"
    };

    if (titles[path]) return titles[path];
    if (path.startsWith("/project/")) return "Project Details";
    if (path.startsWith("/dispute/")) return "Resolution Center";
    return "Management Hub";
  };

  return (
    <div className="flex min-h-screen bg-[#ffffff] relative">
      {/* 1. Sidebar: Desktop (Fixed) & Mobile (Drawer) */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "linear" }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              className="absolute top-0 left-0 h-screen z-[110]"
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-[110]">
        <Sidebar />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-grow flex flex-col lg:ml-56 min-h-screen relative w-full overflow-x-hidden">

        {/* Scaled Global Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 lg:px-8 lg:py-5 flex justify-between items-center border-b border-zinc-50">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-zinc-50 rounded-xl transition-colors"
            >
              <Menu size={18} className="text-zinc-900" />
            </button>
            <div className="space-y-0.5 truncate">
              <h2 className="text-sm lg:text-base font-bold text-[#111111] leading-none truncate">
                {getPageTitle()}
              </h2>
              <div className="hidden md:flex items-center gap-2 text-[10px] text-zinc-400 font-semibold mt-1">
              </div>
            </div>
          </div>

          {/* Upper Right Action Hub */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Dynamic Wallet Quick Balance */}
            <Link
              to="/escrow"
              className="flex items-center gap-2.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-[#e5e5e5] hover:border-emerald-500 hover:bg-emerald-50/10 transition-all duration-300 group bg-white shadow-sm"
            >
              <Wallet size={14} className="text-[#666666] group-hover:text-emerald-500 transition-colors" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider mb-0.5">Wallet</span>
                <span className="text-[12px] font-black text-zinc-900 group-hover:text-emerald-600 transition-colors">
                  ${user?.walletBalance?.toLocaleString() || "0"}
                </span>
              </div>
            </Link>

            <div className="hidden sm:flex w-9 h-9 rounded-xl border border-[#e5e5e5] bg-white items-center justify-center cursor-pointer relative hover:bg-[#f9f9f9] transition-colors">
              <Bell size={16} className="text-[#666666]" />
              <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full absolute top-2 right-2 border-2 border-white"></div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 md:p-1.5 md:pr-4 rounded-[10px] border border-[#e5e5e5] bg-[#ffffff] hover:border-[#10b981] transition-all group"
              >
                <div className="relative">
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-[#111111] text-[#ffffff] flex items-center justify-center text-[11px] font-black group-hover:bg-[#10b981] transition-all">
                    {user?.name?.[0] || "A"}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] shadow-xl z-50 py-2"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#111111] hover:bg-[#f9f9f9] transition-colors"
                    >
                      <User size={14} className="text-[#666666]" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 w-full text-left transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
