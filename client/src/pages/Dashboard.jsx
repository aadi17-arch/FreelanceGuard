import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Vault, 
  Lock, 
  Globe, 
  LogOut, 
  Plus, 
  Settings, 
  Bell,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white"
    >
      {/* Platform Navigation - NO ICON */}
      <nav className="bg-white border-b border-rui-gray-border px-4 py-4 md:px-8 sticky top-0 z-50">
        <div className="section-container !px-0 flex justify-between items-center">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center space-x-3 md:space-x-6">
            <span className="text-base md:text-xl font-bold tracking-tight uppercase">
              Freelance<span className="text-rui-blue">Guard</span>
            </span>
          </motion.div>
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 text-rui-gray-muted hover:text-rui-dark transition-colors relative">
              <Bell size={20} strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rui-danger rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-2 md:space-x-3 bg-rui-light px-3 py-1.5 md:px-5 md:py-2 rounded-full border border-rui-gray-border">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-rui-blue text-white flex items-center justify-center font-bold text-[10px] md:text-xs">
                {user?.name?.[0].toUpperCase()}
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest hidden sm:inline">{user?.name?.split(' ')[0]}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-rui-dark text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Exit</span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="section-container py-8 md:py-16 space-y-12 md:space-y-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <motion.div variants={itemVariants} className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-2 text-rui-blue">
              <Activity size={14} strokeWidth={3} />
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Platform Overview</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Hello, {user?.name?.split(' ')[0]}</h1>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="btn-pill-primary w-full md:w-auto flex items-center justify-center gap-2">
              <Plus size={18} />
              Create Project
            </button>
            <button className="btn-pill-secondary w-full md:w-auto flex items-center justify-center gap-2">
              <Settings size={18} />
              Settings
            </button>
          </motion.div>
        </header>

        {/* Organic Stats Grid - Refined Icons */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
        >
          {[
            { label: "Available Funds", val: "$12,450.00", sub: "+$4,200 this week", color: "text-rui-dark", bg: "bg-white", icon: <Vault size={22} strokeWidth={1.2} /> },
            { label: "Active Escrows", val: "08", sub: "3 awaiting approval", color: "text-white", bg: "bg-rui-dark", icon: <Lock size={22} strokeWidth={1.2} /> },
            { label: "Vault Health", val: "98.5%", sub: "Top 1% of users", color: "text-rui-success", bg: "bg-white", icon: <Globe size={22} strokeWidth={1.2} /> },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`${item.bg} rounded-[40px] border border-rui-gray-border p-10 md:p-14 flex flex-col items-center text-center space-y-4 cursor-default shadow-xl shadow-black/[0.02]`}
            >
              <div className={`p-4 rounded-2xl ${item.bg === 'bg-white' ? 'bg-rui-light text-rui-blue' : 'bg-white/10 text-white'}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] ${item.bg === 'bg-white' ? 'text-rui-gray-muted' : 'text-gray-400'}`}>{item.label}</span>
              <p className={`text-4xl md:text-5xl font-bold tracking-tight ${item.color}`}>{item.val}</p>
              <span className="text-[10px] md:text-xs font-bold text-rui-success uppercase">{item.sub}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Call to Action Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-rui-blue rounded-[40px] p-8 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left overflow-hidden relative shadow-2xl shadow-rui-blue/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="space-y-4 md:space-y-6 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">Protect Your<br />Next Deal</h2>
            <p className="text-white/80 text-base md:text-xl font-medium max-w-lg leading-relaxed">
              Invite a collaborator and start a secure contract in seconds. 
              The ultimate bridge between talent and capital.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full lg:w-auto bg-white text-rui-blue px-12 py-6 rounded-full font-bold text-sm uppercase tracking-widest relative z-10 shadow-2xl flex items-center justify-center gap-3"
          >
            <Vault size={20} strokeWidth={1.5} />
            Get Secured Now
          </motion.button>
        </motion.div>
      </main>
    </motion.div>
  );
}
