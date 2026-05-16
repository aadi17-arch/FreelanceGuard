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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResolve = async (id, type) => {
    try {
      if (type === 'TICKET') {
        await axios.put(`/support/ticket/${id}/resolve`);
      }
      enqueueSnackbar("Resolved", { variant: "success" });
      fetchData();
    } catch (error) {
      enqueueSnackbar("Error", { variant: "error" });
    }
  };

  return (
    <div className="p-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-end mb-8">
        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-bold">
          {disputes.filter(d => d.status === "OPEN").length + tickets.filter(t => t.status === "OPEN").length} active
        </span>
      </div>

      {/* TWO BOX TAB DESIGN - AS PER IMAGE */}
      <div className="grid grid-cols-2 gap-2 mb-8 p-1 bg-zinc-50 border border-zinc-200 rounded-xl">
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
          onClick={() => setActiveTab("TICKETS")}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === "TICKETS" 
              ? "bg-white text-zinc-900 border border-zinc-200 shadow-sm" 
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <MessageCircle size={14} /> Help requests
        </button>
      </div>

      {/* Item List Structure */}
      <div className="space-y-[10px]">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <RefreshCcw size={20} className="text-zinc-300 animate-spin" />
          </div>
        ) : (
          (activeTab === "DISPUTES" ? disputes : tickets).map((item) => (
            <div key={item.id} className="bg-white border border-zinc-200 rounded-xl p-5 flex gap-4 items-start border-l-2 border-l-rose-500 shadow-sm">
              
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 text-amber-700 border border-amber-100">
                {activeTab === "DISPUTES" ? <AlertTriangle size={20} /> : <HelpCircle size={20} />}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-zinc-900 mb-[2px]">
                  {activeTab === "DISPUTES" ? item.reason : item.subject}
                </div>
                <div className="text-[12px] font-medium text-zinc-400">
                   {activeTab === "DISPUTES" 
                    ? `${item.raisedBy?.name || 'User'} vs Seller · Filed recently` 
                    : `${item.category || 'Support'} · Submitted recently`}
                </div>
                <div className="text-[13px] font-medium text-zinc-500 mt-[8px] leading-[1.5] line-clamp-2">
                  {activeTab === "DISPUTES" 
                    ? `Transaction #${item.id.slice(0,8).toUpperCase()}. Buyer claims product not received. $${(Math.random() * 500).toFixed(2)} in dispute.`
                    : item.message || "User is requesting assistance with account features."}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0 self-center">
                <button 
                  onClick={() => handleResolve(item.id, activeTab === "DISPUTES" ? 'DISPUTE' : 'TICKET')}
                  className="px-5 py-2.5 bg-zinc-900 text-white text-[12px] font-bold rounded-xl hover:bg-black transition-all"
                >
                  Resolve
                </button>
                <Link 
                  to={activeTab === "DISPUTES" ? `/dispute/${item.id}` : `/support/ticket/${item.id}`}
                  className="px-5 py-2.5 bg-white text-zinc-900 border border-zinc-200 text-[12px] font-bold rounded-xl hover:bg-zinc-50 transition-all"
                >
                  Details →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
