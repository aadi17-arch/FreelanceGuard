import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Send, 
  User, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { getTicketDetails, replyToTicket } from "../../services/supportService";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "notistack";

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTicketDetails = React.useCallback(async () => {
    try {
      const data = await getTicketDetails(id);
      setTicket(data);
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [id, enqueueSnackbar]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    try {
      await replyToTicket(id, reply);
      setReply("");
      fetchTicketDetails(); // Refresh messages
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "text-blue-600 bg-blue-50 border-blue-100";
      case "IN_PROGRESS": return "text-amber-600 bg-amber-50 border-amber-100";
      case "CLOSED": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      default: return "text-zinc-600 bg-zinc-50 border-zinc-100";
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-6 h-6 border-2 border-rui-dark border-t-transparent rounded-full" />
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Loading messages...</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/support" 
            className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-all text-zinc-500"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{ticket.subject}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Ticket ID: <span className="text-zinc-900 font-financial">{ticket.id.split('-')[0]}</span>
              <span className="mx-2 opacity-20">•</span>
              Opened on {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Conversation Area */}
      <div className="flex-grow flex flex-col bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm h-[calc(100vh-250px)]">
        {/* Messages List */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide bg-zinc-50/30">
          {ticket.messages.map((message) => {
            const isMe = message.senderId === user.id;
            const isAdmin = message.sender?.role === "ADMIN";

            return (
              <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-4 max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                    isAdmin ? "bg-rui-success text-white border-rui-success" : "bg-white text-zinc-400 border-zinc-100"
                  }`}>
                    {isAdmin ? <Shield size={18} /> : <User size={18} />}
                  </div>
                  
                  <div className={`space-y-1.5 ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">
                        {isAdmin ? "Support" : (isMe ? "You" : "User")}
                      </span>
                      <span className="text-[10px] text-zinc-300 opacity-50">•</span>
                      <span className="text-[10px] text-zinc-400 font-financial uppercase">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isMe 
                        ? "bg-rui-dark text-white rounded-tr-none" 
                        : (isAdmin 
                            ? "bg-white text-zinc-900 border border-rui-success/20 rounded-tl-none" 
                            : "bg-white text-zinc-700 border border-zinc-100 rounded-tl-none")
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        {ticket.status !== "CLOSED" ? (
          <div className="p-6 bg-white border-t border-zinc-100">
            <form onSubmit={handleSendReply} className="flex gap-4">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your secure message..."
                disabled={sending}
                className="flex-grow h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-6 text-sm focus:outline-none focus:ring-1 focus:ring-rui-success focus:border-rui-success transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className="w-14 h-14 bg-rui-dark hover:bg-black text-white rounded-2xl flex items-center justify-center transition-all disabled:bg-zinc-200 shadow-lg shadow-zinc-200"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-3 text-zinc-400">
            <CheckCircle2 size={16} />
            <p className="text-[10px] font-bold uppercase tracking-widest">This session has been archived and resolved</p>
          </div>
        )}
      </div>
    </div>
  );
}
