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

  if (user?.kyc?.status === "PENDING") {
    return (
      <div className="space-y-8 pb-10">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div className="bg-white border border-zinc-100 rounded-2xl lg:rounded-[2rem] p-6 lg:p-8 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-bold text-zinc-400">Uploaded Document</h3>
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


        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-8 lg:space-y-12 pb-10">
      {/* Header & Status */}
      <div className="space-y-4">
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-[10px] border flex items-center gap-3 shadow-sm ${statusMessage.type === 'success' ? 'bg-[#f0fdf4] border-[#10b981]/20 text-[#10b981]' : 'bg-red-50 border-red-200 text-red-600'
                }`}
            >
              <Fingerprint className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold">{statusMessage.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="bg-[#f0fdf4] text-[#10b981] rounded-[20px] px-[14px] py-[6px] text-xs font-bold whitespace-nowrap">
            Review time: Usually within 24 hours
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 max-w-[1000px]">
        <div className="flex-grow max-w-2xl">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Document Selection */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-[#111111]">Step 1 — Choose document type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {docTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDocumentType(type.id)}
                    className={`flex flex-col items-center justify-center text-center p-5 rounded-[10px] border transition-all active:scale-[0.98] gap-4 ${documentType === type.id
                        ? "bg-[#111111] text-[#ffffff] border-[#111111]"
                        : "bg-[#ffffff] text-[#111111] border-[#e5e5e5] hover:border-[#666666]"
                      }`}
                  >
                    <div className={`${documentType === type.id ? 'text-[#ffffff]' : 'text-[#10b981]'} transition-colors`}>
                      {type.icon}
                    </div>
                    <span className="text-xs font-bold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Upload */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-[#111111]">Step 2 — Upload your document</label>
              <div
                className={`relative border-2 border-dashed rounded-[10px] p-8 lg:p-12 transition-all active:scale-[0.98] cursor-pointer text-center ${file ? "border-[#10b981] bg-[#f0fdf4]" : "border-[#e5e5e5] bg-[#f9f9f9] hover:border-[#666666]"
                  }`}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />

                <div className="flex flex-col items-center gap-4">
                  {preview ? (
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative">
                      <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded-xl shadow-md" />
                      <div className="absolute top-2 right-2 p-2 bg-[#111111] text-[#ffffff] rounded-lg shadow-sm">
                        <Camera size={14} />
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-[10px] bg-[#ffffff] flex items-center justify-center text-[#10b981] shadow-sm">
                        <Camera size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#111111]">Upload document</p>
                        <p className="text-xs text-[#666666]">Accepted formats: JPG or PNG, max 10MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-4 bg-[#111111] text-[#ffffff] rounded-[10px] text-sm font-bold hover:bg-[#333333] transition-all flex items-center justify-center gap-4 disabled:opacity-30"
            >
              {loading ? "Uploading..." : "Start verification"}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-4 shrink-0">
        <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] p-[16px] flex items-start gap-4">
          <div className="text-[#10b981] mt-0.5"><Lock size={18} /></div>
          <div>
            <p className="text-sm font-bold text-[#111111]">Encrypted storage</p>
            <p className="text-xs text-[#666666] mt-1">Your data is safe</p>
          </div>
        </div>
        <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] p-[16px] flex items-start gap-4">
          <div className="text-[#10b981] mt-0.5"><ShieldCheck size={18} /></div>
          <div>
            <p className="text-sm font-bold text-[#111111]">Your privacy</p>
            <p className="text-xs text-[#666666] mt-1">Information is never shared</p>
          </div>
        </div>
        <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] p-[16px] flex items-start gap-4">
          <div className="text-[#10b981] mt-0.5"><CheckCircle2 size={18} /></div>
          <div>
            <p className="text-sm font-bold text-[#111111]">Identity confirmed</p>
            <p className="text-xs text-[#666666] mt-1">Biometric link established</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
