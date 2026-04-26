import { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/marketplace" || path === "/escrow") return null;
    return "Management";
  };

  return (
    <div className="flex min-h-screen bg-white font-body relative">
      {/* 1. Sidebar: Desktop (Fixed) & Mobile (Drawer) */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-rui-dark/40 backdrop-blur-[2px]"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-screen z-[110]"
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Always visible on large screens) */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-[110]">
        <Sidebar />
      </div>
      
      {/* 2. Main content area */}
      <div className="flex-grow flex flex-col lg:ml-[220px] min-h-screen relative w-full">
        {/* Subtle Background Glow - Removed for cleaner look */}

        {/* Top Header: Clean, borderless feel */}
        <header className="sticky top-0 z-50 bg-background-tertiary/80 backdrop-blur-md px-5 py-4 md:px-8 md:py-7 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 hover:bg-background-secondary rounded-lg transition-colors"
            >
              <Menu size={18} className="text-text-primary" />
            </button>
            {getPageTitle() && (
              <div className="space-y-0.5">
                <h2 className="text-[20px] font-semibold text-text-primary tracking-tight leading-none">{getPageTitle()}</h2>
                <div className="hidden md:flex items-center gap-1.5 text-[13px] text-text-secondary mt-1.5">
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}</span>
                  <span className="opacity-40">·</span>
                  <span>All projects</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-md border border-border-tertiary bg-background-primary flex items-center justify-center cursor-pointer relative hidden sm:flex hover:bg-background-secondary transition-colors">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 015 5v3l1.5 2H1.5L3 9V6a5 5 0 015-5zM6.5 14a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-text-secondary"/></svg>
              <div className="w-1.5 h-1.5 bg-rui-success rounded-full absolute top-1.5 right-1.5"></div>
            </div>
            <div className="w-[34px] h-[34px] rounded-full bg-rui-success/10 border border-border-tertiary flex items-center justify-center text-[12px] font-medium text-rui-success shadow-sm">
              {user?.name?.[0] || "A"}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="px-8 pb-20 z-10 w-full overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
