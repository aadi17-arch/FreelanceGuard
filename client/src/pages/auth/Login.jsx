import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { FormInput, FormButton } from '../../components/ui/AuthFormComponents';
import toast from 'react-hot-toast';
import { z } from 'zod';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // 1. Validate form data
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors(formattedErrors);
      setIsLoading(false);
      return toast.error("Please fix the errors below.");
    }

    // 2. Perform API Authentication
    try {
      const data = await login(formData.email, formData.password);


      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || "Connection failed. Please check your server.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-emerald-500/20">
      <div className="w-full max-w-[440px] space-y-10">

        <div className="text-center space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10 group-hover:bg-emerald-500 transition-all">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Freelance<span className="text-emerald-500">Guard</span></span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Welcome Back</h1>
            <p className="text-sm font-medium text-zinc-500">Log in to manage your projects and payments.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              autoFocus
              required
              value={formData.email}
              error={errors.email?.[0]}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="space-y-2">
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                required
                value={formData.password}
                error={errors.password?.[0]}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" title="Recover password" className="text-xs font-semibold text-zinc-500 hover:text-emerald-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-1">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-200 bg-zinc-50'}`}
            >
              {rememberMe && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
            <label className="text-sm font-medium text-zinc-500 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
              Remember me
            </label>
          </div>

          <FormButton isLoading={isLoading}>
            Sign In <ArrowRight size={18} />
          </FormButton>
        </form>

        <div className="space-y-6 pt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
            <div className="relative flex justify-center text-[12px] font-bold text-zinc-400 bg-white px-4">Or continue with</div>
          </div>

          <button type="button" className="w-full py-3.5 bg-zinc-50 border-2 border-zinc-50 rounded-xl flex items-center justify-center gap-3 text-zinc-500 font-bold hover:bg-white hover:border-zinc-200 hover:text-zinc-900 transition-all active:scale-95">
            <User size={18} /> Social Login
          </button>

          <p className="text-center text-sm font-medium text-zinc-500">
            New here? <Link to="/register" className="text-emerald-500 font-bold hover:underline">Create an account</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
