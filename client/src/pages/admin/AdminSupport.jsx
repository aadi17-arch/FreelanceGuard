import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { getAllTickets, resolveTicket } from "../../services/supportService";
import { useSnackbar } from "notistack";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const { enqueueSnackbar } = useSnackbar();

  const fetchAdminTickets = React.useCallback(async () => {
    try {
      const data = await getAllTickets();
      setTickets(data);
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchAdminTickets();
  }, [fetchAdminTickets]);

  const handleResolve = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await resolveTicket(id);
      enqueueSnackbar("Ticket resolved successfully", { variant: "success" });
      fetchAdminTickets();
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    filter === "ALL" ? true : ticket.status === filter
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "OPEN": return "text-blue-700 bg-blue-50 border-blue-100";
      case "IN_PROGRESS": return "text-amber-700 bg-amber-50 border-amber-100";
      case "CLOSED": return "text-rui-success bg-emerald-50 border-emerald-100";
      default: return "text-zinc-700 bg-zinc-50 border-zinc-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rui-success">
            <Shield size={16} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Admin Panel</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Support center</h1>
          <p className="text-zinc-500 text-sm">Manage user requests and resolve issues.</p>
        </div>
        
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 shadow-inner">
          {["ALL", "OPEN", "IN_PROGRESS", "CLOSED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                filter === s ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Open tickets</p>
            <p className="text-3xl font-bold text-zinc-900 leading-none font-financial">{tickets.filter(t => t.status === "OPEN").length}</p>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm flex items-center gap-6 group hover:border-amber-200 transition-all">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center transition-transform">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">In progress</p>
            <p className="text-3xl font-bold text-zinc-900 leading-none font-financial">{tickets.filter(t => t.status === "IN_PROGRESS").length}</p>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all">
          <div className="w-14 h-14 bg-emerald-50 text-rui-success rounded-2xl flex items-center justify-center transition-transform">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Resolved</p>
            <p className="text-3xl font-bold text-zinc-900 leading-none font-financial">{tickets.filter(t => t.status === "CLOSED").length}</p>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ticket details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-zinc-300">
                      <MessageSquare size={48} />
                      <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No matching tickets found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400">
                          <UserIcon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 leading-tight">{ticket.user?.name || "Unknown User"}</p>
                          <p className="text-[11px] text-zinc-400">{ticket.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{ticket.category}</span>
                          <span className="text-[10px] text-zinc-300">•</span>
                          <span className="text-[10px] text-zinc-400">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{ticket.subject}</h3>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ticket.status !== "CLOSED" && (
                          <button
                            onClick={(e) => handleResolve(ticket.id, e)}
                            className="p-2 hover:bg-emerald-50 text-zinc-400 hover:text-emerald-600 rounded-lg transition-all"
                            title="Resolve ticket"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <Link
                          to={`/support/ticket/${ticket.id}`}
                          className="p-2 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900 rounded-lg transition-all"
                          title="View thread"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
