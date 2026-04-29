import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Zap,
  ShieldCheck,
  DollarSign,
  Star,
  Users
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Market() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const tabs = [
    { id: "ALL", label: "Global" },
    { id: "OPEN", label: "Open" },
    { id: "IN_PROGRESS", label: "Active" },
    { id: "COMPLETED", label: "Archive" }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/projects/all");
      setProjects(res.data);
    } catch (err) {
      console.error("Marketplace sync failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "ALL" ? true : p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
        <Briefcase className="w-6 h-6 text-zinc-300" />
      </motion.div>
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Scanning Market...</p>
    </div>
  );

  return (
    <div className="space-y-5 lg:space-y-12 pb-20">
      {/* 1. Scaled Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-500">
             <Zap size={10} fill="currentColor" />
             <p className="text-[7px] font-black uppercase tracking-[0.3em]">Network Active</p>
          </div>
          <h1 className="text-xl lg:text-4xl font-black tracking-tighter text-zinc-900 uppercase">Marketplace</h1>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-grow lg:flex-grow-0 lg:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} />
            <input 
              type="text"
              placeholder="Find missions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-100 border-none rounded-xl text-[10px] font-bold uppercase tracking-tight focus:bg-zinc-200 outline-none transition-all placeholder:text-zinc-400"
            />
          </div>
          {user?.role === 'CLIENT' && (
            <Link to="/create-project" className="lg:block hidden">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
                <Plus size={12} strokeWidth={3} /> Post Mission
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Compact Sticky Tabs */}
      <div className="sticky top-0 z-40 -mx-4 px-4 bg-white/80 backdrop-blur-xl border-b border-zinc-50 pt-1">
        <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative ${
                activeTab === tab.id ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="marketTabMarker" className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Compact Opportunity Nodes */}
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((proj) => (
            <motion.div 
              key={proj.id}
              layout
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              onClick={() => navigate(`/project/${proj.id}`)}
              className="group bg-white border border-zinc-100 rounded-2xl p-4 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:shadow-xl hover:border-emerald-500/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-start gap-4 w-full lg:w-auto">
                 <div className="w-10 h-10 lg:w-16 lg:h-16 bg-zinc-900 rounded-xl flex items-center justify-center text-emerald-500 shadow-lg shrink-0 group-hover:rotate-6 transition-transform">
                    <ShieldCheck size={18} />
                 </div>
                 <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${
                         proj.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-50 text-zinc-400'
                       }`}>
                          {proj.status}
                       </span>
                       <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1">
                          <Clock size={8} /> {new Date(proj.createdAt).toLocaleDateString()}
                       </p>
                    </div>
                    <h3 className="text-sm lg:text-xl font-black text-zinc-900 uppercase tracking-tight truncate leading-tight group-hover:text-emerald-600 transition-colors">
                       {proj.title}
                    </h3>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 text-[9px] font-black text-zinc-400 uppercase tracking-tight">
                          <Users size={10} className="text-zinc-200" />
                          {proj.client?.name || "Verified Client"}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-between w-full lg:w-auto gap-6 pt-3 lg:pt-0 border-t border-zinc-50 lg:border-none">
                 <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">Allocation</p>
                    <div className="flex items-center gap-0.5 font-black text-zinc-900 text-base lg:text-2xl font-mono tracking-tighter">
                       <DollarSign size={12} className="text-emerald-500" />
                       {proj.budget?.toLocaleString()}
                    </div>
                 </div>
                 <div className="w-8 h-8 lg:w-12 lg:h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                    <ChevronRight size={14} />
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center space-y-4 px-6">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-200">
               <Briefcase size={24} />
            </div>
            <p className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.3em]">No operational activity logged</p>
          </div>
        )}
      </div>

      {/* Scaled Floating Button */}
      {user?.role === 'CLIENT' && (
        <div className="fixed bottom-6 right-6 lg:hidden z-50">
           <Link to="/create-project">
              <button className="w-12 h-12 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
                 <Plus size={20} strokeWidth={3} />
              </button>
           </Link>
        </div>
      )}
    </div>
  );
}
