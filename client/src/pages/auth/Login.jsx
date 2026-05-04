import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Fingerprint,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";

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
        toast.success("Welcome back!", {
          style: {
            background: '#18181b',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 'bold'
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        });
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] px-2 sm:px-0 space-y-10 relative z-10"
      >
        {/* Brand Core */}
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="group">
             <div className="w-16 h-16 bg-zinc-900 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
                <Shield size={32} className="text-emerald-500" />
             </div>
          </Link>
          <div className="text-center space-y-3">
             <h2 className="text-3xl font-bold tracking-tight text-zinc-900 leading-tight">Welcome back</h2>
             <p className="text-sm font-medium text-zinc-400 italic">"Secure your work. Protect your income."</p>
          </div>
        </div>

        {/* Auth Hub */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-zinc-200/50">
           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-4">
               {/* Email Port */}
               <div className="space-y-2">
                 <div className="flex items-center gap-2 px-1">
                   <Mail size={14} className="text-zinc-400" />
                   <label className="text-xs font-bold text-zinc-500">Email Address</label>
                 </div>
                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all"
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
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all pr-12"
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
                 className="w-full py-4 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-2xl shadow-zinc-900/10 hover:bg-emerald-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
               >
                 {loading ? "Signing in..." : (
                   <>
                    Sign in to Account
                    <ArrowRight size={16} />
                   </>
                 )}
               </button>
             </div>
           </form>
        </div>

        {/* Action Link */}
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
