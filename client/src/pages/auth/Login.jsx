import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tight uppercase">
            Freelance<span className="text-[#1D9E75]">Guard</span>
          </Link>
          <div className="flex items-center justify-center space-x-3">
             <span className="label-caps opacity-60">Professional Authentication</span>
          </div>
        </div>

        {/* Geometric Form Container */}
        <div className="rui-card-organic w-full space-y-8 shadow-2xl shadow-black/[0.02] p-10 md:p-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-rui-dark">Login to Account</h2>
            <p className="body-small opacity-60 uppercase">Access your secure workspace.</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rui-danger/5 border border-rui-danger/10 text-rui-danger px-4 py-3 rounded-xl label-caps !text-center">
                {error}
              </div>
            )}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="label-caps ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-rui-light/50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#1D9E75]/30 focus:bg-white transition-all"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="label-caps ml-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-rui-light/50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#1D9E75]/30 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-rui-dark text-white rounded-xl label-caps !text-white hover:bg-[#1D9E75] transition-all shadow-xl shadow-black/5"
            >
              Login
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="label-caps opacity-60">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#1D9E75] hover:underline font-black">Register Now</Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 md:mt-12 label-caps opacity-20">Secure Data Access • v2.4.0</p>
      </motion.div>
    </div>
  );
}
