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
      pendingMilestones: 0,
      openDisputes: 0
   });
   const [recentActivity, setRecentActivity] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (user) {
         fetchDashboardStats();
      }
   }, [user]);

   const fetchDashboardStats = async () => {
      try {
         setLoading(true);
         const res = await axios.get("/projects/stats");
         const { activeProjects, pendingMilestones, openDisputes, breakdown } = res.data;

         setStats({
            activeProjects: activeProjects || 0,
            pendingMilestones: pendingMilestones || 0,
            openDisputes: openDisputes || 0
         });
         setRecentActivity(breakdown || []);
      } catch (err) {
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-4 pb-4">
         <section className="grid grid-cols-1 gap-4">
            <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] p-6 relative overflow-hidden group">
               <div className="relative z-10 space-y-4">
                  <div className="space-y-2">
                     <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[#111111]">Hello, {user?.name?.split(' ')[0]}!</h1>
                     <p className="text-sm lg:text-base text-[#666666] font-medium max-w-sm leading-relaxed">
                        Manage your active commitments and track project milestones through this dashboard.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                     <Link to={user?.role === 'CLIENT' ? '/create-project' : '/marketplace'} className="w-full sm:w-auto">
                        <button className="w-full px-6 py-3 bg-[#10b981] border border-[#10b981] text-white rounded-[10px] text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2">
                           {user?.role === 'CLIENT' ? 'Post new project' : 'Find jobs'}
                        </button>
                     </Link>
                     <Link to="/contracts" className="w-full sm:w-auto">
                        <button className="w-full px-6 py-3 bg-white text-[#111111] border border-[#e5e5e5] rounded-[10px] text-sm font-bold transition-all flex items-center justify-center">
                           My active deals
                        </button>
                     </Link>
                  </div>
               </div>
            </div>
         </section>

         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
               { label: "Active contracts", subtitle: "Successfully in progress", value: stats.activeProjects || 0, icon: <BriefcaseBusiness /> },
               { label: "Pending milestones", subtitle: "Awaiting your action", value: stats.pendingMilestones || 0, icon: <Clock /> },
               { label: "Open disputes", subtitle: "Needs resolution", value: stats.openDisputes || 0, icon: <AlertTriangle /> },
            ].map((stat, i) => (
               <div key={i} className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] flex items-center gap-4 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-50 text-[#10b981] shrink-0">
                     {React.cloneElement(stat.icon, { size: 18 })}
                  </div>
                  <div>
                     <p className="text-[28px] font-black text-[#111111] tracking-tighter leading-none mb-1">{stat.value}</p>
                     <p className="text-[12px] font-bold text-[#666666] leading-none">{stat.label}</p>
                  </div>
               </div>
            ))}
         </section>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
               <h3 className="text-sm font-black text-[#111111] flex items-center gap-2 px-1">
                  <div className="w-1 h-4 bg-[#10b981] rounded-full" />
                  Recent activity
               </h3>

               <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] overflow-hidden shadow-sm">
                  {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                     <div key={item.id} className={`p-[20px] flex items-center justify-between hover:bg-zinc-50 transition-all group cursor-pointer ${index !== recentActivity.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-lg bg-zinc-50 text-[#666666] flex items-center justify-center shrink-0">
                              <LockKeyhole size={16} />
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-bold text-[#111111] truncate">
                                 Update on {item.project?.title}
                              </p>
                              <p className="text-xs text-[#666666] font-medium mt-1">
                                 {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-[#e5e5e5] group-hover:text-[#111111] transition-all" />
                     </div>
                  )) : (
                     <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                        <div className="text-[#666666]">
                           <FileText size={20} />
                        </div>
                        <p className="text-xs font-bold text-[#666666]">Start by exploring the marketplace or creating your first project</p>
                     </div>
                  )}
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-black text-[#111111] flex items-center gap-2 px-1">
                  <div className="w-1 h-4 bg-[#10b981] rounded-full" />
                  Account status
               </h3>

               {!user?.kyc ? (
                  <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] space-y-4">
                     <div className="space-y-2">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-600">
                           <AlertTriangle size={18} />
                        </div>
                        <h4 className="text-sm font-black text-[#ef4444]">Action required</h4>
                        <p className="text-xs text-[#666666] font-medium leading-relaxed">
                           Please verify your account to unlock all payment features.
                        </p>
                     </div>
                     <Link to="/kyc" className="block">
                        <button className="w-full py-3 bg-[#111111] text-white rounded-[10px] text-xs font-bold active:scale-95 transition-all">
                           Start verification
                        </button>
                     </Link>
                  </div>
               ) : user?.kyc?.status === 'PENDING' ? (
                  <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] space-y-4">
                     <div className="space-y-2">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-600">
                           <Clock size={18} className="animate-pulse" />
                        </div>
                        <h4 className="text-sm font-black text-[#111111]">Account review</h4>
                        <p className="text-xs text-[#666666] font-medium leading-relaxed">
                           We are currently reviewing your account and verification documents.
                        </p>
                     </div>
                  </div>
               ) : (
                  <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-50 text-zinc-600 rounded-lg flex items-center justify-center">
                           <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                           <h4 className="text-sm font-black text-[#111111] mb-1">Verified account</h4>
                           <p className="text-xs text-[#666666] font-medium">
                              Reliability score: 98%
                           </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-[#e5e5e5] space-y-3">
                         <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-[#666666]">Account health</span>
                            <span className="text-[#10b981]">Excellent</span>
                         </div>
                         <div className="h-1 w-full bg-[#e5e5e5] rounded-full overflow-hidden">
                            <div className="h-full bg-[#10b981] w-[98%] rounded-full shadow-[0_0_8px_#10b981]" />
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </div>
       </div>
    );
}
