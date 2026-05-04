import { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, X, Bell, User } from "lucide-react";
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
    const titles = {
      "/dashboard": "Dashboard",
      "/marketplace": "Find Projects",
      "/escrow": "Payments & Escrow",
      "/profile": "My Profile",
      "/kyc": "Identity Verification",
      "/contracts": "My Projects",
      "/proposals": "My Proposals",
      "/analytics": "Reports & Stats",
      "/messages": "Messages",
      "/disputes": "Help & Support"
    };
    
    if (titles[path]) return titles[path];
    if (path.startsWith("/project/")) return "Project Details";
    if (path.startsWith("/dispute/")) return "Resolution Center";
    return "Management Hub";
  };

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* 1. Sidebar: Desktop (Fixed) & Mobile (Drawer) */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px]"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-screen z-[110]"
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-[110]">
        <Sidebar />
      </div>
      
      {/* 2. Main Content Area */}
      <div className="flex-grow flex flex-col lg:ml-56 min-h-screen relative w-full overflow-x-hidden">
        
        {/* Scaled Global Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 lg:px-8 lg:py-5 flex justify-between items-center border-b border-zinc-50">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-zinc-50 rounded-xl transition-colors"
            >
              <Menu size={18} className="text-zinc-900" />
            </button>
            <div className="space-y-0.5 truncate">
               <h2 className="text-sm lg:text-base font-bold text-zinc-900 leading-none truncate">
                 {getPageTitle()}
               </h2>
               <div className="hidden md:flex items-center gap-2 text-[10px] text-zinc-400 font-semibold mt-1">
                 <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                 <span className="opacity-30">·</span>
                 <span className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    System Online
                 </span>
               </div>
            </div>
          </div>

          {/* Upper Right Action Hub */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex w-9 h-9 rounded-xl border border-zinc-100 bg-zinc-50 items-center justify-center cursor-pointer relative hover:bg-zinc-100 transition-colors">
              <Bell size={16} className="text-zinc-400" />
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute top-2 right-2 border-2 border-zinc-50"></div>
            </div>
            
            <Link 
              to="/profile" 
              className="flex items-center gap-2 p-1 md:p-1.5 md:pr-4 rounded-2xl border border-zinc-100 bg-white hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
            >
               <div className="relative">
                  <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-zinc-900 text-emerald-500 flex items-center justify-center text-[11px] font-black shadow-lg shadow-zinc-900/10 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {user?.name?.[0] || "A"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
               </div>
               <div className="hidden md:block">
                  <p className="text-[11px] font-black text-zinc-900 leading-none tracking-tight">
                    {user?.name?.split(' ')[0]}
                  </p>
                  <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                    Active
                  </p>
               </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="px-4 py-6 lg:px-8 lg:py-10 z-10 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
