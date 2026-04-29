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
  Fingerprint,
  Zap
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
    <div className="space-y-6 lg:space-y-12 pb-20">
      {/* 1. Scaled Welcome & Guidance */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 bg-zinc-900 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-12 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                   <Zap size={12} fill="currentColor" />
                   <p className="text-[8px] font-black uppercase tracking-[0.3em]">Status: Active</p>
                </div>
                <h1 className="text-2xl lg:text-5xl font-black tracking-tighter">Welcome, {user?.name?.split(' ')[0]}</h1>
                <p className="text-[10px] lg:text-xs text-zinc-400 font-medium max-w-sm leading-relaxed uppercase tracking-wider">
                   Your project command center is synchronized.
                </p>
              </div>
              <div className="flex gap-3">
                 <Link to={user?.role === 'CLIENT' ? '/create-project' : '/marketplace'}>
                    <button className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95">
                      {user?.role === 'CLIENT' ? 'New Mission' : 'Find Work'}
                    </button>
                 </Link>
                 <Link to="/escrow">
                    <button className="px-5 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                      Vault
                    </button>
                 </Link>
              </div>
           </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 flex flex-col justify-between shadow-sm">
           <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-emerald-500 shadow-lg">
                 <Wallet size={16} />
              </div>
              <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg uppercase tracking-widest">Live</span>
           </div>
           <div className="mt-6 lg:mt-8">
              <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-1">Primary Wallet</p>
              <p className="text-2xl lg:text-4xl font-black text-zinc-900 tracking-tighter font-mono">
                ${user?.walletBalance?.toLocaleString() || "0.00"}
              </p>
           </div>
           <div className="mt-6 pt-4 border-t border-zinc-50">
              <button className="text-[9px] font-black text-zinc-900 uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center gap-2">
                 Financial Audit <ChevronRight size={12} />
              </button>
           </div>
        </div>
      </section>

      {/* 2. Scaled Metric Hub */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {[
          { label: "Active Nodes", value: stats.activeProjects, icon: <FileText />, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Vault Value", value: `$${stats.totalEscrow.toLocaleString()}`, icon: <ShieldCheck />, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Pending", value: stats.pendingMilestones, icon: <Clock />, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Alerts", value: stats.openDisputes, icon: <AlertTriangle />, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-4 lg:p-8 space-y-3 shadow-sm group">
             <div className={`w-8 h-8 lg:w-10 lg:h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                {React.cloneElement(stat.icon, { size: 14 })}
             </div>
             <div>
                <p className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-0.5">{stat.label}</p>
                <p className="text-lg lg:text-2xl font-black text-zinc-900 tracking-tighter font-mono">{stat.value}</p>
             </div>
          </div>
        ))}
      </section>

      {/* 3. Scaled Activity & Security Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
         <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2 px-1">
               <div className="w-1 h-4 bg-zinc-900 rounded-full" />
               Real-time Ledger
            </h3>
            
            <div className="bg-white border border-zinc-100 rounded-2xl lg:rounded-[2.5rem] shadow-sm overflow-hidden">
               {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                 <div key={item.id} className={`p-4 lg:p-6 flex items-center justify-between hover:bg-zinc-50 transition-all group cursor-pointer ${index !== recentActivity.length - 1 ? 'border-b border-zinc-50' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-zinc-900 text-emerald-500 flex items-center justify-center shrink-0">
                          <Fingerprint size={14} />
                       </div>
                       <div className="min-w-0">
                          <p className="text-[11px] lg:text-[13px] font-black text-zinc-900 uppercase tracking-tight truncate leading-none">
                            Sync: {item.project?.title}
                          </p>
                          <p className="text-[8px] text-zinc-300 font-bold uppercase tracking-[0.2em] mt-1.5">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-200 group-hover:text-zinc-900" />
                 </div>
               )) : (
                <div className="py-20 text-center space-y-3">
                   <Clock size={24} className="mx-auto text-zinc-100" />
                   <p className="text-[8px] font-black text-zinc-200 uppercase tracking-[0.3em]">No activity logged</p>
                </div>
               )}
            </div>
         </div>

         <div className="space-y-4 lg:space-y-6">
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2 px-1">
               <div className="w-1 h-4 bg-emerald-500 rounded-full" />
               Compliance
            </h3>
            
            {!user?.kyc ? (
              <div className="bg-rose-500 rounded-2xl lg:rounded-[2.5rem] p-8 lg:p-10 text-white space-y-6 shadow-xl shadow-rose-500/10">
                 <div className="space-y-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xl">
                       <AlertTriangle size={20} />
                    </div>
                    <h4 className="text-base font-black uppercase tracking-tighter">Security Alert</h4>
                    <p className="text-[9px] text-rose-100 font-bold uppercase tracking-[0.15em] leading-relaxed">
                       Identity verification required.
                    </p>
                 </div>
                 <Link to="/kyc" className="block">
                    <button className="w-full py-3.5 bg-white text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">
                      Verify Node
                    </button>
                 </Link>
              </div>
            ) : user?.kyc?.status === 'PENDING' ? (
              <div className="bg-amber-500 rounded-2xl p-8 text-white space-y-6 shadow-xl shadow-amber-500/10">
                 <div className="space-y-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                       <Clock size={20} className="animate-pulse" />
                    </div>
                    <h4 className="text-base font-black uppercase tracking-tighter">Audit Pending</h4>
                 </div>
                 <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="h-full bg-white w-1/3 rounded-full" />
                 </div>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-2xl lg:rounded-[2.5rem] p-8 lg:p-10 text-white space-y-6 shadow-xl group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                       <ShieldCheck size={20} />
                    </div>
                    <div className="min-w-0">
                       <h4 className="text-sm font-black uppercase tracking-tighter">Verified</h4>
                       <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.15em] leading-relaxed">
                          Institutional-grade trust.
                       </p>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                       <span>Score</span>
                       <span className="text-emerald-400">9.8</span>
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
