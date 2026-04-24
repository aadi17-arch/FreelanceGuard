import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(name, email, password, role);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center atmospheric-bg p-4 md:p-8 relative">
      {/* Global Theme Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-xl bg-white border border-rui-gray-border shadow-sm hover:shadow-md transition-all text-rui-dark"
        >
          {isDarkMode ? <Sun size={20} className="text-rui-success" /> : <Moon size={20} />}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Symmetric Brand Header */}
        <div className="mb-8 md:mb-12 text-center flex flex-col items-center space-y-4">
          <Link to="/" className="flex flex-col items-center gap-3 group">
            <div className="p-3 rounded-2xl bg-white border border-rui-gray-border shadow-sm group-hover:shadow-md transition-all">
              <img src="logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-2xl md:text-3xl font-black tracking-tight uppercase text-rui-dark mt-2">
              FreelanceGuard
            </span>
          </Link>
          <div className="flex items-center justify-center space-x-3">
             <span className="label-caps opacity-60">Protocol Membership</span>
          </div>
        </div>

        {/* Geometric Form Container */}
        <div className="rui-card-organic w-full space-y-8 shadow-2xl p-10 md:p-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-rui-dark">Register</h2>
            <p className="body-small opacity-60 uppercase">Join the secure network</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rui-danger/5 border border-rui-danger/10 text-rui-danger px-4 py-3 rounded-xl label-caps !text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="label-caps ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="auth-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="label-caps ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="auth-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="label-caps ml-1">Account Role</label>
                <select 
                  className="auth-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="CLIENT">Client (Hirer)</option>
                  <option value="FREELANCER">Freelancer (Provider)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="label-caps ml-1">Password</label>
                <input
                  type="password"
                  required
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-button bg-rui-success hover:bg-rui-success/90"
            >
              Initialize Membership
            </button>
          </form>

          <div className="pt-6 border-t border-rui-gray-border/50 text-center">
            <p className="text-[11px] font-bold text-rui-gray-muted uppercase tracking-widest">
              Already a member?{" "}
              <Link to="/login" className="text-rui-success hover:underline ml-1">
                Login
              </Link>
            </p>
          </div>
        </div>
        
        {/* Back Link */}
        <Link to="/" className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rui-gray-muted hover:text-rui-dark transition-all">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
