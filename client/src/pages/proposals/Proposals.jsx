import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ClipboardList,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Briefcase,
  ChevronRight,
  Filter,
  ArrowUpRight,
  User,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { acceptProposal, getClientProposals, getMyProposals } from "../../services/proposalService";
import { toast } from "react-hot-toast";

export default function Proposals() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let data;
      if (user?.role === "CLIENT") {
        data = await getClientProposals();
      } else {
        data = await getMyProposals();
      }
      setProposals(Array.isArray(data?.proposals) ? data.proposals : Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptProposal(id);
      toast.success("Freelancer hired successfully");
      fetchData();
    }
    catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to hire freelancer");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "REJECTED": return "bg-rose-50 text-rose-600 border-rose-100";
      case "UNDER_REVIEW": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-zinc-50 text-zinc-400 border-zinc-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTED": return <CheckCircle2 size={12} />;
      case "REJECTED": return <XCircle size={12} />;
      case "UNDER_REVIEW": return <Clock size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900">
            {user?.role === "CLIENT" ? "Project Proposals" : "My Applications"}
          </h1>
          <p className="text-sm font-medium text-zinc-400">
            {user?.role === "CLIENT" ? "Review and manage bids for your active projects." : "Track the status of your submitted bids."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-zinc-100 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 bg-zinc-900 text-emerald-500 rounded-lg flex items-center justify-center">
              <ClipboardList size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 leading-none">Total Bids</p>
              <p className="text-sm font-black text-zinc-900 mt-1">{proposals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-50 pb-4">
        <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {["all", "pending", "review", "accepted"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-xs font-bold whitespace-nowrap transition-all relative capitalize ${activeTab === tab ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="proposalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search proposals..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border-none rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 text-center text-zinc-400 font-bold">Loading Proposals...</div>
        ) : (() => {
          const filtered = proposals.filter(p => {
            const matchesTab = activeTab === "all" || p.status?.toLowerCase() === activeTab.toLowerCase();
            return matchesTab;
          });

          return filtered.length > 0 ? filtered.map((proposal) => (
          <div
            key={proposal.id}
            className="group bg-white border border-zinc-100 rounded-2xl p-6 hover:shadow-2xl hover:shadow-zinc-200/40 hover:border-emerald-100 transition-all duration-500"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4 flex-grow">
                {/* Status & Date */}
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1.5 tracking-tight ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    {proposal.status?.replace("_", " ") || "PENDING"}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Project Info */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                    {proposal.project?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                    <User size={12} />
                    <span>{user?.role === "CLIENT" ? `From: ${proposal.freelancer?.name}` : `Sent to Client`}</span>
                  </div>
                </div>

                {/* Snippet */}
                <p className="text-xs text-zinc-500 line-clamp-1 max-w-2xl leading-relaxed italic">
                  "{proposal.coverLetter}"
                </p>
              </div>

              {/* Action Stats */}
              <div className="flex items-center justify-between lg:justify-end gap-8 pt-4 lg:pt-0 border-t lg:border-none border-zinc-50">
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Bid Amount</p>
                  <div className="flex items-center justify-end gap-0.5 text-xl font-black text-zinc-900 tracking-tighter">
                    <DollarSign size={14} className="text-emerald-500" />
                    {proposal.amount.toLocaleString()}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Timeline</p>
                  <p className="text-xs font-black text-zinc-900 uppercase tracking-tight">{proposal.duration} Days</p>
                </div>

                <div className="flex items-center gap-2">
                  {user?.role === "CLIENT" && proposal.status === "PENDING" && proposal.project?.status === "OPEN" && (
                    <button
                      onClick={() => handleAccept(proposal.id)}
                      className="px-5 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      Hire Freelancer
                    </button>
                  )}
                  <button className="w-10 h-10 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all shadow-sm">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          )) : (
            <div className="py-32 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-200">
                <ClipboardList size={24} />
              </div>
              <p className="text-sm font-bold text-zinc-300">No proposals found yet.</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
