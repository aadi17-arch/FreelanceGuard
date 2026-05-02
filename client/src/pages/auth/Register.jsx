import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  Shield, 
  User, 
  Mail, 
  Lock, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FREELANCER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length === 0) return 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(formData.password);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { name, email, password, role } = formData;
      const success = await register(name, email, password, role);
      if (success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[460px] space-y-10 relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-6">
          <Link to="/" className="group">
             <div className="w-16 h-16 bg-zinc-900 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
                <Shield size={32} className="text-emerald-500" />
             </div>
          </Link>
          <div className="text-center space-y-3">
             <h2 className="text-3xl font-bold tracking-tight text-zinc-900 leading-tight">Create your account</h2>
             <p className="text-sm font-medium text-zinc-400">Join the secure network for freelancers and clients</p>
          </div>
        </div>

        {/* Form Hub */}
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-zinc-200/50">
           <form onSubmit={handleSubmit} className="space-y-6">
             {/* Role Selector */}
             <div className="flex bg-zinc-50 p-1 rounded-2xl border border-zinc-100">
               {["FREELANCER", "CLIENT"].map((role) => (
                 <button
                   key={role}
                   type="button"
                   onClick={() => setFormData({ ...formData, role })}
                   className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                     formData.role === role 
                     ? "bg-white text-zinc-900 shadow-sm border border-zinc-100" 
                     : "text-zinc-400 hover:text-zinc-600"
                   }`}
                 >
                   {role === "FREELANCER" ? "I am a Freelancer" : "I am a Client"}
                 </button>
               ))}
             </div>

             <div className="space-y-4">
               {/* Full Name */}
               <div className="space-y-2">
                 <div className="flex items-center gap-2 px-1">
                   <User size={14} className="text-zinc-400" />
                   <label className="text-xs font-bold text-zinc-500">Full Name</label>
                 </div>
                 <input
                   type="text"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all"
                   placeholder="Enter your full name"
                   required
                 />
               </div>

               {/* Email */}
               <div className="space-y-2">
                 <div className="flex items-center gap-2 px-1">
                   <Mail size={14} className="text-zinc-400" />
                   <label className="text-xs font-bold text-zinc-500">Email Address</label>
                 </div>
                 <input
                   type="email"
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all"
                   placeholder="Enter your email address"
                   required
                 />
               </div>

                {/* Password */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-zinc-400" />
                      <label className="text-xs font-bold text-zinc-500">Password</label>
                    </div>
                    {formData.password && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        strength <= 2 ? "text-red-500" : strength <= 4 ? "text-amber-500" : "text-emerald-500"
                      }`}>
                        {strength <= 2 ? "Weak" : strength <= 4 ? "Medium" : "Secure"}
                      </span>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all pr-12"
                      placeholder="Create a strong password"
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

                  {/* Strength Meter Bars */}
                  <div className="flex gap-1.5 px-1 pt-1">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div 
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          strength >= step 
                            ? (strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-amber-500" : "bg-emerald-500")
                            : "bg-zinc-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
             </div>

             <div className="flex items-start gap-3 px-1 group">
               <input 
                 type="checkbox" 
                 required 
                 className="mt-1 w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
               />
               <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                 I agree to the{" "}
                 <Link 
                   to="/terms" 
                   onClick={(e) => e.stopPropagation()} 
                   className="text-emerald-600 font-bold hover:underline"
                 >
                   Terms of Service
                 </Link>{" "}
                 and{" "}
                 <Link 
                   to="/privacy" 
                   onClick={(e) => e.stopPropagation()} 
                   className="text-emerald-600 font-bold hover:underline"
                 >
                   Privacy Policy
                 </Link>.
               </p>
             </div>

             <div className="pt-2">
               <button 
                 type="submit" 
                 disabled={loading} 
                 className="w-full py-4 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-2xl shadow-zinc-900/10 hover:bg-emerald-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
               >
                 {loading ? "Creating account..." : (
                   <>
                    Create My Account
                    <ArrowRight size={16} />
                   </>
                 )}
               </button>
             </div>
           </form>
        </div>

        {/* Redirect Hub */}
        <p className="text-center text-sm font-medium text-zinc-400">
          Already a member?{" "}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
