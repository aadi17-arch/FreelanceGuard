import { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

export default function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  type = "warning",
  children 
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/60"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] p-10 shadow-2xl border border-zinc-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            type === 'warning' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
          }`}>
            <AlertCircle size={24} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight">{title}</h2>
        </div>

        {/* Children (Form) or Default Message */}
        <div className="mb-8">
          {children ? children : (
            <p className="text-zinc-500 text-sm leading-relaxed">
              {message}
            </p>
          )}
        </div>

        {/* Actions - Only show if NO children are provided */}
        {!children && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onClose}
              className="flex-grow py-3 border border-zinc-200 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`flex-grow py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all ${
                type === 'warning' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-zinc-900 hover:bg-black shadow-zinc-200'
              }`}
            >
              {confirmText}
            </button>
          </div>
        )}

        {/* Decorative Detail */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      </div>
    </div>
  );
}
