import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  FileText,
  PenTool,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  ArrowLeft,
  Fingerprint,
  Zap
} from "lucide-react";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Development",
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const showStatus = (msg, type) => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/projects/create", formData);
      showStatus("Project created successfully.", 'success');
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      showStatus(err.response?.data?.message || "Project creation failed.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-10 pb-20 px-4 lg:px-0">
      {/* 1. Navigation & Status */}
      <header className="space-y-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold">Dashboard</span>
        </Link>

        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border flex items-center gap-3 shadow-lg ${
                statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">{statusMessage.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-emerald-500">
             <Zap size={14} fill="currentColor" />
             <p className="text-xs font-bold text-zinc-400">Project Builder</p>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 leading-none">Create a Project</h1>
          <p className="text-sm font-medium text-zinc-400 max-w-lg">
             Configure your project requirements to start a secure escrow contract.
          </p>
        </div>
      </header>

      {/* 2. Compact Architect Form */}
      <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-zinc-50">
          
          {/* Section 1: Identification & Allocation */}
          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-lg">
                  <PenTool size={14} />
                </div>
                <label className="text-sm font-bold text-zinc-500">Project Name</label>
              </div>
              <input
                type="text"
                name="title"
                required
                className="w-full text-lg lg:text-xl font-black bg-transparent border-none focus:ring-0 placeholder:text-zinc-200 text-zinc-900 tracking-tight px-0"
                placeholder="e.g. Protocol Development V2"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

          {/* Section 2: Category & Allocation */}
          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center">
                  <Package size={14} />
                </div>
                <label className="text-sm font-bold text-zinc-500">Project Category</label>
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-lg font-bold bg-transparent border-none focus:ring-0 text-zinc-900 tracking-tight px-0 appearance-none cursor-pointer"
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Writing">Writing</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <DollarSign size={14} />
                </div>
                <label className="text-sm font-bold text-zinc-500">Project Budget ($)</label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-zinc-300">$</span>
                <input
                  type="number"
                  name="budget"
                  required
                  className="w-full text-lg lg:text-xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-zinc-200 text-zinc-900 tracking-tight"
                  placeholder="0.00"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          </div>

          {/* Section 2: Scope of Operations */}
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-400 flex items-center justify-center">
                <FileText size={14} />
              </div>
              <label className="text-sm font-bold text-zinc-500">Project Description</label>
            </div>
            <textarea
              name="description"
              required
              rows={6}
              className="w-full text-[13px] font-medium bg-transparent border-none focus:ring-0 placeholder:text-zinc-200 text-zinc-600 resize-none leading-relaxed px-0"
              placeholder="Outline the technical requirements, operational milestones, and timeline..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Section 3: Finalization */}
          <div className="p-6 lg:p-8 bg-zinc-50/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-400">System Online</span>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <button 
                 type="button"
                 onClick={() => navigate('/dashboard')}
                 className="flex-grow sm:flex-none px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={loading}
                 className="flex-grow sm:flex-none px-10 py-3.5 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-900/10 active:scale-95 flex items-center justify-center gap-3"
               >
                 {loading ? "Creating..." : (
                   <>
                     Create Project
                     <ChevronRight size={14} strokeWidth={3} />
                   </>
                 )}
               </button>
            </div>
          </div>
        </form>
      </div>

      {/* Security Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {[
           { title: "Escrow Protocol", desc: "Funds are locked in a neutral node until verification." },
           { title: "Legal Synchrony", desc: "Digital contract is signed upon project initiation." }
         ].map((item, i) => (
           <div key={i} className="bg-zinc-50/50 border border-zinc-100 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-zinc-900">
                 <ShieldCheck size={12} className="text-emerald-500" />
                 <p className="text-[10px] font-black uppercase tracking-tight">{item.title}</p>
              </div>
              <p className="text-[9px] text-zinc-400 font-medium leading-relaxed uppercase tracking-widest">{item.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
}
