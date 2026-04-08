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
    <div className="min-h-screen flex items-center justify-center bg-rui-light p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Symmetric Brand Header */}
        <div className="mb-8 md:mb-12 text-center space-y-2">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight uppercase">
            Freelance<span className="text-rui-blue">Guard</span>
          </Link>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-[2px] w-4 bg-rui-gray-border"></div>
            <span className="text-[9px] md:text-[10px] font-bold text-rui-gray-muted tracking-[0.3em] uppercase">Auth Layer</span>
            <div className="h-[2px] w-4 bg-rui-gray-border"></div>
          </div>
        </div>

        {/* Boxy Form Container - Structured Auth Aesthetic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="auth-card w-full space-y-8"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-rui-dark">Welcome Back</h2>
            <p className="text-xs md:text-sm font-semibold text-rui-gray-muted">Access your secure workspace</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rui-danger/10 border border-rui-danger text-rui-danger px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-wider text-center"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-rui-dark uppercase tracking-widest block pl-1">Email Terminal</label>
                <input
                  type="email"
                  required
                  className="auth-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-rui-dark uppercase tracking-widest block pl-1">Private Code</label>
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
              className="auth-button"
            >
              Authorize
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[10px] md:text-xs font-bold text-rui-gray-muted uppercase tracking-widest">
              No account?{" "}
              <Link to="/register" className="text-rui-blue hover:underline font-bold">Create One</Link>
            </p>
          </div>
        </motion.div>
        
        <p className="mt-8 md:mt-12 text-[9px] md:text-[10px] font-bold text-rui-gray-muted uppercase tracking-[0.4em]">Encryption Active</p>
      </motion.div>
    </div>
  );
}
