import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  FileText,
  UserCheck,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Simple Agreement",
      desc: "First, you and your partner agree on the work and the price. We create a simple digital contract that everyone can see and understand.",
      icon: <FileText size={20} />,
      color: "bg-zinc-100 text-zinc-900"
    },
    {
      title: "2. Safe Holding",
      desc: "Before any work starts, the client puts the payment into our safe holding system. The freelancer knows the money is there, so they can start working with confidence.",
      icon: <Lock size={20} />,
      color: "bg-emerald-600 text-white"
    },
    {
      title: "3. Easy Payment",
      desc: "Once the work is finished and the client is happy, the money is released instantly. No waiting for weeks or chasing invoices.",
      icon: <Zap size={20} />,
      color: "bg-zinc-900 text-white"
    }
  ];

  const features = [
    {
      title: "Real people only",
      desc: "We check every user to make sure they are real. This builds a community of trust where everyone is accountable.",
      icon: <UserCheck size={16} className="text-emerald-600" />
    },
    {
      title: "Bank-level safety",
      desc: "Your data and money are protected by the same systems used by professional banks.",
      icon: <ShieldCheck size={16} className="text-emerald-600" />
    },
    {
      title: "Fair support",
      desc: "If there's ever a misunderstanding, our team is here to help both sides reach a fair solution.",
      icon: <ShieldAlert size={16} className="text-emerald-600" />
    }
  ];

  return (
    <div className="public-page min-h-screen bg-white font-body overflow-x-hidden">
      {/* Navigation */}
      <nav className="px-4 py-5 md:px-6 md:py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-zinc-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-900/10">
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">Freelance<span className="text-emerald-600">Guard</span></span>
        </Link>
        <Link to="/login">
          <button className="px-5 py-2 bg-zinc-900 text-white rounded-2xl text-[11px] font-bold hover:bg-zinc-800 transition-all">
            Sign in
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-5 min-h-[calc(100vh-80px)] flex flex-col justify-center items-center max-w-5xl mx-auto text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.1] md:leading-[1.05]"
        >
          How we keep your <br className="hidden md:block" /> <span className="text-emerald-600">payments safe.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-base md:text-xl text-zinc-600 font-medium max-w-2xl mx-auto leading-relaxed px-2"
        >
          FreelanceGuard is a neutral space where money is only released when both sides are happy. We make sure work gets done and freelancers get paid.
        </motion.p>
      </section>

      {/* 3-Step Process */}
      <section className="px-5 py-16 md:py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white p-6 md:p-8 lg:p-10 rounded-[2.5rem] border border-zinc-200 shadow-sm space-y-6"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 ${step.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                {step.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">{step.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features List */}
      <section className="px-5 py-16 md:py-24 lg:py-40 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="space-y-10 md:space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              Professional safety <br className="hidden md:block" /> <span className="text-zinc-400">for everyone.</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-600 leading-relaxed max-w-md font-medium">
              We handle the complicated security stuff so you can focus on getting your work done.
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-4 md:gap-6 items-start"
              >
                <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-900">{f.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Simplified Info Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16 text-white space-y-8 md:space-y-10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-400 truncate">Safe platform</p>
              <p className="text-base md:text-xl font-bold truncate">Your trust is our priority</p>
            </div>
          </div>
          
          <p className="text-zinc-300 font-medium text-base md:text-lg leading-relaxed italic">
            "Money only moves when the job is done. This simple rule makes working together much safer for everyone involved."
          </p>

          <div className="pt-6 md:pt-8 border-t border-zinc-800 flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck size={14} className="text-emerald-500" />
            </div>
            <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Verified payment system</p>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-5 py-12 md:py-20 text-center max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-emerald-600 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 lg:p-20 space-y-8 md:space-y-10"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to start working <br className="hidden md:block" /> without the worry?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-4 bg-white text-emerald-700 rounded-2xl text-xs font-bold hover:bg-zinc-50 transition-colors flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10">
                Create your account <ArrowRight size={14} />
              </button>
            </Link>
            <Link to="/marketplace" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-4 bg-emerald-700 text-white rounded-2xl text-xs font-bold hover:bg-emerald-800 transition-colors border border-emerald-500/20">
                Browse projects
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-10 md:py-12 border-t border-zinc-100 text-center">
        <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          © {new Date().getFullYear()} FreelanceGuard. Simple and secure payments.
        </p>
      </footer>
    </div>
  );
}
