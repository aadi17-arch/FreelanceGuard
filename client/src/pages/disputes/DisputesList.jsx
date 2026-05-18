import React, { useState, useEffect, useRef } from 'react';
import {
  Scale,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown,
  Search,
  ShieldAlert,
  Gavel,
  RefreshCcw,
  LifeBuoy,
  MessagesSquare,
  BookOpen,
  FileQuestion,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';

const SupportHub = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  
  const [activeTicket, setActiveTicket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sendingChat, setSendingChat] = useState(false);
  
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dispute', {
        withCredentials: true
      });
      setDisputes(response.data.disputes || []);
    } catch (error) {
      toast.error("Failed to load cases.");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveChatTicket = async () => {
    try {
      const response = await axios.get('/support/my-tickets');
      const openTicket = response.data.find(t => t.category === 'CHAT' && t.status !== 'CLOSED');
      if (openTicket) {
        const details = await axios.get(`/support/ticket/${openTicket.id}`);
        setActiveTicket(openTicket);
        setChatMessages(details.data.messages || []);
      } else {
        setActiveTicket(null);
        setChatMessages([]);
      }
    } catch (err) {
      console.error("Failed to load support chat session", err);
    }
  };

  useEffect(() => {
    if (!isChatOpen) return;

    setLoadingChat(true);
    fetchActiveChatTicket().finally(() => setLoadingChat(false));

    const interval = setInterval(fetchActiveChatTicket, 3000);
    return () => clearInterval(interval);
  }, [isChatOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || sendingChat) return;

    setSendingChat(true);
    try {
      if (activeTicket) {
        const response = await axios.post(`/support/reply/ticket/${activeTicket.id}`, {
          content: chatMessage
        });
        setChatMessages((prev) => [...prev, response.data]);
        setChatMessage("");
      } else {
        const response = await axios.post('/support/ticket', {
          subject: "Live Query Chat",
          category: "CHAT",
          content: chatMessage
        });
        const newTicket = response.data.supportTicket;
        setActiveTicket(newTicket);
        setChatMessages(newTicket.messages || []);
        setChatMessage("");
      }
    } catch (err) {
      toast.error("Failed to send message to support");
    } finally {
      setSendingChat(false);
    }
  };

  const filteredDisputes = disputes.filter(d => {
    return filter === 'ALL' ? true : d.status === filter;
  });

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
      <RefreshCcw className="w-5 h-5 text-zinc-900 animate-spin" />
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Syncing cases...</p>
    </div>
  );

  return (
    <div className="relative pb-24">
      {/* 1. Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Disputes</h1>

        <div className="flex bg-zinc-100 p-1 rounded-xs border border-zinc-200">
          {[
            { label: "All", key: "ALL" },
            { label: "Open", key: "OPEN" },
            { label: "Resolved", key: "RESOLVED" }
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-xs transition-all ${
                filter === f.key ? "bg-white text-zinc-900 border border-zinc-200" : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Case List */}
      <div className="bg-white border border-zinc-300 rounded-xs overflow-hidden">
        {filteredDisputes.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {filteredDisputes.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/dispute/${d.id}`)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-none flex items-center justify-center border shrink-0 transition-colors ${
                    d.status === 'OPEN'
                      ? 'bg-amber-50 border-amber-100 text-amber-500'
                      : 'bg-emerald-50 border-emerald-100 text-emerald-500'
                  }`}>
                    {d.status === 'OPEN' ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900 truncate group-hover:text-zinc-900 transition-colors">
                      {d.milestone?.contract?.project?.title || "Payment review"}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">

                      <span className="text-[10px] text-zinc-500 font-bold">
                        Opened - {new Date(d.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className={`px-2.5 py-1 rounded-none text-[9px] font-black uppercase tracking-wider hidden sm:block border ${
                    d.status === 'OPEN'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {d.status === 'OPEN' ? 'In progress' : 'Resolved'}
                  </span>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:text-zinc-950 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 bg-zinc-100 rounded-none flex items-center justify-center text-zinc-200 mx-auto">
              <Scale size={24} />
            </div>
            <p className="text-xs font-bold text-zinc-600 tracking-widest">No disputes</p>
          </div>
        )}
      </div>

      {/* 3. Floating Messenger Popup */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="w-[320px] h-[450px] bg-white rounded-3xl border border-zinc-200 flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            {/* Chat Header */}
            <div className="bg-zinc-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <MessagesSquare size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Support Admin</p>
                  <p className="text-[10px] text-emerald-400 font-bold mt-1">Online • Live Chat</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="w-7 h-7 rounded-lg hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-zinc-50 space-y-4 scrollbar-none flex flex-col">
              {loadingChat ? (
                <div className="flex-grow flex flex-col items-center justify-center space-y-2">
                  <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Securing Connection...</p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-none shadow-sm space-y-1.5 max-w-[90%] mt-2">
                  <p className="text-xs font-bold text-zinc-900 leading-normal">
                    Hi! Welcome to secure chat.
                  </p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                    Need help? Type your message below to immediately start a private chat thread with an Admin.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => {
                  const isMe = msg.senderId === user?.id;
                  const isAdmin = msg.sender?.role === "ADMIN" || !isMe;

                  return (
                    <div key={msg.id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"} w-full`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-normal shadow-sm ${
                        isMe 
                          ? "bg-zinc-900 text-white rounded-tr-none" 
                          : "bg-white text-zinc-800 border border-zinc-100 rounded-tl-none"
                      }`}>
                        {!isMe && (
                          <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                            {msg.sender?.role === "ADMIN" ? "Support Admin" : "Support"}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap break-words font-medium">{msg.content}</p>
                        <p className={`text-[8px] text-right mt-1.5 opacity-50 font-financial ${isMe ? "text-zinc-300" : "text-zinc-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-zinc-100">
              <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 bg-zinc-50 rounded-2xl px-4 py-2 border border-zinc-200">
                <input
                  type="text"
                  placeholder={sendingChat ? "Sending..." : "Type a message..."}
                  className="flex-grow bg-transparent text-xs font-bold focus:outline-none placeholder:text-zinc-400 text-zinc-900 disabled:opacity-50"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  disabled={sendingChat}
                />
                <button 
                  type="submit" 
                  disabled={!chatMessage.trim() || sendingChat}
                  className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-black text-white flex items-center justify-center transition-all disabled:opacity-30 active:scale-90"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Floating Icon */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 duration-300 ${
            isChatOpen ? 'bg-zinc-950 text-white rotate-180' : 'bg-zinc-900 text-white shadow-zinc-300'
          }`}
        >
          {isChatOpen ? <ChevronDown size={20} /> : <MessagesSquare size={20} />}
        </button>
      </div>
    </div>
  );
};

export default SupportHub;
