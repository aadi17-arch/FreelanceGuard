import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Globe, Search, Filter, ShieldCheck, ChevronRight, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Market() {
  const { user } = useAuth();
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
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1, y: 0, transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-10 pb-20">
      {/* Header Section: Scaled & Balanced */}
      <motion.header variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-2 text-rui-success">
          <Globe size={12} strokeWidth={3} />
          <p className="label-caps !text-rui-success !text-[9px]">Project Marketplace</p>
        </div>
        <h1>Browse Projects</h1>
        <p className="text-xs md:text-sm text-gray-500 max-w-xl font-medium">
          Secure your next contract with guaranteed milestone payments through our
          <span className="text-rui-success font-bold"> Secure Escrow</span> system.
        </p>
      </motion.header>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-rui-success/20 border-t-rui-success rounded-full animate-spin"></div>
          <p className="label-caps !text-rui-success !text-[9px]">Synchronizing Market...</p>
        </div>
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
          {projects.map((proj) => (
            <motion.div
              key={proj.id}
              variants={itemVariants}
              className="group bg-white border border-rui-gray-border/50 hover:border-rui-success/20 rounded-xl p-6 md:p-8 transition-all hover:shadow-xl hover:shadow-black/[0.02]"
            >
              <div className="flex flex-col md:flex-row justify-between gap-8">
                {/* Left side: Project Details */}
                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-rui-success/10 flex items-center justify-center text-rui-success group-hover:bg-rui-dark group-hover:text-rui-light transition-all duration-300">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-lg md:text-xl font-bold text-rui-dark tracking-tight leading-none group-hover:text-rui-success transition-colors">{proj.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-rui-gray-muted opacity-60">
                          {proj.client?.name || "Verified Client"}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-rui-success"></div>
                        <span className="text-[9px] font-black tracking-widest text-rui-success">Secure Node</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed max-w-2xl line-clamp-2">
                    {proj.description}
                  </p>
                </div>

                {/* Right side: Budget & Action */}
                <div className="flex flex-row md:flex-col justify-between items-center md:items-end md:w-44 shrink-0 gap-4">
                   <div className="text-left md:text-right space-y-0.5">
                      <p className="text-2xl font-financial text-rui-dark leading-none">${proj.budget?.toLocaleString() || "0"}</p>
                      <p className="label-caps !text-[8px]">Allocation</p>
                   </div>
                   
                   <Link to={`/project/${proj.id}`} className="w-auto md:w-full">
                    <button className="px-6 md:px-0 md:w-full py-2.5 bg-rui-dark text-rui-light rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#1D9E75] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5">
                      View
                      <ChevronRight size={12} />
                    </button>
                   </Link>
                </div>
              </div>

              {/* Project Metadata Footer */}
              <div className="mt-6 pt-6 border-t border-rui-gray-border/10 flex flex-wrap gap-6 items-center">
                 <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rui-light text-rui-gray-muted">
                      <User size={12} />
                    </div>
                    <span className="text-[9px] font-bold text-rui-gray-muted uppercase tracking-wider">Identity Confirmed</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rui-light text-rui-gray-muted">
                      <Filter size={12} />
                    </div>
                    <span className="text-[9px] font-bold text-rui-gray-muted uppercase tracking-wider">{proj.category || "General"}</span>
                 </div>
                 <div className="ml-auto">
                    <div className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-[0.2em] border ${
                      proj.status === 'OPEN' 
                        ? 'bg-[#E1F5EE] text-[#1D9E75] border-[#1D9E75]/10' 
                        : 'bg-rui-blue/5 text-rui-blue border-rui-blue/10'
                    }`}>
                      {proj.status === 'OPEN' ? 'Accepting Bids' : proj.status}
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
