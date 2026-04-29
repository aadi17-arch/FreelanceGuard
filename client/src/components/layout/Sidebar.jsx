import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { 
  ShieldCheck,
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
    { name: "Identity", path: "/kyc", icon: <ShieldCheck size={14} />, section: "LEGAL" },
  ];

  const sections = ["MAIN", "FINANCIALS", "LEGAL"];

  return (
    <aside className="h-screen w-[220px] bg-background-primary border-r border-border-tertiary flex flex-col py-5 z-[60] relative">
      {/* Close Button - Detached for better alignment */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onClose} 
        className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-full transition-colors z-[70]"
      >
        <X size={18} className="text-gray-400" />
      </motion.button>

      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-5 mb-3 pb-6 border-b border-border-tertiary"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-rui-success rounded flex items-center justify-center">
            <ShieldCheck size={12} className="text-white" />
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-text-primary leading-none tracking-tight">
              Freelance<span className="text-rui-success font-medium">Guard</span>
            </h1>
            <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mt-1.5 opacity-60">
              Vault · Milestones
            </p>
          </div>
        </div>
      </motion.div>

      {/* Primary Action Button: Role-Aware */}
      <div className="px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
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
        </motion.div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-grow space-y-6 overflow-y-auto scrollbar-hide">
        {sections.map((section, sIdx) => (
          <div key={section} className="mb-2">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.2 + (sIdx * 0.1) }}
              className="text-[9px] font-black text-text-tertiary px-5 py-3 tracking-[0.2em] uppercase"
            >
              {section}
            </motion.h3>
            <ul className="space-y-0.5 flex flex-col">
              {navItems.filter(item => item.section === section).map((item, iIdx) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.2 + (sIdx * 0.1) + (iIdx * 0.05),
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    whileTap={{ x: 8, scale: 0.96 }}
                  >
                    <Link 
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-5 py-[10px] text-[12px] transition-all rounded-none ${
                        isActive 
                          ? "bg-background-secondary text-text-primary font-bold border-r-2 border-rui-success" 
                          : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                      }`}
                    >
                      <div className={`opacity-60 flex-shrink-0 ${isActive ? 'text-rui-success opacity-100' : ''}`}>
                        {item.icon}
                      </div>
                      <span className="font-medium tracking-tight">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Profile Section */}
      <div className="mt-auto px-4 pb-2">
        <div className="flex items-center justify-between p-2.5 bg-background-secondary rounded-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-rui-success/10 text-rui-success flex items-center justify-center text-[10px] font-medium border border-rui-success/10 shrink-0">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-[12px] font-medium text-text-primary leading-none truncate">
                {user?.name || "Alex Kim"}
              </p>
              <p className="text-[10px] text-text-secondary mt-0.5 truncate">
                {user?.role || "Freelancer"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-text-secondary hover:text-rui-danger transition-all"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
