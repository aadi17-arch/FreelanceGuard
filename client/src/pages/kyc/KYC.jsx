import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  Lock,
  Clock,
  Camera,
  ChevronDown
} from "lucide-react";

export default function Verification() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("Passport");
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
    }
  };

  const showStatus = (msg, type) => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a photo of your ID.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("document", file);

    try {
      await axios.post("/kyc/submit", formData);
      showStatus("We've received your document.", 'success');
      setTimeout(() => refreshUser(), 1500);
    } catch (err) {
      showStatus(err.response?.data?.message || "Something went wrong. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const docTypes = [
    { id: "Passport", label: "International Passport", icon: <Fingerprint size={16} /> },
    { id: "ID Card", label: "National ID Card", icon: <ShieldCheck size={16} /> },
    { id: "Driver License", label: "Driver's License", icon: <FileText size={16} /> },
  ];

  if (user?.kyc?.status === "PENDING") {
    return (
      <div className="space-y-8 pb-10">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-bold text-zinc-400">Document you uploaded</h3>
              </div>

              <div className="relative rounded-[1.5rem] overflow-hidden border border-zinc-50 bg-zinc-50 transition-all">
                {user.kyc.documentUrl ? (
                  <img
                    src={`http://localhost:5001/${user.kyc.documentUrl.replace(/\\/g, '/')}`}
                    alt="ID Document"
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center text-zinc-200">
                    <Fingerprint size={32} />
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center gap-3 text-amber-600">
                <Clock size={16} />
                <p className="text-sm font-bold">Review in progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.kyc?.status === "APPROVED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 space-y-8 text-zinc-900">
        <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Identity confirmed</h2>
          <p className="text-sm font-medium text-zinc-500 max-w-sm">
            Your verification is complete. You now have full access to all payment features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10 px-0 sm:px-4 lg:px-0">
      <div className="space-y-4 mb-10">
        {statusMessage && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
            }`}>
            <Fingerprint className="w-5 h-5 shrink-0" />
            <span className="text-sm font-bold">{statusMessage.msg}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1 */}
        <div className="space-y-3">
          <div className="flex flex-col gap-0.5">
            <label className="text-sm font-bold text-zinc-900">1. Select your document</label>
            <p className="text-[11px] font-medium text-zinc-400">Pick the ID you have with you right now.</p>
          </div>
          
          <div className="relative">
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full h-12 pl-4 pr-10 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 appearance-none focus:outline-none focus:border-zinc-900 transition-all cursor-pointer"
            >
              {docTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-3">
          <div className="flex flex-col gap-0.5">
            <label className="text-sm font-bold text-zinc-900">2. Photo of your ID</label>
            <p className="text-[11px] font-medium text-zinc-400">Make sure we can see your name and photo clearly.</p>
          </div>
          <div
            className={`relative border border-dashed rounded-xl p-6 sm:p-10 transition-all cursor-pointer text-center ${file ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 bg-zinc-50 hover:border-zinc-400"
              }`}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />

            <div className="flex flex-col items-center gap-4">
              {preview ? (
                <div className="relative w-full max-w-[280px] mx-auto">
                  <img src={preview} alt="Preview" className="w-full aspect-[4/3] object-cover rounded-lg shadow-sm border-2 border-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center shadow-md border border-white">
                    <Camera size={14} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-500 border border-zinc-100">
                    <Camera size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-900 text-center">Tap to upload</p>
                    <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">JPG or PNG only</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-4 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95 shadow-lg shadow-zinc-900/10"
        >
          {loading ? <RefreshCcw size={16} className="animate-spin" /> : "Send for review"}
        </button>
      </form>
    </div>
  );
}
