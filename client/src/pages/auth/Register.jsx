import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FREELANCER",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;
    try {
      await register(name, email, password, role);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] space-y-10"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-rui-success rounded flex items-center justify-center">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-rui-dark">Freelance<span className="text-rui-success font-medium">Guard</span></span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-rui-dark">Create your account</h1>
            <p className="text-xs font-medium text-gray-400">Start protecting your projects today</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Full Name</label>
              <input
                type="text"
                placeholder="Alex Kim"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full py-3 bg-transparent border-b border-gray-100 text-sm font-medium focus:border-rui-success outline-none transition-all placeholder:text-gray-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full py-3 bg-transparent border-b border-gray-100 text-sm font-medium focus:border-rui-success outline-none transition-all placeholder:text-gray-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full py-3 bg-transparent border-b border-gray-100 text-sm font-medium focus:border-rui-success outline-none transition-all placeholder:text-gray-200"
                required
              />
            </div>

            {/* Role Toggle */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">I am a...</label>
              <div className="flex bg-gray-50 rounded-lg p-1 relative cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "FREELANCER" })}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] z-10 transition-colors duration-200 relative ${formData.role === "FREELANCER" ? "text-rui-success" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {formData.role === "FREELANCER" && (
                    <motion.div 
                      layoutId="activeRole"
                      className="absolute inset-0 bg-rui-success/10 border border-rui-success/20 rounded-md z-[-1]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "CLIENT" })}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] z-10 transition-colors duration-200 relative ${formData.role === "CLIENT" ? "text-rui-success" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {formData.role === "CLIENT" && (
                    <motion.div 
                      layoutId="activeRole"
                      className="absolute inset-0 bg-rui-success/10 border border-rui-success/20 rounded-md z-[-1]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  Client
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-4 bg-rui-success text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-rui-success/90 transition-all shadow-lg shadow-rui-success/20"
            >
              Create account
            </motion.button>
            <p className="text-[10px] text-center text-gray-400 font-medium leading-relaxed">
              By signing up you agree to our <Link to="#" className="text-gray-600 hover:underline">Terms</Link> and <Link to="#" className="text-gray-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-[11px] font-bold text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-rui-success hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
