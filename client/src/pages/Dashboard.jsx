import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
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
  useEffect(() => {
    const fetchProjects = async () => {
      // ONLY fetch if we have a user and we aren't still loading the auth profile
      if (!user) return;

      try {
        const res = await axios.get("/projects/userProjectList");
        setProjects(res.data);
      }
      catch (err) {
        console.error("Failed to fetch projects");
      }
    };
    fetchProjects();
  }, [user]); // Add user to the dependency array!

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen atmospheric-bg transition-colors duration-1000"
    >
      {/* Platform Navigation - Cinematic Glass */}
      <nav className="glass-nav">
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
            <div className="flex items-center space-x-6">
              {user?.role === "FREELANCER" && (
                <Link to="/marketplace" className="text-[10px] font-black uppercase tracking-[0.2em] text-rui-blue hover:text-rui-dark transition-colors hidden md:block">
                  Find Work
                </Link>
              )}

              {/* Unified User Node */}
              <div className="flex items-center bg-rui-light/50 border border-rui-gray-border rounded-full pl-2 pr-4 py-1.5 gap-3">
                <div className="w-8 h-8 rounded-full bg-rui-blue text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-lg">
                  {user?.name?.[0]}
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-[10px] font-bold text-rui-dark truncate max-w-[80px]">{user?.name}</span>
                  <span className="text-[7px] font-black text-rui-blue uppercase tracking-widest">{user?.role}</span>
                </div>
                <div className="w-px h-4 bg-rui-gray-border mx-1" />
                <button
                  onClick={handleLogout}
                  className="text-rui-gray-muted hover:text-rui-danger transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
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
            {user?.role === "CLIENT" && (<Link to="/create-project" className="w-full md:w-auto">
              <button className="btn-pill-primary w-full md:w-auto flex items-center justify-center gap-2 shadow-lg shadow-rui-blue/20">
                <Plus size={18} />
                Create Project
              </button>
            </Link>)}
            {user?.role === "FREELANCER" &&
              <Link to="/marketplace" className="w-full md:w-auto">
                <button className="btn-pill-secondary w-full md:w-auto flex items-center justify-center gap-2">
                  <Globe size={18} />
                  Find Work
                </button>
              </Link>
            }
            <button className="btn-pill-secondary w-full md:w-auto flex items-center justify-center gap-2">
              <Settings size={18} />
              Settings
            </button>
          </motion.div>
        </header>

        {/* Organic Stats Grid - Refined Icons */}
        <motion.div
          variants={containerVariants}
          className="geometric-grid"
        >
          {[
            { label: "Available Funds", val: `$${(user?.walletBalance || 0).toLocaleString()}`, sub: user?.role === "CLIENT" ? "Operational Budget" : "Career Earnings", color: "text-rui-dark", bg: "bg-white", icon: <Vault size={22} strokeWidth={1.2} /> },
            { label: "Secured Funds", val: `$${(user?.heldAmount || 0).toLocaleString()}`, sub: `${projects.length} protocols active`, color: "text-white", bg: "bg-rui-dark", icon: <Lock size={22} strokeWidth={1.2} /> },
            { label: "Vault Health", val: "98.5%", sub: "Top 1% of users", color: "text-rui-success", bg: "bg-white", icon: <Globe size={22} strokeWidth={1.2} /> },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`${item.bg} rui-card-organic flex flex-col items-center text-center space-y-4`}
            >
              <div className={`p-4 rounded-2xl ${item.bg === 'bg-white' ? 'bg-rui-light text-rui-blue' : 'bg-white/10 text-white'}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] ${item.bg === 'bg-white' ? 'text-rui-gray-muted' : 'text-gray-400'}`}>{item.label}</span>
              <p className={`text-3xl md:text-4xl font-bold tracking-tight ${item.color}`}>{item.val}</p>
              <span className="text-[10px] md:text-xs font-semibold text-rui-success uppercase tracking-wider">{item.sub}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Real Projects List */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold tracking-tight">Active Projects</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rui-blue bg-rui-blue/5 px-4 py-2 rounded-full border border-rui-blue/10">
              {projects.length} Total
            </span>
          </div>

          <div className="geometric-grid">
            {projects.length > 0 ? (
              projects.map((proj) => (
                <Link key={proj.id} to={`/project/${proj.id}`} className="block h-full">
                  <div className="rui-card-organic flex flex-col justify-between h-full group hover:border-rui-blue transition-all cursor-pointer min-h-[160px]">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="font-bold text-lg text-rui-dark group-hover:text-rui-blue transition-colors line-clamp-1">{proj.title}</p>
                        <p className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-[0.2em]">
                          Protocol ID: {proj.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          proj.status === 'OPEN' ? 'bg-rui-blue' : 
                          proj.status === 'IN_PROGRESS' ? 'bg-rui-success' : 
                          'bg-rui-gray-muted'
                        }`} />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          proj.status === 'OPEN' ? 'text-rui-blue' : 
                          proj.status === 'IN_PROGRESS' ? 'text-rui-success' : 
                          'text-rui-gray-muted'
                        }`}>
                          {proj.status === 'OPEN' ? 'Bidding' : 
                          proj.status === 'IN_PROGRESS' ? 'Operational' : 
                          'Archived'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full rui-card-organic !p-12 text-center bg-rui-light/30 border-dashed">
                <p className="text-rui-gray-muted font-medium">No projects found. Launch your first protocol above.</p>
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
}
