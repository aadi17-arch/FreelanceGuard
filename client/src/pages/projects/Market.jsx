import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  ArrowRight,
  Filter,
  Briefcase,
  Zap,
  Plus,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Market() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Market scan error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all projects" || activeFilter === "all" || p.category?.toLowerCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
        <Briefcase className="w-6 h-6 text-zinc-300" />
      </motion.div>
      <p className="text-sm font-bold text-emerald-500">Finding projects...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Market Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-500">
            <Zap size={10} fill="currentColor" />
            <p className="text-xs font-bold text-emerald-500">System Ready</p>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900">Project Marketplace</h1>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-grow lg:w-72 group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-100 border-none rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-400"
            />
          </div>
          <Link to="/create-project">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
              <Plus size={16} /> Post Project
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Quick Filters */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
        {["All Projects", "Development", "Design", "Marketing", "Writing"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter.toLowerCase())}
            className={`pb-3 px-1 text-xs font-bold whitespace-nowrap transition-all relative ${(activeFilter === filter.toLowerCase() || (activeFilter === 'all' && filter === 'All Projects'))
                ? "text-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            {filter}
            {(activeFilter === filter.toLowerCase() || (activeFilter === 'all' && filter === 'All Projects')) && (
              <motion.div layoutId="marketFilter" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 3. Project Listings */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.length > 0 ? filteredProjects.map((proj) => (
          <Link
            key={proj.id}
            to={`/project/${proj.id}`}
            className="group bg-white border border-zinc-100 rounded-2xl p-5 lg:p-6 hover:shadow-2xl hover:shadow-zinc-200/50 hover:border-emerald-100 transition-all duration-500 flex flex-col lg:flex-row lg:items-center gap-6"
          >
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 text-zinc-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-500">
                  <Briefcase size={18} />
                </div>
                <div className="space-y-0.5">
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 tracking-tight">
                    Open Project
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-300">
                    <Clock size={10} /> {new Date(proj.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg lg:text-xl font-bold text-zinc-900 tracking-tight truncate group-hover:text-emerald-600 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed max-w-2xl font-medium">
                  {proj.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full lg:w-auto gap-10 pt-4 lg:pt-0 border-t border-zinc-50 lg:border-none">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-zinc-300">Project Budget</p>
                <div className="flex items-center gap-0.5 font-black text-zinc-900 text-xl lg:text-2xl tracking-tighter">
                  <DollarSign size={16} className="text-emerald-500" />
                  {proj.budget?.toLocaleString()}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-200 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-500">
                <ChevronRight size={18} />
              </div>
            </div>
          </Link>
        )) : (
          <div className="py-32 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-200">
              <Briefcase size={24} />
            </div>
            <p className="text-sm font-bold text-zinc-300">No projects found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
