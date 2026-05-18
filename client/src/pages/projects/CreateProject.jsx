import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from '../../utils/toast';
import {
  Package,
  FileText,
  PenTool,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  ArrowLeft,
  Fingerprint,
  Zap
} from "lucide-react";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Development",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role?.toUpperCase() !== "CLIENT") {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-xl font-bold text-zinc-900">Access Restricted</h2>
        <p className="text-sm text-zinc-500 max-w-xs">
          Only clients can post new projects to the platform.
        </p>
        <Link to="/dashboard" className="text-xs font-bold text-emerald-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/projects/create", formData);
      toast.success("Project created successfully.");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Project creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-[600px] mx-auto space-y-4 pb-4 px-4 lg:px-0">
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[#666666] hover:text-[#111111] transition-colors group">
          <ArrowLeft size={14} className="text-[#10b981] group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-bold">Back to Dashboard</span>
        </Link>
      </div>

      <div className="bg-[#ffffff] border border-[#cccccc] rounded-[12px] p-[28px] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#333333]">Project title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Enter your project title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-xs font-medium text-[#111111] placeholder:text-[#aaaaaa] bg-[#ffffff] border border-[#cccccc] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#10b981] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#333333]">Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-xs font-medium text-[#111111] bg-[#ffffff] border border-[#cccccc] rounded-[8px] px-3 py-2 appearance-none cursor-pointer focus:outline-none focus:border-[#10b981] transition-all"
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Writing">Writing</option>
                </select>
                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#666666] pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#333333]">Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#aaaaaa]">$</span>
                <input
                  type="number"
                  name="budget"
                  required
                  placeholder="e.g. 500"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2 text-xs font-medium text-[#111111] placeholder:text-[#aaaaaa] bg-[#ffffff] border border-[#cccccc] rounded-[8px] focus:outline-none focus:border-[#10b981] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#333333]">Project description</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe what you need, including goals and timeline"
              value={formData.description}
              onChange={handleChange}
              className="w-full text-xs font-medium text-[#111111] placeholder:text-[#aaaaaa] bg-[#ffffff] border border-[#cccccc] rounded-[8px] p-3 resize-none focus:outline-none focus:border-[#10b981] transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-xs font-bold text-[#666666] hover:text-[#111111] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#111111] hover:bg-[#333333] text-white rounded-[8px] text-xs font-bold transition-all disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
