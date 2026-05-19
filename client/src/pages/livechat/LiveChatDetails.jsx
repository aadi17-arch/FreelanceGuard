import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Send, Shield, User } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "notistack";

export default function LiveChatDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSession = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`/livechat/session/${id}`);
      setSession(data);
    } catch (error) {
      enqueueSnackbar("Failed to load chat session", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, id]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    try {
      await axios.post(`/livechat/reply/${id}`, { content: reply });
      setReply("");
      fetchSession();
    } catch (error) {
      enqueueSnackbar("Failed to send message", { variant: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    try {
      await axios.put(`/livechat/session/${id}/close`);
      fetchSession();
      enqueueSnackbar("Chat closed", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to close chat", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-6 h-6 border-2 border-rui-dark border-t-transparent rounded-full" />
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          Loading messages...
        </p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="w-full h-full flex flex-col space-y-4 sm:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Link
            to={user?.role === "ADMIN" ? "/admin" : "/disputes"}
            className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-all text-zinc-500 shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-zinc-900 tracking-tight leading-tight break-words">
                Live Chat
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider shrink-0 ${
                  session.status === "OPEN"
                    ? "text-blue-600 bg-blue-50 border-blue-100"
                    : "text-emerald-600 bg-emerald-50 border-emerald-100"
                }`}
              >
                {session.status}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 flex-wrap">
              <span>Session ID:</span>
              <span className="text-zinc-900 font-financial">
                {session.id.split("-")[0]}
              </span>
              <span className="opacity-20">•</span>
              <span>
                Opened on {new Date(session.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {user?.role === "ADMIN" && session.status !== "CLOSED" && (
          <button
            onClick={handleClose}
            className="h-10 px-5 bg-zinc-900 hover:bg-black text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-xs font-bold w-full lg:w-auto shrink-0 active:scale-95"
          >
            <CheckCircle2 size={14} />
            Close
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm min-h-[450px] lg:h-[calc(100vh-260px)]">
        <div className="flex-grow overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 scrollbar-none bg-zinc-50">
          {(session.messages || []).map((message) => {
            const isMe = message.senderId === user.id;
            const isAdmin = message.sender?.role === "ADMIN";

            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 sm:gap-4 max-w-[85%] sm:max-w-[75%] ${
                    isMe ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                      isAdmin
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-400 border-zinc-100"
                    }`}
                  >
                    {isAdmin ? <Shield size={16} /> : <User size={16} />}
                  </div>

                  <div className={`space-y-1.5 min-w-0`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] sm:text-[10px] font-bold text-zinc-900 uppercase tracking-widest">
                        {isAdmin ? "Admin" : isMe ? "You" : "User"}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-zinc-300 opacity-50">
                        •
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-zinc-400 font-financial uppercase">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
                        isMe
                          ? "bg-zinc-900 text-white rounded-tr-none"
                          : "bg-white text-zinc-700 border border-zinc-100 rounded-tl-none"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {session.status !== "CLOSED" ? (
          <div className="p-4 sm:p-6 bg-white border-t border-zinc-100">
            <form onSubmit={handleSendReply} className="flex gap-3 sm:gap-4">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your message..."
                disabled={sending}
                className="flex-grow h-12 sm:h-14 bg-zinc-50 border border-zinc-200 rounded-2xl px-5 text-xs sm:text-sm focus:outline-none focus:border-zinc-900 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-900 hover:bg-black text-white rounded-2xl flex items-center justify-center transition-all disabled:bg-zinc-200 active:scale-95 shrink-0 shadow-sm"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-6 sm:p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-3 text-zinc-400">
            <CheckCircle2 size={16} />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              This session is closed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

