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
  ClipboardList
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
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={14} />, section: "Overview" },
    { name: "Find Projects", path: "/marketplace", icon: <Search size={14} />, section: "Overview" },
    { name: "My Projects", path: "/contracts", icon: <FileText size={14} />, section: "Overview" },

    { name: "Payments & Escrow", path: "/escrow", icon: <Wallet size={14} />, section: "Finance" },
    { name: "My Proposals", path: "/proposals", icon: <ClipboardList size={14} />, section: "Finance" },

    { name: "Identity Verification", path: "/kyc", icon: <ShieldCheck size={14} />, section: "Account" },
    { name: "My Profile", path: "/profile", icon: <User size={14} />, section: "Account" },
    { name: "Help & Support", path: "/disputes", icon: <AlertTriangle size={14} />, section: "Account" },
  ];

  const sections = ["Overview", "Finance", "Account"];

  return (
    <aside className="h-screen w-56 bg-white border-r border-zinc-100 flex flex-col py-6 z-[60] transition-all duration-300">
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
            <p className="text-[10px] font-bold text-zinc-400 mt-1">
              Secure Escrow
            </p>
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
                        ? "text-zinc-900 bg-zinc-50 font-bold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50/50"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-emerald-500 rounded-full"
                      />
                    )}

                    <div className={`${isActive ? "text-emerald-500" : "text-zinc-400 group-hover:text-zinc-900"} transition-all duration-300`}>
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

      {/* Profile Node & Logout */}
      <div className="mt-auto px-4 pt-6 border-t border-zinc-50 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 text-emerald-500 flex items-center justify-center text-[11px] font-black shadow-lg shadow-zinc-900/10">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-[12px] font-black text-zinc-900 leading-none truncate">
              {user?.name}
            </p>
            <p className="text-[10px] font-bold text-zinc-400 mt-1 opacity-80">
              {user?.role === "CLIENT" ? "Client Account" : "Freelancer Account"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-300 group"
        >
          <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
