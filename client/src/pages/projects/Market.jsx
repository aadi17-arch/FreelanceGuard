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
  X,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { submitProposal } from "../../services/proposalService";
import { toast } from "react-hot-toast";

export default function Market() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  // Proposal Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    duration: "",
    coverLetter: ""
  });

  const handleApplyClick = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProject(project);
    setFormData({ ...formData, amount: project.budget || "" });
    setShowApplyModal(true);
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitProposal({
        projectId: selectedProject.id,
        amount: parseFloat(formData.amount),
        duration: parseInt(formData.duration),
        coverLetter: formData.coverLetter
      });
      toast.success("Proposal submitted successfully!");
      setShowApplyModal(false);
      setFormData({ amount: "", duration: "", coverLetter: "" });
    } catch (error) {
      toast.error(error || "Failed to submit proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:flex-grow lg:w-72 group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-100 border-none rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-400"
            />
          </div>
          {user?.role === "CLIENT" && (
            <Link to="/create-project" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-xl active:scale-95 text-nowrap">
                <Plus size={16} /> Post Project
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Quick Filters */}
      <div className="flex items-center gap-6 overflow-x-auto pb-2 px-1 custom-scrollbar no-scrollbar">
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

            <div className="flex flex-col sm:flex-row items-center justify-between w-full lg:w-auto gap-6 pt-4 lg:pt-0 border-t border-zinc-50 lg:border-none">
              <div className="flex items-center gap-8">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Project Budget</p>
                  <div className="flex items-center gap-0.5 font-black text-zinc-900 text-xl lg:text-2xl tracking-tighter">
                    <DollarSign size={16} className="text-emerald-500" />
                    {proj.budget?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {user?.role === "FREELANCER" && (
                  <button
                    onClick={(e) => handleApplyClick(e, proj)}
                    className="flex-grow sm:flex-grow-0 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Apply Now
                  </button>
                )}
                <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-200 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-500">
                  <ChevronRight size={18} />
                </div>
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

      {/* 4. Application Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-zinc-900 tracking-tight">Submit Proposal</h2>
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{selectedProject?.title}</p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleProposalSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Bid Amount ($)</label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        required
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full pl-9 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Duration (Days)</label>
                    <div className="relative">
                      <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        required
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="7"
                        className="w-full pl-9 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Cover Letter</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    placeholder="Describe why you're the best fit for this project..."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Send Proposal"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
