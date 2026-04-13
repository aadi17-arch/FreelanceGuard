import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Globe, Search, Filter, ShieldCheck, ChevronRight, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Market() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAllProject = async () => {
      try {
        const res = await axios.get("/projects/all");
        setProjects(res.data);
      }
      catch (err) {
        console.log("Failed to Fetch marketplace");
      }
      finally {
        setLoading(false);
      }
    };
    fetchAllProject();
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0, transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.26, 1]
      }
    }
  };
  return (
    <motion.div initial="hidden" animate="visible" className="min-h-screen atmospheric-bg">
      {/* Marketplace Nav */}
      <nav className="glass-nav">
        <div className="section-container !px-0 flex justify-between items-center">
          <Link to="/dashboard" className="text-base md:text-xl font-bold tracking-tight uppercase">
            Freelance<span className="text-rui-blue">Guard</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-rui-blue hover:text-rui-dark transition-colors">Dashboard</Link>
            
            {/* Unified User Node */}
            <div className="flex items-center bg-rui-light/50 border border-rui-gray-border rounded-full pl-2 pr-4 py-1.5 gap-3">
              <div className="w-8 h-8 rounded-full bg-rui-blue text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-lg">
                {user?.name?.[0]}
              </div>
              <div className="flex flex-col -space-y-1 text-left">
                <span className="text-[10px] font-bold text-rui-dark truncate max-w-[80px]">{user?.name || "User"}</span>
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
        </div>
      </nav>
      <main className="section-container py-12 md:py-20">
        <motion.header variants={itemVariants} className="mb-16 space-y-4">
          <div className="flex items-center gap-2 text-rui-blue">
            <Globe size={14} strokeWidth={3} />
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Protocol Marketplace</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Verified Opportunities</h1>
          <p className="text-rui-gray-muted text-sm md:text-lg font-medium max-w-xl">
            Secure your next contract with guaranteed milestone payments through our
            <span className="text-rui-dark font-bold"> Escrow Guard</span> protocol.
          </p>
        </motion.header>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-rui-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div variants={containerVariants} className="geometric-grid">
            {projects.map((proj) => (
              <motion.div
                key={proj.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="rui-card-organic flex flex-col justify-between group h-full shadow-sm"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-rui-light rounded-xl text-rui-blue group-hover:bg-rui-blue group-hover:text-white transition-all">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rui-blue bg-rui-blue/5 px-3 py-1.5 rounded-md border border-rui-blue/10">{proj.status}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-rui-dark tracking-tight leading-tight line-clamp-2">{proj.title}</h3>
                    <p className="text-[13px] text-rui-gray-muted line-clamp-3 leading-relaxed font-medium">{proj.description}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-rui-light">
                    <div className="w-8 h-8 rounded-lg bg-rui-light flex items-center justify-center text-rui-blue">
                      <User size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-bold text-rui-gray-muted tracking-[0.2em]">Escrow Verified</span>
                      <span className="text-[11px] font-semibold text-rui-dark uppercase">{proj.client?.name || "Client"}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/project/${proj.id}`} className="mt-8">
                  <button className="btn-pill-primary w-full flex items-center justify-center gap-2">
                    Access Protocol
                    <ChevronRight size={14} />
                  </button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
