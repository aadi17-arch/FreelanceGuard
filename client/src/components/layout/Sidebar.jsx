import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { 
  ShieldCheck,
  LayoutDashboard, 
  BriefcaseBusiness, 
  Wallet, 
  Search, 
  User, 
  LogOut,
  Settings,
  Bell,
  MessageSquare,
  ClipboardList,
  BarChart3,
  FileText,
  AlertTriangle
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
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={15} />, section: "Dashboard" },
    { name: "Marketplace", path: "/marketplace", icon: <Search size={15} />, section: "Dashboard" },
    { name: "My Projects", path: "/contracts", icon: <FileText size={15} />, section: "Dashboard" },
    { name: "My Proposals", path: "/proposals", icon: <ClipboardList size={15} />, section: "Dashboard" },
    
    { name: "Payments", path: "/escrow", icon: <Wallet size={15} />, section: "Finances" },
    { name: "Reports", path: "/analytics", icon: <BarChart3 size={15} />, section: "Finances" },
    
    { name: "Messages", path: "/messages", icon: <MessageSquare size={15} />, section: "Account" },
    { name: "Support & Issues", path: "/disputes", icon: <AlertTriangle size={15} />, section: "Account" },
    { name: "Settings", path: "/profile", icon: <User size={15} />, section: "Account" },
    { name: "Verification", path: "/kyc", icon: <ShieldCheck size={15} />, section: "Account" },
  ];

  const sections = ["Dashboard", "Finances", "Account"];

  return (
    <aside className="h-screen w-[210px] bg-white border-r border-zinc-100 flex flex-col py-6 z-[60] relative">
      {/* Brand Logo */}
      <div className="px-6 mb-8">
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <span className="text-sm font-black text-zinc-900 tracking-tight">FreelanceGuard</span>
        </Link>
      </div>

      {/* Navigation Nodes */}
      <nav className="flex-1 px-3 space-y-7 overflow-y-auto custom-scrollbar">
        {sections.map((section) => (
          <div key={section} className="space-y-2">
            <h3 className="px-4 text-[11px] font-bold text-zinc-400">
              {section}
            </h3>
            <div className="space-y-0.5">
              {navItems
                .filter((item) => item.section === section)
                .map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative ${
                        isActive 
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10" 
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <span className={`${isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-900"} transition-colors`}>
                        {item.icon}
                      </span>
                      <span className="text-[13px] font-semibold tracking-tight">{item.name}</span>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="activeGlow"
                          className="absolute left-0 w-0.5 h-4 bg-emerald-500 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Session Footer */}
      <div className="px-3 mt-6 pt-6 border-t border-zinc-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-300 group"
        >
          <LogOut size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[13px] font-semibold tracking-tight">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
