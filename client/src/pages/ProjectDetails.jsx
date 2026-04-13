import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Send, DollarSign, TextQuote, User, Clock, LogOut } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const { user, logout, refreshUser } = useAuth();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [proposal, setProposal] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // 1. Fetch Project Details
        const projRes = await axios.get("/projects/all");
        const found = projRes.data.find(p => p.id === id);

        console.log("Logged in User:", user?.id);
        console.log("Project Owner (clientId):", found?.clientId);

        setProject(found);

        if (user?.role === "CLIENT") {
          const bidsRes = await axios.get(`/bids/project/${id}`);
          setBids(bidsRes.data);
          console.log("Bids Fetched:", bidsRes.data.length);
        }
      } catch (err) {
        console.error("Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/bids/createBid", {
        projectId: id,
        amount,
        proposal
      });
      alert("Bid Submitted Successfully!");
      navigate("/marketplace");
    } catch (err) {
      alert("Failed to submit bid");
    }
  };
  const handleAcceptBid = async (bidId) => {
    try {
      await axios.post(`/bids/bid/${bidId}`);
      await refreshUser(); // Update the wallet balance instantly
      alert("Escrow Secured! Project is now In Progress");
      navigate("/dashboard");
    }
    catch (err) {
      alert("Failed to secure funds. Check balance.");
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-rui-light">Loading Protocol...</div>;
  if (!project) return <div className="h-screen flex items-center justify-center">Project Not Found</div>;

  return (
    <div className="min-h-screen atmospheric-bg">
      {/* Platform Navigation - Cinematic Glass */}
      <nav className="glass-nav mb-12">
        <div className="section-container !px-0 flex justify-between items-center">
          <Link to="/dashboard" className="text-base md:text-xl font-bold tracking-tight uppercase">
            Freelance<span className="text-rui-blue">Guard</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-rui-blue hover:text-rui-dark transition-colors">Dashboard</Link>

            {/* Unified User Node */}
            <div className="flex items-center bg-rui-light/50 border border-rui-gray-border rounded-full pl-2 pr-4 py-1.5 gap-3">
              <div className="w-8 h-8 rounded-full bg-rui-blue text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-lg">
                {user?.name?.[0]}
              </div>
              <div className="flex flex-col -space-y-1 text-left">
                <span className="text-[10px] font-bold text-rui-dark truncate max-w-[80px]">{user?.name || "User"}</span>
                <span className="text-[7px] font-black text-rui-blue uppercase tracking-widest">{user?.role}</span>
              </div>
              <div className="w-px h-4 bg-rui-gray-border mx-1" />
              <button
                onClick={handleLogout}
                className="text-rui-gray-muted hover:text-rui-danger transition-colors"
                title="Logout"
              >
                <LogOut size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 space-y-10 pb-20">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-rui-gray-muted hover:text-rui-blue font-bold uppercase tracking-widest text-xs transition-colors">
          <ChevronLeft size={16} />
          Back to Marketplace
        </Link>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side: Project Info */}
          <section className="lg:col-span-2 space-y-8">
            <div className="rui-card-organic !p-10 md:p-16 space-y-8">
              <div className="flex items-center gap-3 text-rui-success">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Verified Escrow Project</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">{project.title}</h1>
              <div className="flex items-center gap-6 text-rui-gray-muted border-y border-rui-light py-6">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest text-rui-dark">{project.client?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-lg md:text-xl text-rui-gray-muted leading-relaxed font-medium">
                {project.description}
              </p>
            </div>
          </section>

          {/* Right Side: Action Panel */}
          <aside className="space-y-6">
            {user?.role === "FREELANCER" ? (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="rui-card-organic !p-10 bg-white shadow-2xl shadow-rui-blue/10 border-rui-blue/30">
                <h3 className="text-xl font-bold mb-6">Submit Proposal</h3>
                <form onSubmit={handleBidSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rui-gray-muted">Your Rate ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-rui-gray-muted" size={18} />
                      <input
                        type="number"
                        required
                        placeholder="500"
                        className="w-full bg-rui-light border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-rui-dark focus:ring-2 ring-rui-blue transition-all"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-rui-gray-muted">Proposal Details</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Explain why you are the best fit..."
                      className="w-full bg-rui-light border-none rounded-2xl p-4 font-medium text-rui-dark focus:ring-2 ring-rui-blue transition-all"
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-pill-primary w-full flex items-center justify-center gap-3 py-5">
                    <Send size={18} />
                    Deploy Proposal
                  </button>
                </form>
              </motion.div>
            ) : user?.id === project.clientId ? (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-rui-dark px-2 tracking-tight">Active Bids ({bids.length})</h3>
                <div className="space-y-4">
                  {bids.length > 0 ? bids.map(bid => (
                    <div key={bid.id} className="rui-card-organic flex flex-col space-y-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-[0.2em]">{bid.freelancer?.name}</span>
                        <span className="text-xl font-bold text-rui-blue tracking-tight">${bid.amount}</span>
                      </div>
                      <p className="text-sm text-rui-dark font-medium leading-relaxed italic">"{bid.proposal}"</p>
                      <button 
                        onClick={() => handleAcceptBid(bid.id)}
                        className="btn-pill-primary w-full !py-3"
                      >
                        Accept & Secure Funds
                      </button>
                    </div>
                  )) : (
                    <div className="rui-card-organic text-center py-16 opacity-50">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Awaiting Proposals</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rui-card-organic !p-10 text-center">
                <p className="text-xs font-bold text-rui-gray-muted uppercase tracking-widest">You are viewing this as a guest</p>
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
