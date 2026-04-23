import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tight uppercase">
            Freelance<span className="text-[#1D9E75]">Guard</span>
          </Link>
          <div className="flex items-center justify-center space-x-3">
             <span className="label-caps opacity-60">New Account Registration</span>
          </div>
        </div>

        {/* Geometric Form Container */}
        <div className="rui-card-organic w-full space-y-8 shadow-2xl shadow-black/[0.02] p-10 md:p-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-rui-dark">Create Account</h2>
            <p className="body-small opacity-60 uppercase">Join the secure freelance marketplace.</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rui-danger/5 border border-rui-danger/10 text-rui-danger px-4 py-3 rounded-xl label-caps !text-center">
                {error}
              </div>
            )}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label-caps ml-1">Legal Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-rui-light/50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#1D9E75]/30 focus:bg-white transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps ml-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "CLIENT" })}
                      className={`py-4 rounded-xl label-caps transition-all ${
                        formData.role === "CLIENT"
                          ? "bg-[#1D9E75] text-white shadow-xl shadow-[#1D9E75]/20"
                          : "bg-rui-light text-rui-gray-muted border-2 border-transparent hover:border-rui-gray-border/30"
                      }`}
                    >
                      Client
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "FREELANCER" })}
                      className={`py-4 rounded-xl label-caps transition-all ${
                        formData.role === "FREELANCER"
                          ? "bg-[#1D9E75] text-white shadow-xl shadow-[#1D9E75]/20"
                          : "bg-rui-light text-rui-gray-muted border-2 border-transparent hover:border-rui-gray-border/30"
                      }`}
                    >
                      Freelancer
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-caps ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-rui-light/50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#1D9E75]/30 focus:bg-white transition-all"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="label-caps ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full bg-rui-light/50 border-2 border-transparent rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#1D9E75]/30 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-rui-dark text-white rounded-xl label-caps !text-white hover:bg-[#1D9E75] transition-all shadow-xl shadow-black/5"
            >
              Create Account
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="label-caps opacity-60">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1D9E75] hover:underline font-black">Log In</Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 md:mt-12 label-caps opacity-20">Verified User Network • Secure Access</p>
      </motion.div>
    </div>
  );
}
