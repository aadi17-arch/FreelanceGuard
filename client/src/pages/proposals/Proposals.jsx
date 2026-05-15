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
import { motion } from "framer-motion";
import { acceptProposal, getClientProposals, getMyProposals } from "../../services/proposalService";
import toast from '../../utils/toast';

export default function Proposals() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      fetchData();
    }
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
      <div className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-white border border-zinc-200 px-[16px] py-[16px] rounded-[10px] flex flex-col min-w-[130px] shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 mb-1">Active proposals</p>
          <p className="text-[24px] font-bold text-zinc-900 leading-none font-financial">{proposals.length}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-0">
        <div className="relative w-full sm:w-64 group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-rui-success transition-colors" />
          <input
            type="text"
            placeholder="Search all proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-[8px] text-xs font-bold focus:outline-none focus:border-rui-success transition-all text-zinc-900 placeholder:text-zinc-400"
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
              <div className="sm:hidden relative w-full">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-[10px] pl-4 pr-10 py-2.5 text-[10px] font-bold text-zinc-900 appearance-none focus:outline-none focus:border-rui-success hover:border-zinc-400 transition-all cursor-pointer"
                >
                  {tabs.map(tab => (
                    <option key={tab.key} value={tab.key}>{tab.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown size={14} />
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-6 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 px-1 text-[11px] font-bold tracking-[0.05em] whitespace-nowrap transition-all relative ${activeTab === tab.key ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-600"
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div 
                        layoutId="proposalTab"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-rui-success rounded-full" 
                      />
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
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4 border border-zinc-200 rounded-[10px] bg-white">
            <div className="w-6 h-6 border-2 border-rui-dark border-t-transparent rounded-full" />
            <p className="text-[10px] font-bold text-zinc-400">Loading proposals...</p>
          </div>
        ) : (() => {
          const filtered = proposals.filter(p => {
            const matchesTab = activeTab === "all" || p.status?.toLowerCase() === activeTab.toLowerCase();
            const matchesSearch = !searchTerm || 
              p.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.coverLetter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
          });

          return filtered.length > 0 ? filtered.map((proposal) => (
            <div
              key={proposal.id}
              className="group bg-white border border-zinc-100 rounded-2xl p-6 hover:border-rui-success/30 transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1.5 ${getStatusColor(proposal.status)}`}>
                      {getStatusIcon(proposal.status)}
                      {proposal.status?.replace("_", " ") || "PENDING"}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-300 flex items-center gap-1">
                      <Clock size={10} /> Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-rui-success transition-colors">
                      {proposal.project?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                      <User size={12} />
                      <span>{user?.role === "CLIENT" ? `From: ${proposal.freelancer?.name}` : `Sent to Client`}</span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-500 line-clamp-1 max-w-2xl leading-relaxed italic">
                    "{proposal.coverLetter}"
                  </p>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-8 pt-4 lg:pt-0 border-t lg:border-none border-zinc-50">
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400">Total budget</p>
                    <div className="flex items-center justify-end gap-0.5 text-xl font-bold text-zinc-900 tracking-tighter font-financial">
                      <DollarSign size={14} className="text-rui-success" />
                      {proposal.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400">Delivery</p>
                    <p className="text-xs font-bold text-zinc-900">{proposal.duration} Days</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {user?.role === "CLIENT" && proposal.status === "PENDING" && proposal.project?.status === "OPEN" && (
                      <button
                        onClick={() => handleAccept(proposal.id)}
                        className="px-5 py-2.5 bg-rui-success text-white hover:bg-emerald-600 rounded-xl text-[10px] font-bold transition-all shadow-lg shadow-emerald-100"
                      >
                        Hire freelancer
                      </button>
                    )}
                    <button className="w-10 h-10 rounded-xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-rui-dark hover:text-white hover:border-rui-dark transition-all shadow-sm">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4 border border-zinc-200 rounded-[10px] bg-white">
              <div className="text-zinc-200">
                <ClipboardList size={32} />
              </div>
              <p className="text-[10px] font-bold text-zinc-400">No proposals found</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}





