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
      case "OPEN": return <AlertCircle size={13} className="text-blue-500" />;
      case "IN_PROGRESS": return <Clock size={13} className="text-amber-500" />;
      case "CLOSED": return <CheckCircle2 size={13} className="text-emerald-500" />;
      default: return <AlertCircle size={13} className="text-zinc-400" />;
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
    <div className="w-full mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Tickets</h1>
        {!isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-8 px-4 bg-zinc-900 hover:bg-black text-white rounded-sm flex items-center justify-center gap-1.5 transition-all text-xs font-bold"
          >
            <Plus size={13} />
            Create ticket
          </button>
        )}
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-10 h-10 bg-zinc-50 rounded-sm border border-zinc-200 flex items-center justify-center text-zinc-600">
              <MessageSquare size={18} />
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No support tickets</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/support/ticket/${ticket.id}`}
                className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center border shrink-0 ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-900 truncate">
                      {ticket.subject}
                    </h3>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">
                      Last update - {new Date(ticket.updatedAt).toLocaleDateString()}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Ticket">
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-black tracking-wider text-zinc-600">Subject</label>
              <input
                required
                type="text"
                placeholder="What do you need help with?"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full h-9 bg-zinc-50 border border-zinc-300 rounded-sm px-3 text-xs font-bold focus:outline-none focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black tracking-wider text-zinc-600">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {["GENERAL", "PAYMENT", "TECHNICAL", "DISPUTE"].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewTicket({ ...newTicket, category: cat })}
                    className={`h-8 rounded-sm text-[10px] font-black uppercase border transition-all ${
                      newTicket.category === cat
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-900"
                    }`}
                  >
                    {cat.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black  tracking-wider text-zinc-600">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Explain the issue clearly..."
                value={newTicket.content}
                onChange={(e) => setNewTicket({ ...newTicket, content: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-sm p-3 text-xs font-bold focus:outline-none focus:border-zinc-900 focus:bg-white transition-all resize-none placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-9 text-zinc-500 text-[10px] font-black tracking-widest hover:text-zinc-950 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-[2] h-9 bg-zinc-900 hover:bg-black disabled:bg-zinc-200 text-white rounded-sm text-[10px] font-black tracking-widest transition-all flex items-center justify-center"
            >
              {submitting ? "Sending..." : "Create ticket"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
