import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Lock,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";

export default function EscrowDashboard() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [releasingId, setReleasingId] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/escrow");
      setContracts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch contracts", err);
      toast.error("Network synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseFunds = async (contractId) => {
    if (!contractId) return;
    setReleasingId(contractId);
    try {
      await axios.post(`/escrow/release/${contractId}`);
      toast.success("Capital Released Successfully");
      fetchContracts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setReleasingId(null);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleReleaseFunds(selectedContractId)}
        title="Execute Capital Release?"
        message="By confirming, you authorize the immediate transfer of locked funds. This protocol is irreversible."
        confirmText="Confirm Release"
        cancelText="Abort"
      />

      {/* Header Section: Balanced & Scaled */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-rui-gray-border/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#1D9E75]">
            <Lock size={12} strokeWidth={3} />
            <p className="label-caps !text-[#1D9E75] !text-[9px]">Escrow Protection</p>
          </div>
          <h1>Financials</h1>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white border border-rui-gray-border/50 rounded-xl shadow-sm">
           <div className="space-y-0.5 text-right">
             <p className="label-caps !text-[8px]">Wallet Balance</p>
             <p className="text-2xl font-financial text-[#1D9E75] leading-none">
                ${user?.walletBalance?.toLocaleString() || "0.00"}
             </p>
           </div>
           <div className="w-9 h-9 rounded-lg bg-[#E1F5EE] flex items-center justify-center text-[#1D9E75]">
             <ShieldCheck size={18} />
           </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#1D9E75]/20 border-t-[#1D9E75] rounded-full animate-spin"></div>
          <p className="label-caps !text-[#1D9E75] !text-[9px]">Synchronizing States...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts && contracts.length > 0 ? (
            contracts.map((escrow) => (
              <motion.div
                key={escrow?.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white border border-rui-gray-border/50 rounded-xl p-6 hover:border-[#1D9E75]/20 transition-all hover:shadow-xl hover:shadow-black/[0.02] flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-0.5">
                    <p className="label-caps !text-[8px] opacity-60">Contract ID</p>
                    <p className="text-[10px] text-rui-blue font-financial tracking-widest uppercase">
                        {escrow?.id?.slice(-8) || "PENDING"}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                    escrow?.status === 'COMPLETED' ? 'bg-[#E1F5EE] text-[#1D9E75] border-[#1D9E75]/10' : 'bg-rui-blue/5 text-rui-blue border-rui-blue/20'
                  }`}>
                    {escrow?.status || "ACTIVE"}
                  </div>
                </div>

                <h3 className="text-base font-bold text-rui-dark tracking-tight mb-3 group-hover:text-[#1D9E75] transition-colors line-clamp-1">
                  {escrow?.project?.title || "Project Protocol"}
                </h3>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-rui-gray-border/5 my-2">
                  <div className="space-y-0.5">
                    <p className="label-caps !text-[8px]">Locked</p>
                    <p className="text-lg font-financial text-rui-dark tracking-tighter">
                        ${escrow?.amount?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="label-caps !text-[8px]">Network</p>
                    <p className="text-[9px] font-black text-[#1D9E75] uppercase tracking-wider">Secured</p>
                  </div>
                </div>

                <div className="mt-6 space-y-6 flex-grow">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                      <span>Progress</span>
                      <span>{escrow?.status === 'COMPLETED' ? '100%' : '40%'}</span>
                    </div>
                    <div className="h-[2px] w-full bg-rui-light rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1D9E75] transition-all duration-1000"
                        style={{ width: escrow?.status === 'COMPLETED' ? '100%' : '40%' }}
                      ></div>
                    </div>
                  </div>

                  {escrow?.status !== 'COMPLETED' && user?.role === 'CLIENT' && (
                    <button 
                      onClick={() => {
                        setSelectedContractId(escrow?.id);
                        setIsModalOpen(true);
                      }}
                      className="w-full py-3 bg-rui-dark text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#1D9E75] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5"
                    >
                      {releasingId === escrow?.id ? <RefreshCw className="animate-spin" size={12} /> : "Execute Release"}
                      {releasingId !== escrow?.id && <ChevronRight size={12} />}
                    </button>
                  )}
                  
                  {escrow?.status === 'COMPLETED' && (
                    <div className="w-full py-3 bg-[#E1F5EE] text-[#1D9E75] rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#1D9E75]/10 flex items-center justify-center gap-2">
                      <CheckCircle2 size={12} />
                      Completed
                    </div>
                  )}

                  {escrow?.status !== 'COMPLETED' && user?.role === 'FREELANCER' && (
                    <div className="w-full py-3 bg-rui-light text-rui-gray-muted rounded-lg text-[9px] font-black uppercase tracking-widest border border-rui-gray-border/30 flex items-center justify-center gap-2">
                      <Lock size={12} />
                      Funds Secured
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full h-48 flex flex-col items-center justify-center space-y-2 bg-white border border-rui-gray-border/50 rounded-xl">
               <p className="label-caps opacity-40 !text-[9px]">No active escrow states found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
