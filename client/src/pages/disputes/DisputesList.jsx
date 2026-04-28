import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Search,
  ShieldAlert,
  Gavel
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DisputesList = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, OPEN, RESOLVED
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/dispute', {
        withCredentials: true
      });
      setDisputes(response.data);
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(d => 
    filter === 'ALL' ? true : d.status === filter
  );

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Scale className="w-8 h-8 text-accent-primary" />
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Resolution Center</h1>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            Manage and track active institutional disputes
          </p>
        </div>
        
        <div className="flex bg-background-secondary p-1 rounded-xl border border-border-primary">
          {['ALL', 'OPEN', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                filter === f ? 'bg-accent-primary text-background-primary shadow-lg' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-background-secondary border border-border-primary p-6 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Active Disputes</p>
          <p className="text-3xl font-bold text-amber-500">{disputes.filter(d => d.status === 'OPEN').length}</p>
        </div>
        <div className="bg-background-secondary border border-border-primary p-6 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Total Resolved</p>
          <p className="text-3xl font-bold text-emerald-500">{disputes.filter(d => d.status === 'RESOLVED').length}</p>
        </div>
        <div className="bg-background-secondary border border-border-primary p-6 rounded-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">Avg. Resolution Time</p>
          <p className="text-3xl font-bold text-blue-500">4.2 Days</p>
        </div>
      </div>

      {/* Disputes Table/List */}
      <div className="bg-background-secondary border border-border-primary rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-primary/50">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-secondary border-b border-border-primary">Case ID</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-secondary border-b border-border-primary">Project / Milestone</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-secondary border-b border-border-primary">Amount</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-secondary border-b border-border-primary text-center">Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-text-secondary border-b border-border-primary text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/50">
              {filteredDisputes.map((d, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={d.id} 
                  className="group hover:bg-background-primary/30 transition-colors"
                >
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs font-bold text-accent-primary">#{d.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-text-primary mb-1">{d.milestone?.project?.title || "Contract Dispute"}</p>
                    <p className="text-[10px] text-text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Started {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-5 font-mono text-sm font-bold text-text-primary">
                    ${d.milestone?.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                      d.status === 'OPEN' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => navigate(`/dispute/${d.id}`)}
                      className="p-2 hover:bg-accent-primary hover:text-background-primary border border-border-primary rounded-xl transition-all group/btn shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredDisputes.length === 0 && (
            <div className="text-center py-20 px-4">
              <ShieldAlert className="w-12 h-12 text-text-secondary/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-secondary">No records found</h3>
              <p className="text-sm text-text-secondary/60 max-w-xs mx-auto mt-2">
                Your dispute history is currently empty. Cases will appear here once protocol is initiated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputesList;
