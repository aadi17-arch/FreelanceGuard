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
  ChevronRight,
  ChevronDown,
  X,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from '../../utils/toast';

export default function Market() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const allowedRoles = ["FREELANCER", "CLIENT"];
  if (!allowedRoles.includes(user?.role?.toUpperCase())) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Access Restricted</h2>
        <p className="text-sm text-zinc-500 max-w-xs">
          The project marketplace is restricted to authorized platform users.
        </p>
        <Link to="/dashboard" className="text-xs font-bold text-emerald-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Modal state and submission logic removed - now redirects to details page as requested

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/projects");
      setProjects(res.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || p.category?.toLowerCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getCount = (filter) => {
    if (filter === "All") return projects.length;
    return projects.filter(p => p.category?.toLowerCase() === filter.toLowerCase()).length;
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-6 h-6 border-2 border-rui-dark border-t-transparent rounded-full" />
      <p className="text-[10px] font-bold text-zinc-400">Loading available projects...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="relative w-full sm:w-72 group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-rui-success transition-colors" />
          <input
            type="text"
            placeholder="Search all projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-[8px] text-xs font-bold focus:outline-none focus:border-rui-success focus:ring-1 focus:ring-rui-success transition-all placeholder:text-zinc-400 text-zinc-900"
          />
        </div>
      </div>

      <div className="md:hidden relative w-full">
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="w-full bg-white border border-zinc-200 rounded-[10px] pl-4 pr-10 py-2.5 text-[10px] font-bold text-zinc-900 appearance-none focus:outline-none focus:border-rui-success hover:border-zinc-400 transition-all cursor-pointer"
        >
          {["All", "Development", "Design", "Marketing", "Writing"].map((filter) => (
            <option key={filter} value={filter.toLowerCase()}>
              {filter}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 overflow-x-auto pb-2 px-1 border-b border-zinc-200 no-scrollbar">
        {["All", "Development", "Design", "Marketing", "Writing"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter.toLowerCase())}
            className={`pb-3 px-1 text-[11px] font-bold tracking-[0.05em] whitespace-nowrap transition-all relative flex items-center gap-2 ${(activeFilter === filter.toLowerCase())
                ? "text-zinc-950"
                : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            {filter}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeFilter === filter.toLowerCase() ? "bg-rui-success/10 text-rui-success" : "bg-zinc-50 text-zinc-400"
            }`}>
              {getCount(filter)}
            </span>
            {(activeFilter === filter.toLowerCase()) && (
              <motion.div
                layoutId="marketTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-rui-success rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.length > 0 ? filteredProjects.map((proj) => (
          <Link
            key={proj.id}
            to={`/project/${proj.id}`}
            className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-950 hover:shadow-sm transition-all duration-300 flex flex-col gap-4"
          >
            {/* Top row: Title and Date */}
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-md font-bold text-zinc-900 tracking-tight truncate group-hover:text-emerald-600 transition-colors">
                {proj.title}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 shrink-0">
                <Clock size={11} />
                <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description just below the title */}
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-medium">
              {proj.description}
            </p>

            {/* Bottom row: Budget and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Budget:</span>
                <div className="flex items-center gap-0.5 font-black text-emerald-600 text-sm tracking-tight">
                  <DollarSign size={13} />
                  {proj.budget?.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user?.role === "FREELANCER" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/project/${proj.id}`);
                    }}
                    className="px-5 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold hover:bg-black transition-all"
                  >
                    Send proposal
                  </button>
                )}
                <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-all duration-300">
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4 border border-zinc-200 rounded-[10px] bg-white">
            <div className="text-zinc-200">
              <Briefcase size={32} />
            </div>
            <p className="text-[10px] font-bold text-zinc-400">No matching projects found</p>
            {user?.role?.toUpperCase() === "CLIENT" && (
               <Link to="/create-project">
                 <button className="px-6 py-2.5 bg-rui-dark text-white rounded-[10px] text-[10px] font-bold hover:bg-black transition-all">
                   Post a project
                 </button>
               </Link>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
