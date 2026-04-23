import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Wallet,
  ChevronRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalEscrow: 0,
    pendingMilestones: 0,
  });

  useEffect(() => {
    // Logic to fetch dashboard stats would go here
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      {/* 1. Welcome Section: Responsive & Scaled */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-rui-dark text-white rounded-2xl p-8 relative overflow-hidden group">
           <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rui-success">System Status: Active</p>
                <h1 className="text-2xl md:text-3xl font-bold !text-white leading-tight">Project Overview: {user?.name}</h1>
                <p className="text-xs md:text-sm text-gray-400 max-w-md">Access your active contracts and escrow transactions through the secure management interface.</p>
              </div>
              <div className="flex gap-3">
                 <Link to={user?.role === 'CLIENT' ? '/create-project' : '/marketplace'}>
                    <button className="px-6 py-2.5 bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
                      {user?.role === 'CLIENT' ? 'Post New Project' : 'Find Opportunities'}
                    </button>
                 </Link>
                 <Link to="/escrow">
                    <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
                      View Financials
                    </button>
                 </Link>
              </div>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#1D9E75]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#1D9E75]/20 transition-all duration-700"></div>
        </div>

        <div className="bg-white border border-rui-gray-border/50 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
           <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-[#E1F5EE] text-[#1D9E75]">
                 <Wallet size={18} />
              </div>
              <span className="text-[9px] font-black text-rui-success uppercase tracking-widest bg-rui-success/5 px-2 py-1 rounded">Protocol Verified</span>
           </div>
           <div className="mt-4">
              <p className="label-caps opacity-60 mb-1">Available Capital</p>
              <p className="text-3xl font-financial text-rui-dark tracking-tighter">
                ${user?.walletBalance?.toLocaleString() || "0.00"}
              </p>
           </div>
           <div className="mt-4 pt-4 border-t border-rui-gray-border/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-rui-gray-muted">View Wallet</span>
              <ChevronRight size={14} className="text-rui-gray-muted" />
           </div>
        </div>
      </motion.section>

      {/* 2. Metric Grid: Responsive Columns */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Active Contracts", value: stats.activeProjects, icon: <FileText size={16} />, color: "text-rui-blue", bg: "bg-rui-blue/5" },
          { label: "Escrow Balance", value: `$${stats.totalEscrow.toLocaleString()}`, icon: <ShieldCheck size={16} />, color: "text-rui-success", bg: "bg-rui-success/10" },
          { label: "Pending Approvals", value: stats.pendingMilestones, icon: <Clock size={16} />, color: "text-rui-warning", bg: "bg-rui-warning/5" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-rui-gray-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
             <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                   {stat.icon}
                </div>
                <div>
                   <p className="label-caps opacity-60 mb-0.5">{stat.label}</p>
                   <p className="text-xl font-bold tracking-tight text-rui-dark">{stat.value}</p>
                </div>
             </div>
          </div>
        ))}
      </motion.section>

      {/* 3. Activity & Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Feed */}
         <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
               <h3 className="label-caps !text-rui-dark">Live Protocol Feed</h3>
               <button className="text-[10px] font-black text-[#1D9E75] uppercase tracking-widest hover:underline">View All</button>
            </div>
            
            <div className="bg-white border border-rui-gray-border/50 rounded-2xl divide-y divide-rui-gray-border/10 shadow-sm">
               {[1, 2, 3].map((item) => (
                 <div key={item} className="p-6 flex items-center justify-between hover:bg-rui-light/30 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-rui-light flex items-center justify-center text-rui-gray-muted group-hover:bg-rui-success/10 group-hover:text-rui-success transition-all">
                          <CheckCircle2 size={16} />
                       </div>
                       <div>
                          <p className="text-[12px] font-bold text-rui-dark">Milestone Payment Released</p>
                          <p className="text-[10px] text-rui-gray-muted mt-0.5 font-medium uppercase tracking-tighter">Project Alpha • 2 hours ago</p>
                       </div>
                    </div>
                    <ArrowUpRight size={16} className="text-rui-gray-border group-hover:text-rui-dark transition-colors" />
                 </div>
               ))}
            </div>
         </motion.div>

         {/* Sidebar Stats */}
         <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="label-caps !text-rui-dark px-2">Compliance Status</h3>
            <div className="bg-rui-success/5 border border-rui-success/20 rounded-2xl p-6 space-y-6">
               <div className="flex items-center gap-3">
                  <ShieldCheck className="text-rui-success" size={18} />
                  <span className="text-[11px] font-black tracking-wider text-rui-success">Verified Account Status</span>
               </div>
               <p className="text-[11px] text-rui-success/80 leading-relaxed font-medium">
                  Your identity has been verified. You have full access to escrow services and contract management tools.
               </p>
               <div className="pt-2">
                  <div className="w-full h-1 bg-rui-success/10 rounded-full overflow-hidden">
                     <div className="h-full bg-rui-success w-[85%]"></div>
                  </div>
                  <p className="text-[9px] font-black text-rui-success mt-2 tracking-widest">Trust Score: 9.8</p>
               </div>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
}
