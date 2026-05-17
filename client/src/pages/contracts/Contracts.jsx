import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, variantProps } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from '../../utils/toast';
import {enqueueSnackbar,closeSnackbar} from "notistack";
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
  RefreshCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  HelpCircle
} from "lucide-react";

export default function Contracts() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [showDemo, setShowDemo] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedContractId, setExpandedContractId] = useState(null);
  const [selectedContractForModal, setSelectedContractForModal] = useState(null);

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/escrow");
      const mapped = (res.data || []).map((c) => {
        const counterpartyName =
          user?.role === "CLIENT"
            ? c.freelancer?.name || "Freelancer"
            : c.project?.client?.name || "Client";
        const counterpartyLabel =
          user?.role === "CLIENT" ? "Freelancer" : "Client";
        const initials = counterpartyName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();

        return {
          id: c.id,
          counterpartyName,
          counterpartyLabel,
          initials: initials || "C",
          title: c.project?.title || "Project Contract",
          status: c.status,
          startDate: new Date(c.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          amount: `$${c.totalAmount?.toLocaleString()}`,
          rawAmount: c.totalAmount,
          milestones: c.milestones || [],
        };
      });
      setContracts(mapped);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

   const handleSubmitDeliverable = (contractId, milestoneId) => {
    if (showDemo) {
      toast.success("Demo Mode: Deliverable work note submitted successfully!");
      return;
    }

    // Trigger a premium, flat custom confirmation notification toast
    enqueueSnackbar("", {
      persist: true,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
      content: (key) => (
        <div className="bg-[#111111] border border-zinc-800 text-white p-3.5 flex flex-row items-center justify-between gap-5 font-body shadow-2xl min-w-[320px] max-w-md w-full">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shrink-0" />
            <p className="text-[11px] font-bold text-zinc-100 tracking-tight">
              Are you sure you want to submit this work?
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => closeSnackbar(key)}
              className="px-2.5 py-1 bg-transparent hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-[9px] font-black transition-all uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                closeSnackbar(key); // Dismiss this toast

                // Ask for the note and perform the API submission
                const note = window.prompt("Enter a brief description/note of the completed work you are submitting:");
                if (note === null) return;

                try {
                  setLoading(true);
                  await axios.post(`/milestone/submit/${milestoneId}`, { submissionNote: note });

                  toast.success("Work deliverable submitted for client review!");
                  await fetchContracts();
                  if (refreshUser) await refreshUser();
                } catch (err) {
                  toast.error(err.response?.data?.message || "Failed to submit work.");
                } finally {
                  setLoading(false);
                }
              }}
              className="px-2.5 py-1 bg-[#10b981] hover:bg-[#0d9488] text-white text-[9px] font-black transition-all uppercase tracking-wider cursor-pointer shadow-sm"
            >
              Yes, Submit
            </button>
          </div>
        </div>
      )
    });
  };


  const handleRaiseDispute = async (contractId, milestoneId) => {
    if (showDemo) {
      toast.success("Demo Mode: Dispute folder opened successfully!", {
        style: { background: "#18181b", color: "#fff", borderRadius: "12px", fontSize: "13px" }
      });
      return;
    }

    const reason = window.prompt("Please enter the reason for opening this escrow dispute:");
    if (!reason) return;

    try {
      setLoading(true);
      await axios.post("/dispute", { milestoneId, reason });

      toast.success("Dispute raised. FreelanceGuard support team has been notified.", {
        style: {
          background: "#18181b",
          color: "#fff",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "bold"
        },
        iconTheme: {
          primary: "#f43f5e",
          secondary: "#fff"
        }
      });

      await fetchContracts();
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate dispute.");
    } finally {
      setLoading(false);
    }
  };

  const activeContracts = [
    {
      id: "demo-active-1",
      counterpartyName: "Alex Rivera",
      counterpartyLabel: "Freelancer",
      initials: "AR",
      title: "React Native Mobile App Development",
      status: "ACTIVE",
      startDate: "May 01, 2026",
      amount: "$4,500",
      milestones: [
        {
          id: "m-1",
          title: "Wireframes & Brand Identity",
          description: "Establish project high-fidelity UI layout schemas and aesthetic details.",
          amount: 1500,
          status: "RELEASED"
        },
        {
          id: "m-2",
          title: "Functional Frontend App Scaffold",
          description: "Develop the React Native application frontend structure with mock route bindings.",
          amount: 2000,
          status: "SUBMITTED"
        },
        {
          id: "m-3",
          title: "Backend API Integration & Production Deployment",
          description: "Connect standard cloud database triggers and officially push live to marketplaces.",
          amount: 1000,
          status: "PENDING"
        }
      ]
    }
  ];

  const completedContracts = [
    {
      id: "demo-completed-1",
      counterpartyName: "Sophia Chen",
      counterpartyLabel: "Freelancer",
      initials: "SC",
      title: "UI/UX Redesign for E-commerce Platform",
      status: "COMPLETED",
      startDate: "Apr 12, 2026",
      amount: "$1,800",
      milestones: [
        {
          id: "m-4",
          title: "Interactive Figma Prototypes",
          description: "Completed full visual redesign containing user navigation research details.",
          amount: 1800,
          status: "RELEASED"
        }
      ]
    }
  ];

  const realFiltered = contracts.filter((c) =>
    activeTab === "active"
      ? c.status === "ACTIVE" ||
        c.status === "PENDING" ||
        c.status === "ACTIVE_MUTUAL"
      : c.status === "COMPLETED" || c.status === "RESOLVED"
  );

  const currentContracts = showDemo
    ? activeTab === "active"
      ? activeContracts
      : completedContracts
    : realFiltered;

  const toggleExpand = (contractId) => {
    setExpandedContractId(
      expandedContractId === contractId ? null : contractId
    );
  };

  return (
    <div className="w-full space-y-6 pb-10 px-6 bg-[#ffffff]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#666666]">
          View milestones, track secure escrow locking, and process releases
        </p>

        <button
          onClick={() => setShowDemo(!showDemo)}
          className="self-start flex items-center gap-1.5 px-3 py-1.5 bg-[#f9f9f9] hover:bg-[#111111] hover:text-white border border-[#e5e5e5] rounded-[20px] text-[10px] font-black text-[#666666] transition-all shadow-sm"
        >
          <Sparkles size={10} className="text-[#10b981]" />
          <span>
            {showDemo ? "Hide Premium Demo Card" : "Show Premium Demo Card"}
          </span>
        </button>
      </div>

      <div className="md:hidden relative w-full">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] pl-4 pr-10 py-2.5 text-xs font-bold text-[#111111] appearance-none focus:outline-none focus:border-[#10b981] hover:border-[#111111] transition-all cursor-pointer"
        >
          <option value="active">Active Contracts</option>
          <option value="completed">Completed Contracts</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#666666]">
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 border-b border-[#e5e5e5] pb-0">
        {[
          { id: "active", label: "Active Contracts" },
          { id: "completed", label: "Completed Contracts" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-xs font-bold whitespace-nowrap transition-all relative ${
              activeTab === tab.id
                ? "text-[#111111]"
                : "text-[#666666] hover:text-[#111111]"
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
              <p className="text-xs font-bold text-[#666666]">
                Retrieving escrow contracts...
              </p>
            </motion.div>
          ) : currentContracts.length === 0 ? (
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
                  {activeTab === "active"
                    ? "No active contracts yet"
                    : "No completed contracts yet"}
                </h3>
                <p className="text-xs text-[#666666] max-w-xs leading-relaxed">
                  {activeTab === "active"
                    ? user?.role === "CLIENT"
                      ? "Once you hire a freelancer, your contract will appear here"
                      : "Once a client hires you, your contract will appear here"
                    : "Once your contracts are completed and escrow released, they will appear here"}
                </p>
              </div>
              {activeTab === "active" &&
                (user?.role === "CLIENT" ? (
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
                ))}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {currentContracts.map((contract) => {
                const isExpanded = expandedContractId === contract.id;

                const activeMilestones =
                  contract.milestones && contract.milestones.length > 0
                    ? contract.milestones
                    : [
                        {
                          id: `fallback-${contract.id}`,
                          title: "Contract Escrow Milestone",
                          description:
                            "Standard project deliverable secured inside the secure FreelanceGuard vault.",
                          amount: contract.rawAmount || 0,
                          status:
                            contract.status === "COMPLETED"
                              ? "RELEASED"
                              : "PENDING"
                        }
                      ];

                return (
                  <div
                    key={contract.id}
                    className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] space-y-4 hover:border-[#10b981] transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-black">
                           {contract.initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111111]">
                            {contract.counterpartyName}
                          </p>
                          <p className="text-[10px] text-[#666666] font-medium">
                            {contract.counterpartyLabel}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-[20px] ${
                          contract.status === "ACTIVE" ||
                          contract.status === "PENDING"
                            ? "bg-[#f0fdf4] text-[#10b981]"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {contract.status === "ACTIVE" ||
                        contract.status === "PENDING"
                          ? "Active"
                          : "Completed"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#111111]">
                        {contract.title}
                      </h4>
                      <p className="text-[11px] text-[#666666] font-medium leading-relaxed">
                        Secure escrow engagement protecting counterparties
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#f9f9f9]">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-[#666666]">
                          Start date
                        </p>
                        <p className="text-xs font-bold text-[#111111]">
                          {contract.startDate}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-[#666666]">
                          Contract Value
                        </p>
                        <p className="text-xs font-bold text-[#111111]">
                          {contract.amount}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => setSelectedContractForModal(contract)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#111111] hover:bg-[#333333] text-white rounded-[8px] text-xs font-bold transition-all shadow-sm"
                      >
                        <FileText size={13} />
                        <span>View details</span>
                      </button>
                      <button
                        onClick={() => toggleExpand(contract.id)}
                        className="flex items-center justify-between px-4 py-2.5 bg-[#f9f9f9] hover:bg-[#eaeaea] text-[#111111] rounded-[8px] text-xs font-bold transition-all border border-[#e5e5e5]"
                      >
                        <span>Milestones ({activeMilestones.length})</span>
                        {isExpanded ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden pt-4 border-t border-[#e5e5e5] space-y-6"
                        >
                          <h5 className="text-[11px] font-black text-[#666666] px-1">
                            Milestone Settlement Timeline
                          </h5>

                          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-[#e5e5e5]">
                            {activeMilestones.map((m, idx) => {
                              let statusColor =
                                "bg-zinc-200 border-zinc-300 text-zinc-500";
                              let badgeText = "Pending";
                              let StatusIcon = Clock;

                              if (m.status === "RELEASED" || m.status === "APPROVED") {
                                statusColor =
                                  "bg-[#10b981] border-[#10b981] text-white";
                                badgeText = "Escrow Released";
                                StatusIcon = CheckCircle;
                              } else if (m.status === "SUBMITTED") {
                                statusColor =
                                  "bg-amber-500 border-amber-500 text-white animate-pulse";
                                badgeText = "Under Review";
                                StatusIcon = Clock;
                              } else if (m.status === "DISPUTED") {
                                statusColor =
                                  "bg-rose-500 border-rose-500 text-white";
                                badgeText = "Disputed";
                                StatusIcon = AlertTriangle;
                              }

                              return (
                                <div
                                  key={m.id || idx}
                                  className="relative space-y-2"
                                >
                                  <div
                                    className={`absolute -left-[21.5px] top-1.5 w-[13px] h-[13px] rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                                      m.status === "RELEASED" || m.status === "APPROVED"
                                        ? "border-[#10b981]"
                                        : "border-zinc-300"
                                    }`}
                                  >
                                    <div
                                      className={`w-[5px] h-[5px] rounded-full ${
                                        m.status === "RELEASED" || m.status === "APPROVED"
                                          ? "bg-[#10b981]"
                                          : "bg-zinc-300"
                                      }`}
                                    />
                                  </div>

                                  <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-[8px] p-4 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                      <div className="space-y-0.5">
                                        <p className="text-xs font-black text-[#111111]">
                                          {m.title}
                                        </p>
                                        <p className="text-[10px] text-[#666666] font-medium">
                                          Value: ${m.amount?.toLocaleString()}
                                        </p>
                                      </div>

                                      <span
                                        className={`self-start sm:self-center flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-[20px] ${
                                          m.status === "RELEASED" || m.status === "APPROVED"
                                            ? "bg-[#f0fdf4] text-[#10b981]"
                                            : m.status === "SUBMITTED"
                                              ? "bg-amber-50 text-amber-600"
                                              : m.status === "DISPUTED"
                                                ? "bg-rose-50 text-rose-500"
                                                : "bg-zinc-100 text-zinc-500"
                                        }`}
                                      >
                                        <StatusIcon size={10} />
                                        <span>{badgeText}</span>
                                      </span>
                                    </div>

                                    <p className="text-[11px] text-[#666666] font-medium leading-relaxed">
                                      {m.description}
                                    </p>

                                    <div className="pt-2 flex flex-wrap gap-2 border-t border-[#e5e5e5]/50">
                                      {user?.role === "CLIENT" ? (
                                        m.status === "SUBMITTED" ? (
                                          <>
                                            <button
                                              onClick={() =>
                                                handleReleaseMilestone(
                                                  contract.id,
                                                  m.id
                                                )
                                              }
                                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981] hover:bg-[#0d9488] text-white rounded-[6px] text-[10px] font-black transition-all"
                                            >
                                              <CheckCircle size={10} />
                                              <span>Release Escrow Funds</span>
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleRaiseDispute(
                                                  contract.id,
                                                  m.id
                                                )
                                              }
                                              className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-[#e5e5e5] hover:border-rose-200 rounded-[6px] text-[10px] font-black transition-all"
                                            >
                                              <AlertTriangle size={10} />
                                              <span>Raise Dispute</span>
                                            </button>
                                          </>
                                        ) : m.status === "PENDING" ? (
                                          <div className="flex items-center gap-1.5 text-[10px] text-[#666666] font-bold py-1">
                                            <Clock size={12} />
                                            <span>
                                              Funds locked. Awaiting freelancer
                                              deliverable submission.
                                            </span>
                                          </div>
                                        ) : m.status === "RELEASED" || m.status === "APPROVED" ? (
                                          <div className="flex items-center gap-1.5 text-[10px] text-[#10b981] font-bold py-1">
                                            <CheckCircle size={12} />
                                            <span>
                                              Payment settled. Escrow
                                              successfully released to
                                              contractor.
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1.5 text-[10px] text-rose-500 font-bold py-1">
                                            <AlertTriangle size={12} />
                                            <span>
                                              Milestone is in active dispute
                                              review.
                                            </span>
                                          </div>
                                        )
                                      ) : m.status === "PENDING" ? (
                                        <button
                                          onClick={() =>
                                            handleSubmitDeliverable(
                                              contract.id,
                                              m.id
                                            )
                                          }
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] hover:bg-[#10b981] text-white rounded-[6px] text-[10px] font-black transition-all"
                                        >
                                          <Send size={10} />
                                          <span>Submit Work for Review</span>
                                        </button>
                                      ) : m.status === "SUBMITTED" ? (
                                        <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-bold py-1">
                                          <Clock
                                            size={12}
                                            className="animate-spin"
                                          />
                                          <span>
                                            Deliverable submitted. Awaiting
                                            client payment release.
                                          </span>
                                        </div>
                                      ) : m.status === "RELEASED" || m.status === "APPROVED" ? (
                                        <div className="flex items-center gap-1.5 text-[10px] text-[#10b981] font-bold py-1">
                                          <CheckCircle size={12} />
                                          <span>
                                            Completed! Funds successfully
                                            released to your wallet.
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1.5 text-[10px] text-rose-500 font-bold py-1">
                                          <AlertTriangle size={12} />
                                          <span>
                                            Milestone is under dispute review.
                                            Support is reviewing.
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedContractForModal && (() => {
          const contract = selectedContractForModal;
          const activeMilestones = contract.milestones && contract.milestones.length > 0
            ? contract.milestones
            : [
                {
                  id: `fallback-${contract.id}`,
                  title: "Contract Escrow Milestone",
                  description: "Standard project deliverable secured inside the secure FreelanceGuard vault.",
                  amount: contract.rawAmount || 0,
                  status: contract.status === "COMPLETED" ? "RELEASED" : "PENDING"
                }
              ];

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedContractForModal(null)}
                className="absolute inset-0 bg-[#09090b] "
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-[#e5e5e5] max-h-[90vh] flex flex-col"
              >
                <div className="p-6 border-b border-[#e5e5e5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-[#10b981] bg-[#f0fdf4] px-2.5 py-1 rounded-full">
                      Escrow Vault Secure
                    </span>
                    <h3 className="text-base font-black text-[#111111] mt-2">
                      {contract.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedContractForModal(null)}
                    className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-[#666666] font-bold text-sm transition-all"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                  <div className="grid grid-cols-2 gap-4 bg-[#f9f9f9] p-4 rounded-xl border border-[#e5e5e5]">
                    <div>
                      <p className="text-[10px] font-bold text-[#666666]">Counterparty Name</p>
                      <p className="text-sm font-bold text-[#111111]">{contract.counterpartyName}</p>
                      <p className="text-[9px] text-[#666666]">{contract.counterpartyLabel}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#666666]">Contract Value</p>
                      <p className="text-sm font-bold text-[#111111]">{contract.amount}</p>
                      <p className="text-[9px] text-[#666666]">Start Date: {contract.startDate}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-[#666666]">
                      Milestone Settlements ({activeMilestones.length})
                    </h4>

                    <div className="space-y-3">
                      {activeMilestones.map((m, idx) => (
                        <div key={m.id || idx} className="p-4 bg-white border border-[#e5e5e5] rounded-xl flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-[#111111]">{m.title}</p>
                            <p className="text-[11px] text-[#666666] leading-relaxed">{m.description}</p>
                            <p className="text-xs font-bold text-[#10b981]">${m.amount?.toLocaleString()}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            m.status === "RELEASED" || m.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : m.status === "SUBMITTED"
                              ? "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse"
                              : m.status === "DISPUTED"
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : "bg-zinc-50 text-zinc-600 border border-zinc-100"
                          }`}>
                            {m.status?.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#f9f9f9] border-t border-[#e5e5e5] flex justify-end">
                  <button
                    onClick={() => setSelectedContractForModal(null)}
                    className="px-5 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    Close Contract
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
