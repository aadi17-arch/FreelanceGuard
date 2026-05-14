import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   ShieldAlert,
   FileText,
   Clock,
   Upload,
   ChevronLeft,
   AlertCircle,
   CheckCircle2,
   Lock,
   MessageSquare,
   ShieldCheck,
   History,
   Download,
   Info,
   User
} from 'lucide-react';
import axios from 'axios';
import toast from '../../utils/toast';

const DisputeDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [dispute, setDispute] = useState(null);
   const [loading, setLoading] = useState(true);
   const [uploading, setUploading] = useState(false);
   const [evidenceFile, setEvidenceFile] = useState(null);
   const [evidenceDesc, setEvidenceDesc] = useState('');

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

   const handleUploadEvidence = async (e) => {
      e.preventDefault();
      if (!evidenceFile) return;

      setUploading(true);
      const formData = new FormData();
      formData.append('disputeId', id);
      formData.append('evidence', evidenceFile);
      formData.append('fileName', evidenceDesc);

      try {
         await axios.post(`/dispute/evidence/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
         });
         toast.success("Information saved to your case.");
         setEvidenceFile(null);
         setEvidenceDesc('');
         fetchDisputeDetails();
      } catch (error) {
         toast.error("Failed to save your information.");
      } finally {
         setUploading(false);
      }
   };

   if (loading) return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
         <ShieldCheck className="w-8 h-8 text-emerald-500" />
         <p className="text-xs font-bold text-zinc-400">Loading support case...</p>
      </div>
   );

   return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
         <div className="w-full bg-zinc-900 text-white py-3 px-6 flex justify-between items-center relative">
            <div className="flex items-center gap-4">
               <button onClick={() => navigate(-1)} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
                  <ChevronLeft size={16} />
               </button>
               <div className="h-4 w-[1px] bg-zinc-800" />
               <div className="flex items-center gap-2">
                  <ShieldAlert size={12} className="text-emerald-500" />
                  <p className="text-[10px] font-bold">Case ID: <span className="text-emerald-500">{dispute?.id?.slice(0, 8)}</span></p>
               </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
               <p className="text-[9px] font-bold text-zinc-400">Protection: Active</p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
               <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${dispute?.status === 'OPEN' ? 'bg-amber-500 text-white border-amber-500' : 'bg-emerald-500 text-white border-emerald-500'
                        }`}>
                        {dispute?.status === 'OPEN' ? 'Under review' : 'Resolved'}
                     </span>
                     <span className="text-zinc-200 font-medium">/</span>
                     <p className="text-[10px] font-bold text-zinc-400">Help with payment</p>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
                     {dispute?.milestone?.contract?.project?.title || "Payment help"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                     <div className="flex items-center gap-2">
                         <User size={14} className="text-zinc-400" />
                         <p className="text-xs font-medium text-zinc-500">Reported by: <span className="text-zinc-900">{dispute?.raisedBy?.name}</span></p>
                     </div>
                     <div className="flex items-center gap-2">
                         <Clock size={14} className="text-zinc-400" />
                         <p className="text-xs font-medium text-zinc-500">Date: <span className="text-zinc-900">{new Date(dispute?.createdAt).toLocaleDateString()}</span></p>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4">
                  <div className="bg-white border border-zinc-200 p-8 rounded-[2.5rem] flex items-center justify-between group relative overflow-hidden">
                     <div className="space-y-1 relative z-10">
                        <p className="text-[10px] font-bold text-zinc-400">Payment on hold</p>
                        <p className="text-4xl font-bold text-zinc-900 tracking-tighter">${dispute?.milestone?.amount?.toLocaleString()}</p>
                     </div>
                     <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center transition-transform relative z-10">
                        <Lock size={24} />
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-1 space-y-8">
                  <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                     <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-zinc-800 rounded-2xl flex items-center justify-center">
                              <Info size={18} className="text-emerald-500" />
                           </div>
                           <h3 className="text-sm font-bold">What's the issue?</h3>
                        </div>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed italic border-l-2 border-emerald-500 pl-4">
                           "{dispute?.reason}"
                        </p>
                     </div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 space-y-6">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-zinc-900">Add helpful information</h3>
                        <Upload size={16} className="text-zinc-400" />
                     </div>

                     <form onSubmit={handleUploadEvidence} className="space-y-4">
                        <input
                           type="text"
                           value={evidenceDesc}
                           onChange={(e) => setEvidenceDesc(e.target.value)}
                           placeholder="Describe this file..."
                           className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all"
                        />

                        <div className="relative group">
                           <input
                              type="file"
                              onChange={(e) => setEvidenceFile(e.target.files[0])}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                           />
                           <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${evidenceFile ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-200 group-hover:border-zinc-900'
                              }`}>
                              <FileText size={32} className={`mx-auto mb-4 ${evidenceFile ? 'text-emerald-600' : 'text-zinc-200'}`} />
                              <p className="text-[11px] font-bold text-zinc-900">
                                 {evidenceFile ? evidenceFile.name : 'Choose a file'}
                              </p>
                              <p className="text-[9px] text-zinc-400 mt-2 font-bold">PDF / Images only</p>
                           </div>
                        </div>

                        <button
                           type="submit"
                           disabled={uploading || !evidenceFile}
                           className="w-full bg-zinc-900 hover:bg-black disabled:opacity-30 text-white rounded-2xl py-5 font-bold text-xs transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                           {uploading ? "Saving..." : (
                              <>
                                 <ShieldCheck size={16} />
                                 Send to support
                              </>
                           )}
                        </button>
                     </form>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 flex items-center gap-6">
                     <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Support team</p>
                        <p className="text-xs font-bold text-emerald-800 mt-1">Reviewing your case</p>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-10">
                  <div className="space-y-6 px-1">
                     <div className="flex items-center gap-3">
                        <History size={16} className="text-zinc-900" />
                        <h3 className="text-xs font-bold text-zinc-900">What's happening now</h3>
                     </div>
                     <div className="grid grid-cols-4 gap-4">
                        {[
                           { label: "Reported", icon: <AlertCircle />, active: true, done: true },
                           { label: "Information", icon: <Upload />, active: true, done: false },
                           { label: "Review", icon: <ShieldCheck />, active: false, done: false },
                           { label: "Resolved", icon: <CheckCircle2 />, active: false, done: false }
                        ].map((step, i) => (
                           <div key={i} className="space-y-3">
                              <div className={`h-1.5 rounded-full transition-all ${step.done ? 'bg-emerald-500' : step.active ? 'bg-amber-500' : 'bg-zinc-100'}`} />
                              <div className="flex items-center gap-2">
                                 <div className={`text-[10px] ${step.active ? 'text-zinc-900' : 'text-zinc-300'}`}>
                                    {React.cloneElement(step.icon, { size: 12 })}
                                 </div>
                                 <span className={`text-[9px] font-bold ${step.active ? 'text-zinc-900' : 'text-zinc-300'}`}>{step.label}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                           <FileText size={16} className="text-zinc-900" />
                           <h3 className="text-xs font-bold text-zinc-900">Files you shared</h3>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 bg-white px-3 py-1 rounded-full border border-zinc-100 shadow-sm">{dispute?.evidence?.length} files</span>
                     </div>

                     <div className="space-y-4">
                        {dispute?.evidence?.map((item, index) => (
                           <div
                              key={item.id}
                              className="bg-white border border-zinc-200 rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-500 transition-all group"
                           >
                              <div className="flex items-center gap-6 w-full md:w-auto">
                                 <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all shadow-inner">
                                    <FileText size={24} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold text-zinc-300 mb-1">File #{item.id.slice(0, 8)}</p>
                                    <h4 className="text-lg font-bold text-zinc-900 tracking-tight">{item.fileName || "Shared file"}</h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                       <div className="flex items-center gap-1.5">
                                          <div className="w-4 h-4 rounded-full bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-white">{item.uploadedBy?.name?.charAt(0)}</div>
                                          <span className="text-[10px] font-bold text-zinc-400">{item.uploadedBy?.name}</span>
                                       </div>
                                       <span className="text-zinc-200 text-xs">|</span>
                                       <span className="text-[10px] font-bold text-zinc-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                              </div>

                              <a
                                 href={`http://localhost:5001/${item.fileUrl.replace(/\\/g, '/')}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="w-full md:w-auto px-8 py-3 bg-zinc-50 hover:bg-zinc-900 hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                              >
                                 <Download size={14} />
                                 Download
                              </a>
                           </div>
                        ))}

                        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 border-l-4 border-l-emerald-500">
                           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="space-y-1">
                                 <h4 className="text-sm font-bold text-zinc-900">Ticket opened</h4>
                                 <p className="text-xs font-medium text-zinc-500">Your support request has been created and funds are held securely.</p>
                              </div>
                              <div className="text-right shrink-0">
                                 <p className="text-[10px] font-bold text-emerald-600 mb-1">Status: Active</p>
                                 <p className="text-[10px] font-bold text-zinc-400">{new Date(dispute?.createdAt).toLocaleString()}</p>
                              </div>
                           </div>
                        </div>

                        {dispute?.evidence?.length === 0 && (
                           <div className="py-20 text-center space-y-4 bg-white border border-dashed border-zinc-200 rounded-[2.5rem]">
                              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                 <MessageSquare size={28} className="text-zinc-200" />
                              </div>
                              <h4 className="text-sm font-bold text-zinc-900">No files yet</h4>
                              <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto">Please add any screenshots or documents that can help us resolve your issue.</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default DisputeDetails;
