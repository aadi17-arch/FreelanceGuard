import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  PlusContainer, 
  FileText, 
  PenTool, 
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Plus
} from "lucide-react";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:5001/api/projects/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initialize project");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-rui-light"
    >
      {/* Organic Header */}
      <nav className="bg-white border-b border-rui-gray-border px-4 py-4 md:px-8">
        <div className="section-container !px-0 flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <Link to="/dashboard" className="p-2 hover:bg-rui-light rounded-full transition-colors text-rui-gray-muted hover:text-rui-dark">
                <ArrowLeft size={20} />
             </Link>
             <span className="text-sm md:text-base font-bold tracking-tight uppercase">
                Freelance<span className="text-rui-blue">Guard</span>
             </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-rui-blue text-white flex items-center justify-center font-bold text-xs uppercase">
              {user?.name?.[0]}
            </div>
          </div>
        </div>
      </nav>

      <main className="section-container py-12 md:py-20 max-w-4xl">
        <motion.div variants={containerVariants} className="space-y-12">
          
          {/* Form Header */}
          <motion.header variants={itemVariants} className="space-y-2">
            <div className="flex items-center gap-2 text-rui-blue mb-4">
              <ShieldCheck size={16} strokeWidth={2} />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Phase 01: Initiation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Initialize Your Project</h1>
            <p className="text-rui-gray-muted text-sm md:text-lg font-medium max-w-xl">
              Describe your requirements to activate 
              <span className="text-rui-dark font-bold"> Escrow Protection</span> and start receiving verified bids.
            </p>
          </motion.header>

          {/* Form Card - Organic Style */}
          <motion.div variants={itemVariants} className="rui-card-organic !p-0 overflow-hidden shadow-2xl shadow-black/[0.03]">
            <form onSubmit={handleSubmit} className="divide-y divide-rui-gray-border">
              
              {/* Error Message */}
              {error && (
                <div className="p-6 bg-rui-danger/5 border-b border-rui-danger/20 text-rui-danger text-xs font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              {/* Title Section */}
              <div className="p-8 md:p-12 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-rui-light rounded-2xl text-rui-blue">
                    <PenTool size={20} strokeWidth={2} />
                  </div>
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rui-dark">Naming the Core</label>
                </div>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full text-2xl md:text-4xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-rui-gray-border text-rui-dark"
                  placeholder="e.g. Design a Banking Dashboard"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Description Section */}
              <div className="p-8 md:p-12 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-rui-light rounded-2xl text-rui-gray-muted">
                    <FileText size={20} strokeWidth={2} />
                  </div>
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-rui-dark">Specifications & Parameters</label>
                </div>
                <textarea
                  name="description"
                  required
                  rows={8}
                  className="w-full text-base md:text-xl font-medium bg-transparent border-none focus:ring-0 placeholder:text-rui-gray-border text-rui-dark resize-none leading-relaxed"
                  placeholder="Provide detailed project requirements, expected outcomes, and technical parameters..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Action Section */}
              <div className="p-8 md:p-12 bg-rui-light/50 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4 text-rui-gray-muted">
                  <div className="w-2 h-2 rounded-full bg-rui-success animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Network Status: Secured</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn-pill-primary w-full md:w-auto flex items-center gap-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      Encrypting...
                    </span>
                  ) : (
                    <>
                      Launch Protocol
                      <ChevronRight size={18} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          <motion.footer variants={itemVariants} className="text-center">
            <p className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-[0.3em]">
              All data is end-to-end encrypted and legally verified.
            </p>
          </motion.footer>

        </motion.div>
      </main>
    </motion.div>
  );
}
