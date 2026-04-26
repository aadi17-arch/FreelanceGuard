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
  Lock
} from "lucide-react";
import toast from "react-hot-toast";

export default function KYC() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("PASSPORT");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a document image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("document", file);

    try {
      await axios.post("/kyc/submit", formData);
      toast.success("Verification Protocol Initiated");
      refreshUser(); // Update UI with pending status
    } catch (err) {
      toast.error(err.response?.data?.message || "Transmission failed");
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
      <div className="flex flex-col items-center justify-center py-20 space-y-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-rui-blue/20 border-t-rui-blue animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-rui-blue">
            <Lock size={32} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Verification in Progress</h2>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Your identity documents are currently being processed by our compliance node. 
            Access will be granted within 24-48 hours.
          </p>
        </div>
      </div>
    );
  }

  if (user?.kyc?.status === "APPROVED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-8">
        <div className="w-24 h-24 rounded-full bg-rui-success/10 flex items-center justify-center text-rui-success shadow-lg shadow-rui-success/5">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-rui-success">Identity Verified</h2>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Your account is fully synchronized with the security network. 
            You have maximum access to vault and contract services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-10 pb-20"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-rui-success">
          <Lock size={12} strokeWidth={3} />
          <p className="label-caps !text-rui-success !text-[9px]">Identity Protocol</p>
        </div>
        <h1>Account Verification</h1>
        <p className="text-xs md:text-sm text-gray-500 font-medium max-w-lg">
          Complete your identity verification to unlock institutional-grade vault limits 
          and professional contract protections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Area */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-rui-gray-border/50 rounded-2xl p-8 shadow-sm">
            
            {/* Doc Type Selector */}
            <div className="space-y-4">
              <label className="label-caps !text-[10px]">1. Select Document Type</label>
              <div className="grid grid-cols-1 gap-3">
                {docTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDocumentType(type.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      documentType === type.id 
                        ? "bg-rui-dark text-white border-rui-dark shadow-lg shadow-black/5" 
                        : "bg-white text-gray-500 border-rui-gray-border/50 hover:border-rui-dark/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {type.icon}
                      <span className="text-[11px] font-bold uppercase tracking-wider">{type.label}</span>
                    </div>
                    {documentType === type.id && <CheckCircle2 size={14} className="text-rui-success" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-4">
              <label className="label-caps !text-[10px]">2. Upload Document Scan</label>
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-10 transition-all text-center cursor-pointer ${
                  file ? "border-rui-success/50 bg-rui-success/5" : "border-rui-gray-border/50 hover:border-rui-dark/30 hover:bg-rui-light/30"
                }`}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                
                <div className="flex flex-col items-center space-y-4">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full max-h-40 object-contain rounded-lg" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-rui-light flex items-center justify-center text-rui-gray-muted">
                        <Upload size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-rui-dark uppercase tracking-widest">Select Image File</p>
                        <p className="text-[10px] text-gray-400 mt-1">High-quality JPG or PNG (Max 5MB)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-4 bg-rui-dark text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rui-success transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Transmitting..." : (
                <>
                  Submit for Verification
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-rui-dark text-white rounded-2xl p-8 space-y-6 shadow-xl shadow-black/10">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-rui-success">Security Standards</h3>
            <ul className="space-y-4">
              {[
                { title: "End-to-End Encryption", desc: "Data is encrypted before leaving your browser node." },
                { title: "Identity Protection", desc: "We use decentralized verification protocols to secure your PII." },
                { title: "Compliance Ready", desc: "Meets international anti-money laundering regulations." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-rui-success/20 flex items-center justify-center text-rui-success mt-0.5">
                    <ShieldCheck size={12} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider leading-none">{item.title}</p>
                    <p className="text-[10px] text-white/50 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rui-warning/5 border border-rui-warning/20 rounded-2xl p-6 flex gap-4">
            <AlertCircle className="text-rui-warning shrink-0" size={16} />
            <div>
              <p className="text-[10px] font-bold text-rui-warning uppercase tracking-widest mb-1">Upload Guidelines</p>
              <p className="text-[10px] text-rui-warning/70 font-medium leading-relaxed">
                Ensure all four corners of the document are visible and all text is legible. 
                Blurry or cropped images will be rejected by the protocol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
