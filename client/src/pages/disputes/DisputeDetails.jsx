import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Scale
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
      console.log("FETCHING VAULT ID:", id);
      const response = await axios.get(`http://localhost:5001/api/dispute/${id}`, {
        withCredentials: true
      });
      console.log("VAULT DATA:", response.data);
      setDispute(response.data);
    } catch (error) {
      console.error("Vault sync failure:", error);
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
      await axios.post(`http://localhost:5001/api/dispute/evidence/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      toast.success("Proof successfully logged in vault");
      setEvidenceFile(null);
      setEvidenceDesc('');
      fetchDisputeDetails();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to submit evidence");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Scale className="text-amber-600 w-8 h-8" />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-900/10">
                <ShieldAlert className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-900">Case #{dispute?.id?.slice(0, 8).toUpperCase() || 'REF-ID'}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    dispute?.status === 'OPEN' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                    'bg-emerald-50 text-emerald-600 border-emerald-200'
                  }`}>
                    {dispute?.status || 'PENDING'}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    {dispute?.milestone?.contract?.project?.title || 'Protocol'} / <span className="text-zinc-900">{dispute?.milestone?.title || 'Initial Allocation'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl shadow-zinc-900/5 flex items-center gap-6">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">Locked in Vault</p>
              <p className="text-2xl font-black text-zinc-900 leading-none">
                ${dispute?.milestone?.amount?.toLocaleString() || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Details & Evidence Upload */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-xl shadow-zinc-900/5"
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-zinc-400">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Dispute Reason
              </h3>
              <p className="text-sm font-medium text-zinc-700 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                "{dispute?.reason}"
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-xl shadow-zinc-900/5"
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-zinc-400">
                <Upload className="w-4 h-4 text-zinc-900" />
                Submit Evidence
              </h3>
              <form onSubmit={handleUploadEvidence} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest font-black ml-1">Evidence Title</label>
                  <input 
                    type="text"
                    value={evidenceDesc}
                    onChange={(e) => setEvidenceDesc(e.target.value)}
                    placeholder="e.g. Completed deliverable screenshot"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-zinc-900 placeholder:text-zinc-300"
                  />
                </div>
                
                <div className="relative group">
                  <input 
                    type="file"
                    onChange={(e) => setEvidenceFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    evidenceFile ? 'border-amber-500 bg-amber-50/50' : 'border-gray-200 group-hover:border-zinc-900'
                  }`}>
                    <FileText className={`w-8 h-8 mx-auto mb-3 ${evidenceFile ? 'text-amber-600' : 'text-zinc-300 group-hover:text-zinc-900'} transition-colors`} />
                    <p className="text-xs font-black text-zinc-900 uppercase tracking-tight">
                      {evidenceFile ? evidenceFile.name : 'Drop Evidence Here'}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tighter">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={uploading || !evidenceFile}
                  className="w-full bg-zinc-900 hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-zinc-900/10 flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest"
                >
                  {uploading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }}><Clock className="w-4 h-4" /></motion.div>
                  ) : <Upload className="w-4 h-4" />}
                  Submit Proof to Vault
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right Column: Evidence Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 text-zinc-400">
                <Clock className="w-4 h-4 text-zinc-900" />
                Evidence Timeline
              </h2>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{dispute?.evidence?.length} entries found</span>
            </div>

            <div className="relative border-l-2 border-gray-200 ml-4 space-y-10 pb-8">
              <AnimatePresence mode='popLayout'>
                {dispute?.evidence?.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-10"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-[3px] border-zinc-900 rounded-full z-10" />
                    
                    <div className="bg-white border border-gray-200 rounded-[32px] p-6 hover:border-amber-500 transition-all group shadow-xl shadow-zinc-900/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-zinc-900 group-hover:text-amber-600 transition-colors tracking-tight">
                            {item.fileName || "Unnamed Evidence"}
                          </h4>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just Now'}
                          </p>
                        </div>
                        <a 
                          href={`http://localhost:5001/${item.fileUrl.replace(/\\/g, '/')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-accent-primary transition-all"
                        >
                          View File
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                        <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-[11px] font-black text-white shadow-lg shadow-zinc-900/20">
                          {item.uploadedBy?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                          Evidence submitted by <span className="text-zinc-900 font-black tracking-tight">{item.uploadedBy?.name || 'System'}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Initial Dispute Node */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative pl-10"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-amber-500 rounded-full z-10 flex items-center justify-center shadow-lg shadow-amber-500/50">
                  <ShieldAlert className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-[32px] p-8 shadow-xl shadow-amber-500/5">
                  <h4 className="font-black text-amber-700 uppercase text-xs tracking-widest mb-2">Dispute Protocol Initiated</h4>
                  <p className="text-[11px] text-amber-600 font-medium leading-relaxed">
                    Vault locked at <span className="text-amber-800 font-bold">{dispute?.createdAt ? new Date(dispute.createdAt).toLocaleString() : 'Processing...'}</span> by <span className="text-amber-800 font-black">{dispute?.raisedBy?.name || 'Authorized User'}</span>
                  </p>
                </div>
              </motion.div>
            </div>

            {dispute?.evidence?.length === 0 && (
              <div className="text-center py-20 bg-background-secondary/50 rounded-3xl border-2 border-dashed border-border-primary">
                <MessageSquare className="w-12 h-12 text-text-secondary/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-secondary">No evidence submitted yet</h3>
                <p className="text-sm text-text-secondary/60 max-w-xs mx-auto mt-2">
                  Use the upload panel to attach proof for the mediator to review.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetails;
