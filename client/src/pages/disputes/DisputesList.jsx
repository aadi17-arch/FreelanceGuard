import React, { useState, useEffect } from 'react';
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

const SupportHub = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const navigate = useNavigate();

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
          <div className="w-[320px] h-[450px] bg-white rounded-none border border-zinc-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Chat Header */}
            <div className="bg-zinc-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-emerald-500 flex items-center justify-center text-white">
                  <MessagesSquare size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Support Agent</p>
                  <p className="text-[10px] text-emerald-400 font-bold">Online</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-zinc-400 hover:text-white">
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-zinc-50 space-y-4">
              <div className="bg-white border border-zinc-200 p-3 rounded-none max-w-[85%]">
                <p className="text-xs font-medium text-zinc-600 leading-relaxed">
                  Hi! How can we help you today?
                </p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-zinc-100">
              <div className="flex items-center gap-2 bg-zinc-50 rounded-none px-3 py-2 border border-zinc-200">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow bg-transparent text-xs font-medium focus:outline-none placeholder:text-zinc-400"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button className="text-zinc-900 hover:text-black">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Icon */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-none shadow-none border border-zinc-200 flex items-center justify-center transition-all hover:bg-zinc-900 active:bg-zinc-200 ${
            isChatOpen ? 'bg-zinc-900 text-white rotate-180' : 'bg-emerald-600 text-white'
          }`}
        >
          {isChatOpen ? <ChevronDown size={24} /> : <MessagesSquare size={24} />}
        </button>
      </div>
    </div>
  );
};


export default SupportHub;
