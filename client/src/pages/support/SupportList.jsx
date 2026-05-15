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
import { getUserTickets, createTicket } from "../../services/supportService";
import Modal from "../../components/ui/Modal";
import { useSnackbar } from "notistack";

export default function SupportList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", category: "GENERAL", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchTickets = React.useCallback(async () => {
    try {
      const data = await getUserTickets();
      setTickets(data);
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

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
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rui-success">
            <HelpCircle size={16} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Support hub</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">How can we help?</h1>
          <p className="text-zinc-500 text-sm">Track your requests and talk to our team.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-6 bg-rui-dark hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-sm font-bold"
        >
          <Plus size={16} />
          Create ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest opacity-40">Your tickets</h2>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-6 h-6 border-2 border-rui-dark border-t-transparent rounded-full" />
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Loading...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center text-zinc-200">
              <MessageSquare size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">No active tickets</h3>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                If you encounter any issues, our support team is available 24/7 to assist you.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/support/ticket/${ticket.id}`}
                className="flex items-center justify-between p-6 hover:bg-zinc-50/50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center border ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{ticket.category}</span>
                      <span className="text-[10px] text-zinc-300">•</span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-zinc-900 group-hover:text-rui-success transition-colors">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-md">
                      {ticket.messages?.[0]?.content || "Waiting for initial message..."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New support ticket">
        <form onSubmit={handleCreateTicket} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subject</label>
              <input
                required
                type="text"
                placeholder="What do you need help with?"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full h-12 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-rui-success focus:border-rui-success transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {["GENERAL", "PAYMENT", "TECHNICAL", "DISPUTE"].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewTicket({ ...newTicket, category: cat })}
                    className={`h-11 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      newTicket.category === cat 
                        ? "bg-rui-dark text-white border-rui-dark" 
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    {cat.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Tell us more about your issue..."
                value={newTicket.content}
                onChange={(e) => setNewTicket({ ...newTicket, content: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-rui-success focus:border-rui-success transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-12 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-zinc-900 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-[2] h-12 bg-rui-success hover:bg-emerald-700 disabled:bg-zinc-200 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all flex items-center justify-center"
            >
              {submitting ? "Sending..." : "Send request"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
