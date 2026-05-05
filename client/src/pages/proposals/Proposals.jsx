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
  ChevronDown,
  Filter,
  ArrowUpRight,
  User,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { acceptProposal, getClientProposals, getMyProposals } from "../../services/proposalService";
import { toast } from "react-hot-toast";

export default function Proposals() {
  const { user, refreshUser } = useAuth();
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
      if (refreshUser) {
        await refreshUser();
      }
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
    <div className="space-y-6">
      {/* 1. Stats Row */}
      <div className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-[#ffffff] border border-[#e5e5e5] px-[16px] py-[16px] rounded-[10px] flex flex-col min-w-[130px]">
          <p className="text-xs font-bold text-[#666666] mb-1">Total proposals</p>
          <p className="text-[24px] font-black text-[#111111] leading-none">{proposals.length}</p>
        </div>
        <div className="bg-[#ffffff] border border-[#e5e5e5] px-[16px] py-[16px] rounded-[10px] flex flex-col min-w-[130px]">
          <p className="text-xs font-bold text-[#666666] mb-2">Queue status</p>
          <span className="self-start bg-[#f0fdf4] text-[#10b981] px-2 py-1 rounded-[20px] text-[10px] font-black">Status: Open</span>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="flex flex-col gap-4 border-b border-[#e5e5e5] pb-0">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            placeholder="Search proposals..."
            className="w-full pl-9 pr-4 py-2 bg-[#ffffff] border border-[#e5e5e5] rounded-[8px] text-xs font-medium focus:outline-none focus:border-[#10b981] transition-all text-[#111111] placeholder:text-[#666666]"
          />
        </div>
        
        {(() => {
          const tabs = user?.role === "CLIENT"
            ? [
                { key: "all", label: "All Received" },
                { key: "pending", label: "New / Pending" },
                { key: "review", label: "In Review" },
                { key: "accepted", label: "Hired" }
              ]
            : [
                { key: "all", label: "All Proposals" },
                { key: "pending", label: "Waiting" },
                { key: "review", label: "Under Review" },
                { key: "accepted", label: "Accepted" }
              ];

          return (
            <>
              {/* Mobile Dropdown (shown on mobile, hidden on desktop) */}
              <div className="sm:hidden relative w-full">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] pl-4 pr-10 py-2.5 text-xs font-bold text-[#111111] appearance-none focus:outline-none focus:border-[#10b981] hover:border-[#111111] transition-all cursor-pointer"
                >
                  {tabs.map(tab => (
                    <option key={tab.key} value={tab.key}>{tab.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#666666]">
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* Desktop Tabs (hidden on mobile, shown on desktop) */}
              <div className="hidden sm:flex items-center gap-6 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 px-1 text-xs font-bold whitespace-nowrap transition-all relative ${activeTab === tab.key ? "text-[#111111]" : "text-[#666666] hover:text-[#111111]"
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div layoutId="proposalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </>
          );
        })()}
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
            <div className="py-10 text-center space-y-3">
              <div className="text-[#666666]">
                <ClipboardList size={24} className="mx-auto" />
              </div>
              <p className="text-sm font-bold text-[#666666]">No proposals yet.</p>
              <p className="text-xs text-[#666666]">Once freelancers apply to your projects, their proposals will appear here.</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
