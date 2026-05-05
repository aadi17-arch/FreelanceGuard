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
   ChevronRight,
   Plus,
   X
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function EscrowDashboard() {
   const [contracts, setContracts] = useState([]);
   const [liveUser, setLiveUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [showFundForm, setShowFundForm] = useState(false);
   const [fundAmount, setFundAmount] = useState("");
   const [submittingFund, setSubmittingFund] = useState(false);
   const { user, refreshUser } = useAuth();

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

   const handleFundAction = async (e) => {
      e.preventDefault();
      const amountParsed = parseFloat(fundAmount);
      if (!fundAmount || isNaN(amountParsed) || amountParsed <= 0) {
         toast.error("Please enter a valid positive amount");
         return;
      }
      try {
         setSubmittingFund(true);
         const isClient = user?.role === "CLIENT";
         const endpoint = isClient ? "/escrow/add-funds" : "/escrow/withdraw";
         await axios.post(endpoint, { amount: amountParsed });
         
         toast.success(isClient 
            ? `Successfully deposited $${amountParsed.toLocaleString()} to your wallet.` 
            : `Successfully withdrew $${amountParsed.toLocaleString()} from your wallet.`
         );
         setFundAmount("");
         setShowFundForm(false);
         await fetchData();
         if (refreshUser) {
            await refreshUser();
         }
      } catch (err) {
         toast.error(err.response?.data?.message || "Operation failed.");
      } finally {
         setSubmittingFund(false);
      }
   };

   if (loading) return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
            <Zap className="w-5 h-5 text-[#10b981]" />
         </motion.div>
         <p className="text-xs font-bold text-[#666666]">Checking your balance...</p>
      </div>
   );

   return (
      <div className="space-y-8 pb-10">
          {/* 1. Slim Header with Interactive Forms */}
          <div className="space-y-4 pb-4">
             <div className="flex justify-end">
                <button
                   onClick={() => setShowFundForm(!showFundForm)}
                   className="px-5 py-2.5 bg-[#111111] hover:bg-zinc-800 text-white rounded-[10px] text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
                >
                   {user?.role === "CLIENT" ? (
                      <>
                         <Plus size={14} className="text-[#10b981]" /> Add Funds
                      </>
                   ) : (
                      <>
                         <ArrowUpRight size={14} className="text-[#10b981]" /> Withdraw Earnings
                      </>
                   )}
                </button>
             </div>

             <AnimatePresence>
                {showFundForm && (
                   <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                   >
                      <form 
                         onSubmit={handleFundAction} 
                         className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-5 max-w-md ml-auto space-y-4 shadow-sm"
                      >
                         <div className="flex justify-between items-center pb-2 border-b border-zinc-50">
                            <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                               {user?.role === "CLIENT" ? "Deposit Funds to Wallet" : "Withdraw Balance"}
                            </h4>
                            <button 
                               type="button" 
                               onClick={() => setShowFundForm(false)}
                               className="text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                               <X size={14} />
                            </button>
                         </div>
                         <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-[#666666]">Amount (USD)</label>
                            <div className="relative">
                               <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">$</span>
                               <input
                                  type="number"
                                  required
                                  min="1"
                                  step="any"
                                  placeholder="e.g. 500"
                                  value={fundAmount}
                                  onChange={(e) => setFundAmount(e.target.value)}
                                  className="w-full pl-7 pr-4 py-2 bg-[#ffffff] border border-[#e5e5e5] rounded-[8px] text-xs font-black text-zinc-900 focus:outline-none focus:border-[#10b981] transition-all"
                               />
                            </div>
                         </div>
                         <button
                            type="submit"
                            disabled={submittingFund}
                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[8px] text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
                         >
                            {submittingFund ? "Processing..." : (user?.role === "CLIENT" ? "Confirm Deposit" : "Confirm Withdrawal")}
                         </button>
                      </form>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

         {/* 2. Focused Balance Grid */}
         <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Main Balance */}
            <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] flex flex-col justify-between">
               <p className="text-[12px] font-bold text-[#666666] mb-1">Available balance</p>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[28px] font-black tracking-tighter text-[#111111]">${(liveUser || user)?.walletBalance?.toLocaleString() || "0"}</span>
                  <span className="text-[10px] font-bold text-[#666666]">USD</span>
               </div>
               <div className="mt-auto inline-flex self-start px-2 py-1 bg-[#f0fdf4] text-[#10b981] rounded-[20px] text-[10px] font-black">
                  Ready to use
               </div>
            </div>

            {/* Locked Funds */}
            <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] flex flex-col justify-between">
               <p className="text-[12px] font-bold text-[#666666] mb-1">In active projects</p>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[28px] font-black tracking-tighter text-[#111111]">${(liveUser || user)?.heldAmount?.toLocaleString() || "0"}</span>
                  <span className="text-[10px] font-bold text-[#666666]">USD</span>
               </div>
               <div className="mt-auto inline-flex self-start px-2 py-1 bg-[#fefce8] text-[#ca8a04] rounded-[20px] text-[10px] font-black">
                  Locked in project
               </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] flex flex-col justify-between">
               <p className="text-[12px] font-bold text-[#666666] mb-1">
                  {user?.role === "CLIENT" ? "Total spent" : "Total earned"}
               </p>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[28px] font-black tracking-tighter text-[#111111]">
                     ${user?.role === "CLIENT"
                        ? ((liveUser || user)?.totalSpent?.toLocaleString() || "0")
                        : ((liveUser || user)?.totalEarned?.toLocaleString() || "0")
                     }
                  </span>
                  <span className="text-[10px] font-bold text-[#666666]">USD</span>
               </div>
               <div className="mt-auto inline-flex self-start px-2 py-1 bg-[#f9f9f9] text-[#666666] rounded-[20px] text-[10px] font-black">
                  {user?.role === "CLIENT" ? "Lifetime investment" : "Lifetime earnings"}
               </div>
            </div>
         </section>

         {/* 3. Tight Activity Table */}
         <section className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] overflow-hidden">
            <div className="px-8 py-5 border-b border-[#e5e5e5] flex items-center justify-between bg-[#ffffff]">
               <h3 className="text-sm font-black text-[#111111] flex items-center gap-2">
                  <History size={16} className="text-[#666666]" /> Payment history
               </h3>
               <button className="text-xs font-bold text-[#666666] hover:text-[#111111] transition-colors">
                  Export
               </button>
            </div>

            <div className="divide-y divide-[#e5e5e5]">
               {contracts.length > 0 ? (
                  contracts.map((contract) => (
                     <div key={contract.id} className="px-8 py-5 flex items-center justify-between hover:bg-[#f9f9f9] transition-all group">
                        <div className="flex items-center gap-5">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${contract.status === 'COMPLETED' ? 'bg-[#f0fdf4] text-[#10b981]' : 'bg-[#f9f9f9] text-[#666666]'
                              }`}>
                              {contract.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                           </div>
                           <div>
                              <p className="text-sm font-black text-[#111111] tracking-tight truncate max-w-[200px]">
                                 {contract.project?.title}
                              </p>
                              <p className="text-xs font-bold text-[#666666] mt-1">
                                 {new Date(contract.createdAt).toLocaleDateString()} • {contract.status === 'COMPLETED' ? 'Money paid' : 'Safe in project'}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-10">
                           <div className="text-right hidden sm:block">
                              <p className="text-sm font-black text-[#111111] tracking-tighter">${contract.totalAmount?.toLocaleString()}</p>
                           </div>
                           <div className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#666666] group-hover:bg-[#111111] group-hover:text-white transition-all">
                              <ChevronRight size={14} />
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="py-10 text-center space-y-3">
                     <div className="text-[#666666]">
                        <History size={20} className="mx-auto" />
                     </div>
                     <p className="text-xs font-bold text-[#666666]">No transactions yet</p>
                  </div>
               )}
            </div>
         </section>
      </div>
   );
}
