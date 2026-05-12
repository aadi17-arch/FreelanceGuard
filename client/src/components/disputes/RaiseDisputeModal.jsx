import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, AlertTriangle, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RaiseDisputeModal = ({ isOpen, onClose, milestoneId, milestoneTitle }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return toast.error("Please provide a reason for the dispute");

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/dispute', {
        milestoneId,
        reason
      }, { withCredentials: true });

      toast.success("Dispute protocol initiated successfully");
      onClose();
      const disputeId = response.data.dispute?.id || response.data.id;
      if (disputeId) {
        navigate(`/dispute/${disputeId}`);
      } else {
        navigate('/disputes');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to raise dispute");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-x-0 inset-y-0 bg-zinc-900/50"
          />

          {/* Modal Content */}
          <m.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header Glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 rounded-xl">
                    <ShieldAlert className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Raise Dispute</h2>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Protocol: Institutional Resolution</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8">
                <div className="flex gap-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
                    Raising a dispute will <span className="text-amber-700 font-black uppercase">Freeze</span> the funds in the vault for <span className="text-zinc-900 font-bold">"{milestoneTitle}"</span>. No releases will be possible until a resolution is reached.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black ml-1">
                    Reason for Dispute
                  </label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe why you are initiating this dispute..."
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-zinc-900 resize-none placeholder:text-zinc-400"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-amber-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-zinc-900/10 flex items-center justify-center gap-3 group uppercase text-[10px] tracking-widest"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Initiate Freeze Protocol
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="text-[9px] text-center text-zinc-400 font-bold uppercase tracking-tighter">
                  By clicking initiate, you agree to submit evidence within 48 hours.
                </p>
              </form>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RaiseDisputeModal;
