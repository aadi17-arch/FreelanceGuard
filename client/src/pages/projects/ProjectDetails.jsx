import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from '../../utils/toast';
import {
  ChevronLeft,
  ShieldCheck,
  Send,
  DollarSign,
  User,
  Clock,
  Lock,
  CheckCircle2,
  X
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [proposal, setProposal] = useState("");
  const [milestones, setMilestones] = useState([{ title: "", amount: "" }]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      toast.error("Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const totalBidAmount = calculateTotalAmount();
    try {
      await axios.post("/bids/createBid", {
        projectId: id,
        proposal,
        amount: totalBidAmount,
        milestones: milestones
      });
      toast.success("Your proposal has been sent.");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleHire = async (bid) => {
    try {
      await axios.post("/projects/hire", {
        projectId: id,
        freelancerId: bid.freelancerId,
        bidAmount: bid.amount
      });
      toast.success("Hire successful.");
      setTimeout(() => navigate("/escrow"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Hiring failed.");
    }
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "" }]);
  };

  const removeMilestone = (index) => {
    if (milestones.length > 1) {
      const newMilestones = milestones.filter((_, i) => i !== index);
      setMilestones(newMilestones);
    }
  };

  const updateMilestone = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const calculateTotalAmount = () => {
    return milestones.reduce((sum, ms) => sum + (parseFloat(ms.amount) || 0), 0);
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-6 h-6 border-2 border-rui-dark border-t-transparent rounded-full" />
      <p className="text-[10px] font-bold text-zinc-400">Loading project details...</p>
    </div>
  );

  return (
    <div className="space-y-6 lg:space-y-8 pb-10">
      <header className="space-y-6">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
          <ChevronLeft size={16} />
          <span className="text-[10px] font-bold">Back to marketplace</span>
        </Link>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 leading-tight">
              {project?.title}
            </h1>
          </div>
          <div className="bg-rui-dark rounded-2xl px-6 py-4 text-white shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 mb-1">Estimated budget</p>
            <p className="text-2xl lg:text-3xl font-bold tracking-tight text-rui-success font-financial">${project?.budget?.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <h2 className="text-[10px] font-bold text-zinc-400 border-b border-zinc-50 pb-4">Description</h2>
            <div className="text-sm lg:text-base text-zinc-600 font-medium leading-relaxed whitespace-pre-wrap">
              {project?.description}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-zinc-400 border border-zinc-100">
                <User size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 tracking-tight">{project?.client?.name}</p>
                <p className="text-[10px] font-bold text-zinc-400">Client</p>
              </div>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-zinc-400 border border-zinc-100">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 font-financial">
                  {new Date(project?.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[10px] font-bold text-zinc-400">Posted on</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          {user?.role === 'FREELANCER' ? (
            <div className="space-y-4">
              {project?.contracts?.some(c => c.freelancerId === user.id) ? (
                <div className="bg-rui-success rounded-[2rem] p-8 text-center space-y-4 shadow-lg shadow-emerald-100">
                  <CheckCircle2 size={32} className="mx-auto text-white" />
                  <h3 className="text-[10px] font-bold text-white">Project in progress</h3>
                  <button onClick={() => navigate('/escrow')} className="w-full py-3 bg-white text-rui-success rounded-xl text-[10px] font-bold hover:bg-zinc-50 transition-all">
                    View payments
                  </button>
                </div>
              ) : project?.bids?.some(bid => bid.freelancerId === user.id) ? (
                <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 text-center space-y-4 shadow-sm">
                  <CheckCircle2 size={24} className="mx-auto text-rui-success" />
                  <h3 className="text-[10px] font-bold text-zinc-900">Proposal sent</h3>
                  <p className="text-xs text-zinc-500 font-medium">Our system will notify you once the client reviews your offer.</p>
                </div>
              ) : project?.status === 'OPEN' ? (
                <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Send size={14} className="text-zinc-900" />
                    <h3 className="text-[10px] font-bold text-zinc-900">Send a proposal</h3>
                  </div>

                   <form onSubmit={handleBidSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-bold text-zinc-400">Contract terms</label>
                        <button 
                          type="button"
                          onClick={addMilestone}
                          className="text-[10px] font-bold text-rui-success hover:underline"
                        >
                          + Add stage
                        </button>
                      </div>

                      {milestones.map((ms, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-grow space-y-2">
                            <input 
                              type="text"
                              required
                              placeholder="Stage title"
                              value={ms.title}
                              onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                              className="w-full px-4 h-12 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:bg-white focus:border-rui-success transition-all outline-none"
                            />
                          </div>
                          <div className="w-32 relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} />
                            <input 
                              type="number"
                              required
                              placeholder="0"
                              value={ms.amount}
                              onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                              className="w-full pl-8 pr-4 h-12 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:bg-white focus:border-rui-success transition-all outline-none font-financial"
                            />
                          </div>
                          {milestones.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeMilestone(index)}
                              className="h-12 w-10 flex items-center justify-center text-zinc-300 hover:text-red-500 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="p-4 bg-rui-dark rounded-2xl flex items-center justify-between shadow-lg shadow-zinc-100">
                        <span className="text-[10px] font-bold text-zinc-400">Total proposal</span>
                        <span className="text-sm font-bold text-rui-success font-financial">${calculateTotalAmount().toLocaleString()}</span>
                      </div>
                    </div>
                      
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 px-1">Proposal message</label>
                      <textarea
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-600 focus:bg-white focus:border-rui-success transition-all outline-none resize-none leading-relaxed"
                        placeholder="How will you handle this project?"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-rui-dark text-white rounded-xl text-[10px] font-bold hover:bg-black transition-all shadow-lg shadow-zinc-100"
                    >
                      Send proposal
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-zinc-50 border border-zinc-200 rounded-[2rem] p-8 text-center space-y-2">
                  <Lock className="mx-auto text-zinc-300" size={24} />
                  <p className="text-xs font-bold text-zinc-400">Project closed</p>
                </div>
              )}
            </div>
          ) : project?.clientId === user?.id ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 mb-4">Proposals ({project?.bids?.length || 0})</h3>
              <div className="space-y-4">
                {project?.bids?.map((bid) => (
                  <div key={bid.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-zinc-900 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                          {bid.freelancer?.name?.[0]}
                        </div>
                        <p className="text-[11px] font-bold text-zinc-900">{bid.freelancer?.name}</p>
                      </div>
                      <p className="text-xs font-bold text-emerald-600">${bid.amount?.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed italic line-clamp-3 mb-6">"{bid.proposal}"</p>
                    {project.status === 'OPEN' && (
                      <button onClick={() => handleHire(bid)} className="w-full py-2.5 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all">
                        Hire freelancer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-[2rem] p-8 text-center space-y-3">
              <Lock className="mx-auto text-zinc-300" size={24} />
              <h3 className="text-sm font-bold text-zinc-900">Project owner view</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Only the client who posted this project can view proposals and hire freelancers.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
