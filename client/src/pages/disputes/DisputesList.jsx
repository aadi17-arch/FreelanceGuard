import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Search,
  ShieldAlert,
  Gavel
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DisputesList = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, OPEN, RESOLVED
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await axios.get('/dispute', {
        withCredentials: true
      });
      setDisputes(response.data);
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(d => 
    filter === 'ALL' ? true : d.status === filter
  );

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Scale className="w-8 h-8 text-accent-primary" />
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-zinc-900 rounded-lg text-amber-500 shadow-lg shadow-amber-500/10">
                <Gavel size={20} />
             </div>
             <h1 className="text-3xl font-black tracking-tight text-zinc-900">Resolution Center</h1>
          </div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] pl-1">
            Institutional Dispute Management Protocol
          </p>
        </div>
        
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200/50 shadow-inner">
          {['ALL', 'OPEN', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-zinc-900 text-white shadow-xl scale-[1.02]' 
                  : 'text-zinc-400 hover:text-zinc-600 hover:bg-white/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: "Active Cases", value: disputes.filter(d => d.status === 'OPEN').length, icon: <AlertCircle />, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { label: "Resolved", value: disputes.filter(d => d.status === 'RESOLVED').length, icon: <CheckCircle2 />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Avg. Resolution", value: disputes.filter(d => d.status === 'RESOLVED').length > 0 ? "2.1 Days" : "—", icon: <Clock />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden bg-white border ${stat.border} p-8 rounded-[2rem] shadow-sm group transition-all duration-500`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative z-10 flex flex-col gap-4">
               <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  {React.cloneElement(stat.icon, { size: 18 })}
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
                  <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Table / Data Area */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 border-b border-zinc-50">Case Identifier</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 border-b border-zinc-50">Project Asset / Node</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 border-b border-zinc-50">Capital Value</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 border-b border-zinc-50 text-center">Protocol Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 border-b border-zinc-50 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredDisputes.map((d, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={d.id} 
                  className="group hover:bg-zinc-50/80 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/dispute/${d.id}`)}
                >
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-black text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                      #{d.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-zinc-900 mb-1 leading-none">{d.milestone?.project?.title || "Contract Dispute"}</p>
                    <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 mt-2">
                      <div className="w-1 h-1 rounded-full bg-zinc-300" />
                      Initiated {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 font-financial text-sm font-black text-zinc-900">
                    ${d.milestone?.amount?.toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border-2 shadow-sm ${
                      d.status === 'OPEN' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end">
                       <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white group-hover:rotate-90 transition-all duration-500">
                          <ChevronRight size={16} />
                       </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredDisputes.length === 0 && (
            <div className="text-center py-32 px-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/30 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto text-zinc-200 border border-zinc-100">
                   <ShieldAlert size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">System Clear</h3>
                  <p className="text-xs font-bold text-zinc-400 max-w-[240px] mx-auto uppercase tracking-widest leading-loose">
                    No active dispute protocols currently registered in vault.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputesList;
