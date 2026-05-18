import React, { useEffect, useState } from "react";
import axios from "axios";
import {
   Wallet,
   ArrowUpRight,
   CheckCircle2,
   History,
   Plus,
   X,
   ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from '../../utils/toast';

export default function SafeHoldingDashboard() {
   const [contracts, setContracts] = useState([]);
   const [transactions, setTransactions] = useState([]);
   const [liveUser, setLiveUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [showFundForm, setShowFundForm] = useState(false);
   const [fundAmount, setFundAmount] = useState("");
   const [submittingFund, setSubmittingFund] = useState(false);
   const { user, refreshUser } = useAuth();

   useEffect(() => {
      if (user) {
         fetchData();
      }
   }, [user]);

   const fetchData = async () => {
      try {
         setLoading(true);
         const [contractsRes, profileRes, transactionsRes] = await Promise.all([
            axios.get("/escrow"),
            axios.get("/auth/profile"),
            axios.get("/escrow/transactions")
         ]);
         setContracts(contractsRes.data);
         setLiveUser(profileRes.data);
         setTransactions(transactionsRes.data);
      } catch (err) {
      } finally {
         setLoading(false);
      }
   };

   const handleFundAction = async (e) => {
      e.preventDefault();
      const amountParsed = parseFloat(fundAmount);
      if (!fundAmount || isNaN(amountParsed) || amountParsed <= 0) {
         toast.error("Please enter a valid amount");
         return;
      }
      try {
         setSubmittingFund(true);
         const isClient = user?.role === "CLIENT";
         const endpoint = isClient ? "/escrow/add-funds" : "/escrow/withdraw";
         await axios.post(endpoint, { amount: amountParsed });

         toast.success(isClient
            ? `Successfully added $${amountParsed.toLocaleString()} to your wallet.`
            : `Successfully requested withdrawal of $${amountParsed.toLocaleString()}.`
         );
         setFundAmount("");
         setShowFundForm(false);
         await fetchData();
         if (refreshUser) {
            await refreshUser();
         }
      } catch (err) {
         toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      } finally {
         setSubmittingFund(false);
      }
   };

   if (loading) return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
         <Wallet className="w-5 h-5 text-emerald-500" />
         <p className="text-xs font-bold text-zinc-400">Loading your wallet...</p>
      </div>
   );

   return (
      <div className="space-y-8 pb-10">
          <div className="space-y-4 pb-4">
             <div className="flex justify-end">
                <button
                   onClick={() => setShowFundForm(!showFundForm)}
                   className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                   {user?.role === "CLIENT" ? (
                      <>
                         <Plus size={14} className="text-emerald-500" /> Add to wallet
                      </>
                   ) : (
                      <>
                         <ArrowUpRight size={14} className="text-emerald-500" /> Withdraw
                      </>
                   )}
                </button>
             </div>

             {showFundForm && (
                <div className="overflow-hidden">
                   <form
                      onSubmit={handleFundAction}
                      className="bg-white border border-zinc-200 rounded-xl p-6 max-w-md ml-auto space-y-4 shadow-sm"
                   >
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-50">
                         <h4 className="text-xs font-bold text-zinc-900">
                            {user?.role === "CLIENT" ? "Add funds to your wallet" : "Withdraw to your bank"}
                         </h4>
                         <button
                            type="button"
                            onClick={() => setShowFundForm(false)}
                            className="text-zinc-400 hover:text-zinc-900"
                         >
                            <X size={14} />
                         </button>
                      </div>
                      <div className="space-y-1.5">
                         <label className="block text-[10px] font-bold text-zinc-500">Amount (USD)</label>
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
                               className="w-full pl-7 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 focus:outline-none focus:border-emerald-500 transition-all"
                            />
                         </div>
                      </div>
                      <button
                         type="submit"
                         disabled={submittingFund}
                         className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                      >
                         {submittingFund ? "Processing..." : "Confirm"}
                      </button>
                   </form>
                </div>
             )}
          </div>

         <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            { user?.role ==="CLIENT" &&
               <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col justify-between">
               <p className="text-xs font-bold text-zinc-500 mb-1">Available balance</p>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[28px] font-bold tracking-tight text-zinc-900">${(liveUser || user)?.walletBalance?.toLocaleString() || "0"}</span>
                  <span className="text-[10px] font-bold text-zinc-400">USD</span>
               </div>
               <div className="mt-auto inline-flex self-start px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                  Ready to use
               </div>
            </div>}
            <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col justify-between">
               <p className="text-xs font-bold text-zinc-500 mb-1">
                  {user?.role === "CLIENT" ? "Total spent" : "Total earned"}
               </p>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[28px] font-bold tracking-tight text-zinc-900">
                     ${user?.role === "CLIENT"
                        ? ((liveUser || user)?.totalSpent?.toLocaleString() || "0")
                        : ((liveUser || user)?.totalEarned?.toLocaleString() || "0")
                     }
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">USD</span>
               </div>
               <div className="mt-auto inline-flex self-start px-3 py-1 bg-zinc-50 text-zinc-500 rounded-full text-[10px] font-bold">
                  {user?.role === "CLIENT" ? "Lifetime spent" : "Lifetime earnings"}
               </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col justify-between">
               <p className="text-xs font-bold text-zinc-500 mb-1">
                  {user?.role === "CLIENT"?"Held in projects" :"Locked in vault"}
               </p>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[28px] font-bold tracking-tight text-zinc-900">${(liveUser || user)?.heldAmount?.toLocaleString() || "0"}</span>
                  <span className="text-[10px] font-bold text-zinc-400">USD</span>
               </div>
               <div className="mt-auto inline-flex self-start px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold">
                  Secured in holding
               </div>
            </div>

         </section>

         <section className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between">
               <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <History size={16} className="text-zinc-400" /> Your payments
               </h3>
               <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">
                  Export
               </button>
            </div>

            <div className="divide-y divide-zinc-100">
               {transactions.length > 0 ? (
                  transactions.map((tx) => {
                      const isIncoming = 
                         (user?.role === "FREELANCER" && (tx.type === "RELEASE" || tx.type === "DEPOSIT")) ||
                         (user?.role === "CLIENT" && tx.type === "REFUND");
                      const displayTitle = tx.type === "DEPOSIT"
                         ? "Escrow Lock"
                         : tx.type === "WITHDRAWAL"
                         ? "Withdrawn to bank"
                         : tx.contract?.project?.title || tx.milestone?.title || "Project payment";

                      return (
                         <div key={tx.id} className="px-8 py-5 flex items-center justify-between hover:bg-zinc-50 transition-all group">
                            <div className="flex items-center gap-5">
                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isIncoming ? "bg-emerald-50 text-emerald-600" : "bg-zinc-50 text-zinc-400"}`}>
                                  {tx.type === "DEPOSIT" ? (
                                     <Plus size={16} />
                                  ) : tx.type === "WITHDRAWAL" ? (
                                     <ArrowUpRight size={16} />
                                  ) : tx.type === "RELEASE" ? (
                                     <CheckCircle2 size={16} />
                                  ) : (
                                     <Wallet size={16} />
                                  )}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-zinc-900 tracking-tight truncate max-w-[200px]">
                                     {displayTitle}
                                  </p>
                                  <p className="text-xs font-medium text-zinc-400 mt-1">
                                     {new Date(tx.createdAt).toLocaleDateString()} • {tx.type === 'RELEASE' ? 'Payment' : tx.type.toLowerCase()}
                                  </p>
                               </div>
                            </div>

                            <div className="flex items-center gap-10">
                               <div className="text-right hidden sm:block">
                                  <p className={`text-sm font-bold tracking-tight ${isIncoming ? "text-emerald-600" : "text-zinc-900"}`}>
                                     {isIncoming ? "+" : "-"}${tx.amount?.toLocaleString()}
                                  </p>
                               </div>
                               <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                  <ChevronRight size={14} />
                               </div>
                            </div>
                         </div>
                      );
                  })
               ) : (
                  <div className="py-12 text-center space-y-3">
                     <div className="text-zinc-200">
                        <History size={24} className="mx-auto" />
                     </div>
                     <p className="text-xs font-bold text-zinc-400">No payment history yet</p>
                  </div>
               )}
            </div>
         </section>
      </div>
   );
}
