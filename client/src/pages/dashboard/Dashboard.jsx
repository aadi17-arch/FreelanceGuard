import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
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
    <div className="space-y-6 lg:space-y-10 pb-16 max-w-6xl mx-auto">
      {/* 1. Welcome & Primary Balance */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl lg:rounded-[2rem] p-6 lg:p-10 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 space-y-6 lg:space-y-8">
              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                   <Zap size={14} fill="currentColor" />
                   <p className="text-[10px] font-bold uppercase tracking-widest">System Synchronized</p>
                </div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Hi, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-sm lg:text-base text-zinc-400 font-medium max-w-sm leading-relaxed">
                   Monitor your active projects and track your escrow payments in real-time.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                 <Link to={user?.role === 'CLIENT' ? '/create-project' : '/marketplace'}>
                    <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 hover:bg-emerald-400 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                      {user?.role === 'CLIENT' ? 'Post Project' : 'Find Jobs'}
                      <ArrowUpRight size={16} />
                    </button>
                 </Link>
                 <Link to="/escrow">
                    <button className="px-6 py-3 bg-white/5 text-white border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest backdrop-blur-md hover:bg-white/10">
                      View Vault
                    </button>
                 </Link>
              </div>
           </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between shadow-sm">
           <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-emerald-500 shadow-md">
                 <Wallet size={18} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">Online</span>
           </div>
           <div className="mt-6 lg:mt-8">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Wallet Balance</p>
              <p className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tighter">
                ${user?.walletBalance?.toLocaleString() || "0.00"}
              </p>
           </div>
           <div className="mt-6 lg:mt-8 pt-4 border-t border-zinc-50">
              <button className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center gap-2">
                 Financial History <ChevronRight size={12} />
              </button>
           </div>
        </div>
      </section>

      {/* 2. Key Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: "Active Jobs", value: stats.activeProjects, icon: <BriefcaseBusiness />, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total Escrow", value: `$${stats.totalEscrow.toLocaleString()}`, icon: <Shield />, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Pending Tasks", value: stats.pendingMilestones, icon: <Clock />, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Open Issues", value: stats.openDisputes, icon: <AlertTriangle />, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-5 lg:p-6 space-y-3 hover:shadow-md transition-all">
             <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                {React.cloneElement(stat.icon, { size: 18 })}
             </div>
             <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-xl lg:text-2xl font-black text-zinc-900 tracking-tighter">{stat.value}</p>
             </div>
          </div>
        ))}
      </section>

      {/* 3. Activity & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
         <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2 px-1">
               <div className="w-1 h-4 bg-zinc-900 rounded-full" />
               Recent Activity Log
            </h3>
            
            <div className="bg-white border border-zinc-100 rounded-2xl lg:rounded-[1.5rem] overflow-hidden shadow-sm">
               {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                 <div key={item.id} className={`p-5 lg:p-6 flex items-center justify-between hover:bg-zinc-50 transition-all group cursor-pointer ${index !== recentActivity.length - 1 ? 'border-b border-zinc-50' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-zinc-900 text-emerald-500 flex items-center justify-center shrink-0">
                          <LockKeyhole size={16} />
                       </div>
                       <div className="min-w-0">
                          <p className="text-sm font-bold text-zinc-900 truncate">
                            Update: {item.project?.title}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-wider">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-200 group-hover:text-zinc-900 transition-all" />
                 </div>
               )) : (
                <div className="py-20 text-center space-y-4">
                   <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-200">
                      <FileText size={20} />
                   </div>
                   <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Activity Feed Clear</p>
                </div>
               )}
            </div>
         </div>

         <div className="space-y-4 lg:space-y-6">
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2 px-1">
               <div className="w-1 h-4 bg-emerald-500 rounded-full" />
               Security Status
            </h3>
            
            {!user?.kyc ? (
              <div className="bg-rose-500 rounded-2xl lg:rounded-[1.5rem] p-8 lg:p-10 text-white space-y-6 shadow-xl shadow-rose-500/10">
                 <div className="space-y-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xl">
                       <AlertTriangle size={20} />
                    </div>
                    <h4 className="text-lg font-black tracking-tight">Verify Identity</h4>
                    <p className="text-xs text-rose-100 font-medium leading-relaxed">
                       Please complete your identity check to enable withdrawals.
                    </p>
                 </div>
                 <Link to="/kyc" className="block">
                    <button className="w-full py-3.5 bg-white text-rose-600 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all shadow-md">
                       Start Now
                    </button>
                 </Link>
              </div>
            ) : user?.kyc?.status === 'PENDING' ? (
              <div className="bg-amber-500 rounded-2xl lg:rounded-[1.5rem] p-8 lg:p-10 text-white space-y-6 shadow-xl shadow-amber-500/10">
                 <div className="space-y-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                       <Clock size={20} className="animate-pulse" />
                    </div>
                    <h4 className="text-lg font-black tracking-tight">Audit in Progress</h4>
                    <p className="text-xs text-amber-50 font-medium leading-relaxed">
                       We are currently reviewing your profile security.
                    </p>
                 </div>
                 <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="h-full bg-white w-1/3 rounded-full" />
                 </div>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-2xl lg:rounded-[1.5rem] p-8 lg:p-10 text-white space-y-6 shadow-xl group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                       <Shield size={20} />
                    </div>
                    <div className="min-w-0">
                       <h4 className="text-base font-black uppercase tracking-tight leading-none mb-1">Verified</h4>
                       <p className="text-[9px] text-zinc-500 font-bold tracking-widest">
                          TRUST SCORE: 98%
                       </p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                       <span>Health</span>
                       <span className="text-emerald-400">Optimal</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[98%] rounded-full shadow-[0_0_8px_#10b981]" />
                    </div>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
