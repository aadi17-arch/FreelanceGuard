import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown,
  Search,
  ShieldAlert,
  Gavel,
  RefreshCcw,
  Fingerprint,
  LifeBuoy,
  MessagesSquare,
  BookOpen,
  FileQuestion,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SupportHub = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [showFaq, setShowFaq] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dispute', {
        withCredentials: true
      });
      setDisputes(response.data.disputes || []);
    } catch (error) {
      showStatus("Critical synchronization failure.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (msg, type) => {
    setStatusMessage({ msg, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesFilter = filter === 'ALL' ? true : d.status === filter;
    const matchesSearch = d.milestone?.contract?.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <RefreshCcw className="w-6 h-6 text-emerald-500" />
      </motion.div>
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400">Loading Help Center...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="relative w-full sm:w-80">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-[#ffffff] border border-[#e5e5e5] rounded-[8px] text-xs font-medium focus:outline-none focus:border-[#10b981] transition-all text-[#111111] placeholder:text-[#666666]"
        />
      </div>

      <div className="border-b border-[#e5e5e5]" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Live chat",
            desc: "Chat with our support team in real time.",
            icon: <MessagesSquare size={24} className="text-[#10b981]" />,
            action: "Start chat"
          },
          {
            title: "Help docs",
            desc: "Browse guides and answers to common questions.",
            icon: <BookOpen size={24} className="text-[#10b981]" />,
            action: "Browse docs"
          },
          {
            title: "FAQ",
            desc: "Find quick answers to the most asked questions.",
            icon: <FileQuestion size={24} className="text-[#10b981]" />,
            action: "View FAQ"
          }
        ].map((item, i) => (
          <div key={i} className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[20px] flex flex-col justify-between min-h-[180px]">
            <div className="space-y-3">
              <div>{item.icon}</div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#111111]">{item.title}</h3>
                <p className="text-xs text-[#666666] leading-relaxed">{item.desc}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                if (item.action === "Start chat") {
                  toast.success("Connecting to Secure Chat Broker...", {
                    style: { background: "#18181b", color: "#fff", borderRadius: "12px", fontSize: "13px" }
                  });
                  setTimeout(() => {
                    toast.error("All support agents are currently busy. Please email support@freelanceguard.com", {
                      style: { background: "#18181b", color: "#fff", borderRadius: "12px", fontSize: "13px" }
                    });
                  }, 1200);
                } else if (item.action === "Browse docs") {
                  navigate("/how-it-works");
                } else if (item.action === "View FAQ") {
                  setShowFaq(!showFaq);
                }
              }}
              className="mt-4 w-full py-2 bg-[#ffffff] border border-[#e5e5e5] hover:border-[#111111] hover:bg-zinc-50 text-[#111111] rounded-[8px] text-xs font-bold transition-all"
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic Sliding FAQ Accordion */}
      <AnimatePresence>
        {showFaq && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#fafafa] border border-[#e5e5e5] rounded-[10px] p-6 space-y-4 shadow-inner"
          >
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900">
              Frequently Asked Questions (Escrow Guide)
            </h4>
            <div className="space-y-4 divide-y divide-[#e5e5e5]">
              {[
                { q: "How does Secure Escrow Vault work?", a: "When a contract starts, client milestone funds are securely locked into the smart escrow registry. Funds are released to the freelancer only upon client work approval, ensuring complete financial protection." },
                { q: "What is the KYC requirement?", a: "To maintain maximum trust, users must verify identity credentials (e.g. Passport, Drivers License) before submitting wallet deposits or requesting balance withdrawals." },
                { q: "How does the dispute arbitration work?", a: "If an issue arises, any milestone can be disputed. Parties upload evidence files, and FreelanceGuard's dedicated support representatives arbitrate a fair release of funds." }
              ].map((faq, index) => (
                <div key={index} className="pt-4 first:pt-0 space-y-1">
                  <p className="text-xs font-bold text-zinc-900">Q: {faq.q}</p>
                  <p className="text-xs text-[#666666] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Case Management (Disputes) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-[#111111]">My support tickets</h2>
          <div className="md:hidden relative w-full pb-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] pl-4 pr-10 py-2.5 text-xs font-bold text-[#111111] appearance-none focus:outline-none focus:border-[#10b981] hover:border-[#111111] transition-all cursor-pointer"
            >
              <option value="ALL">All tickets</option>
              <option value="OPEN">Open</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-[calc(50%+4px)] pointer-events-none text-[#666666]">
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="hidden md:flex border-b border-[#e5e5e5] gap-6 pb-0">
            {[
              { label: "All tickets", key: "ALL" },
              { label: "Open", key: "OPEN" },
              { label: "Resolved", key: "RESOLVED" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`pb-2 px-1 text-xs font-bold transition-all relative ${
                  filter === f.key ? "text-[#111111]" : "text-[#666666] hover:text-[#111111]"
                }`}
              >
                {f.label}
                {filter === f.key && (
                  <motion.div layoutId="disputeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] overflow-hidden">
          {filteredDisputes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9f9f9] border-b border-[#e5e5e5]">
                    <th className="px-6 py-4 text-xs font-bold text-[#666666]">Case ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#666666]">Project Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#666666] text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#666666] text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {filteredDisputes.map((d) => (
                    <tr key={d.id} className="group hover:bg-[#f9f9f9] transition-colors cursor-pointer" onClick={() => navigate(`/dispute/${d.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${d.status === 'OPEN' ? 'bg-[#10b981]' : 'bg-[#e5e5e5]'}`} />
                          <span className="font-mono text-xs font-bold text-[#666666]">#{d.id.slice(0, 12)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#111111]">{d.milestone?.contract?.project?.title || "Payment Issue"}</p>
                        <p className="text-xs text-[#666666] mt-1">Started on {new Date(d.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] text-[10px] font-bold border ${d.status === 'OPEN'
                            ? 'bg-[#f0fdf4] text-[#10b981] border-transparent'
                            : 'bg-[#f9f9f9] text-[#666666] border-[#e5e5e5]'
                          }`}>
                          {d.status === 'OPEN' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                          {d.status?.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2 text-[#666666] group-hover:text-[#111111] transition-colors">
                          <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">View details</span>
                          <ChevronRight size={16} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="text-[#e5e5e5] flex justify-center">
                <ShieldAlert size={28} />
              </div>
              <p className="text-sm font-bold text-[#111111]">No support tickets yet.</p>
              <p className="text-xs text-[#666666] max-w-xs mx-auto">If you have an issue, use the options above to get help.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-[10px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-lg font-bold text-[#111111]">Need help right now?</h2>
          <p className="text-[#666666] text-xs max-w-sm">Our support team is available 24/7 to help you resolve any issues with your projects.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => {
              window.location.href = "mailto:support@freelanceguard.com?subject=FreelanceGuard Support Inquiry";
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#111111] text-[#ffffff] rounded-[8px] font-bold text-xs hover:bg-[#333333] transition-all"
          >
            Contact support
          </button>
          <button 
            onClick={() => {
              window.location.href = "mailto:support@freelanceguard.com?subject=FreelanceGuard Support Inquiry";
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#ffffff] border border-[#e5e5e5] text-[#111111] rounded-[8px] font-bold text-xs hover:border-[#111111] transition-all"
          >
            Email us
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportHub;
