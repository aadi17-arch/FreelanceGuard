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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/60"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-sm p-6 border border-zinc-200 shadow-sm animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 ${
              type === 'warning' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
            }`}>
              <AlertCircle size={13} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 leading-none">{title}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-zinc-100 rounded-sm border border-zinc-200 text-zinc-500 hover:text-zinc-900 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Children (Form) or Default Message */}
        <div className="mb-6">
          {children ? children : (
            <p className="text-zinc-500 text-xs leading-relaxed">
              {message}
            </p>
          )}
        </div>

        {/* Actions - Only show if NO children are provided */}
        {!children && (
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-grow py-2 border border-zinc-200 rounded-sm text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`flex-grow py-2 rounded-sm text-[10px] font-black uppercase tracking-widest text-white transition-all ${
                type === 'warning' ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-900 hover:bg-black'
              }`}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
