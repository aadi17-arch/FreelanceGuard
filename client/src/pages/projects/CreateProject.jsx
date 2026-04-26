import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Package, 
  FileText, 
  PenTool, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/projects/create", formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initialize project");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* Header: Balanced */}
      <motion.header variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-2 text-rui-success">
          <ShieldCheck size={12} strokeWidth={3} />
          <p className="label-caps !text-rui-success !text-[9px]">Project Initialization</p>
        </div>
        <h1>Post a Project</h1>
        <p className="text-xs md:text-sm text-gray-500 font-medium max-w-lg">
          Define your requirements to initiate a secure escrow contract on the network.
        </p>
      </motion.header>

      {/* Main Form: Professional & Normalized */}
      <motion.div variants={itemVariants} className="bg-white border border-rui-gray-border/50 rounded-2xl overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="divide-y divide-rui-gray-border/10">
          
          {error && (
            <div className="p-4 bg-rui-danger/5 text-rui-danger text-[9px] font-black uppercase tracking-widest text-center border-b border-rui-danger/10">
              {error}
            </div>
          )}

          {/* Title Section */}
          <div className="p-8 md:p-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rui-success/10 text-rui-success flex items-center justify-center">
                <PenTool size={16} />
              </div>
              <label className="label-caps !text-[10px]">Project Designation</label>
            </div>
            <input
              type="text"
              name="title"
              required
              className="w-full text-xl md:text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-rui-gray-border/30 text-rui-dark tracking-tight"
              placeholder="e.g. Website Development"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description Section */}
          <div className="p-8 md:p-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rui-light text-rui-gray-muted flex items-center justify-center">
                <FileText size={16} />
              </div>
              <label className="label-caps !text-[10px]">Scope of Work</label>
            </div>
            <textarea
              name="description"
              required
              rows={8}
              className="w-full text-sm md:text-base font-medium bg-transparent border-none focus:ring-0 placeholder:text-rui-gray-border/30 text-rui-dark resize-none leading-relaxed"
              placeholder="Outline the technical requirements, deliverables, and timeline..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
 
           {/* Budget Section */}
           <div className="p-8 md:p-10 space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-rui-success/10 text-rui-success flex items-center justify-center">
                 <Package size={16} />
               </div>
               <label className="label-caps !text-[10px]">Vault Allocation (USD)</label>
             </div>
             <div className="flex items-center gap-4">
               <span className="text-2xl font-bold text-rui-gray-muted">$</span>
               <input
                 type="number"
                 name="budget"
                 required
                 className="w-full text-xl md:text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-rui-gray-border/30 text-rui-dark tracking-tight"
                 placeholder="0.00"
                 value={formData.budget}
                 onChange={handleChange}
               />
             </div>
           </div>

          {/* Action Section */}
          <div className="p-8 md:p-10 bg-rui-light/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1D9E75]">Status: System Ready</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-3.5 bg-rui-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1D9E75] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/5"
            >
              {loading ? "Initializing..." : (
                <>
                  Post Project
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
