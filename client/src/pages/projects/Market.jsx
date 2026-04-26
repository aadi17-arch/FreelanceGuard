import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Market() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const navigate = useNavigate();

  const tabs = ["All", "Active", "In Progress", "Review", "Completed"];

  useEffect(() => {
    const fetchAllProject = async () => {
      try {
        const res = await axios.get("/projects/all");
        setProjects(res.data);
      }
      catch (err) {
        console.log("Failed to Fetch marketplace");
      }
      finally {
        setLoading(false);
      }
    };
    fetchAllProject();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'OPEN':
        return 'bg-rui-success/10 text-rui-success border-rui-success/20';
      case 'IN PROGRESS':
        return 'bg-rui-blue/10 text-rui-blue border-rui-blue/20';
      case 'REVIEW':
        return 'bg-rui-warning/10 text-rui-warning border-rui-warning/20';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getProgressColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'IN PROGRESS': return 'bg-rui-blue';
      case 'REVIEW': return 'bg-rui-warning';
      case 'COMPLETED': return 'bg-rui-success';
      default: return 'bg-rui-success';
    }
  };

  const filteredProjects = projects.filter(p => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return p.status === "OPEN" || p.status === "ACTIVE";
    return p.status?.toUpperCase() === activeTab.toUpperCase();
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-rui-dark leading-none">Projects</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            {projects.length} total projects
          </p>
        </div>
        
        <Link to="/create-project">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-rui-success text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rui-success/90 transition-all shadow-lg shadow-rui-success/20 active:scale-95">
            <Plus size={14} strokeWidth={3} />
            New project
          </button>
        </Link>
      </div>

      {/* 2. Horizontal Status Tabs - Scrollable on Mobile */}
      <div className="mb-10 -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar border-b border-gray-50 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative ${
                activeTab === tab.id ? "text-rui-success" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabMarker"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-rui-success"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-rui-success/20 border-t-rui-success rounded-full animate-spin"></div>
          <p className="label-caps !text-rui-success !text-[9px]">Syncing Projects...</p>
        </div>
      ) : (
        <div className="w-full overflow-hidden relative">
          {/* Mobile Swipe Hint */}
          <div className="md:hidden flex items-center gap-2 mb-2 text-[8px] font-black uppercase tracking-widest text-gray-400 opacity-60">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            Swipe to view full data
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="">
                  <th className="px-2 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Project</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Client</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Amount</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Progress</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Created</th>
                </tr>
              </thead>
              <tbody className="">
                {filteredProjects.map((proj) => (
                  <tr 
                    key={proj.id} 
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/project/${proj.id}`)}
                  >
                    <td className="px-2 py-4.5">
                      <p className="text-sm font-bold text-rui-dark group-hover:text-rui-success transition-colors">
                        {proj.title}
                      </p>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <Circle size={8} fill="currentColor" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                          {proj.client?.name || "Verified Client"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusColor(proj.status)}`}>
                        {proj.status === 'OPEN' ? 'Active' : proj.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <p className="text-sm font-financial font-bold text-rui-dark">
                        ${proj.budget?.toLocaleString() || "0"}
                      </p>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-4 min-w-[120px]">
                        <div className="flex-grow h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: proj.status === 'COMPLETED' ? "100%" : proj.status === 'IN PROGRESS' ? "60%" : "20%" }}
                            className={`h-full ${getProgressColor(proj.status)}`}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                          {proj.status === 'COMPLETED' ? "3/3" : proj.status === 'IN PROGRESS' ? "2/3" : "1/3"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {new Date(proj.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProjects.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <Clock size={32} />
                </div>
                <p className="label-caps !text-gray-400 !text-[10px]">No projects found in this sector</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
