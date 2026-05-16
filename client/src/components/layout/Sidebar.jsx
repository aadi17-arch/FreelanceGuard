import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldCheck,
  Grid,
  Search,
  Zap,
  Briefcase,
  ClipboardList,
  LifeBuoy,
  X,
  Activity,
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

  const rawNavItems = [
    { name: "Home", path: "/dashboard", icon: <Grid size={14} />, section: "Overview", hideFor: ["ADMIN"] },
    { name: "My contracts", path: "/contracts", icon: <Briefcase size={14} />, section: "Overview", hideFor: ["ADMIN"] },
    { name: "My wallet", path: "/escrow", icon: <Zap size={14} />, section: "Finance", hideFor: ["ADMIN"] },
    { 
      name: user?.role?.toUpperCase() === "CLIENT" ? "Received bids" : "My bids", 
      path: "/proposals", 
      icon: <ClipboardList size={14} />, 
      section: "Finance",
      hideFor: ["ADMIN"]
    },
    { name: "Verification", path: "/kyc", icon: <ShieldCheck size={14} />, section: "Account", hideFor: ["ADMIN"] },
    { name: "Support hub", path: "/support", icon: <LifeBuoy size={14} />, section: "Account", hideFor: ["ADMIN"] },
    { name: "Disputes", path: "/disputes", icon: <AlertTriangle size={14} />, section: "Account", hideFor: ["ADMIN"] },
    ...(user?.role?.toUpperCase() === "ADMIN"
      ? [{ name: "Solution center", path: "/admin", icon: <Activity size={14} />, section: "Management" }]
      : []
    ),
  ];

  const navItems = rawNavItems.filter(item => 
    !item.hideFor || !item.hideFor.includes(user?.role?.toUpperCase())
  );

  const sections = [...new Set(navItems.map(item => item.section))];

  return (
    <aside className="h-screen w-56 bg-zinc-50 border-r border-zinc-200 flex flex-col py-6 z-[60]">
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

      {/* User Profile & KYC Alert */}
      <div className="mt-auto pt-6 px-4 space-y-4">
        <div className="relative">
          {(!user?.kyc || user?.kyc?.status === 'PENDING') && (
            <div className="px-1 mb-2">
              <Link 
                to="/kyc" 
                onClick={onClose}
                className="flex items-center gap-1.5 group transition-all"
              >
                <div className={`w-1 h-1 rounded-full animate-pulse ${!user?.kyc ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${!user?.kyc ? 'text-rose-600' : 'text-amber-600'}`}>
                  {!user?.kyc ? "KYC needed" : "Verification pending"}
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between p-2.5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0 px-1">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-xs font-black shrink-0">
                {user?.name?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-zinc-900 truncate">{user?.name?.split(' ')[0]}</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
            
            {(!user?.kyc || user?.kyc?.status === 'PENDING') && (
              <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle size={12} />
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-2.5 text-zinc-400 hover:text-zinc-900 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-zinc-100 rounded-xl"
        >
          End Session
        </button>
      </div>
    </aside>
  );
}
