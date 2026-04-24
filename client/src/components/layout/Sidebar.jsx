import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Wallet, 
  Landmark, 
  FileText, 
  AlertTriangle,
  LogOut,
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
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={14} />, section: "MAIN" },
    { name: "Projects", path: "/marketplace", icon: <Briefcase size={14} />, section: "MAIN" },
    { name: "Milestones", path: "/milestones", icon: <Calendar size={14} />, section: "MAIN" },
    
    { name: "Vault", path: "/escrow", icon: <Wallet size={14} />, section: "FINANCIALS" },
    { name: "Payments", path: "/payments", icon: <Landmark size={14} />, section: "FINANCIALS" },
    
    { name: "Contracts", path: "/contracts", icon: <FileText size={14} />, section: "LEGAL" },
    { name: "Disputes", path: "/disputes", icon: <AlertTriangle size={14} />, section: "LEGAL" },
  ];

  const sections = ["MAIN", "FINANCIALS", "LEGAL"];

  return (
    <aside className="h-screen w-56 bg-white border-r border-rui-gray-border/40 flex flex-col py-6 z-[60]">
      {/* Brand Header */}
      <div className="px-6 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="logo.png" alt="Logo" className="w-5 h-5 object-contain" />
          <div>
            <h1 className="text-[14px] font-black tracking-tight text-rui-dark leading-none">
              FreelanceGuard
            </h1>
            <p className="text-[8px] font-bold text-rui-gray-muted uppercase tracking-tighter mt-1 opacity-80">
              Vault • Protocol
            </p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 hover:bg-rui-light rounded-lg">
          <X size={16} className="text-rui-gray-muted" />
        </button>
      </div>

      {/* Primary Action Button: Role-Aware */}
      <div className="px-4 mb-8">
        <Link 
          to={user?.role === "CLIENT" ? "/create-project" : "/marketplace"}
          onClick={onClose}
          className="w-full h-10 bg-rui-dark hover:bg-rui-success text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-black/5 group"
        >
          {user?.role === "CLIENT" ? (
            <>
              <LayoutDashboard size={12} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-wider">Post a Project</span>
            </>
          ) : (
            <>
              <Briefcase size={12} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-wider">Find Work</span>
            </>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide">
        {sections.map(section => (
          <div key={section} className="space-y-2">
            <h3 className="px-6 text-[9px] font-black text-rui-gray-muted uppercase tracking-[0.2em] opacity-40">
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
                    className={`flex items-center gap-3 px-6 py-2 transition-all duration-300 group relative ${
                      isActive 
                        ? "text-rui-dark bg-rui-light/30" 
                        : "text-rui-gray-muted hover:text-rui-dark hover:bg-rui-light/20"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 w-[2.5px] h-full bg-rui-success" 
                      />
                    )}
                    
                    <div className={`${isActive ? "text-rui-success" : "group-hover:text-rui-dark"} transition-transform duration-300 group-hover:scale-110`}>
                      {item.icon}
                    </div>
                    <span className={`text-[11px] font-bold tracking-tight transition-all duration-300 ${isActive ? "translate-x-1" : "group-hover:translate-x-0.5"}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Profile & Logout Node */}
      <div className="mt-auto px-5 border-t border-rui-gray-border/20 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-rui-success/10 text-rui-success flex items-center justify-center text-[10px] font-black border border-rui-success/10 shrink-0">
              {user?.name?.[0] || "R"}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-[11px] font-black text-rui-dark leading-none truncate">
                {user?.name || "RECOVERY NODE"}
              </p>
              <p className="text-[9px] font-bold text-rui-gray-muted mt-0.5 uppercase tracking-tighter opacity-70">
                {user?.role || "IDENTIFIED"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 mr-1 text-rui-gray-muted hover:text-rui-danger hover:bg-rui-danger/5 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
