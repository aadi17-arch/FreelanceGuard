import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { 
  ShieldCheck as ShieldIcon, 
  BriefcaseBusiness as CaseIcon, 
  Clock as ClockIcon, 
  AlertTriangle as AlertIcon,
  LockKeyhole as LockIcon,
  ChevronRight as ChevronIcon,
  FileText as FileIcon
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
            <div className="bg-zinc-50 border border-zinc-200 rounded-[10px] p-6 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <div className="space-y-2">
                     <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900">Hello, {user?.name?.split(' ')[0]}!</h1>
                     <p className="text-sm lg:text-base text-zinc-500 font-medium max-w-sm leading-relaxed">
                        Track your work, manage milestones, and see your payments in one place.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                     <Link to={user?.role === 'CLIENT' ? '/create-project' : '/marketplace'} className="w-full sm:w-auto">
                        <button className="w-full px-6 py-3 bg-emerald-600 border border-emerald-600 text-white rounded-[10px] text-sm font-bold transition-all hover:bg-emerald-700 flex items-center justify-center gap-2">
                           {user?.role === 'CLIENT' ? 'Create new project' : 'Find work'}
                        </button>
                     </Link>
                     <Link to="/contracts" className="w-full sm:w-auto">
                        <button className="w-full px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-[10px] text-sm font-bold transition-all hover:bg-zinc-50 flex items-center justify-center">
                           Active projects
                        </button>
                     </Link>
                  </div>
               </div>
            </div>
         </section>

         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
               { label: "Active projects", value: stats.activeProjects || 0, icon: <CaseIcon /> },
               { label: "Pending milestones", value: stats.pendingMilestones || 0, icon: <ClockIcon /> },
               { label: "Open cases", value: stats.openDisputes || 0, icon: <AlertIcon /> },
            ].map((stat, i) => (
               <div key={i} className="bg-white border border-zinc-200 rounded-[10px] p-[20px] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-50 text-emerald-600 shrink-0">
                     {React.cloneElement(stat.icon, { size: 18 })}
                  </div>
                  <div>
                     <p className="text-[28px] font-bold text-zinc-900 tracking-tighter leading-none mb-1">{stat.value}</p>
                     <p className="text-[12px] font-bold text-zinc-500 leading-none">{stat.label}</p>
                  </div>
               </div>
            ))}
         </section>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
               <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 px-1">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  What's happening
               </h3>

               <div className="bg-white border border-zinc-200 rounded-[10px] overflow-hidden">
                  {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                     <div key={item.id} className={`p-[20px] flex items-center justify-between hover:bg-zinc-50 transition-all group cursor-pointer ${index !== recentActivity.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-lg bg-zinc-50 text-zinc-400 flex items-center justify-center shrink-0">
                              <LockIcon size={16} />
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-bold text-zinc-900 truncate">
                                 Update on {item.project?.title}
                              </p>
                              <p className="text-xs text-zinc-400 font-medium mt-1">
                                 {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <ChevronIcon size={16} className="text-zinc-200 group-hover:text-zinc-900 transition-all" />
                     </div>
                  )) : (
                     <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                        <div className="text-zinc-300">
                           <FileIcon size={24} />
                        </div>
                        <p className="text-xs font-bold text-zinc-400">No recent activity to show yet.</p>
                     </div>
                  )}
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 px-1">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  Your account
               </h3>

               {!user?.kyc ? (
                  <div className="bg-white border border-zinc-200 rounded-[10px] p-[20px] space-y-4">
                     <div className="space-y-2">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-rose-500">
                           <AlertIcon size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-rose-600">Action required</h4>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                           Verify your identity to unlock safe holding and secure payments.
                        </p>
                     </div>
                     <Link to="/kyc" className="block">
                        <button className="w-full py-3 bg-zinc-900 text-white rounded-[10px] text-xs font-bold transition-all">
                           Start verification
                        </button>
                     </Link>
                  </div>
               ) : user?.kyc?.status === 'PENDING' ? (
                  <div className="bg-white border border-zinc-200 rounded-[10px] p-[20px] space-y-4">
                     <div className="space-y-2">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
                           <ClockIcon size={18} />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900">Review in progress</h4>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                           We are currently checking your documents. This usually takes less than 24 hours.
                        </p>
                     </div>
                  </div>
               ) : (
                  <div className="bg-white border border-zinc-200 rounded-[10px] p-[20px] space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-50 text-emerald-600 rounded-lg flex items-center justify-center">
                           <ShieldIcon size={18} />
                        </div>
                        <div className="min-w-0">
                           <h4 className="text-sm font-bold text-zinc-900 mb-1">Verified account</h4>
                           <p className="text-xs text-zinc-500 font-medium">
                              Trust score: 98%
                           </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-zinc-100 space-y-3">
                         <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-zinc-500">Account health</span>
                            <span className="text-emerald-600">Excellent</span>
                         </div>
                         <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[98%] rounded-full" />
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </div>
       </div>
    );
}
