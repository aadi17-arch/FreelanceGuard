import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Send, DollarSign, User, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [proposal, setProposal] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        toast.error("Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/bids/create", {
        projectId: id,
        proposal,
        amount: parseFloat(amount)
      });
      toast.success("Proposal Transmitted Successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit proposal");
    }
  };

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 border-3 border-rui-success/20 border-t-rui-success rounded-full animate-spin"></div>
      <p className="label-caps !text-rui-success !text-[9px]">Loading Project Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header: Balanced */}
      <header className="space-y-6">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-rui-gray-muted hover:text-rui-dark transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Market</span>
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rui-success">
              <ShieldCheck size={12} strokeWidth={3} />
              <p className="label-caps !text-rui-success !text-[9px]">Verified Opportunity</p>
            </div>
            <h1>{project?.title}</h1>
          </div>
          <div className="bg-white border border-rui-gray-border/50 rounded-xl px-6 py-4 text-right shadow-sm">
             <p className="label-caps !text-[8px] opacity-60">Vault Allocation</p>
             <p className="text-3xl font-financial text-rui-dark">${project?.budget?.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Project Body */}
        <section className="lg:col-span-2 space-y-8">
           <div className="bg-white border border-rui-gray-border/50 rounded-2xl p-8 md:p-10 space-y-6 shadow-sm">
              <h2 className="label-caps !text-rui-dark !text-[9px] border-b border-rui-gray-border/5 pb-4">Project Requirements</h2>
              <div className="text-sm md:text-base text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                {project?.description}
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-rui-light/50 border border-rui-gray-border/30 rounded-xl p-6 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-rui-gray-muted shadow-sm">
                   <User size={16} />
                 </div>
                 <div>
                    <p className="label-caps !text-[8px]">Client Identity</p>
                    <p className="text-[11px] font-black text-rui-dark uppercase tracking-tight">{project?.client?.name}</p>
                 </div>
              </div>
              <div className="bg-rui-light/50 border border-rui-gray-border/30 rounded-xl p-6 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-rui-gray-muted shadow-sm">
                   <Clock size={16} />
                 </div>
                 <div>
                    <p className="label-caps !text-[8px]">Posted Date</p>
                    <p className="text-[11px] font-black text-rui-dark uppercase tracking-tight">
                      {new Date(project?.createdAt).toLocaleDateString()}
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* Right: Proposal Form */}
        {user?.role === 'FREELANCER' && (
          <aside className="space-y-6">
            <div className="bg-white border border-rui-gray-border/50 rounded-2xl p-8 shadow-xl shadow-black/[0.02]">
               <div className="flex items-center gap-3 mb-8">
                  <Send size={16} className="text-[#1D9E75]" />
                  <h3 className="label-caps !text-rui-dark">Submit Proposal</h3>
               </div>
               
               <form onSubmit={handleBidSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="label-caps !text-[8px] px-1">Bid Amount ($)</label>
                     <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-rui-gray-muted" size={14} />
                        <input 
                           type="number"
                           required
                           className="w-full pl-10 pr-4 py-3 bg-rui-light/50 border border-rui-gray-border/30 rounded-xl text-sm font-bold focus:border-[#1D9E75] transition-all"
                           placeholder="0.00"
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="label-caps !text-[8px] px-1">Cover Letter</label>
                     <textarea 
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-rui-light/50 border border-rui-gray-border/30 rounded-xl text-xs font-medium focus:border-[#1D9E75] transition-all resize-none"
                        placeholder="Detail your approach and relevant experience..."
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                     />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-rui-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1D9E75] transition-all shadow-xl shadow-black/5"
                  >
                    Submit Proposal
                  </button>
               </form>
            </div>

            <div className="bg-[#E1F5EE]/30 border border-[#1D9E75]/10 rounded-2xl p-6 space-y-3">
               <div className="flex items-center gap-2 text-[#1D9E75]">
                  <ShieldCheck size={16} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Payment Guarantee</span>
               </div>
               <p className="text-[9px] text-[#1D9E75] font-bold uppercase tracking-tighter opacity-80 leading-relaxed">
                 All payments are secured by FreelanceGuard Escrow. Funds are locked before you begin work.
               </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
