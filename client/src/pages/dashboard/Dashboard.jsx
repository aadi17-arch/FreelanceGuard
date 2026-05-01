import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Wallet,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  LockKeyhole,
  Zap,
  BriefcaseBusiness
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalEscrow: 0,
    pendingMilestones: 0,
    openDisputes: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/escrow");
      const contracts = res.data || [];
      
      const totalSecured = contracts.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
      const active = contracts.filter(c => c.status !== 'COMPLETED').length;
      const pending = contracts.filter(c => c.status === 'PENDING').length;
      const disputed = contracts.filter(c => c.status === 'DISPUTED').length;

      setStats({
        activeProjects: active,
        totalEscrow: totalSecured,
        pendingMilestones: pending,
        openDisputes: disputed
      });
      setRecentActivity(contracts.slice(0, 4));
    } catch (err) {
      console.error("Dashboard sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 lg:space-y-12 pb-20">
      {/* 1. Welcome & Primary Balance */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 rounded-[2rem] p-8 lg:p-12 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                   <Zap size={14} fill="currentColor" />
                   <p className="text-xs font-bold uppercase tracking-widest">Everything is up to date</p>
                </div>
                <h1 className="text-3xl lg:text-6xl font-black tracking-tight">Hi, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-base lg:text-lg text-zinc-400 font-medium max-w-sm leading-relaxed">
                   Here is what's happening with your work and payments today.
                </p>
              </div>
              <div className="flex gap-4">
                 <Link to={user?.role === 'CLIENT' ? '/create-project' : '/marketplace'}>
                    <button className="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-sm font-bold uppercase tracking-widest transition-all active:scale-95 hover:bg-emerald-400 flex items-center gap-2">
                      {user?.role === 'CLIENT' ? 'Post a Project' : 'Find New Work'}
                      <ArrowUpRight size={18} />
                    </button>
                 </Link>
                 <Link to="/escrow">
                    <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl text-sm font-bold uppercase tracking-widest backdrop-blur-md hover:bg-white/10">
                      My Payments
                    </button>
                 </Link>
              </div>
           </div>
        </div>

        <div className="bg-white border-2 border-zinc-100 rounded-[2rem] p-8 flex flex-col justify-between shadow-xl shadow-zinc-100/50">
           <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl">
                 <Wallet size={20} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full uppercase tracking-widest">Active</span>
           </div>
           <div className="mt-8">
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-2">Available Balance</p>
              <p className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter">
                ${user?.walletBalance?.toLocaleString() || "0.00"}
              </p>
           </div>
           <div className="mt-8 pt-6 border-t border-zinc-50">
              <button className="text-xs font-bold text-zinc-900 uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center gap-2">
                 View History <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </section>

      {/* 2. Key Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Projects", value: stats.activeProjects, icon: <BriefcaseBusiness />, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total Funds", value: `$${stats.totalEscrow.toLocaleString()}`, icon: <ShieldCheck />, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Pending Tasks", value: stats.pendingMilestones, icon: <Clock />, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Issues", value: stats.openDisputes, icon: <AlertTriangle />, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border-2 border-zinc-50 rounded-3xl p-6 lg:p-8 space-y-4 hover:border-zinc-100 transition-all shadow-sm">
             <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                {React.cloneElement(stat.icon, { size: 20 })}
             </div>
             <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-black text-zinc-900 tracking-tighter">{stat.value}</p>
             </div>
          </div>
        ))}
      </section>

      {/* 3. Activity & Safety */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-3 px-2">
               <div className="w-1.5 h-6 bg-zinc-900 rounded-full" />
               Recent Activity
            </h3>
            
            <div className="bg-white border-2 border-zinc-100 rounded-[2.5rem] overflow-hidden">
               {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                 <div key={item.id} className={`p-6 flex items-center justify-between hover:bg-zinc-50 transition-all group cursor-pointer ${index !== recentActivity.length - 1 ? 'border-b border-zinc-50' : ''}`}>
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-emerald-500 flex items-center justify-center shrink-0">
                          <LockKeyhole size={20} />
                       </div>
                       <div className="min-w-0">
                          <p className="text-base font-bold text-zinc-900 truncate">
                            Update: {item.project?.title}
                          </p>
                          <p className="text-xs text-zinc-400 font-medium mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-zinc-200 group-hover:text-zinc-900 transition-all" />
                 </div>
               )) : (
                <div className="py-24 text-center space-y-4">
                   <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-200">
                      <FileText size={24} />
                   </div>
                   <p className="text-sm font-bold text-zinc-300 uppercase tracking-widest">No activity yet</p>
                </div>
               )}
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-3 px-2">
               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
               Security
            </h3>
            
            {!user?.kyc ? (
              <div className="bg-rose-500 rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl shadow-rose-500/20">
                 <div className="space-y-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                       <AlertTriangle size={24} />
                    </div>
                    <h4 className="text-xl font-black">Identity Check</h4>
                    <p className="text-sm text-rose-100 font-medium leading-relaxed">
                       Please verify your identity to unlock all features and start working.
                    </p>
                 </div>
                 <Link to="/kyc" className="block">
                    <button className="w-full py-4 bg-white text-rose-600 rounded-2xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-black/10">
                       Start Verification
                    </button>
                 </Link>
              </div>
            ) : user?.kyc?.status === 'PENDING' ? (
              <div className="bg-amber-500 rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl shadow-amber-500/20">
                 <div className="space-y-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                       <Clock size={24} className="animate-pulse" />
                    </div>
                    <h4 className="text-xl font-black">Checking Identity</h4>
                    <p className="text-sm text-amber-50 font-medium leading-relaxed">
                       Our team is reviewing your documents. This usually takes less than 24 hours.
                    </p>
                 </div>
                 <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="h-full bg-white w-1/3 rounded-full" />
                 </div>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl group">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                       <ShieldCheck size={24} />
                    </div>
                    <div className="min-w-0">
                       <h4 className="text-lg font-black uppercase tracking-tight">Verified</h4>
                       <p className="text-xs text-zinc-500 font-bold tracking-widest">
                          TRUST SCORE: 98%
                       </p>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
                       <span>Security Health</span>
                       <span className="text-emerald-400">Excellent</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[98%] rounded-full shadow-[0_0_12px_#10b981]" />
                    </div>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
