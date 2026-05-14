import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  Wallet,
  FileText,
  ClipboardList,
  HelpCircle,
  X
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
      ? [{ name: "Post a project", path: "/create-project", icon: <LayoutDashboard size={14} />, section: "Overview" }]
      : [{ name: "Find work", path: "/marketplace", icon: <Search size={14} />, section: "Overview" }]
    ),
    { name: "My contracts", path: "/contracts", icon: <FileText size={14} />, section: "Overview" },
    { name: "My wallet", path: "/escrow", icon: <Wallet size={14} />, section: "Finance" },
    { 
      name: user?.role === "CLIENT" ? "Received bids" : "My bids", 
      path: "/proposals", 
      icon: <ClipboardList size={14} />, 
      section: "Finance" 
    },
    { name: "Verification", path: "/kyc", icon: <ShieldCheck size={14} />, section: "Account" },
    { name: "Help", path: "/disputes", icon: <HelpCircle size={14} />, section: "Account" },
  ];

  const sections = ["Overview", "Finance", "Account"];

  return (
    <aside className="h-screen w-56 bg-zinc-50 border-r border-zinc-200 flex flex-col py-6 z-[60]">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex justify-between items-center">
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm">
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-zinc-900 leading-none">
              Freelance<span className="text-emerald-600">Guard</span>
            </h1>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
          <X size={16} className="text-zinc-400" />
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="px-4 mb-10">
        <Link
          to={user?.role === "CLIENT" ? "/create-project" : "/marketplace"}
          onClick={onClose}
          className="w-full h-11 bg-zinc-900 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {user?.role === "CLIENT" ? (
            <>
              <LayoutDashboard size={13} />
              <span className="text-xs font-bold">Post a project</span>
            </>
          ) : (
            <>
              <Search size={13} />
              <span className="text-xs font-bold">Find work</span>
            </>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-grow space-y-8 overflow-y-auto px-2">
        {sections.map(section => (
          <div key={section} className="space-y-2">
            <h3 className="px-5 text-[10px] font-bold text-zinc-400">
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
                    className={`flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all relative ${isActive
                        ? "text-zinc-900 bg-white border border-zinc-200 font-bold"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-white"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-emerald-500 rounded-full" />
                    )}
                    <div className={`${isActive ? "text-emerald-500" : "text-zinc-500"}`}>
                      {item.icon}
                    </div>
                    <span className="text-[12px] tracking-tight">
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
