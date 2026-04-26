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
  FileText,
  AlertTriangle
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
      {/* 1. Welcome Section: Clean & Minimal */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[var(--color-background-primary)] border border-[var(--color-border-tertiary)] rounded-[var(--border-radius-lg)] p-[18px] sm:p-[24px] relative overflow-hidden group">
           <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <h1 className="text-[20px] font-semibold text-[var(--color-text-primary)] leading-tight">Project Overview: {user?.name || "User"}</h1>
                <p className="text-[13px] text-[var(--color-text-secondary)] max-w-md">Access your active contracts and vault transactions through the secure management interface.</p>
              </div>
              <div className="flex gap-3">
                 <Link to={user?.role === 'CLIENT' ? '/create-project' : '/marketplace'}>
                    <button className="px-6 py-2.5 bg-rui-success hover:bg-rui-success/90 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
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
           <div className="absolute top-0 right-0 w-64 h-64 bg-rui-success/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-rui-success/10 transition-all duration-700"></div>
        </div>

        <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-tertiary)] rounded-[var(--border-radius-lg)] p-[18px] sm:p-[20px] flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
           <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-rui-success/10 text-rui-success">
                 <Wallet size={16} />
              </div>
              <span className="text-[10px] font-medium text-rui-success bg-rui-success/10 px-2.5 py-0.5 rounded-full">Protocol Verified</span>
           </div>
           <div className="mt-3">
              <p className="text-[11px] text-[var(--color-text-secondary)] font-medium uppercase tracking-[0.6px] mb-2">Available Capital</p>
              <p className="text-[24px] font-mono font-semibold text-[var(--color-text-primary)] tracking-[-0.5px]">
                ${user?.walletBalance?.toLocaleString() || "0.00"}
              </p>
           </div>
           <div className="mt-4 pt-3 border-t border-[var(--color-border-tertiary)] flex items-center justify-between">
              <span className="text-[11px] text-rui-success cursor-pointer">View Wallet →</span>
           </div>
        </div>
      </motion.section>

      {/* 2. Metric Grid: 4 Columns per the design */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Contracts", value: stats.activeProjects, icon: <FileText size={14} />, color: "text-rui-blue", bg: "bg-rui-blue/10" },
          { label: "Vault Balance", value: `$${stats.totalEscrow.toLocaleString()}`, icon: <ShieldCheck size={14} />, color: "text-rui-success", bg: "bg-rui-success/10" },
          { label: "Pending Approvals", value: stats.pendingMilestones, icon: <Clock size={14} />, color: "text-rui-warning", bg: "bg-rui-warning/10" },
          { label: "Open Disputes", value: 0, icon: <AlertTriangle size={14} />, color: "text-rui-danger", bg: "bg-rui-danger/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--color-background-primary)] border border-[var(--color-border-tertiary)] rounded-[var(--border-radius-lg)] p-[16px] sm:p-[18px]">
             <p className="text-[11px] text-[var(--color-text-secondary)] font-medium uppercase tracking-[0.6px] mb-2">{stat.label}</p>
             <p className="text-[22px] font-semibold text-[var(--color-text-primary)] tracking-[-0.5px] font-mono">{stat.value}</p>
          </div>
        ))}
      </motion.section>

      {/* 3. Activity & Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {/* Main Feed */}
         <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-1">
               <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">Live Protocol Feed</h3>
               <button className="text-[11px] text-rui-success hover:underline">View All →</button>
            </div>
            
            <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-tertiary)] rounded-[var(--border-radius-lg)] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
               {[1, 2, 3].map((item, index) => (
                 <div key={item} className={`p-[16px] flex items-center justify-between hover:bg-[var(--color-background-secondary)] transition-colors group cursor-pointer ${index !== 2 ? 'border-b border-[var(--color-border-tertiary)]' : ''}`}>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-md bg-rui-success/10 flex items-center justify-center text-rui-success shrink-0">
                          <CheckCircle2 size={14} />
                       </div>
                       <div>
                          <p className="text-[13px] font-medium text-[var(--color-text-primary)]">Milestone Payment Released</p>
                          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Project Alpha · <span className="font-mono">2 hours ago</span></p>
                       </div>
                    </div>
                    <ArrowUpRight size={14} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
                 </div>
               ))}
            </div>
         </motion.div>

         {/* Sidebar Stats */}
         <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] px-1">Compliance Status</h3>
            
            {!user?.kyc ? (
              /* Missing KYC Alert */
              <div className="bg-rui-warning/5 border border-rui-warning/20 rounded-[var(--border-radius-lg)] p-[18px] sm:p-[20px] space-y-4">
                 <div className="flex items-center gap-2.5">
                    <AlertTriangle className="text-rui-warning" size={16} />
                    <span className="text-[12px] font-medium text-rui-warning text-sm md:text-base font-medium leading-relaxed">Identity Verification Required</span>
                 </div>
                 <p className="text-[11px] text-rui-warning/80 leading-relaxed">
                    To access higher vault limits and secure larger contracts, please verify your identity.
                 </p>
                 <Link to="/kyc" className="block">
                    <button className="w-full py-2 bg-rui-warning text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rui-warning/90 transition-all">
                      Complete KYC
                    </button>
                 </Link>
              </div>
            ) : user?.kyc?.status === 'PENDING' ? (
              /* Pending KYC Alert */
              <div className="bg-rui-blue/5 border border-rui-blue/20 rounded-[var(--border-radius-lg)] p-[18px] sm:p-[20px] space-y-4">
                 <div className="flex items-center gap-2.5">
                    <Clock className="text-rui-blue" size={16} />
                    <span className="text-[12px] font-medium text-rui-blue">Verification In Progress</span>
                 </div>
                 <p className="text-[11px] text-rui-blue/80 leading-relaxed">
                    Our compliance team is reviewing your documents. This typically takes 24-48 hours.
                 </p>
                 <div className="w-full h-1.5 bg-rui-blue/10 rounded-full overflow-hidden">
                    <div className="h-full bg-rui-blue w-[60%] rounded-full animate-pulse"></div>
                 </div>
              </div>
            ) : (
              /* Approved KYC (Default) */
              <div className="bg-rui-success/5 border border-rui-success/20 rounded-[var(--border-radius-lg)] p-[18px] sm:p-[20px] space-y-4">
                 <div className="flex items-center gap-2.5">
                    <ShieldCheck className="text-rui-success" size={16} />
                    <span className="text-[12px] font-medium text-rui-success">Verified Account</span>
                 </div>
                 <p className="text-[12px] text-rui-success/80 leading-relaxed">
                    Your identity has been verified. You have full access to vault services.
                 </p>
                 <div className="pt-2 border-t border-rui-success/10">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] text-rui-success/70">Trust Score</span>
                      <span className="text-[10px] font-mono font-medium text-rui-success">9.8/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-rui-success/10 rounded-full overflow-hidden">
                       <div className="h-full bg-rui-success w-[98%] rounded-full"></div>
                    </div>
                 </div>
              </div>
            )}
         </motion.div>
      </div>
    </motion.div>
  );
}
