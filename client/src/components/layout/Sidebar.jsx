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
    <aside className="h-screen w-[200px] bg-[var(--color-background-primary)] border-r border-[var(--color-border-tertiary)] flex flex-col py-5 z-[60]">
      {/* Brand Header */}
      <div className="px-5 mb-3 pb-6 border-b border-[var(--color-border-tertiary)] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="logo.png" alt="Logo" className="w-5 h-5 object-contain" />
          <div>
            <h1 className="text-[15px] font-semibold text-[var(--color-text-primary)] leading-none tracking-[-0.3px]">
              Freelance<span className="text-rui-success">Guard</span>
            </h1>
            <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1.5">
              Escrow · Milestones
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
          <div key={section} className="mb-2">
            <h3 className="text-[10px] font-medium text-[var(--color-text-tertiary)] px-5 py-3 tracking-[0.8px] uppercase">
              {section}
            </h3>
            <ul className="space-y-0.5 flex flex-col">
              {navItems.filter(item => item.section === section).map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-5 py-[9px] text-[13px] transition-all rounded-none ${
                      isActive 
                        ? "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-medium border-r-2 border-rui-success" 
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <div className={`opacity-70 flex-shrink-0 ${isActive ? 'text-rui-success opacity-100' : ''}`}>
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Profile Section */}
      <div className="mt-auto px-4 pb-2">
        <div className="flex items-center justify-between p-2.5 bg-[var(--color-background-secondary)] rounded-[var(--border-radius-md)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-rui-success/10 text-rui-success flex items-center justify-center text-[10px] font-medium border border-rui-success/10 shrink-0">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-[12px] font-medium text-[var(--color-text-primary)] leading-none truncate">
                {user?.name || "Alex Kim"}
              </p>
              <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">
                {user?.role || "Freelancer"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-[var(--color-text-secondary)] hover:text-rui-danger transition-all"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
