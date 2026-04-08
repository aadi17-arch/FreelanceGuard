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
    <div className="min-h-screen flex items-center justify-center bg-rui-light p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Brand Header */}
        <div className="mb-8 md:mb-10 text-center space-y-2">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight uppercase">
            Freelance<span className="text-rui-blue">Guard</span>
          </Link>
          <div className="flex items-center justify-center space-x-2">
            <div className="h-[2px] w-4 bg-rui-gray-border"></div>
            <span className="text-[9px] md:text-[10px] font-bold text-rui-gray-muted tracking-[0.3em] uppercase">Registration Layer</span>
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-rui-dark">New Account</h2>
            <p className="text-xs md:text-sm font-semibold text-rui-gray-muted">Join the global workforce</p>
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
                <label className="text-[9px] md:text-[10px] font-bold text-rui-dark uppercase tracking-widest block pl-1">Legal Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="auth-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-rui-dark uppercase tracking-widest block pl-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="auth-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-bold text-rui-dark uppercase tracking-widest block pl-1">Security Key</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="auth-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] font-bold text-rui-dark uppercase tracking-widest block pl-1 text-center">Identity</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "CLIENT" })}
                    className={`py-2 md:py-3 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                      formData.role === "CLIENT"
                        ? "bg-rui-dark text-white shadow-md shadow-black/10"
                        : "bg-rui-light text-rui-gray-muted border border-rui-gray-border"
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "FREELANCER" })}
                    className={`py-2 md:py-3 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                      formData.role === "FREELANCER"
                        ? "bg-rui-dark text-white shadow-md shadow-black/10"
                        : "bg-rui-light text-rui-gray-muted border border-rui-gray-border"
                    }`}
                  >
                    Partner
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
            >
              Initialize
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[10px] md:text-xs font-bold text-rui-gray-muted uppercase tracking-widest">
              Joined?{" "}
              <Link to="/login" className="text-rui-blue hover:underline font-bold">Log In</Link>
            </p>
          </div>
        </motion.div>
        
        <p className="mt-8 md:mt-12 text-[9px] md:text-[10px] font-bold text-rui-gray-muted uppercase tracking-[0.4em]">Global Protocol v1.0</p>
      </motion.div>
    </div>
  );
}
