import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";

import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[400px] space-y-10"
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
            <h1 className="text-2xl font-bold tracking-tight text-rui-dark">Welcome back</h1>
            <p className="text-xs font-medium text-gray-400">Sign in to your account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 bg-transparent border-b border-gray-100 text-sm font-medium focus:border-rui-success outline-none transition-all placeholder:text-gray-200"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
                <Link to="#" className="text-[9px] font-bold text-gray-300 hover:text-rui-success transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 bg-transparent border-b border-gray-100 text-sm font-medium focus:border-rui-success outline-none transition-all placeholder:text-gray-200"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-4 bg-rui-success text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-rui-success/90 transition-all shadow-lg shadow-rui-success/20"
          >
            Sign in
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-[11px] font-bold text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-rui-success hover:underline">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
