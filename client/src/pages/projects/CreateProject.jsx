import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
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
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/projects/create", formData);
      toast.success("Project created successfully.");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Project creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 pb-24 px-4 lg:px-0">
      {/* 1. Glassy Header */}
      <header className="relative py-10 px-8 rounded-[2.5rem] bg-zinc-900 overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 space-y-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-emerald-500/20">
                  <Zap size={20} fill="currentColor" />
               </div>
               <div>
                  <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-none">New Project</h1>
                  <p className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-widest">Post a new job</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Architect Form */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] shadow-xl shadow-zinc-200/40 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-zinc-50">
          
          {/* Section 1: Core Details */}
          <div className="p-8 lg:p-12 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-zinc-400">
                <PenTool size={16} />
                <label className="text-[10px] font-black uppercase tracking-[0.2em]">Project Name</label>
              </div>
              <input
                type="text"
                name="title"
                required
                className="w-full text-2xl lg:text-3xl font-black bg-zinc-50/50 border border-transparent focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl p-6 placeholder:text-zinc-200 text-zinc-900 tracking-tight transition-all"
                placeholder="Name your mission..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-400">
                  <Package size={16} />
                  <label className="text-[10px] font-black uppercase tracking-[0.2em]">Category</label>
                </div>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full text-sm font-bold bg-zinc-50/50 border border-transparent focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl p-4 text-zinc-900 appearance-none cursor-pointer transition-all"
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Writing">Writing</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-zinc-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-400">
                  <DollarSign size={16} />
                  <label className="text-[10px] font-black uppercase tracking-[0.2em]">Budget ($)</label>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 font-bold">$</div>
                  <input
                    type="number"
                    name="budget"
                    required
                    className="w-full pl-8 pr-4 py-4 bg-zinc-50/50 border border-transparent focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl text-sm font-bold text-zinc-900 transition-all"
                    placeholder="0.00"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Scope */}
          <div className="p-8 lg:p-12 space-y-6 bg-zinc-50/20">
            <div className="flex items-center gap-3 text-zinc-400">
              <FileText size={16} />
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">What do you need done?</label>
            </div>
            <textarea
              name="description"
              required
              rows={8}
              className="w-full p-6 bg-white border border-transparent focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 rounded-3xl text-sm font-medium text-zinc-600 resize-none leading-relaxed transition-all shadow-sm"
              placeholder="Explain the work you need, the goals, and the timeline..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Section 3: Finalization */}
          <div className="p-8 lg:p-10 bg-white flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Ready to go</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase">Click to post your job</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <button 
                 type="button"
                 onClick={() => navigate('/dashboard')}
                 className="flex-grow sm:flex-none px-8 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={loading}
                 className="flex-grow sm:flex-none px-12 py-4 bg-zinc-900 text-white rounded-[1.2rem] text-sm font-bold hover:bg-emerald-500 transition-all shadow-2xl shadow-zinc-900/20 active:scale-95 flex items-center justify-center gap-3"
               >
                 {loading ? "Posting..." : (
                   <>
                     Post Project
                     <ChevronRight size={14} strokeWidth={3} />
                   </>
                 )}
               </button>
            </div>
          </div>
        </form>
      </div>

      {/* Security Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {[
           { title: "Safe Payments", desc: "Your money is held securely until you approve the work.", icon: <ShieldCheck size={14} /> },
           { title: "Job Agreements", desc: "A professional agreement is created automatically.", icon: <Fingerprint size={14} /> }
         ].map((item, i) => (
           <div key={i} className="bg-white border border-zinc-100 p-6 rounded-[1.8rem] space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 text-zinc-900">
                 <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                   {item.icon}
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.1em]">{item.title}</p>
              </div>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
}
