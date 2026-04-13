import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center atmospheric-bg p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg flex flex-col items-center"
      >
        {/* Brand Header */}
        <div className="mb-8 md:mb-10 text-center space-y-4">
          <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
            Freelance<span className="text-rui-blue">Guard</span>
          </Link>
          <div className="flex items-center justify-center space-x-3">
             <span className="text-[10px] font-bold text-rui-gray-muted tracking-[0.3em] uppercase">Genesis Layer</span>
          </div>
        </div>

        {/* Geometric Form Container */}
        <div className="rui-card-organic w-full space-y-8 shadow-2xl shadow-black/[0.02]">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-rui-dark">Security Registration</h2>
            <p className="text-xs font-semibold text-rui-gray-muted">Join the decentralized escrow network.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rui-danger/5 border border-rui-danger/10 text-rui-danger px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-widest block pl-1">Legal Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-rui-light/50 border border-rui-gray-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-rui-blue transition-colors"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-widest block pl-1">Identity</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "CLIENT" })}
                      className={`py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                        formData.role === "CLIENT"
                          ? "bg-rui-blue text-white shadow-xl shadow-rui-blue/20"
                          : "bg-rui-light text-rui-gray-muted border border-rui-gray-border"
                      }`}
                    >
                      Client
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "FREELANCER" })}
                      className={`py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                        formData.role === "FREELANCER"
                          ? "bg-rui-blue text-white shadow-xl shadow-rui-blue/20"
                          : "bg-rui-light text-rui-gray-muted border border-rui-gray-border"
                      }`}
                    >
                      Partner
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-widest block pl-1">Email Node</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-rui-light/50 border border-rui-gray-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-rui-blue transition-colors"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-rui-gray-muted uppercase tracking-widest block pl-1">Private Key</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full bg-rui-light/50 border border-rui-gray-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-rui-blue transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-pill-primary w-full !py-4"
            >
              Initialize Handshake
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-[10px] md:text-xs font-bold text-rui-gray-muted uppercase tracking-widest">
              Already Authored?{" "}
              <Link to="/login" className="text-rui-blue hover:underline font-bold">Log In</Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 md:mt-12 text-[9px] md:text-[10px] font-bold text-rui-gray-muted uppercase tracking-[0.4em]">Node Connection Secured</p>
      </motion.div>
    </div>
  );
}
