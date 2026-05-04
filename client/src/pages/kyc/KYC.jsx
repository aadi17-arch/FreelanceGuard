import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Fingerprint,
  Lock,
  Clock,
  Camera
} from "lucide-react";

export default function KYC() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("PASSPORT");
  const [preview, setPreview] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      showStatus("Document uploaded successfully.", 'success');
    }
  };

  const showStatus = (msg, type) => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showStatus("Please capture a document scan.", 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("document", file);

    try {
      await axios.post("/kyc/submit", formData);
      showStatus("Verification started.", 'success');
      setTimeout(() => refreshUser(), 1500);
    } catch (err) {
      showStatus(err.response?.data?.message || "Upload failed.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const docTypes = [
    { id: "PASSPORT", label: "International Passport", icon: <Fingerprint size={16} /> },
    { id: "ID_CARD", label: "National ID Card", icon: <ShieldCheck size={16} /> },
    { id: "DRIVER_LICENSE", label: "Driver's License", icon: <FileText size={16} /> },
  ];

  // --- PENDING STATE ---
  if (user?.kyc?.status === "PENDING") {
    return (
      <div className="space-y-8 py-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500">
              <Clock size={14} strokeWidth={3} className="animate-pulse" />
              <p className="text-xs font-bold">Verification Pending</p>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-zinc-900">Account Review</h1>
          </div>
          <div className="bg-amber-50 border border-amber-100 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
             <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={18} />
             </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 leading-none">Estimated Time</p>
                <p className="text-xs font-bold text-amber-600 mt-1">24-48 Hours</p>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-100 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xs font-bold text-zinc-400">Uploaded Document</h3>
                   <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                     Under Review
                   </span>
                </div>
               
               <div className="relative rounded-xl lg:rounded-[1.5rem] overflow-hidden border border-zinc-50 bg-zinc-50 group-hover:border-amber-500 transition-all duration-700">
                {user.kyc.documentUrl ? (
                  <img 
                    src={`http://localhost:5001/${user.kyc.documentUrl.replace(/\\/g, '/')}`} 
                    alt="KYC Document" 
                    className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center text-zinc-300">
                    <Fingerprint size={32} className="opacity-20" />
                  </div>
                )}
               </div>
            </div>
          </div>

           <div className="bg-zinc-900 rounded-2xl lg:rounded-[2rem] p-8 lg:p-10 text-white space-y-8 shadow-xl">
              <h3 className="text-xs font-bold text-amber-500">Verification Status</h3>
             <div className="space-y-6">
                {[
                  { step: "Verification", status: "Active" },
                  { step: "Compliance Check", status: "Queued" },
                  { step: "Final Approval", status: "Pending" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                     <p className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">{item.step}</p>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                       item.status === 'Active' ? 'bg-amber-500 text-white shadow-lg' : 'bg-zinc-800 text-zinc-600'
                     }`}>{item.status}</span>
                  </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- APPROVED STATE ---
  if (user?.kyc?.status === "APPROVED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 space-y-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-xl border border-emerald-100"
        >
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </motion.div>
         <div className="text-center space-y-3">
           <h2 className="text-2xl font-black tracking-tighter text-zinc-900">Identity Verified</h2>
           <p className="text-xs font-bold text-zinc-400 max-w-sm">
             Your identity verification is complete.
           </p>
         </div>
      </div>
    );
  }

  // --- SUBMISSION STATE ---
  return (
    <div className="space-y-8 lg:space-y-12 pb-10">
      {/* Header & Status */}
      <div className="space-y-6">
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-xl border flex items-center gap-3 shadow-lg ${
                statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}
            >
              <Fingerprint className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider">{statusMessage.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
           <div className="flex items-center gap-2 text-emerald-500">
             <Lock size={12} strokeWidth={3} />
             <p className="text-xs font-bold">Identity Verification</p>
           </div>
           <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-zinc-900 leading-none">Verification</h1>
           <p className="text-sm font-medium text-zinc-400 max-w-lg">
             Complete your identity verification to enable all features.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Document Selection */}
             <div className="space-y-4">
               <label className="text-xs font-bold text-zinc-400 px-1">1. Identity Type</label>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 {docTypes.map((type) => (
                   <button
                     key={type.id}
                     type="button"
                     onClick={() => setDocumentType(type.id)}
                     className={`flex items-center lg:flex-col lg:justify-center lg:text-center p-5 rounded-xl border transition-all active:scale-[0.98] gap-4 ${
                       documentType === type.id 
                         ? "bg-zinc-900 text-white border-zinc-900 shadow-xl" 
                         : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200"
                     }`}
                   >
                     <div className={`${documentType === type.id ? 'text-emerald-400' : 'text-zinc-300'} transition-colors`}>
                       {type.icon}
                     </div>
                     <span className="text-xs font-bold">{type.label.split(' ')[0]}</span>
                   </button>
                 ))}
               </div>
             </div>

            {/* Step 2: Upload */}
            <div className="space-y-4">
             <div className="space-y-4">
               <label className="text-xs font-bold text-zinc-400 px-1">2. Document Upload</label>
               <div 
                 className={`relative border-2 border-dashed rounded-2xl lg:rounded-[2rem] p-8 lg:p-12 transition-all active:scale-[0.98] cursor-pointer text-center ${
                   file ? "border-emerald-500/50 bg-emerald-50/20" : "border-zinc-100 hover:border-zinc-300 bg-zinc-50/50"
                 }`}
                 onClick={() => document.getElementById('file-upload').click()}
               >
                 <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                 
                 <div className="flex flex-col items-center gap-4">
                   {preview ? (
                     <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative">
                        <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded-xl shadow-lg" />
                        <div className="absolute top-2 right-2 p-2 bg-zinc-900 text-white rounded-lg shadow-xl">
                           <Camera size={14} />
                        </div>
                     </motion.div>
                   ) : (
                     <>
                       <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-zinc-300 shadow-sm">
                         <Camera size={20} />
                       </div>
                       <div className="space-y-1">
                         <p className="text-xs font-bold text-zinc-900">Upload Document</p>
                         <p className="text-[10px] text-zinc-400 font-bold">JPG, PNG (Max 10MB)</p>
                       </div>
                     </>
                   )}
                 </div>
               </div>
             </div>
            </div>

             <button
               type="submit"
               disabled={loading || !file}
               className="w-full py-4 bg-zinc-900 text-white rounded-xl lg:rounded-2xl text-xs font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-30"
             >
               {loading ? "Uploading..." : "Start Verification"}
             </button>
          </form>
        </div>

        {/* Security Summary */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 text-white rounded-2xl lg:rounded-[2.5rem] p-8 lg:p-10 space-y-8 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
               <h3 className="text-xs font-bold text-emerald-400 relative z-10">Security Standards</h3>
               <div className="space-y-6 relative z-10">
                  {[
                    { title: "Secure Encryption", desc: "Your data is encrypted end-to-end." },
                    { title: "Private Storage", desc: "Stored in secure, encrypted storage." }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                       <div className="flex items-center gap-2">
                          <ShieldCheck className="text-emerald-500" size={14} />
                          <p className="text-xs font-bold">{item.title}</p>
                       </div>
                       <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
