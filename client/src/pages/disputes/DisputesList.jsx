import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Search,
  ShieldAlert,
  Gavel,
  RefreshCcw,
  Fingerprint,
  LifeBuoy,
  MessagesSquare,
  BookOpen,
  FileQuestion,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupportHub = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
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
      console.error("Failed to fetch disputes:", error);
      showStatus("Critical synchronization failure.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (msg, type) => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesFilter = filter === 'ALL' ? true : d.status === filter;
    const matchesSearch = d.milestone?.contract?.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <RefreshCcw className="w-6 h-6 text-emerald-500" />
      </motion.div>
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Loading Help Center...</p>
    </div>
  );

  return (
    <div className="space-y-8 lg:space-y-12 pb-20">
      {/* Search Row */}
      <div className="flex justify-end px-1">
        <div className="relative w-full lg:w-96 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search cases or help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-zinc-100 rounded-2xl text-sm font-medium shadow-sm focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* 1. Support Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: "Live Chat", 
            desc: "Speak with a support expert in real-time.", 
            icon: <MessagesSquare />, 
            action: "Start Chat",
            color: "text-blue-500",
            bg: "bg-blue-50"
          },
          { 
            title: "Guides & Docs", 
            desc: "Browse our step-by-step platform guides.", 
            icon: <BookOpen />, 
            action: "Read More",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
          },
          { 
            title: "FAQs", 
            desc: "Find quick answers to common questions.", 
            icon: <FileQuestion />, 
            action: "View All",
            color: "text-purple-500",
            bg: "bg-purple-50"
          }
        ].map((item, i) => (
          <div key={i} className="group bg-white border border-zinc-100 p-8 rounded-[2.5rem] space-y-6 hover:border-zinc-200 transition-all hover:shadow-2xl hover:shadow-zinc-200/50 cursor-pointer relative overflow-hidden">
            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-inner`}>
              {React.cloneElement(item.icon, { size: 20, strokeWidth: 2.5 })}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
              <p className="text-sm font-medium text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
            <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs group-hover:gap-3 transition-all pt-2">
              {item.action} <ArrowRight size={14} className="text-emerald-500" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* 3. Case Management (Disputes) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex bg-zinc-50 p-1 rounded-xl border border-zinc-100">
            {['ALL', 'OPEN', 'RESOLVED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          {filteredDisputes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Case ID</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Project Name</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredDisputes.map((d) => (
                    <tr key={d.id} className="group hover:bg-zinc-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/dispute/${d.id}`)}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${d.status === 'OPEN' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                          <span className="font-mono text-[10px] font-bold text-zinc-400">#{d.id.slice(0, 12)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[13px] font-bold text-zinc-900 uppercase tracking-tight">{d.milestone?.contract?.project?.title || "Payment Issue"}</p>
                        <p className="text-[10px] font-medium text-zinc-400 mt-1 italic">Started on {new Date(d.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                          d.status === 'OPEN' 
                          ? 'bg-amber-50 text-amber-600 border-amber-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {d.status === 'OPEN' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                          {d.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex items-center gap-2 text-zinc-300 group-hover:text-zinc-900 transition-colors">
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                           <ChevronRight size={18} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-zinc-100 shadow-inner">
                <ShieldAlert size={28} className="text-zinc-200" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900">No cases found</h4>
              <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto">We couldn't find any support requests matching your search.</p>
              <button 
                onClick={() => {setFilter('ALL'); setSearchQuery('');}}
                className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline pt-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Contact Banner */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent)]" />
         <div className="space-y-4 relative z-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Need help right now?</h2>
            <p className="text-zinc-400 text-sm font-medium max-w-sm">Our support team is available 24/7 to help you resolve any issues with your projects.</p>
         </div>
         <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-white hover:text-zinc-900 text-white rounded-2xl font-bold text-xs transition-all shadow-xl shadow-emerald-500/10 active:scale-95">
              Contact Support
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-800 text-white rounded-2xl font-bold text-xs transition-all hover:bg-zinc-700 active:scale-95">
              Email Us
            </button>
         </div>
      </div>
    </div>
  );
};

export default SupportHub;

