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
    if (path === "/dashboard") return "Overview";
    if (path === "/marketplace") return "Projects";
    if (path === "/escrow") return "Vault";
    return "Management";
  };

  return (
    <div className="flex min-h-screen bg-white font-body relative">
      {/* 1. Sidebar: Desktop (Fixed) & Mobile (Drawer) */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-rui-dark/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      </div>

      <div className={`fixed top-0 left-0 h-screen z-[110] transition-transform duration-500 ease-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      {/* 2. Main content area */}
      <div className="flex-grow flex flex-col lg:ml-[200px] min-h-screen relative w-full">
        {/* Subtle Background Glow - Removed for cleaner look */}

        {/* Top Header: Clean, borderless feel */}
        <header className="sticky top-0 z-50 bg-[var(--color-background-tertiary)]/80 backdrop-blur-md px-8 py-7 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[var(--color-background-secondary)] rounded-xl transition-colors"
            >
              <Menu size={20} className="text-[var(--color-text-primary)]" />
            </button>
            <div className="space-y-0.5">
              <h2 className="text-[20px] font-semibold text-[var(--color-text-primary)] tracking-tight leading-none">{getPageTitle()}</h2>
              <div className="hidden md:flex items-center gap-1.5 text-[13px] text-[var(--color-text-secondary)] mt-1.5">
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}</span>
                <span className="opacity-40">·</span>
                <span>All projects</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-md border border-[var(--color-border-tertiary)] bg-[var(--color-background-primary)] flex items-center justify-center cursor-pointer relative hidden sm:flex hover:bg-[var(--color-background-secondary)] transition-colors">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 015 5v3l1.5 2H1.5L3 9V6a5 5 0 015-5zM6.5 14a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-[var(--color-text-secondary)]"/></svg>
              <div className="w-1.5 h-1.5 bg-rui-success rounded-full absolute top-1.5 right-1.5"></div>
            </div>
            <div className="w-[34px] h-[34px] rounded-full bg-rui-success/10 border border-[var(--color-border-tertiary)] flex items-center justify-center text-[12px] font-medium text-rui-success shadow-sm">
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
