import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center atmospheric-bg p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Symmetric Brand Header */}
        <div className="mb-8 md:mb-12 text-center space-y-4">
          <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
            Freelance<span className="text-rui-blue">Guard</span>
          </Link>
          <div className="flex items-center justify-center space-x-3">
             <span className="text-[10px] font-bold text-rui-gray-muted tracking-[0.3em] uppercase">Auth Node</span>
          </div>
        </div>

        {/* Geometric Form Container */}
        <div className="rui-card-organic w-full space-y-8 shadow-2xl shadow-black/[0.02]">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-rui-dark">Verify Residency</h2>
            <p className="text-xs font-semibold text-rui-gray-muted">Access your encrypted workspace terminal.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rui-danger/5 border border-rui-danger/10 text-rui-danger px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-widest block pl-1">Email Terminal</label>
                <input
                  type="email"
                  required
                  className="w-full bg-rui-light/50 border border-rui-gray-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-rui-blue transition-colors"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-widest block pl-1">Access Protocol</label>
                <input
                  type="password"
                  required
                  className="w-full bg-rui-light/50 border border-rui-gray-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-rui-blue transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-pill-primary w-full !py-4"
            >
              Initialize Session
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-[10px] md:text-xs font-bold text-rui-gray-muted uppercase tracking-widest">
              No security clearance?{" "}
              <Link to="/register" className="text-rui-blue hover:underline font-bold">Register Now</Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 md:mt-12 text-[9px] md:text-[10px] font-bold text-rui-gray-muted uppercase tracking-[0.4em]">Protocol Version 2.4.0</p>
      </motion.div>
    </div>
  );
}
