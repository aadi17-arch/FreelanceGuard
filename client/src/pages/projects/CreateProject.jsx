import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
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
      {/* Back to Dashboard Link */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-[#666666] hover:text-[#111111] transition-colors group">
          <ArrowLeft size={14} className="text-[#10b981] group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-bold">Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[12px] p-[28px] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Title Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#666666]">Project title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Enter your project title"
              value={formData.title}
              onChange={handleChange}
              className="w-full text-xs font-medium text-[#111111] placeholder:text-[#aaaaaa] bg-[#ffffff] border border-[#e5e5e5] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#10b981] transition-all"
            />
          </div>

          {/* Row of Category & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#666666]">Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-xs font-medium text-[#111111] bg-[#ffffff] border border-[#e5e5e5] rounded-[8px] px-3 py-2 appearance-none cursor-pointer focus:outline-none focus:border-[#10b981] transition-all"
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
              <label className="block text-xs font-bold text-[#666666]">Budget (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#aaaaaa]">$</span>
                <input
                  type="number"
                  name="budget"
                  required
                  placeholder="e.g. 500"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full pl-7 pr-3 py-2 text-xs font-medium text-[#111111] placeholder:text-[#aaaaaa] bg-[#ffffff] border border-[#e5e5e5] rounded-[8px] focus:outline-none focus:border-[#10b981] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#666666]">Project description</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe what you need, including goals and timeline"
              value={formData.description}
              onChange={handleChange}
              className="w-full text-xs font-medium text-[#111111] placeholder:text-[#aaaaaa] bg-[#ffffff] border border-[#e5e5e5] rounded-[8px] p-3 resize-none focus:outline-none focus:border-[#10b981] transition-all"
            />
          </div>

          {/* Buttons Row */}
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

      {/* Trust Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "Safe payments", desc: "Your money is held securely until you approve the work.", icon: <ShieldCheck size={16} className="text-[#10b981]" /> },
          { title: "Job agreement", desc: "A professional agreement is created automatically.", icon: <Fingerprint size={16} className="text-[#10b981]" /> }
        ].map((item, i) => (
          <div key={i} className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-[16px] space-y-2">
            <div className="flex items-center gap-2 text-[#111111]">
              <div>{item.icon}</div>
              <p className="text-xs font-bold">{item.title}</p>
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
