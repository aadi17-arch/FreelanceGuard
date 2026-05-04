import React, { useEffect, useState } from "react";
import axios from "axios";
import {
   Wallet,
   ArrowUpRight,
   Clock,
   CheckCircle2,
   TrendingUp,
   History,
   Lock,
   Zap,
   ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function EscrowDashboard() {
   const [contracts, setContracts] = useState([]);
   const [liveUser, setLiveUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const { user } = useAuth();

   useEffect(() => {
      fetchData();
   }, []);

   const fetchData = async () => {
      try {
         setLoading(true);
         const [contractsRes, profileRes] = await Promise.all([
            axios.get("/escrow"),
            axios.get("/auth/profile")
         ]);
         setContracts(contractsRes.data);
         setLiveUser(profileRes.data);
      } catch (err) {
         console.error("Data sync error:", err);
      } finally {
         setLoading(false);
      }
   };

   if (loading) return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
            <Zap className="w-5 h-5 text-emerald-500" />
         </motion.div>
         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Checking your balance...</p>
      </div>
   );

   return (
      <div className="space-y-8 pb-10">
         {/* 1. Slim Header */}
         <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-100 pb-8">
            <div>
               <div className="flex items-center gap-2 text-emerald-500 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">Safety Verified</p>
               </div>
               <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">My Payments</h1>
            </div>

            <div className="flex items-center gap-2">
               <Link to="/wallet/withdraw">
                  <button className="px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-900/10">
                     <ArrowUpRight size={14} /> Withdraw Money
                  </button>
               </Link>
            </div>
         </header>

         {/* 2. Focused Balance Grid */}
         <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Main Balance */}
            <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
               <p className="text-[9px] font-black text-emerald-100 uppercase tracking-widest mb-4">Money you can spend</p>
               <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black tracking-tighter">${(liveUser || user)?.walletBalance?.toLocaleString() || "0"}</span>
                  <span className="text-[10px] font-bold opacity-60">USD</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full w-fit">
                  <CheckCircle2 size={10} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Ready to use</span>
               </div>
            </div>

            {/* Locked Funds */}
            <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm relative group">
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Safe in a project</p>
               <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black tracking-tighter text-zinc-900">${(liveUser || user)?.heldAmount?.toLocaleString() || "0"}</span>
                  <span className="text-[10px] font-bold text-zinc-400">USD</span>
               </div>
               <div className="flex items-center gap-2 text-emerald-500">
                  <Lock size={10} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Protected for you</span>
               </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6 shadow-sm group">
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Total earned so far</p>
               <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black tracking-tighter text-zinc-900">${(liveUser || user)?.totalEarned?.toLocaleString() || "0"}</span>
                  <span className="text-[10px] font-bold text-zinc-400">USD</span>
               </div>
               <div className="flex items-center gap-2 text-zinc-400">
                  <TrendingUp size={10} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Your progress</span>
               </div>
            </div>
         </section>

         {/* 3. Tight Activity Table */}
         <section className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/30">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <History size={14} /> Past payments
               </h3>
               <button className="text-[9px] font-black text-zinc-300 uppercase tracking-widest hover:text-zinc-900 transition-colors">
                  See all history
               </button>
            </div>

            <div className="divide-y divide-zinc-50">
               {contracts.length > 0 ? (
                  contracts.map((contract) => (
                     <div key={contract.id} className="px-8 py-5 flex items-center justify-between hover:bg-zinc-50/50 transition-all group">
                        <div className="flex items-center gap-5">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                              contract.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-500' : 'bg-zinc-100 text-zinc-400'
                           }`}>
                              {contract.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                           </div>
                           <div>
                              <p className="text-xs font-black text-zinc-900 uppercase tracking-tight truncate max-w-[200px]">
                                 {contract.project?.title}
                              </p>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                                 {new Date(contract.createdAt).toLocaleDateString()} • {contract.status === 'COMPLETED' ? 'Money Paid' : 'Safe in Project'}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-10">
                           <div className="text-right hidden sm:block">
                              <p className="text-[10px] font-black text-zinc-900 tracking-tighter">${contract.totalAmount?.toLocaleString()}</p>
                           </div>
                           <div className="w-8 h-8 rounded-full border border-zinc-50 flex items-center justify-center text-zinc-200 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                              <ChevronRight size={14} />
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="py-20 text-center space-y-3">
                     <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-200">
                        <History size={20} />
                     </div>
                     <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">No activity found</p>
                  </div>
               )}
            </div>
         </section>
      </div>
   );
}
