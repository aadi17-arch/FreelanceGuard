import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   ShieldAlert,
   FileText,
   Clock,
   Upload,
   ChevronLeft,
   CheckCircle2,
   Lock,
   ShieldCheck,
   Download,
   User,
   Scale,
   AlertTriangle,
   ArrowRight
} from 'lucide-react';
import axios from 'axios';
import toast from '../../utils/toast';

const DisputeDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [dispute, setDispute] = useState(null);
   const [loading, setLoading] = useState(true);
   const [resolving, setResolving] = useState(false);

   useEffect(() => {
      fetchDisputeDetails();
   }, [id]);

   const fetchDisputeDetails = async () => {
      try {
         setLoading(true);
         const response = await axios.get(`/dispute/${id}`, {
            withCredentials: true
         });
         setDispute(response.data);
      } catch (error) {
         toast.error("Failed to load case details.");
      } finally {
         setLoading(false);
      }
   };

   const handleResolve = async (action) => {
      setResolving(true);
      try {
         // Logic to resolve dispute would go here
         toast.success(`Dispute ${action} successfully.`);
         fetchDisputeDetails();
      } catch (error) {
         toast.error("Failed to update dispute status.");
      } finally {
         setResolving(false);
      }
   };

   if (loading) return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
         <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Case...</p>
      </div>
   );

   const isResolved = dispute?.status !== 'OPEN';

   return (
      <div className="min-h-screen bg-white text-zinc-900 pb-20">
         {/* Navigation Header */}
         <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <button 
                  onClick={() => navigate(-1)} 
                  className="p-2 hover:bg-zinc-50 rounded-xl transition-colors border border-transparent hover:border-zinc-200"
               >
                  <ChevronLeft size={16} />
               </button>
               <div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Case Identifier</span>
                     <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">#{dispute?.id?.slice(0, 8)}</span>
                  </div>
                  <h1 className="text-sm font-bold tracking-tight text-zinc-900">Support Resolution Center</h1>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${isResolved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                  {dispute?.status}
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-8 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               {/* Main content */}
               <div className="lg:col-span-8 space-y-10">
                  
                  {/* Subject & Summary */}
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                           <Scale size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Active Dispute</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-zinc-900 leading-tight">
                           {dispute?.milestone?.contract?.project?.title}
                        </h2>
                     </div>

                     <div className="grid grid-cols-3 gap-6 p-6 bg-zinc-50 border border-zinc-100 rounded-2xl">
                        <div>
                           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Raised By</p>
                           <p className="text-sm font-bold text-zinc-900">{dispute?.raisedBy?.name}</p>
                           <p className="text-[10px] font-bold text-zinc-400 uppercase">{dispute?.raisedBy?.role}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Project Budget</p>
                           <p className="text-sm font-bold text-zinc-900">${dispute?.milestone?.contract?.totalAmount?.toLocaleString()}</p>
                           <p className="text-[10px] font-bold text-emerald-600 uppercase">Escrow Secured</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">Created Date</p>
                           <p className="text-sm font-bold text-zinc-900">{new Date(dispute?.createdAt).toLocaleDateString()}</p>
                           <p className="text-[10px] font-bold text-zinc-400 uppercase">System Timestamp</p>
                        </div>
                     </div>
                  </div>

                  {/* Reason & Statement */}
                  <div className="p-8 border border-zinc-100 rounded-3xl bg-white shadow-sm shadow-zinc-100/50">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
                           <ShieldAlert size={16} />
                        </div>
                        <h3 className="text-sm font-bold tracking-tight">Statement of Reason</h3>
                     </div>
                     <p className="text-sm font-medium text-zinc-600 leading-relaxed pl-4 border-l-2 border-zinc-900 italic">
                        "{dispute?.reason}"
                     </p>
                  </div>

                  {/* Evidence List */}
                  <div className="space-y-6">
                     <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                        <div className="flex items-center gap-3">
                           <FileText size={16} className="text-zinc-900" />
                           <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Submitted Evidence</h3>
                        </div>
                        <span className="text-[10px] font-black text-zinc-400">{dispute?.evidence?.length || 0} Files</span>
                     </div>

                     <div className="space-y-3">
                        {dispute?.evidence?.map((item) => (
                           <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-900 transition-colors group">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                    <FileText size={18} />
                                 </div>
                                 <div>
                                    <p className="text-[12px] font-bold text-zinc-900">{item.fileName || 'Evidence document'}</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">By {item.uploadedBy?.name} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                 </div>
                              </div>
                              <button className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors">
                                 <Download size={16} />
                              </button>
                           </div>
                        ))}
                        {(!dispute?.evidence || dispute.evidence.length === 0) && (
                           <div className="py-12 text-center border border-dashed border-zinc-200 rounded-3xl">
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No evidence submitted yet</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Action Sidebar */}
               <div className="lg:col-span-4 space-y-6">
                  
                  {/* Amount on Hold Card */}
                  <div className="p-8 bg-zinc-900 text-white rounded-[2rem] relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Escrow Retained</p>
                        <div className="flex items-baseline gap-1">
                           <span className="text-5xl font-black tracking-tighter">${dispute?.milestone?.amount?.toLocaleString()}</span>
                           <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Locked</span>
                        </div>
                     </div>
                     <Lock className="absolute -bottom-6 -right-6 text-zinc-800" size={140} />
                  </div>

                  {/* Resolution Panel */}
                  <div className="p-8 border border-zinc-100 bg-white rounded-[2rem] shadow-xl shadow-zinc-100/50 space-y-8">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={14} className="text-emerald-500" />
                           <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Administrator Panel</h3>
                        </div>
                        <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                           As an administrator, you must review the evidence submitted and determine the final fund allocation. This action is final.
                        </p>
                     </div>

                     <div className="space-y-3">
                        {!isResolved ? (
                           <>
                              <button 
                                 onClick={() => handleResolve('RELEASED')}
                                 className="w-full h-12 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                              >
                                 Release to Freelancer
                                 <ArrowRight size={14} />
                              </button>
                              <button 
                                 onClick={() => handleResolve('REFUNDED')}
                                 className="w-full h-12 bg-white border border-zinc-200 text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-[0.98]"
                              >
                                 Refund to Client
                              </button>
                           </>
                        ) : (
                           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                              <CheckCircle2 size={16} className="text-emerald-600" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Case Resolved</span>
                           </div>
                        )}
                     </div>

                     <div className="pt-6 border-t border-zinc-100 flex items-center gap-3 text-zinc-400">
                        <AlertTriangle size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Irreversible Command</span>
                     </div>
                  </div>

                  {/* System Audit Log */}
                  <div className="p-6 border border-zinc-100 bg-zinc-50/50 rounded-3xl space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Audit History</h4>
                     <div className="space-y-4">
                        <div className="flex gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                           <div>
                              <p className="text-[11px] font-bold text-zinc-900">Dispute Initialized</p>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase">{new Date(dispute?.createdAt).toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="flex gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1" />
                           <div>
                              <p className="text-[11px] font-bold text-zinc-400">Escrow funds auto-locked</p>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase">System Command</p>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </div>
   );
};

export default DisputeDetails;
