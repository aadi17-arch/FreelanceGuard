import React, { useState, useEffect } from 'react';
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
  LifeBuoy,
  MessagesSquare,
  BookOpen,
  FileQuestion,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from '../../utils/toast';

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
      toast.error("Failed to load your support tickets.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesFilter = filter === 'ALL' ? true : d.status === filter;
    const matchesSearch = d.milestone?.contract?.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <RefreshCcw className="w-6 h-6 text-emerald-500" />
      <p className="text-xs font-bold text-zinc-400">Loading help center...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="relative w-full sm:w-80">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-[8px] text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all text-zinc-900 placeholder:text-zinc-400"
        />
      </div>

      <div className="border-b border-zinc-100" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Live chat",
            desc: "Chat with our support team in real time.",
            icon: <MessagesSquare size={24} className="text-emerald-500" />,
            action: "Start chat"
          },
          {
            title: "Help docs",
            desc: "Browse guides and answers to common questions.",
            icon: <BookOpen size={24} className="text-emerald-500" />,
            action: "Browse docs"
          },
          {
            title: "FAQ",
            desc: "Find quick answers to common questions.",
            icon: <FileQuestion size={24} className="text-emerald-500" />,
            action: "View FAQ"
          }
        ].map((item, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-[10px] p-[20px] flex flex-col justify-between min-h-[180px]">
            <div className="space-y-3">
              <div>{item.icon}</div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-900">{item.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                if (item.action === "Start chat") {
                  toast.success("Connecting you to support...");
                  setTimeout(() => {
                    toast.error("All agents are currently busy. Please email support@freelanceguard.com");
                  }, 1200);
                } else if (item.action === "Browse docs") {
                  navigate("/how-it-works");
                } else if (item.action === "View FAQ") {
                  setShowFaq(!showFaq);
                }
              }}
              className="mt-4 w-full py-2 bg-white border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 text-zinc-900 rounded-[8px] text-xs font-bold transition-all"
            >
              {item.action}
            </button>
          </div>
        ))}
      </div>

      {showFaq && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-[10px] p-6 space-y-4">
          <h4 className="text-xs font-bold text-zinc-900">
            Common questions about payments
          </h4>
          <div className="space-y-4 divide-y divide-zinc-200">
            {[
              { q: "How do safe payments work?", a: "When a contract starts, the client's payment is securely held by us. Funds are released to the freelancer only after the work is approved, ensuring protection for both sides." },
              { q: "What is the verification requirement?", a: "To maintain trust, users must verify their identity (e.g., Passport or Driver's License) before adding or withdrawing funds." },
              { q: "What happens if there is an issue?", a: "If an issue arises, any payment can be put on hold. Our team will then help review the situation and ensure a fair outcome for both parties." }
            ].map((faq, index) => (
              <div key={index} className="pt-4 first:pt-0 space-y-1">
                <p className="text-xs font-bold text-zinc-900">Q: {faq.q}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Case Management */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900">My support tickets</h2>
          <div className="md:hidden relative w-full pb-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-[10px] pl-4 pr-10 py-2.5 text-xs font-bold text-zinc-900 appearance-none focus:outline-none focus:border-emerald-500 hover:border-zinc-900 transition-all cursor-pointer"
            >
              <option value="ALL">All tickets</option>
              <option value="OPEN">Open</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-[calc(50%+4px)] pointer-events-none text-zinc-400">
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="hidden md:flex border-b border-zinc-100 gap-6 pb-0">
            {[
              { label: "All tickets", key: "ALL" },
              { label: "Open", key: "OPEN" },
              { label: "Resolved", key: "RESOLVED" }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`pb-2 px-1 text-xs font-bold transition-all relative ${
                  filter === f.key ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {f.label}
                {filter === f.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-[10px] overflow-hidden">
          {filteredDisputes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500">Ticket ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500">Project</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredDisputes.map((d) => (
                    <tr key={d.id} className="group hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => navigate(`/dispute/${d.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${d.status === 'OPEN' ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                          <span className="font-mono text-xs font-bold text-zinc-400">#{d.id.slice(0, 12)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-zinc-900">{d.milestone?.contract?.project?.title || "Payment help"}</p>
                        <p className="text-xs text-zinc-400 mt-1">Requested on {new Date(d.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] text-[10px] font-bold border ${d.status === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-600 border-transparent'
                            : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                          }`}>
                          {d.status === 'OPEN' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                          {d.status === 'OPEN' ? 'In progress' : 'Resolved'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2 text-zinc-400 group-hover:text-zinc-900 transition-colors">
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
              <div className="text-zinc-200 flex justify-center">
                <ShieldAlert size={28} />
              </div>
              <p className="text-sm font-bold text-zinc-900">No support tickets yet.</p>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">If you have an issue, use the options above to get help.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-[10px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-lg font-bold text-zinc-900">Need help right now?</h2>
          <p className="text-zinc-500 text-xs max-w-sm">Our support team is available to help you resolve any issues with your projects.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => {
              window.location.href = "mailto:support@freelanceguard.com";
            }}
            className="w-full sm:w-auto px-6 py-3 bg-zinc-900 text-white rounded-[8px] font-bold text-xs hover:bg-black transition-all"
          >
            Contact support
          </button>
          <button 
            onClick={() => {
              window.location.href = "mailto:support@freelanceguard.com";
            }}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-zinc-200 text-zinc-900 rounded-[8px] font-bold text-xs hover:border-zinc-900 transition-all"
          >
            Email us
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportHub;
