import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FormInput, FormButton } from '../../components/ui/AuthFormComponents';
import toast from 'react-hot-toast';
import { z } from 'zod';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
const registerSchema = z.object({
  name: z.string().min(3, "Enter valid name"),
  email: z.string().email("Please enter valid email address"),
  password: z.string().min(8, "Password must be at least characters"),
  role: z.enum(['FREELANCER', 'CLIENT']),
  confirmPassword: z.string().min(8, "Password must be at least characters"),
}).refine(
  data => data.password === data.confirmPassword, {
  message: "Password do not match", path: ["confirmPassword"]
});

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'FREELANCER'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return toast.error("Passwords do not match.");
    }
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors(formattedErrors);
      setIsLoading(false);
      return toast.error("Please fix the errors below");
    }
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      setShowSuccess(true);
      setTimeout(() =>
        navigate('/dashboard'), 2500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-emerald-500/20">
      {!showSuccess ? (
        <div className="w-full max-w-[480px] space-y-10">
          <div className="text-center space-y-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">Freelance<span className="text-emerald-500">Guard</span></span>
            </Link>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Create an account</h1>
              <p className="text-sm font-medium text-zinc-500">Join the network to secure your projects and payments.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'FREELANCER', label: 'Freelancer', icon: Briefcase },
                  { id: 'CLIENT', label: 'Client', icon: User }
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={`
                      p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                      ${formData.role === role.id
                        ? 'border-emerald-500 bg-emerald-50/30 text-zinc-900'
                        : 'border-zinc-200 bg-zinc-50/50 text-zinc-400 hover:border-zinc-300 hover:text-zinc-500'}
                    `}
                  >
                    <role.icon size={20} strokeWidth={formData.role === role.id ? 2.5 : 2} />
                    <span className="text-[13px] font-bold">{role.label}</span>
                  </button>
                ))}
              </div>

              <FormInput
                label="Full Name"
                name="name"
                placeholder="Enter your name"
                icon={User}
                autoFocus
                required
                value={formData.name}
                error={errors.name?.[0]}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                icon={Mail}
                required
                value={formData.email}
                error={errors.email?.[0]}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  icon={Lock}
                  required
                  value={formData.password}
                  error={errors.password?.[0]}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  icon={Lock}
                  required
                  value={formData.confirmPassword}
                  error={errors.confirmPassword?.[0]}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="px-1 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400">
                  <span>Password Strength</span>
                  <span className="text-emerald-500">Secure</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 px-1">
              <button
                type="button"
                onClick={() => setAgreedTerms(!agreedTerms)}
                className={`mt-0.5 w-5 h-5 min-w-[20px] rounded-md border-2 transition-all flex items-center justify-center ${agreedTerms ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-200 bg-zinc-50'}`}
              >
                {agreedTerms && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>
              <label className="text-xs font-medium text-zinc-500 leading-relaxed cursor-pointer" onClick={() => setAgreedTerms(!agreedTerms)}>
                I agree to the <span className="text-zinc-900 font-bold">Terms of Service</span> and the <span className="text-zinc-900 font-bold">Privacy Policy</span>.
              </label>
            </div>

            <FormButton isLoading={isLoading} disabled={!agreedTerms}>
              Sign Up <ArrowRight size={18} />
            </FormButton>
          </form>

          <p className="text-center text-sm font-medium text-zinc-500">
            Already have an account? <Link to="/login" className="text-emerald-500 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      ) : (
        <div className="text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/30">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Account Created</h1>
            <p className="text-sm font-medium text-zinc-500">Success! Redirecting you to the login page...</p>
          </div>
        </div>
      )}
    </div>
  );
}
