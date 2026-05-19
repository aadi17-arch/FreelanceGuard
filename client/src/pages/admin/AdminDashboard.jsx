import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  MessageCircle,
  RefreshCcw,
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("TICKETS");
  const [tickets, setTickets] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const getDisplayItems = () => {
    if (activeTab === "TICKETS") {
      return disputes;
    }
    // LiveChat sessions do not have ticket categories; treat all as chat sessions here.
    return tickets;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketsRes, disputesRes] = await Promise.all([
        axios.get("/livechat/admin/sessions"),
        axios.get("/dispute")
      ]);
      setTickets(ticketsRes.data);
      setDisputes(disputesRes.data.disputes || []);
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

  return (
    <div className="p-5 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-end mb-8">
        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-bold">
          {disputes.filter(d => d.status === "OPEN").length + tickets.filter(t => t.status === "OPEN").length} active
        </span>
      </div>

      {/* TWO BOX TAB DESIGN - AS PER IMAGE */}
      <div className="grid grid-cols-2 gap-2 mb-8 p-1 bg-zinc-50 border border-zinc-200 rounded-xl">
        <button
          onClick={() => setActiveTab("TICKETS")}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === "TICKETS"
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
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <RefreshCcw size={20} className="text-zinc-300 animate-spin" />
          </div>
        ) : getDisplayItems().length === 0 ? (
          <div className="py-20 text-center text-zinc-400 text-xs font-bold uppercase tracking-wider">
            No active {activeTab === "TICKETS" ? "dispute" : "live chat"} items
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {getDisplayItems().map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors">

                {/* Left side: Icon + Content Info */}
                <div className="flex gap-4 items-start md:items-center min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    activeTab === "TICKETS"
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-emerald-50 text-emerald-700 border-emerald-100"
                  }`}>
                    {activeTab === "TICKETS" ? <AlertTriangle size={16} /> : <MessageCircle size={16} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <span className="text-[13px] font-bold text-zinc-900 truncate max-w-[200px] sm:max-w-none">
                        {activeTab === "TICKETS"
                          ? (item.milestone?.contract?.project?.title || "Disputed Milestone")
                          : `Live chat - ${item.user?.name || "User"}`}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        item.status === "OPEN"
                          ? "bg-rose-50 text-rose-600 border-rose-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-zinc-700">
                        {activeTab === "TICKETS"
                          ? `${item.raisedBy?.name || 'User'} vs ${item.milestone?.contract?.freelancer?.name || 'Freelancer'}`
                          : item.user?.name || 'User'}
                      </span>
                      <span>•</span>
                      <span>Filed {new Date(item.createdAt).toLocaleDateString()}</span>
                      {activeTab === "TICKETS" && (
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
                  {item.status !== "RESOLVED" && item.status !== "CLOSED" && activeTab === "TICKETS" && (
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
                    </div>
                  )}
                  {item.status !== "RESOLVED" && item.status !== "CLOSED" && activeTab === "CHATS" && (
                    <button
                      onClick={() => handleResolve(item.id, 'TICKET')}
                      className="px-4 py-2 bg-zinc-900 text-white text-[11px] font-bold rounded-lg hover:bg-black transition-all flex-1 md:flex-none text-center"
                    >
                      Close Chat
                    </button>
                  )}
                  <Link
                    to={activeTab === "TICKETS" ? `/dispute/${item.id}` : `/livechat/session/${item.id}`}
                    className="px-4 py-2 bg-white text-zinc-900 border border-zinc-200 text-[11px] font-bold rounded-lg hover:bg-zinc-50 transition-all flex-1 md:flex-none text-center"
                  >
                    View Details →
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
