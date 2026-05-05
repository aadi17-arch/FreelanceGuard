import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  Wallet,
  FileText,
  AlertTriangle,
  X,
  LogOut,
  User,
  ClipboardList,
  HelpCircle
} from "lucide-react";

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/dashboard", icon: <LayoutDashboard size={14} />, section: "Overview" },
    ...(user?.role === "CLIENT"
      ? [{ name: "Post Project", path: "/create-project", icon: <LayoutDashboard size={14} />, section: "Overview" }]
      : [{ name: "Find Work", path: "/marketplace", icon: <Search size={14} />, section: "Overview" }]
    ),
    { name: "My Contracts", path: "/contracts", icon: <FileText size={14} />, section: "Overview" },

    { name: "My Wallet", path: "/escrow", icon: <Wallet size={14} />, section: "Finance" },
    { 
      name: user?.role === "CLIENT" ? "Received Bids" : "My Bids", 
      path: "/proposals", 
      icon: <ClipboardList size={14} />, 
      section: "Finance" 
    },

    { name: "Verification", path: "/kyc", icon: <ShieldCheck size={14} />, section: "Account" },
    { name: "Help", path: "/disputes", icon: <HelpCircle size={14} />, section: "Account" },
  ];

  const sections = ["Overview", "Finance", "Account"];

  return (
    <aside className="h-screen w-56 bg-[#f9f9f9] border-r border-[#e5e5e5] flex flex-col py-6 z-[60] transition-all duration-300">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex justify-between items-center">
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-900/10 group-hover:rotate-12 transition-transform">
            <ShieldCheck size={14} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-[13px] font-black tracking-tight text-zinc-900 leading-none">
              FreelanceGuard
            </h1>

          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-zinc-50 rounded-lg transition-colors">
          <X size={16} className="text-zinc-400" />
        </button>
      </div>

      {/* Primary Action Button: Role-Aware */}
      <div className="px-4 mb-10">
        <Link
          to={user?.role === "CLIENT" ? "/create-project" : "/marketplace"}
          onClick={onClose}
          className="w-full h-11 bg-zinc-900 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-zinc-900/10 group"
        >
          {user?.role === "CLIENT" ? (
            <>
              <LayoutDashboard size={13} className="text-white" />
              <span className="text-xs font-bold">Post Project</span>
            </>
          ) : (
            <>
              <Search size={13} className="text-white" />
              <span className="text-xs font-bold">Find Projects</span>
            </>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-grow space-y-8 overflow-y-auto custom-scrollbar px-2">
        {sections.map(section => (
          <div key={section} className="space-y-2">
            <h3 className="px-5 text-[10px] font-bold text-zinc-400 opacity-80">
              {section}
            </h3>
            <div className="space-y-0.5">
              {navItems.filter(item => item.section === section).map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 group relative ${isActive
                        ? "text-[#111111] bg-white border border-[#e5e5e5] font-bold"
                        : "text-[#666666] hover:text-[#111111] hover:bg-white"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#10b981] rounded-full"
                      />
                    )}

                    <div className={`${isActive ? "text-[#10b981]" : "text-[#666666] group-hover:text-[#111111]"} transition-all duration-300`}>
                      {item.icon}
                    </div>
                    <span className={`text-[12px] tracking-tight transition-all duration-300 ${isActive ? "translate-x-1" : ""}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>


    </aside>
  );
}
