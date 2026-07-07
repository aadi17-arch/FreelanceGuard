import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  MessageCircle,
  RefreshCcw,
  AlertTriangle,
  ShieldCheck,
  User,
  ExternalLink
} from "lucide-react";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("DISPUTES");
  const [tickets, setTickets] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketsRes, disputesRes, kycsRes] = await Promise.all([
        axios.get("/livechat/admin/sessions"),
        axios.get("/dispute"),
        axios.get("/kyc/pending")
      ]);
      setTickets(ticketsRes.data);
      setDisputes(disputesRes.data.disputes || []);
      setKycs(kycsRes.data || []);
    } catch (error) {
      enqueueSnackbar("Failed to fetch admin dashboard data", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResolve = async (id, type, action = null) => {
    try {
      if (type === 'TICKET') {
        await axios.put(`/livechat/session/${id}/close`);
        enqueueSnackbar("Ticket closed successfully", { variant: "success" });
      }
      else if (type === 'DISPUTE') {
        if (!action) {
          enqueueSnackbar("Please select resolution type", { variant: "warning" });
          return;
        }
        await axios.put(`/dispute/resolve/${id}`, {
          action, // 'RELEASED' or 'REFUNDED'
          resolution: `Admin resolved dispute: ${action === 'RELEASED' ? 'Funds released to freelancer.' : 'Funds refunded to client.'}`
        });
        enqueueSnackbar(`Dispute ${action.toLowerCase()} successfully`, { variant: "success" });
      }
      fetchData();
    } catch (error) {
      enqueueSnackbar("Error resolving case", { variant: "error" });
    }
  };

  const handleVerifyKYC = async (kycId, status) => {
    try {
      await axios.put(`/kyc/verify/${kycId}`, { status });
      enqueueSnackbar(`KYC Request ${status.toLowerCase()} successfully`, { variant: "success" });
      fetchData();
    } catch (error) {
      enqueueSnackbar("Failed to process KYC request", { variant: "error" });
    }
  };

  const getDisplayItems = () => {
    if (activeTab === "DISPUTES") return disputes;
    if (activeTab === "CHATS") return tickets;
    if (activeTab === "KYC") return kycs;
    return [];
  };

  return (
    <div className="p-5 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-end mb-8">
        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-bold">
          {disputes.filter(d => d.status === "OPEN").length + 
           tickets.filter(t => t.status === "OPEN").length + 
           kycs.length} active tasks
        </span>
      </div>

      {/* THREE BOX TAB DESIGN */}
      <div className="grid grid-cols-3 gap-2 mb-8 p-1 bg-zinc-50 border border-zinc-200 rounded-xl">
        <button
          onClick={() => setActiveTab("DISPUTES")}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === "DISPUTES"
              ? "bg-white text-zinc-900 border border-zinc-200 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <Scale size={14} /> Disputes
        </button>
        <button
          onClick={() => setActiveTab("CHATS")}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === "CHATS"
              ? "bg-white text-zinc-900 border border-zinc-200 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <MessageCircle size={14} /> Chats
        </button>
        <button
          onClick={() => setActiveTab("KYC")}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === "KYC"
              ? "bg-white text-zinc-900 border border-zinc-200 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <ShieldCheck size={14} /> KYC stats
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <RefreshCcw size={20} className="text-zinc-300 animate-spin" />
          </div>
        ) : getDisplayItems().length === 0 ? (
          <div className="py-20 text-center text-zinc-400 text-xs font-bold uppercase tracking-wider">
            No active {activeTab === "DISPUTES" ? "dispute" : activeTab === "CHATS" ? "live chat" : "KYC"} items
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {getDisplayItems().map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors">

                {/* Left side: Icon + Content Info */}
                <div className="flex gap-4 items-start md:items-center min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    activeTab === "DISPUTES"
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : activeTab === "CHATS"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-sky-50 text-sky-700 border-sky-100"
                  }`}>
                    {activeTab === "DISPUTES" ? (
                      <AlertTriangle size={16} />
                    ) : activeTab === "CHATS" ? (
                      <MessageCircle size={16} />
                    ) : (
                      <User size={16} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <span className="text-[13px] font-bold text-zinc-900 truncate max-w-[200px] sm:max-w-none">
                        {activeTab === "DISPUTES" && (item.milestone?.contract?.project?.title || "Disputed Milestone")}
                        {activeTab === "CHATS" && `Live chat - ${item.user?.name || "User"}`}
                        {activeTab === "KYC" && `${item.user?.name || "User Verification"}`}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        activeTab === "KYC"
                          ? "bg-sky-50 text-sky-600 border-sky-100"
                          : item.status === "OPEN" || item.status === "PENDING"
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}>
                        {activeTab === "KYC" ? "Pending Approval" : item.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-zinc-700">
                        {activeTab === "DISPUTES" && `${item.raisedBy?.name || 'User'} vs ${item.milestone?.contract?.freelancer?.name || 'Freelancer'}`}
                        {activeTab === "CHATS" && (item.user?.email || 'User')}
                        {activeTab === "KYC" && `${item.user?.email} • Doc Type: ${item.documentType}`}
                      </span>
                      <span>•</span>
                      <span>Submitted {new Date(item.createdAt).toLocaleDateString()}</span>
                      {activeTab === "DISPUTES" && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">${item.milestone?.amount?.toLocaleString() || '0'} in dispute</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Action Triggers */}
                <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 justify-end shrink-0">
                  {activeTab === "DISPUTES" && item.status !== "RESOLVED" && item.status !== "CLOSED" && (
                    <div className="flex gap-1.5 flex-1 md:flex-none">
                      <button
                        onClick={() => handleResolve(item.id, 'DISPUTE', 'RELEASED')}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all text-center"
                      >
                        Release
                      </button>
                      <button
                        onClick={() => handleResolve(item.id, 'DISPUTE', 'REFUNDED')}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg transition-all text-center"
                      >
                        Refund
                      </button>
                      <Link
                        to={`/dispute/${item.id}`}
                        className="px-4 py-2 bg-white text-zinc-900 border border-zinc-200 text-[11px] font-bold rounded-lg hover:bg-zinc-50 transition-all flex-1 md:flex-none text-center"
                      >
                        Details →
                      </Link>
                    </div>
                  )}

                  {activeTab === "CHATS" && item.status !== "RESOLVED" && item.status !== "CLOSED" && (
                    <div className="flex gap-1.5 flex-1 md:flex-none">
                      <button
                        onClick={() => handleResolve(item.id, 'TICKET')}
                        className="px-4 py-2 bg-zinc-900 text-white text-[11px] font-bold rounded-lg hover:bg-black transition-all flex-1 md:flex-none text-center"
                      >
                        Close Chat
                      </button>
                      <Link
                        to={`/livechat/session/${item.id}`}
                        className="px-4 py-2 bg-white text-zinc-900 border border-zinc-200 text-[11px] font-bold rounded-lg hover:bg-zinc-50 transition-all flex-1 md:flex-none text-center"
                      >
                        Details →
                      </Link>
                    </div>
                  )}

                  {activeTab === "KYC" && (
                    <div className="flex gap-1.5 flex-1 md:flex-none">
                      <button
                        onClick={() => handleVerifyKYC(item.id, 'APPROVED')}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all text-center"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyKYC(item.id, 'REJECTED')}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg transition-all text-center"
                      >
                        Reject
                      </button>
                      <a
                        href={item.documentUrl.startsWith('http') ? item.documentUrl : `${axios.defaults.baseURL.replace('/api', '')}/${item.documentUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white text-zinc-900 border border-zinc-200 text-[11px] font-bold rounded-lg hover:bg-zinc-50 transition-all flex-1 md:flex-none text-center flex items-center justify-center gap-1"
                      >
                        View Doc <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
