import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-rui-dark/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-12 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              type === 'warning' ? 'bg-rui-danger/10 text-rui-danger' : 'bg-[#E1F5EE] text-[#1D9E75]'
            }`}>
              <AlertCircle size={28} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-rui-light rounded-xl transition-colors">
              <X size={20} className="text-rui-gray-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter text-rui-dark leading-tight">{title}</h2>
            <p className="body-lead !text-rui-dark opacity-60">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onClose}
              className="flex-grow py-4 border-2 border-rui-gray-border/20 rounded-2xl label-caps !text-rui-gray-muted hover:bg-rui-light transition-all"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-grow py-4 rounded-2xl label-caps !text-white shadow-xl transition-all ${
                type === 'warning' ? 'bg-rui-danger hover:bg-rui-dark shadow-rui-danger/20' : 'bg-rui-dark hover:bg-[#1D9E75] shadow-black/10'
              }`}
            >
              {confirmText}
            </button>
          </div>

          {/* Decorative Detail */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rui-gray-border/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
