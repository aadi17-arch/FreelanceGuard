import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  MessageSquare, 
  Scale, 
  CheckCircle2, 
  ChevronRight,
  RefreshCcw,
  User as UserIcon,
  Inbox
} from "lucide-react";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("DISPUTES");
  const [tickets, setTickets] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketsRes, disputesRes] = await Promise.all([
        axios.get("/support/admin/all"),
        axios.get("/dispute") 
      ]);
      setTickets(ticketsRes.data);
      setDisputes(disputesRes.data.disputes || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResolveTicket = async (id) => {
    try {
      await axios.put(`/support/ticket/${id}/resolve`);
      enqueueSnackbar("Resolved", { variant: "success" });
      fetchData();
    } catch (error) {
      enqueueSnackbar("Error", { variant: "error" });
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 overflow-hidden">
      
      {/* 1. Header Section - Fixed */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Admin center</h1>
          <p className="text-zinc-500 text-sm">Review disputes and help requests.</p>
        </div>

        {/* Minimal Tab Switcher */}
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveTab("DISPUTES")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "DISPUTES" 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-zinc-500"
            }`}
          >
            <Scale size={14} />
            Dispute cases ({disputes.filter(d => d.status === "OPEN").length})
          </button>
          <button
            onClick={() => setActiveTab("TICKETS")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "TICKETS" 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-zinc-500"
            }`}
          >
            <Inbox size={14} />
            Help requests ({tickets.filter(t => t.status === "OPEN").length})
          </button>
        </div>
      </div>

      {/* 2. Main Content Area - Internal Scrollable */}
      <div className="flex-grow bg-white border border-zinc-200 rounded-[2rem] overflow-hidden flex flex-col shadow-sm">
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <RefreshCcw size={24} className="text-indigo-600 animate-spin" />
            </div>
          ) : activeTab === "DISPUTES" ? (
            /* --- DISPUTES LIST --- */
            <div className="divide-y divide-zinc-100">
              {disputes.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-zinc-300 gap-2">
                   <Scale size={32} />
                   <p className="text-sm font-medium">No active disputes</p>
                </div>
              ) : (
                disputes.map(dispute => (
                  <div key={dispute.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          dispute.status === "OPEN" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                          {dispute.status === "OPEN" ? "Active" : "Resolved"}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">ID: {dispute.id.slice(0, 8)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900">{dispute.reason}</h3>
                      <p className="text-xs text-zinc-500">Raised by {dispute.raisedBy?.name}</p>
                    </div>
                    <Link 
                      to={`/dispute/${dispute.id}`} 
                      className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-black transition-all"
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* --- TICKETS LIST --- */
            <div className="divide-y divide-zinc-100">
              {tickets.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-zinc-300 gap-2">
                   <Inbox size={32} />
                   <p className="text-sm font-medium">No help requests</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          ticket.status === "OPEN" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-zinc-100 text-zinc-500 border-zinc-200"
                        }`}>
                          {ticket.status === "OPEN" ? "New" : "Closed"}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{ticket.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-900">{ticket.subject}</h3>
                      <p className="text-xs text-zinc-500">From {ticket.user?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       {ticket.status !== "CLOSED" && (
                         <button 
                           onClick={() => handleResolveTicket(ticket.id)}
                           className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                         >
                           <CheckCircle2 size={18} />
                         </button>
                       )}
                       <Link 
                         to={`/support/ticket/${ticket.id}`}
                         className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-black transition-all"
                       >
                         <ChevronRight size={18} />
                       </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer Stats - Fixed */}
      <div className="grid grid-cols-2 gap-4 shrink-0">
         <div className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total disputes</p>
            <p className="text-3xl font-bold text-zinc-900 leading-none">{disputes.length}</p>
         </div>
         <div className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total requests</p>
            <p className="text-3xl font-bold text-zinc-900 leading-none">{tickets.length}</p>
         </div>
      </div>
    </div>
  );
}
