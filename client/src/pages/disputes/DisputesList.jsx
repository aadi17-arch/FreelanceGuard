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
  Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DisputesList = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); 
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

  const filteredDisputes = disputes.filter(d => 
    filter === 'ALL' ? true : d.status === filter
  );

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <Scale className="w-6 h-6 text-amber-500" />
      </motion.div>
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Scanning Archive...</p>
    </div>
  );

  return (
    <div className="space-y-5 lg:space-y-8 pb-20">
      {/* 1. Status Alert - Scaled */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 shadow-sm ${
              statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-wider">{statusMessage.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Scaled Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500">
             <Gavel size={12} />
             <p className="text-[7px] font-black uppercase tracking-[0.3em]">Institutional Node</p>
          </div>
          <h1 className="text-xl lg:text-3xl font-black tracking-tighter text-zinc-900 uppercase">Resolution</h1>
        </div>
        
        <div className="flex w-full lg:w-auto bg-zinc-50 p-1 rounded-xl border border-zinc-100 shadow-inner">
          {['ALL', 'OPEN', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Scaled Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
        {[
          { label: "Active", value: disputes.filter(d => d.status === 'OPEN').length, icon: <AlertCircle />, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Resolved", value: disputes.filter(d => d.status === 'RESOLVED').length, icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Stability", value: "98.2%", icon: <RefreshCcw />, color: "text-blue-600", bg: "bg-blue-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-4 lg:p-6 rounded-2xl flex items-center gap-4">
             <div className={`w-8 h-8 lg:w-10 lg:h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center shrink-0`}>
                {React.cloneElement(stat.icon, { size: 14 })}
             </div>
             <div>
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-300">{stat.label}</p>
                <p className="text-lg font-black tracking-tighter text-zinc-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* 4. Scaled Dispute Area */}
      <div className="bg-white border border-zinc-100 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">ID</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Project</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredDisputes.map((d) => (
                <tr key={d.id} className="group hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => navigate(`/dispute/${d.id}`)}>
                  <td className="px-6 py-5"><span className="font-mono text-[9px] font-black text-zinc-300">#{d.id.slice(0, 8)}</span></td>
                  <td className="px-6 py-5 text-[11px] font-black text-zinc-900 uppercase tracking-tight">{d.milestone?.contract?.project?.title || "Asset Dispute"}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border ${d.status === 'OPEN' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right"><ChevronRight size={14} className="ml-auto text-zinc-200" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-zinc-50">
          {filteredDisputes.map((d) => (
            <div key={d.id} onClick={() => navigate(`/dispute/${d.id}`)} className="p-4 space-y-3 active:bg-zinc-50">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[8px] font-black text-zinc-200 bg-zinc-50 px-1.5 py-0.5 rounded">#{d.id.slice(0, 8)}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase border ${d.status === 'OPEN' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{d.status}</span>
              </div>
              <h3 className="text-[11px] font-black text-zinc-900 uppercase tracking-tight leading-tight">{d.milestone?.contract?.project?.title || "Asset Dispute"}</h3>
              <div className="flex justify-end pt-1">
                 <button className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Review Case →</button>
              </div>
            </div>
          ))}
        </div>

        {filteredDisputes.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <ShieldAlert size={24} className="mx-auto text-zinc-100" />
            <p className="text-[8px] font-black text-zinc-200 uppercase tracking-widest">No active protocols registered.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputesList;
