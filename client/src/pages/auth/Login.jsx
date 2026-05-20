import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye,
  EyeOff
} from "lucide-react";
import toast from '../../utils/toast';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] px-2 sm:px-0 space-y-6 relative z-10"
      >
        <div className="flex flex-col items-center gap-3">
          <Link to="/">
            <span className="inline-block px-5 py-0.5 border-2 border-zinc-900 bg-zinc-50/10 rounded-[50%] text-xl md:text-2xl font-logo font-bold text-zinc-900 select-none -rotate-[6deg] transform origin-center transition-all shadow-[0_3px_6px_rgba(24,24,27,0.04),_0_1px_3px_rgba(24,24,27,0.08)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.15)] hover:scale-105 hover:bg-emerald-50/30 hover:border-emerald-600 duration-200">
              Freelance<span className="text-emerald-600">Guard</span>
            </span>
          </Link>
          <div className="text-center space-y-1">
             <h2 className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">Welcome back</h2>
             <p className="text-xs font-medium text-zinc-400">"Secure your work. Protect your income."</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-4">
               <div className="space-y-2">
                 <div className="flex items-center gap-2 px-1">
                   <Mail size={14} className="text-zinc-400" />
                   <label className="text-xs font-bold text-zinc-500">Email Address</label>
                 </div>
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all"
                   placeholder="Enter your email address"
                   required
                 />
               </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <Lock size={14} className="text-zinc-400" />
                    <label className="text-xs font-bold text-zinc-500">Password</label>
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
             </div>

             <div className="pt-2">
               <button 
                 type="submit" 
                 disabled={loading} 
                 className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-sm font-bold shadow-2xl shadow-zinc-900/10 hover:bg-emerald-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
               >
                 {loading ? "Signing in..." : (
                   <>
                    Sign in
                    <ArrowRight size={16} />
                   </>
                 )}
               </button>
             </div>
           </form>
        </div>

        <p className="text-center text-sm font-medium text-zinc-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-600 font-bold hover:underline">
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
