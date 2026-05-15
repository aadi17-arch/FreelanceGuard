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
import { submitProposal } from "../../services/proposalService";
import Modal from "../../components/ui/Modal";
import toast from '../../utils/toast';

export default function Market() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

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
            className="group bg-white border border-zinc-200 rounded-[10px] p-[20px] hover:border-rui-success transition-all duration-500 flex flex-col lg:flex-row lg:items-center gap-6"
          >
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-50 text-zinc-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-rui-success transition-all duration-500 border border-zinc-100 group-hover:border-rui-success/20">
                  <Briefcase size={18} />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                    <Clock size={10} /> {new Date(proj.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg lg:text-xl font-bold text-zinc-900 tracking-tight truncate group-hover:text-rui-success transition-colors">
                  {proj.title}
                </h3>
                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed max-w-2xl font-medium">
                  {proj.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between w-full lg:w-auto gap-6 pt-4 lg:pt-0 border-t border-zinc-100 lg:border-none">
              <div className="flex items-center gap-8">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-zinc-400">Estimated budget</p>
                  <div className="flex items-center gap-0.5 font-bold text-zinc-900 text-xl lg:text-2xl tracking-tighter font-financial">
                    <DollarSign size={16} className="text-rui-success" />
                    {proj.budget?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {user?.role === "FREELANCER" && (
                  <button
                    onClick={(e) => handleApplyClick(e, proj)}
                    className="flex-grow sm:flex-grow-0 px-6 py-2.5 bg-rui-dark text-white rounded-[10px] text-[10px] font-bold hover:bg-black transition-all"
                  >
                    Send proposal
                  </button>
                )}
                <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-rui-dark group-hover:text-white group-hover:border-rui-dark transition-all duration-500">
                  <ChevronRight size={18} />
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
            {user?.role === "CLIENT" && (
               <Link to="/create-project">
                 <button className="px-6 py-2.5 bg-rui-dark text-white rounded-[10px] text-[10px] font-bold hover:bg-black transition-all">
                   Post a project
                 </button>
               </Link>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Send proposal"
        type="success"
      >
        <form onSubmit={handleProposalSubmit} className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-rui-success mb-4">Project: {selectedProject?.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 px-1">Your budget ($)</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  required
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 h-12 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:bg-white focus:border-rui-success outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 px-1">Duration (Days)</label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  required
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="7"
                  className="w-full pl-9 pr-4 h-12 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-bold focus:bg-white focus:border-rui-success outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 px-1">Proposal message</label>
            <textarea
              required
              rows={4}
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              placeholder="Describe why you're the best fit for this project..."
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:bg-white focus:border-rui-success outline-none transition-all resize-none"
            />
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full h-14 bg-rui-dark text-white rounded-2xl text-[10px] font-bold hover:bg-black transition-all shadow-xl shadow-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Send Proposal"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
