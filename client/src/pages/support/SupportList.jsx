import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Search
} from "lucide-react";
import { getUserTickets, getAllTickets, createTicket } from "../../services/supportService";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "notistack";

export default function SupportList() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", category: "GENERAL", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const fetchTickets = React.useCallback(async () => {
    try {
      const data = isAdmin ? await getAllTickets() : await getUserTickets();
      setTickets(data);
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, isAdmin]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTicket(newTicket);
      enqueueSnackbar("Ticket created successfully", { variant: "success" });
      setIsModalOpen(false);
      setNewTicket({ subject: "", category: "GENERAL", content: "" });
      fetchTickets();
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "OPEN": return <AlertCircle size={14} className="text-blue-500" />;
      case "IN_PROGRESS": return <Clock size={14} className="text-amber-500" />;
      case "CLOSED": return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return <AlertCircle size={14} className="text-zinc-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "bg-blue-50 text-blue-700 border-blue-100";
      case "IN_PROGRESS": return "bg-amber-50 text-amber-700 border-amber-100";
      case "CLOSED": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default: return "bg-zinc-50 text-zinc-700 border-zinc-100";
    }
  };



  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Support requests</h1>
        {!isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-5 bg-zinc-900 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-xs font-bold"
          >
            <Plus size={14} />
            Create ticket
          </button>
        )}
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-200">
              <MessageSquare size={24} />
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No active chats</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/support/ticket/${ticket.id}`}
                className="flex items-center justify-between p-4 hover:bg-zinc-50/50 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900 truncate">
                      {ticket.subject}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-medium">
                      Last update: {new Date(ticket.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-900 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create ticket">
        <form onSubmit={handleCreateTicket} className="space-y-5 p-2">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400">Subject</label>
              <input
                required
                type="text"
                placeholder="What do you need help with?"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-medium focus:outline-none focus:border-zinc-900 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {["GENERAL", "PAYMENT", "TECHNICAL", "DISPUTE"].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewTicket({ ...newTicket, category: cat })}
                    className={`h-10 rounded-xl text-[10px] font-bold border transition-all ${
                      newTicket.category === cat
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    {cat.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Explain the issue clearly..."
                value={newTicket.content}
                onChange={(e) => setNewTicket({ ...newTicket, content: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs font-medium focus:outline-none focus:border-zinc-900 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-11 text-zinc-400 text-[11px] font-bold hover:text-zinc-900 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-[2] h-11 bg-zinc-900 hover:bg-black disabled:bg-zinc-200 text-white rounded-xl text-[11px] font-bold shadow-sm transition-all flex items-center justify-center"
            >
              {submitting ? "Sending..." : "Create ticket"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
