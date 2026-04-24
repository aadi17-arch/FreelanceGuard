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
      <div className="flex-grow flex flex-col lg:ml-56 min-h-screen bg-[#fcfdfe] relative w-full">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
           <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rui-success/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Top Header: Sticky with glassmorphism */}
        <header className="sticky top-0 z-50 bg-[#fcfdfe]/80 backdrop-blur-md px-6 md:px-10 py-5 flex justify-between items-center border-b border-rui-gray-border/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-rui-light rounded-xl transition-colors"
            >
              <Menu size={20} className="text-rui-dark" />
            </button>
            <div className="space-y-0.5">
              <h2 className="text-xl md:text-2xl font-bold text-rui-dark tracking-tight">{getPageTitle()}</h2>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-rui-gray-muted uppercase tracking-wider">
                <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="opacity-40">•</span>
                <span>Secure Network</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right mr-2">
              <p className="text-[11px] font-black text-rui-dark leading-none">{user?.name || "RECOVERY NODE"}</p>
              <p className="text-[9px] font-bold text-rui-gray-muted uppercase tracking-tighter mt-1">{user?.role || "IDENTIFIED"}</p>
            </div>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-rui-light border border-rui-gray-border/50 flex items-center justify-center text-[11px] font-black text-rui-dark shadow-sm">
                {user?.name?.[0] || "R"}
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rui-success border-2 border-white rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="px-6 md:px-10 pb-20 z-10 w-full overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
