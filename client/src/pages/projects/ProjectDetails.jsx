import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Send, DollarSign, User, Clock, Lock, CheckCircle2 } from "lucide-react";
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
      await axios.post("/bids/createBid", {
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

  const handleHire = async (bid) => {
    try {
      const res = await axios.post("/projects/hire", {
        projectId: id,
        freelancerId: bid.freelancerId,
        bidAmount: bid.amount
      });
      toast.success(res.data.message);
      navigate("/escrow");
    } catch (err) {
      toast.error(err.response?.data?.message || "Hiring protocol failed");
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

        {/* Right: Proposal Form / Bids List */}
        <aside className="space-y-6">
          {user?.role === 'FREELANCER' ? (
            <>
              {project?.contracts?.some(c => c.freelancerId === user.id) ? (
                /* AWARDED VIEW */
                <div className="bg-rui-success/10 border border-rui-success/30 rounded-2xl p-8 text-center space-y-4 shadow-xl shadow-rui-success/5">
                  <div className="w-12 h-12 bg-rui-success rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-rui-success/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="label-caps !text-rui-success !text-xs">Project Awarded</h3>
                    <p className="text-[10px] text-rui-success font-black uppercase tracking-widest mt-2 opacity-80">
                      Funds Secured in Vault
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/escrow')}
                    className="w-full py-3 bg-rui-success text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                  >
                    Go to Vault
                  </button>
                </div>
              ) : project?.bids?.some(bid => bid.freelancerId === user.id) ? (
                /* ALREADY BIDDED VIEW */
                <div className="bg-white border border-rui-gray-border/50 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 bg-rui-success/5 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="text-rui-success" size={20} />
                  </div>
                  <div>
                    <h3 className="label-caps !text-rui-dark">Proposal Submitted</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      You are in the queue
                    </p>
                  </div>
                </div>
              ) : project?.status === 'OPEN' ? (
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
                        className="w-full py-4 bg-rui-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rui-success transition-all shadow-xl shadow-black/5"
                      >
                        Submit Proposal
                      </button>
                   </form>
                </div>
              ) : (
                <div className="bg-white border border-rui-gray-border/50 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <div>
                    <h3 className="label-caps !text-gray-400">Project Closed</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                      No longer accepting proposals
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* CLIENT VIEW: Show Bids */
            <div className="space-y-4">
              <h3 className="label-caps !text-rui-dark mb-4">Proposals Received ({project?.bids?.length || 0})</h3>
              <div className="space-y-4">
                {project?.bids?.map((bid) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={bid.id} 
                    className="bg-white border border-rui-gray-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rui-success/10 text-rui-success flex items-center justify-center text-[10px] font-bold">
                          {bid.freelancer?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-rui-dark leading-none">{bid.freelancer?.name}</p>
                          <p className="text-[9px] text-rui-gray-muted uppercase tracking-widest mt-1">Freelancer</p>
                        </div>
                      </div>
                      <p className="text-sm font-financial font-bold text-rui-success">${bid.amount?.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed italic border-l-2 border-rui-gray-border/20 pl-4 mb-4 line-clamp-3">
                      "{bid.proposal}"
                    </p>
                    <button 
                      onClick={() => handleHire(bid)}
                      className="w-full py-2 bg-rui-light text-rui-dark rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rui-dark hover:text-white transition-all"
                    >
                      Hire {bid.freelancer?.name?.split(' ')[0]}
                    </button>
                  </motion.div>
                ))}
                {project?.bids?.length === 0 && (
                  <div className="text-center py-10 bg-rui-light/30 rounded-2xl border-2 border-dashed border-rui-gray-border/20">
                    <p className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-widest">No proposals yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-rui-success/5 border border-rui-success/10 rounded-2xl p-6 space-y-3">
             <div className="flex items-center gap-2 text-rui-success">
                <ShieldCheck size={16} strokeWidth={3} />
                <span className="text-[9px] font-black uppercase tracking-widest">Vault Protection</span>
             </div>
             <p className="text-[9px] text-rui-success font-bold tracking-tighter opacity-80 leading-relaxed">
               All payments are secured by FreelanceGuard Vault. Funds are locked before you begin work.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
