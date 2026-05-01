import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { 
  Shield,
  LayoutDashboard, 
  Briefcase, 
  Wallet, 
  FileText, 
  AlertTriangle,
  LogOut,
  X,
  PlusCircle,
  Search,
  User,
  MessageSquare,
  ClipboardList,
  BarChart3,
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

  // Restored full operational suite for strategic growth
  const navItems = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={14} />, section: "WORK" },
    { name: "Global Market", path: "/marketplace", icon: <Search size={14} />, section: "WORK" },
    { name: "My Contracts", path: "/contracts", icon: <FileText size={14} />, section: "WORK" },
    { name: "Bids & Proposals", path: "/proposals", icon: <ClipboardList size={14} />, section: "WORK" },
    
    { name: "Financial Vault", path: "/escrow", icon: <Wallet size={14} />, section: "FINANCES" },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={14} />, section: "FINANCES" },
    
    { name: "Messages", path: "/messages", icon: <MessageSquare size={14} />, section: "SECURITY" },
    { name: "Active Cases", path: "/disputes", icon: <AlertTriangle size={14} />, section: "SECURITY" },
    { name: "My Profile", path: "/profile", icon: <User size={14} />, section: "SECURITY" },
    { name: "Identity Proof", path: "/kyc", icon: <Shield size={14} />, section: "SECURITY" },
  ];

  const sections = ["WORK", "FINANCES", "SECURITY"];

  return (
    <aside className="h-screen w-[210px] bg-white border-r border-zinc-100 flex flex-col py-6 z-[60] relative">
      {/* Mobile Close */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onClose} 
        className="lg:hidden absolute top-4 right-4 p-2 hover:bg-zinc-50 rounded-full transition-colors z-[70]"
      >
        <X size={18} className="text-zinc-400" />
      </motion.button>

      {/* Brand */}
      <div className="px-6 mb-8">
        <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
            <Shield size={14} className="text-white" />
          </div>
          <span className="text-[13px] font-black text-zinc-900 tracking-tight">FreelanceGuard</span>
        </Link>
      </div>

      {/* Primary Action */}
      <div className="px-4 mb-8">
        <Link 
          to={user?.role === "CLIENT" ? "/create-project" : "/marketplace"}
          onClick={onClose}
          className="w-full h-11 bg-zinc-900 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-black/5"
        >
          <PlusCircle size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {user?.role === "CLIENT" ? "New Project" : "Find Work"}
          </span>
        </Link>
      </div>

      {/* Navigation Groups: Full Suite */}
      <div className="flex-grow space-y-6 overflow-y-auto no-scrollbar pb-10">
        {sections.map((section) => (
          <div key={section}>
            <h3 className="text-[8px] font-black text-zinc-300 px-6 mb-2 tracking-[0.25em] uppercase">
              {section}
            </h3>
            <ul className="space-y-0.5">
              {navItems.filter(item => item.section === section).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-6 py-2.5 text-[11px] transition-all relative group ${
                      isActive 
                        ? "text-zinc-900 font-bold" 
                        : "text-zinc-400 hover:text-zinc-600"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-4 bg-emerald-500 rounded-r-full"
                      />
                    )}
                    <div className={`${isActive ? 'text-emerald-500' : 'opacity-40 group-hover:opacity-100'}`}>
                      {item.icon}
                    </div>
                    <span className="tracking-tight whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Profile: Unified Access */}
      <div className="mt-auto px-4">
        <Link 
          to="/profile"
          onClick={onClose}
          className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-[11px] font-black text-emerald-500 shrink-0 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-[11px] font-black text-zinc-900 truncate uppercase tracking-tight leading-none">
                {user?.name || "User"}
              </p>
              <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5">
                {user?.role}
              </p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            className="p-1.5 text-zinc-300 hover:text-rose-500 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </Link>
      </div>
    </aside>
  );
}
