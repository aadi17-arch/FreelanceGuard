import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Lock,
  ChevronRight,
  Circle,
  AlertCircle,
  ShieldAlert,
  Scale
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import RaiseDisputeModal from "../../components/disputes/RaiseDisputeModal";
import { useNavigate } from "react-router-dom";

export default function EscrowDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
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

  const totalSecured = contracts.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const activeContracts = contracts.filter(c => c.status !== 'COMPLETED').length;

  return (
    <div className="space-y-8 pb-20">
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleReleaseFunds(selectedContractId)}
        title="Execute Fund Release?"
        message="By confirming, you authorize the immediate transfer of held funds. This transaction is final and irreversible."
        confirmText="Confirm Release"
        cancelText="Abort"
      />

      <RaiseDisputeModal 
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        milestoneId={selectedMilestone?.id}
        milestoneTitle={selectedMilestone?.title}
      />

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-rui-dark leading-none">Vault</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          All funds held securely per project
        </p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pb-6">
        <div className="p-5 md:p-0 bg-white md:bg-transparent rounded-2xl md:rounded-none border md:border-0 border-gray-100 shadow-sm md:shadow-none space-y-2">
          <p className="label-caps !text-[9px] !text-gray-400">Total Secured</p>
          <p className="text-xl font-financial font-bold text-rui-dark">
            ${totalSecured.toLocaleString()}
          </p>
          <span className="inline-block px-2 py-0.5 rounded-full bg-rui-success/10 text-rui-success text-[8px] font-black uppercase tracking-wider">
            {activeContracts} active holds
          </span>
        </div>
        <div className="p-5 md:p-0 bg-white md:bg-transparent rounded-2xl md:rounded-none border md:border-0 border-gray-100 shadow-sm md:shadow-none space-y-2">
          <p className="label-caps !text-[9px] !text-gray-400">Released this month</p>
          <p className="text-xl font-financial font-bold text-rui-dark">$8,250</p>
          <span className="inline-block px-2 py-0.5 rounded-full bg-rui-blue/10 text-rui-blue text-[8px] font-black uppercase tracking-wider">
            3 transactions
          </span>
        </div>
        <div className="p-5 md:p-0 bg-white md:bg-transparent rounded-2xl md:rounded-none border md:border-0 border-gray-100 shadow-sm md:shadow-none space-y-2">
          <p className="label-caps !text-[9px] !text-gray-400">In Dispute</p>
          <p className="text-xl font-financial font-bold text-rui-dark">$2,000</p>
          <span className="inline-block px-2 py-0.5 rounded-full bg-rui-warning/10 text-rui-warning text-[8px] font-black uppercase tracking-wider">
            2 open cases
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Main Table Area */}
        <div className="lg:col-span-8 space-y-5">
          <p className="label-caps !text-[10px] !text-rui-dark">Vault holdings</p>
          <div className="w-full overflow-hidden relative bg-white md:bg-transparent rounded-2xl md:rounded-none border md:border-0 border-gray-100 p-4 md:p-0">
            {/* Mobile Swipe Hint */}
            <div className="md:hidden flex items-center gap-2 mb-2 text-[8px] font-black uppercase tracking-widest text-gray-400 opacity-60">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              Swipe to view full data
            </div>
            <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="">
                      <th className="px-0 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Project</th>
                      <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Counterparty</th>
                      <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Held</th>
                      <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Status</th>
                      <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Protection</th>
                    </tr>
                  </thead>
              <tbody className="">
                {contracts.map((escrow) => (
                  <tr key={escrow.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-0 py-4">
                      <p className="text-sm font-bold text-rui-dark group-hover:text-rui-success transition-colors">
                        {escrow.project?.title || "Secure Contract"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-gray-600">{escrow.project?.client?.name || "Client"}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-financial font-bold text-rui-success">
                        ${escrow.totalAmount?.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                        escrow.status === 'COMPLETED' ? 'bg-gray-100 text-gray-500 border-gray-200' : 
                        escrow.status === 'DISPUTED' ? 'bg-amber-100 text-amber-600 border-amber-200 shadow-sm' :
                        'bg-rui-success/10 text-rui-success border-rui-success/20'
                      }`}>
                        {escrow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Contextual Actions */}
                        {escrow.status === 'ACTIVE' && (
                          <button 
                            onClick={() => {
                              setSelectedMilestone({ id: escrow.id, title: escrow.project?.title });
                              setIsDisputeModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all group/btn shadow-sm"
                          >
                            <ShieldAlert className="w-3 h-3 transition-transform group-hover/btn:scale-110" />
                            Raise Dispute
                          </button>
                        )}
                        
                        {escrow.status === 'DISPUTED' && (
                          <button 
                            onClick={() => navigate(`/dispute/${escrow.dispute?.id}`)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all group/btn shadow-sm"
                          >
                            <Scale className="w-3 h-3 transition-transform group-hover/btn:scale-110" />
                            View Case
                          </button>
                        )}

                        {escrow.status === 'COMPLETED' && (
                          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest px-3 py-1.5">
                            Protected
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {/* Sidebar Allocation Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-5">
            <p className="label-caps !text-[10px] !text-rui-dark">Fund allocation</p>
            <div className="space-y-6">
              {contracts.slice(0, 3).map((escrow, i) => (
                <div key={escrow.id} className="space-y-2.5">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-rui-success' : i === 1 ? 'bg-rui-warning' : 'bg-rui-blue'}`} />
                      <div>
                        <p className="text-[10px] font-bold text-rui-dark leading-none">{escrow.project?.title}</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          {Math.round((escrow.totalAmount / totalSecured) * 100)}% of total
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] font-financial font-bold text-rui-dark">${escrow.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${i === 0 ? 'bg-rui-success' : i === 1 ? 'bg-rui-warning' : 'bg-rui-blue'}`} 
                      style={{ width: `${(escrow.totalAmount / totalSecured) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-rui-success/5 border border-rui-success/10 rounded-2xl p-6 space-y-3">
            <p className="label-caps !text-[8px] !text-rui-success">Total secured in vault</p>
            <p className="text-3xl font-financial font-bold text-rui-success tracking-tight">
              ${totalSecured.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
