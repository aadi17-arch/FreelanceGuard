import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ShieldCheck, 
  Send, 
  DollarSign, 
  User, 
  Clock, 
  Lock, 
  CheckCircle2,
  Fingerprint,
  AlertCircle
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [proposal, setProposal] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      showStatus("Failed to load project details.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (msg, type) => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/bids/createBid", {
        projectId: id,
        proposal,
        amount: parseFloat(amount)
      });
      showStatus("Proposal submitted successfully.", 'success');
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      showStatus(err.response?.data?.message || "Submission failed.", 'error');
    }
  };

  const handleHire = async (bid) => {
    try {
      const res = await axios.post("/projects/hire", {
        projectId: id,
        freelancerId: bid.freelancerId,
        bidAmount: bid.amount
      });
      showStatus("Hire successful.", 'success');
      setTimeout(() => navigate("/escrow"), 2000);
    } catch (err) {
      showStatus(err.response?.data?.message || "Hiring failed.", 'error');
    }
  };

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <ShieldCheck className="w-8 h-8 text-emerald-500" />
      </motion.div>
      <p className="text-xs font-bold text-emerald-500">Syncing...</p>
    </div>
  );

  return (
    <div className="space-y-6 lg:space-y-8 pb-10">
      {/* 1. Header & Navigation - Desktop Scaled */}
      <header className="space-y-6">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold">Marketplace</span>
        </Link>

        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border flex items-center gap-3 shadow-lg ${
                statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold">{statusMessage.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <ShieldCheck size={12} strokeWidth={3} />
              <p className="text-xs font-bold text-zinc-400">Verified Opportunity</p>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
              {project?.title}
            </h1>
          </div>
          <div className="bg-zinc-900 rounded-2xl px-6 py-4 text-white shadow-xl shadow-zinc-900/10">
             <p className="text-xs font-bold text-white/40 mb-1">Project Budget</p>
             <p className="text-2xl lg:text-3xl font-black tracking-tighter text-emerald-400">${project?.budget?.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
           <div className="bg-white border border-zinc-100 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 space-y-6 shadow-sm">
              <h2 className="text-sm font-bold text-zinc-400 border-b border-zinc-50 pb-4">Project Overview</h2>
              <div className="text-sm lg:text-base text-zinc-600 font-medium leading-relaxed whitespace-pre-wrap">
                {project?.description}
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-50/50 border border-zinc-100 rounded-xl p-5 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-zinc-400 shadow-sm">
                   <User size={16} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-zinc-900 tracking-tight">{project?.client?.name}</p>
                 </div>
              </div>
              <div className="bg-zinc-50/50 border border-zinc-100 rounded-xl p-5 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-zinc-400 shadow-sm">
                   <Clock size={16} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-zinc-400 mb-0.5">Date Created</p>
                    <p className="text-xs font-bold text-zinc-900">
                      {new Date(project?.createdAt).toLocaleDateString()}
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* 3. Action Aside */}
        <aside className="space-y-4">
          {user?.role === 'FREELANCER' ? (
            <div className="space-y-4">
              {project?.contracts?.some(c => c.freelancerId === user.id) ? (
                <div className="bg-emerald-500 rounded-2xl lg:rounded-[2rem] p-8 text-center space-y-4 shadow-xl shadow-emerald-500/10">
                   <CheckCircle2 size={32} className="mx-auto text-white" />
                   <h3 className="text-sm font-bold text-white leading-none">Project Started</h3>
                   <button onClick={() => navigate('/escrow')} className="w-full py-3 bg-white text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                     View Escrow
                   </button>
                </div>
              ) : project?.bids?.some(bid => bid.freelancerId === user.id) ? (
                <div className="bg-white border border-zinc-100 rounded-2xl lg:rounded-[2rem] p-8 text-center space-y-4 shadow-sm">
                  <Clock size={24} className="mx-auto text-zinc-300" />
                  <h3 className="text-xs font-bold text-zinc-900">Proposal Submitted</h3>
                </div>
              ) : project?.status === 'OPEN' ? (
                <div className="bg-white border border-zinc-100 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                      <Send size={14} className="text-zinc-900" />
                      <h3 className="text-sm font-bold text-zinc-900">Submit a Proposal</h3>
                   </div>
                   
                   <form onSubmit={handleBidSubmit} className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-zinc-400 px-1">Bid Amount ($)</label>
                         <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
                            <input 
                               type="number"
                               required
                               className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-black text-zinc-900 focus:bg-white focus:border-emerald-500 transition-all outline-none"
                               placeholder="0.00"
                               value={amount}
                               onChange={(e) => setAmount(e.target.value)}
                            />
                         </div>
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-zinc-400 px-1">Your Proposal</label>
                         <textarea 
                            required
                            rows={6}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[12px] font-medium text-zinc-600 focus:bg-white focus:border-emerald-500 transition-all outline-none resize-none leading-relaxed"
                            placeholder="Detail your operational approach..."
                            value={proposal}
                            onChange={(e) => setProposal(e.target.value)}
                         />
                      </div>
    
                      <button 
                        type="submit"
                        className="w-full py-3.5 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                      >
                        Submit Proposal
                      </button>
                   </form>
                </div>
              ) : (
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-8 text-center space-y-2">
                  <Lock className="mx-auto text-zinc-300" size={24} />
                  <p className="text-xs font-bold text-zinc-400">Project Closed</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 mb-4">Proposals ({project?.bids?.length || 0})</h3>
              <div className="space-y-4">
                {project?.bids?.map((bid) => (
                  <div key={bid.id} className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black uppercase">
                          {bid.freelancer?.name?.[0]}
                        </div>
                        <p className="text-[11px] font-black text-zinc-900 leading-none">{bid.freelancer?.name}</p>
                      </div>
                      <p className="text-[12px] font-black text-emerald-500">${bid.amount?.toLocaleString()}</p>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic line-clamp-3 mb-4">"{bid.proposal}"</p>
                    {project.status === 'OPEN' && (
                      <button onClick={() => handleHire(bid)} className="w-full py-2 bg-zinc-50 text-zinc-900 rounded-lg text-xs font-bold hover:bg-zinc-900 hover:text-white transition-all">
                        Hire Freelancer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
