import { useAuth } from "../../context/AuthContext";
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
   Download,
   User,
   AlertTriangle,
   ArrowRight
} from 'lucide-react';
import axios from 'axios';
import toast from '../../utils/toast';

const DisputeDetails = () => {
   const { id } = useParams();
   const { user } = useAuth();
   const navigate = useNavigate();
   const [dispute, setDispute] = useState(null);
   const [loading, setLoading] = useState(true);
   const [resolving, setResolving] = useState(false);
   const [showUpload, setShowUpload] = useState(false);
   const [selectedFile, setSelectedFile] = useState(null);
   const [fileNotes, setFileNotes] = useState("");
   const [uploading, setUploading] = useState(false);

   const handleUploadEvidenceSubmit = async (e) => {
      e.preventDefault();
      if (!selectedFile) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("evidence", selectedFile);
      formData.append("fileName", fileNotes || selectedFile.name);
      try {
         await axios.post(
            `/dispute/evidence/${id}`,
            formData, {
               headers: {
                  'Content-Type': 'multipart/form-data'
               }
            }
         );
         toast.success("Evidence uploaded successfully!");
         setSelectedFile(null);
         setFileNotes("");
         setShowUpload(false);
         fetchDisputeDetails();
      } catch (err) {
         toast.error(err.response?.data?.message || "Failed to upload evidence.");
      } finally {
         setUploading(false);
      }
   };

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
         await axios.put(`/dispute/resolve/${id}`, {
            action,
            resolution:`Admin resolved dispute : ${action === 'RELEASED' ? 'Funds released to freelancer' : 'Funds refunded to client.'}`
         });
         toast.success(`Dispute ${action} successfully.`);
         fetchDisputeDetails();
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update dispute status.");
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
   const isAdmin = user?.role === 'ADMIN';

   return (
      <div className="min-h-screen bg-white text-zinc-900 pb-20 w-full">
         {/* Navigation Header */}
         <div className="sticky top-0 z-40 bg-white border-b border-zinc-200 px-4 py-3.5 w-full">
            <div className="flex justify-between items-center w-full px-2">
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => navigate(-1)}
                     className="p-2 hover:bg-zinc-100 rounded-sm border border-zinc-200 text-zinc-950 transition-colors"
                  >
                     <ChevronLeft size={15} />
                  </button>
                  <div>
                     <div className="flex items-center gap-2">
                        <span className="text-[15px] font-black  tracking-wider text-zinc-800">Dispute details</span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-sm border border-emerald-100">#{dispute?.id?.slice(0, 8)}</span>
                     </div>
                     <h1 className="text-xs font-bold tracking-tight text-zinc-900"></h1>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-0.5 rounded-sm text-[10px] font-black uppercase tracking-tighter border ${isResolved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                     {dispute?.status}
                  </div>
               </div>
            </div>
         </div>

         <div className="w-full px-6 mt-8 space-y-8">
            {/* Top Unified Widescreen Header Banner */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 p-5 bg-zinc-50 border border-zinc-200 rounded-sm w-full">
               {/* Left: Project Title */}
               <div className="space-y-1 max-w-md shrink-0">
                  <div className="flex items-center gap-1.5 text-zinc-500">

                     <span className="text-[14px] font-bold tracking-widest">Project</span>
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-zinc-900 leading-tight">
                     {dispute?.milestone?.contract?.project?.title}
                  </h2>
               </div>

               {/* Middle: Details (Raised By, Budget, Reason) */}
               <div className="flex flex-wrap items-center gap-8 xl:border-l xl:border-zinc-200 xl:pl-6 flex-grow">
                  <div>
                     <p className="text-[10px] font-bold text-zinc-500">
                        {dispute?.raisedBy?.role === 'CLIENT' ? 'Client' : 'Freelancer'}
                     </p>
                     <p className="text-xs font-bold text-zinc-900">{dispute?.raisedBy?.name}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-zinc-500 tracking-wider mb-0.5">Budget</p>
                     <p className="text-xs font-bold text-zinc-900">${dispute?.milestone?.contract?.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div className="max-w-[320px]">
                     <p className="text-[10px] font-black text-blue-800 tracking-wider mb-0.5">Reason</p>
                     <p className="text-xs font-bold text-zinc-900">"{dispute?.reason}"</p>
                  </div>
               </div>

               {/* Right: Escrow Locked Pill */}
               <div className="bg-zinc-900 text-white px-4 py-2.5 rounded-sm flex items-center gap-3 shrink-0 shadow-sm">
                  <div>
                     <p className="text-[9px] font-black tracking-widest text-zinc-400">Disputed Amount</p>
                     <p className="text-lg font-black tracking-tight">${dispute?.milestone?.amount?.toLocaleString()}</p>
                  </div>
                  <Lock size={15} className="text-emerald-400" />
               </div>
            </div>

            {/* Grid Columns for Case Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">

               {/* Main content - Dynamic columns depending on admin resolution panel */}
               <div className={`${(isAdmin || isResolved) ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 w-full`}>

                  {showUpload && (
                     <form onSubmit={handleUploadEvidenceSubmit} className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3 w-full animate-fadeIn">
                        <div className="flex items-center gap-3">
                           <label className="cursor-pointer h-8 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-sm flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-700 transition-all shrink-0">
                              <Upload size={12} />
                              {selectedFile ? selectedFile.name : "Choose File"}
                              <input
                                 type="file"
                                 onChange={(e) => setSelectedFile(e.target.files[0])}
                                 className="hidden"
                              />
                           </label>
                           {selectedFile && (
                              <button
                                 type="button"
                                 onClick={() => setSelectedFile(null)}
                                 className="text-xs text-red-500 hover:underline font-bold"
                              >
                                 Clear
                              </button>
                           )}
                        </div>
                        {selectedFile && (
                           <div className="flex gap-2">
                              <input
                                 type="text"
                                 placeholder="Evidence notes (optional)..."
                                 value={fileNotes}
                                 onChange={(e) => setFileNotes(e.target.value)}
                                 className="flex-grow text-xs bg-white border border-zinc-200 rounded-sm px-3 py-1.5 focus:outline-none focus:border-zinc-900 transition-all"
                              />
                              <button
                                 type="submit"
                                 disabled={uploading}
                                 className="h-8 px-4 bg-zinc-900 hover:bg-black text-white rounded-sm text-xs font-bold transition-all disabled:opacity-50"
                              >
                                 {uploading ? "Uploading..." : "Upload File"}
                              </button>
                           </div>
                        )}
                     </form>
                  )}
                  {!isResolved && !isAdmin && (
                        <button
                           onClick={() => setShowUpload(!showUpload)}
                           className="text-xs font-bold bg-zinc-900 hover:bg-black text-white px-4 py-1.5 rounded-sm transition-all flex items-center gap-2"
                        >
                           <Upload size={12} />
                           Submit Evidence
                        </button>
                  )}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 w-full mb-4">
                     <div className="flex items-center gap-2.5 text-zinc-950">
                        <FileText size={18} className="text-zinc-950 stroke-[2.5]" />
                        <h3 className="text-sm font-black tracking-wider text-zinc-950">Submitted Evidence</h3>
                     </div>
                  </div>

                  <div className="space-y-2 w-full">
                     {dispute?.evidence?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-b-0 group w-full">
                           <div className="flex items-center gap-2.5">
                              <FileText size={14} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                              <div>
                                 <span className="text-xs font-bold text-zinc-900">{item.fileName || 'Evidence document'}</span>
                                 <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight ml-2">By {item.uploadedBy?.name}</span>
                              </div>
                           </div>
                           <button className="p-1 hover:bg-zinc-100 rounded-sm text-zinc-400 hover:text-zinc-900 transition-colors">
                              <Download size={13} />
                           </button>
                        </div>
                     ))}
                     {(!dispute?.evidence || dispute.evidence.length === 0) && (
                        <p className="text-xs font-bold text-zinc-400 tracking-widest py-2">No evidence documents submitted.</p>
                     )}
                  </div>

               </div>

               {(isAdmin || isResolved) && (
                  <div className="lg:col-span-4 space-y-6 w-full animate-fadeIn">
                     <div className="p-6 border border-zinc-200 bg-white rounded-sm space-y-6 w-full">
                        <div className="space-y-1.5">
                           <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800">Verdict</h4>
                           <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
                              {isResolved ? "Final verdict and case closure details." : "Review the Evidence and cast final decision."}
                           </p>
                        </div>

                        <div className="space-y-2.5">
                           {!isResolved ? (
                              <>
                                 <button
                                    onClick={() => handleResolve('RELEASED')}
                                    className="w-full h-10 bg-zinc-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2.5"
                                 >
                                    Release to Freelancer
                                    <ArrowRight size={12} />
                                 </button>
                                 <button
                                    onClick={() => handleResolve('REFUNDED')}
                                    className="w-full h-10 bg-white border border-zinc-200 text-zinc-900 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                                 >
                                    Refund to Client
                                 </button>
                              </>
                           ) : (
                              <div className={`p-4 border rounded-sm flex flex-col gap-2.5 ${
                                  dispute?.resolution?.toLowerCase().includes('released') || dispute?.resolution?.toLowerCase().includes('freelancer')
                                     ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                     : 'bg-blue-50 border-blue-100 text-blue-700'
                               }`}>
                                 <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className={
                                        dispute?.resolution?.toLowerCase().includes('released') || dispute?.resolution?.toLowerCase().includes('freelancer')
                                           ? 'text-emerald-600'
                                           : 'text-blue-600'
                                     } />
                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                        {dispute?.resolution?.toLowerCase().includes('released') || dispute?.resolution?.toLowerCase().includes('freelancer')
                                           ? 'Released to Freelancer'
                                           : 'Refunded to Client'}
                                     </span>
                                 </div>
                                 <p className="text-xs font-medium text-zinc-600 border-t border-dashed border-zinc-200/60 pt-2 mt-1 leading-relaxed">
                                    {dispute?.resolution}
                                 </p>
                              </div>
                           )}
                        </div>

                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>
   );
};

export default DisputeDetails;
