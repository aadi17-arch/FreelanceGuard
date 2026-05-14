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
  Camera
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
    <div className="space-y-8 lg:space-y-12 pb-10">
      <div className="space-y-4">
        {statusMessage && (
          <div className={`p-4 rounded-[10px] border flex items-center gap-3 ${statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
            }`}>
            <Fingerprint className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold">{statusMessage.msg}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="bg-emerald-50 text-emerald-600 rounded-full px-4 py-1.5 text-xs font-bold">
            We usually check your ID within 24 hours
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 max-w-[1000px]">
        <div className="flex-grow max-w-2xl">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-900">1. Choose your document type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {docTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDocumentType(type.id)}
                    className={`flex flex-col items-center justify-center text-center p-5 rounded-xl border transition-all gap-4 ${documentType === type.id
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400"
                      }`}
                  >
                    <div className={`${documentType === type.id ? 'text-white' : 'text-emerald-500'} transition-colors`}>
                      {type.icon}
                    </div>
                    <span className="text-xs font-bold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-900">2. Upload a photo of your ID</label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 lg:p-12 transition-all cursor-pointer text-center ${file ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 bg-zinc-50 hover:border-zinc-400"
                  }`}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />

                <div className="flex flex-col items-center gap-4">
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded-xl" />
                      <div className="absolute top-2 right-2 p-2 bg-zinc-900 text-white rounded-lg">
                        <Camera size={14} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-500 border border-zinc-100">
                        <Camera size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-zinc-900">Choose a photo</p>
                        <p className="text-xs text-zinc-500">Accepted files: JPG or PNG, max 10MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-4 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-30"
            >
              {loading ? "Sending..." : "Start verification"}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-4 shrink-0">
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-start gap-4">
          <div className="text-emerald-500 mt-0.5"><Lock size={18} /></div>
          <div>
            <p className="text-sm font-bold text-zinc-900">Safe and secure</p>
            <p className="text-xs text-zinc-500 mt-1">Your data is fully protected.</p>
          </div>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-start gap-4">
          <div className="text-emerald-500 mt-0.5"><ShieldCheck size={18} /></div>
          <div>
            <p className="text-sm font-bold text-zinc-900">Your privacy</p>
            <p className="text-xs text-zinc-500 mt-1">We never share your personal information.</p>
          </div>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-start gap-4">
          <div className="text-emerald-500 mt-0.5"><CheckCircle2 size={18} /></div>
          <div>
            <p className="text-sm font-bold text-zinc-900">Identity confirmed</p>
            <p className="text-xs text-zinc-500 mt-1">Your identity is now confirmed.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
