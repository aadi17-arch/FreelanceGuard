import React, { useEffect, useState } from "react";
import axios from "axios";
import {
   ShieldCheck,
   Wallet,
   ArrowUpRight,
   ArrowDownRight,
   Clock,
   CheckCircle2,
   Search,
   Filter,
   DollarSign,
   TrendingUp,
   History,
   Lock,
   ArrowRight,
   Zap,
   Briefcase,
   ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function EscrowDashboard() {
   const [contracts, setContracts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [statusMessage, setStatusMessage] = useState(null);

   useEffect(() => {
      fetchContracts();
   }, []);

   const fetchContracts = async () => {
      try {
         setLoading(true);
         const res = await axios.get("/escrow");
         setContracts(res.data);
      } catch (err) {
         console.error("Escrow data sync error:", err);
      } finally {
         setLoading(false);
      }
   };

   if (loading) return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
            <Wallet className="w-6 h-6 text-zinc-300" />
         </motion.div>
         <p className="text-sm font-bold text-emerald-500">Loading payments...</p>
      </div>
   );

   return (
      <div className="space-y-8 pb-20">
         {/* 1. Dashboard Header */}
         <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-emerald-500">
                  <Zap size={10} fill="currentColor" />
                  <p className="text-xs font-bold text-emerald-500">Payments Online</p>
               </div>
               <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900 leading-none">Payments & Escrow</h1>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
               <Link to="/wallet/withdraw" className="flex-grow lg:flex-none">
                  <button className="w-full px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold active:scale-95 flex items-center justify-center gap-2 shadow-xl">
                     <ArrowUpRight size={16} /> Withdraw Funds
                  </button>
               </Link>
            </div>
         </header>

         {/* 2. Balance Summary Cards */}
         <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-500 rounded-[2rem] p-8 text-white space-y-6 shadow-xl shadow-emerald-500/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="space-y-1 relative z-10">
                  <p className="text-xs font-bold text-emerald-100">Available Balance</p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-bold tracking-tighter">$2,450</span>
                     <span className="text-xs font-bold text-emerald-100">USD</span>
                  </div>
               </div>
               <div className="pt-4 border-t border-white/10 relative z-10">
                  <p className="text-[10px] font-bold text-emerald-100 flex items-center gap-2">
                     <CheckCircle2 size={12} /> Verified Balance
                  </p>
               </div>
            </div>

            <div className="bg-zinc-900 rounded-[2rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden group">
               <div className="space-y-1 relative z-10">
                  <p className="text-xs font-bold text-zinc-500">Funds in Escrow</p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-bold tracking-tighter text-emerald-400">$1,800</span>
                     <span className="text-xs font-bold text-zinc-500">USD</span>
                  </div>
               </div>
               <div className="pt-4 border-t border-white/5 relative z-10">
                  <p className="text-[10px] font-bold text-zinc-500 flex items-center gap-2">
                     <Lock size={12} /> Currently locked in projects
                  </p>
               </div>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 space-y-6 shadow-sm group">
               <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-400">Total Earnings</p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-bold tracking-tighter text-zinc-900">$12,400</span>
                     <span className="text-xs font-bold text-zinc-400">USD</span>
                  </div>
               </div>
               <div className="pt-4 border-t border-zinc-50">
                  <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-2">
                     <TrendingUp size={12} /> +12% from last month
                  </p>
               </div>
            </div>
         </section>

         {/* 3. Transaction History */}
         <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <div className="w-1 h-4 bg-zinc-900 rounded-full" />
                  Transaction History
               </h3>
               <button className="text-[11px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors">
                  View All History
               </button>
            </div>

            <div className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm">
               {contracts.length > 0 ? (
                  <div className="divide-y divide-zinc-50">
                     {contracts.map((contract) => (
                        <div key={contract.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-50 transition-colors group">
                           <div className="flex items-center gap-5">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${contract.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                                 }`}>
                                 {contract.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-zinc-900 truncate max-w-[200px]">
                                    {contract.project?.title}
                                 </p>
                                 <p className="text-xs text-zinc-400 font-bold mt-1">
                                    {new Date(contract.createdAt).toLocaleDateString()} • {contract.status === 'COMPLETED' ? 'Funds Released' : 'Held in Escrow'}
                                 </p>
                              </div>
                           </div>

                           <div className="flex items-center justify-between md:justify-end gap-10">
                              <div className="text-right">
                                 <p className="text-xs font-bold text-zinc-400 mb-1">Project Amount</p>
                                 <p className="text-lg font-bold text-zinc-900 tracking-tighter">${contract.totalAmount?.toLocaleString()}</p>
                              </div>
                              <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-200 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all">
                                 <ChevronRight size={18} />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="py-24 text-center space-y-4">
                     <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-200">
                        <History size={24} />
                     </div>
                     <p className="text-sm font-bold text-zinc-300">No payment activity found</p>
                  </div>
               )}
            </div>
         </section>
      </div>
   );
}
