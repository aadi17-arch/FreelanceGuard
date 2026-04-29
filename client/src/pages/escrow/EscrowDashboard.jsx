import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  Plus, 
  Lock, 
  Scale, 
  CheckCircle2, 
  ShieldAlert,
  ChevronRight,
  Fingerprint,
  Zap,
  ArrowDownCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EscrowDashboard = () => {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEscrows();
  }, []);

  const fetchEscrows = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/escrow");
      setEscrows(res.data);
    } catch (err) {
      console.error(err);
      showStatus("Vault synchronization failure.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (msg, type) => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const totalHeld = escrows.reduce((sum, e) => sum + e.totalAmount, 0);
  const activeContracts = escrows.filter(e => e.status === 'ACTIVE').length;
  const disputedContracts = escrows.filter(e => e.status === 'DISPUTED').length;

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <Lock className="w-6 h-6 text-emerald-500" />
      </motion.div>
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Authenticating Vault...</p>
    </div>
  );

  return (
    <div className="space-y-6 lg:space-y-12 pb-20">
      {/* 1. Status Alert - Scaled */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`px-4 py-3 rounded-xl border flex items-center gap-3 shadow-sm ${
              statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-wider">{statusMessage.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Scaled Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-500">
             <ShieldCheck size={10} strokeWidth={3} />
             <p className="text-[7px] font-black uppercase tracking-[0.3em]">Protected Capital</p>
          </div>
          <h1 className="text-xl lg:text-4xl font-black tracking-tighter text-zinc-900 uppercase leading-none">Financial Vault</h1>
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
           <Link to="/marketplace" className="flex-grow lg:flex-none">
              <button className="w-full px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2">
                 <ArrowUpRight size={12} /> Deposit
              </button>
           </Link>
           <button className="px-3 py-2.5 bg-zinc-100 text-zinc-300 rounded-xl cursor-not-allowed">
              <ArrowDownCircle size={14} />
           </button>
        </div>
      </div>

      {/* 3. Scaled Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-3 bg-zinc-900 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-12 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-6 lg:space-y-10">
            <div className="flex justify-between items-start">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <Wallet size={16} className="text-emerald-400" />
               </div>
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Secured Archive</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400/70 mb-1">Escrow Value</p>
              <h2 className="text-3xl lg:text-7xl font-black tracking-tighter font-mono">${totalHeld.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-[1.5rem] p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Node Status</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <span className="text-zinc-300">Active</span>
                <span className="text-zinc-900">{activeContracts}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <span className="text-zinc-300">Dispute</span>
                <span className="text-rose-500">{disputedContracts}</span>
              </div>
              <div className="h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-50">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Vault Encrypted</p>
             </div>
          </div>
        </div>
      </div>

      {/* 4. Scaled Asset Ledger */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest px-2">Asset Ledger</h3>
        <div className="bg-white border border-zinc-100 rounded-[1.5rem] overflow-hidden shadow-sm">
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50">
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Asset</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Counterparty</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Value</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Status</th>
                  <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {escrows.map((escrow) => (
                  <tr key={escrow.id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-[12px] font-black text-zinc-900 uppercase tracking-tight">{escrow.project?.title}</p>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">ID: {escrow.id.slice(0, 8)}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-[9px] font-black text-zinc-400">
                          {escrow.freelancer?.name?.[0]}
                        </div>
                        <p className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{escrow.freelancer?.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-[12px] text-zinc-900 font-mono tracking-tighter">
                      ${escrow.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                         escrow.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-50 text-zinc-400'
                       }`}>
                         {escrow.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <ChevronRight size={14} className="ml-auto text-zinc-200" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-zinc-50">
             {escrows.map((escrow) => (
               <div key={escrow.id} className="p-4 space-y-3 active:bg-zinc-50 transition-colors">
                  <div className="flex justify-between items-center">
                     <h4 className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{escrow.project?.title}</h4>
                     <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase border ${escrow.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'}`}>
                        {escrow.status}
                     </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                     <p className="text-[12px] font-black text-zinc-900 font-mono tracking-tighter">${escrow.totalAmount.toLocaleString()}</p>
                     <button className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Audit →</button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowDashboard;
