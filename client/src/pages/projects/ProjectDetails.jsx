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
  const [submitting, setSubmitting] = useState(false);
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
    if (submitting) return;
    setSubmitting(true);
    const totalBidAmount = calculateTotalAmount();
    try {
      const res = await axios.post("/bids/createBid", {
        projectId: id,
        proposal,
        amount: totalBidAmount,
        milestones: milestones
      });
      toast.success("Your proposal has been sent.");

      // Update local state immediately so that the form collapses into the "Proposal sent" checkmark box instantly
      setProject((prev) => {
        if (!prev) return prev;
        const newBid = {
          id: res.data.bid?.id || Math.random().toString(),
          projectId: id,
          freelancerId: user.id,
          amount: totalBidAmount,
          proposal: proposal,
          freelancer: {
            id: user.id,
            name: user.name
          }
        };
        return {
          ...prev,
          bids: [...(prev.bids || []), newBid]
        };
      });

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
      setSubmitting(false);
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
    <div className="space-y-6 pb-10">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
        <ChevronLeft size={16} />
        <span className="text-[10px] font-bold">Back to marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 space-y-6 shadow-sm">
            {/* Header: Title and Budget Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-zinc-100">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
                  {project?.title}
                </h1>
              </div>
              <div className="bg-zinc-50 rounded-lg px-4 py-2 border border-zinc-200/80 flex flex-col shrink-0 w-full sm:w-auto">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">Budget</p>
                <p className="text-lg font-black text-emerald-600 font-financial">${project?.budget?.toLocaleString()}</p>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</h2>
              <div className="text-xs lg:text-sm text-zinc-600 font-semibold leading-relaxed whitespace-pre-wrap">
                {project?.description}
              </div>
            </div>

            {/* Client Metadata block nested at the bottom of the same card */}
            <div className="bg-zinc-50 border border-zinc-250/60 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-zinc-400 border border-zinc-100 shrink-0">
                  <User size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate leading-none mb-1">{project?.client?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 shrink-0">
                <Clock size={11} />
                <span>{new Date(project?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          {user?.role === 'FREELANCER' ? (
            <div className="space-y-4">
              {project?.contracts?.some(c => c.freelancerId === user.id) ? (
                <div className="bg-rui-success rounded-xl p-5 sm:p-6 text-center space-y-3 shadow-md shadow-emerald-50 border border-emerald-600">
                  <CheckCircle2 size={24} className="mx-auto text-white" />
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">Project in progress</h3>
                  <button onClick={() => navigate('/escrow')} className="w-full py-2.5 bg-white text-rui-success rounded-lg text-[10px] font-bold hover:bg-zinc-50 transition-all">
                    View payments
                  </button>
                </div>
              ) : project?.status !== 'OPEN' ? (
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 text-center space-y-2">
                  <Lock className="mx-auto text-zinc-300" size={20} />
                  <p className="text-xs font-bold text-zinc-400">Project closed</p>
                </div>
              ) : project?.bids?.some(bid => bid.freelancerId === user.id) ? (
                <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 text-center space-y-3 shadow-sm">
                  <CheckCircle2 size={20} className="mx-auto text-rui-success" />
                  <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider">Proposal sent</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">Our system will notify you once the client reviews your offer.</p>
                </div>
              ) : (
                <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-50">
                    <Send size={12} className="text-zinc-900" />
                    <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider">Send a proposal</h3>
                  </div>

                  <form onSubmit={handleBidSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-0.5">
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
                        <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                          <div className="flex-grow w-full">
                            <input
                              type="text"
                              required
                              placeholder="Stage title"
                              value={ms.title}
                              onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                              className="w-full px-3 h-10 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 focus:border-zinc-900 transition-all outline-none"
                            />
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <div className="flex-grow sm:w-28 relative">
                              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" size={10} />
                              <input
                                type="number"
                                required
                                placeholder="0"
                                value={ms.amount}
                                onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                                className="w-full pl-6 pr-3 h-10 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 focus:border-zinc-900 transition-all outline-none font-financial"
                              />
                            </div>
                            {milestones.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMilestone(index)}
                                className="h-10 px-3 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-200 transition-all shrink-0"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="p-3.5 bg-zinc-50 rounded-lg flex items-center justify-between border border-zinc-200">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total proposal</span>
                        <span className="text-xs font-extrabold text-emerald-600 font-financial">${calculateTotalAmount().toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 px-0.5">Proposal message</label>
                      <textarea
                        required
                        rows={4}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-600 focus:bg-white focus:border-zinc-900 transition-all outline-none resize-none leading-relaxed"
                        placeholder="How will you handle this project?"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full py-3 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border shadow-sm ${
                        submitting
                          ? "bg-zinc-400 border-zinc-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                      }`}
                    >
                      {submitting ? "Sending..." : "Send proposal"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : project?.clientId === user?.id ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 mb-4">Proposals ({project?.bids?.length || 0})</h3>
              <div className="space-y-4">
                {project?.bids?.map((bid) => (
                  <div key={bid.id} className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 shadow-sm hover:border-zinc-900 transition-all">
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
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 text-center space-y-2">
              <Lock className="mx-auto text-zinc-300" size={20} />
              <h3 className="text-xs font-bold text-zinc-900">Project owner view</h3>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
                Only the client who posted this project can view proposals and hire freelancers.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
