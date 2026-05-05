import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Briefcase,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  RefreshCcw
} from "lucide-react";

export default function Contracts() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [showDemo, setShowDemo] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/escrow");
      const mapped = (res.data || []).map(c => {
        const counterpartyName = user?.role === "CLIENT"
          ? (c.freelancer?.name || "Freelancer")
          : (c.project?.client?.name || "Client");
        const counterpartyLabel = user?.role === "CLIENT" ? "Freelancer" : "Client";
        const initials = counterpartyName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
        return {
          id: c.id,
          counterpartyName,
          counterpartyLabel,
          initials: initials || "C",
          title: c.project?.title || "Project Contract",
          status: c.status,
          startDate: new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          amount: `$${c.totalAmount?.toLocaleString()}`
        };
      });
      setContracts(mapped);
    } catch (err) {
      console.error("Failed to fetch contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mock Contracts
  const activeContracts = [
    {
      id: "1",
      freelancer: "Alex Rivera",
      initials: "AR",
      title: "React Native Mobile App Development",
      status: "ACTIVE",
      startDate: "May 01, 2026",
      amount: "$4,500"
    }
  ];

  const completedContracts = [
    {
      id: "2",
      freelancer: "Sophia Chen",
      initials: "SC",
      title: "UI/UX Redesign for E-commerce Platform",
      status: "COMPLETED",
      startDate: "Apr 12, 2026",
      amount: "$1,800"
    }
  ];

  const realFiltered = contracts.filter(c => 
    activeTab === "active" 
      ? (c.status === "ACTIVE" || c.status === "PENDING" || c.status === "ACTIVE_MUTUAL") 
      : (c.status === "COMPLETED" || c.status === "RESOLVED")
  );

  const currentContracts = showDemo
    ? (activeTab === "active" ? activeContracts : completedContracts)
    : realFiltered;

  return (
    <div className="w-full space-y-6 pb-10 px-6 bg-[#ffffff]">
      
      {/* Upper header is handled globally by DashboardLayout.jsx. No duplicate H1 here. */}
      {/* Description Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#666666]">
          View and manage all your active and past contracts
        </p>

        {/* Premium Demo Toggle */}
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="self-start flex items-center gap-1.5 px-3 py-1.5 bg-[#f9f9f9] hover:bg-[#111111] hover:text-white border border-[#e5e5e5] rounded-[20px] text-[10px] font-black uppercase tracking-wider text-[#666666] transition-all"
        >
          <Sparkles size={10} className="text-[#10b981]" />
          <span>{showDemo ? "Hide active demo card" : "Show active demo card"}</span>
        </button>
      </div>

      {/* Mobile Dropdown (shown on mobile, hidden on desktop) */}
      <div className="md:hidden relative w-full">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] pl-4 pr-10 py-2.5 text-xs font-bold text-[#111111] appearance-none focus:outline-none focus:border-[#10b981] hover:border-[#111111] transition-all cursor-pointer"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#666666]">
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Desktop Tabs (hidden on mobile, shown on desktop) */}
      <div className="hidden md:flex items-center gap-6 border-b border-[#e5e5e5] pb-0">
        {[
          { id: "active", label: "Active" },
          { id: "completed", label: "Completed" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-xs font-bold whitespace-nowrap transition-all relative ${
              activeTab === tab.id ? "text-[#111111]" : "text-[#666666] hover:text-[#111111]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="contractsTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981] rounded-full" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center space-y-3"
            >
              <RefreshCcw size={18} className="text-[#10b981] animate-spin" />
              <p className="text-xs font-bold text-[#666666]">Retrieving escrow contracts...</p>
            </motion.div>
          ) : currentContracts.length === 0 ? (
            /* Empty State Container */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 border border-dashed border-[#e5e5e5] rounded-[10px] bg-[#ffffff]"
            >
              <div className="w-12 h-12 bg-[#f9f9f9] rounded-full flex items-center justify-center text-[#e5e5e5] border border-[#e5e5e5]">
                <FileText size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#111111]">
                  {activeTab === "active" ? "No active contracts yet" : "No completed contracts yet"}
                </h3>
                <p className="text-xs text-[#666666] max-w-xs leading-relaxed">
                  {activeTab === "active" 
                    ? (user?.role === "CLIENT" 
                        ? "Once you hire a freelancer, your contract will appear here"
                        : "Once a client hires you, your contract will appear here")
                    : "Once your contracts are completed and escrow released, they will appear here"
                  }
                </p>
              </div>
              {activeTab === "active" && (
                user?.role === "CLIENT" ? (
                  <Link to="/proposals">
                    <button className="px-5 py-2.5 bg-[#10b981] hover:bg-[#0d9488] text-white rounded-[8px] text-xs font-bold transition-all shadow-sm">
                      Review received bids
                    </button>
                  </Link>
                ) : (
                  <Link to="/marketplace">
                    <button className="px-5 py-2.5 bg-[#10b981] hover:bg-[#0d9488] text-white rounded-[8px] text-xs font-bold transition-all shadow-sm">
                      Find work
                    </button>
                  </Link>
                )
              )}
            </motion.div>
          ) : (
            /* Contract Cards Grid */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {currentContracts.map((contract) => (
                <div 
                  key={contract.id} 
                  className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] space-y-4 hover:border-[#10b981] transition-all duration-300 shadow-sm"
                >
                  {/* Card Header: Freelancer Info & Status */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-black">
                        {contract.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#111111]">{contract.counterpartyName}</p>
                        <p className="text-[10px] text-[#666666] font-medium">{contract.counterpartyLabel}</p>
                      </div>
                    </div>

                    <span 
                      className={`text-[10px] font-black px-2.5 py-1 rounded-[20px] ${
                        contract.status === "ACTIVE" 
                          ? "bg-[#f0fdf4] text-[#10b981]" 
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {contract.status === "ACTIVE" ? "Active" : "Completed"}
                    </span>
                  </div>

                  {/* Project Title */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#111111] line-clamp-1">
                      {contract.title}
                    </h4>
                    <p className="text-[11px] text-[#666666] font-medium leading-relaxed">
                      Secure escrow engagement
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#f9f9f9]">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-[#666666]">Start date</p>
                      <p className="text-xs font-bold text-[#111111]">{contract.startDate}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-[#666666]">Amount</p>
                      <p className="text-xs font-bold text-[#111111]">{contract.amount}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <button className="w-full py-2 bg-transparent hover:bg-[#f9f9f9] text-[#111111] border border-[#e5e5e5] hover:border-[#111111] rounded-[8px] text-xs font-bold transition-all">
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
