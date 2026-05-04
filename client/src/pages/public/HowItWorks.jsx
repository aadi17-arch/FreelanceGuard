import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  Wallet, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  FileText,
  ShieldAlert
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Secure Agreement",
      desc: "Clients post work and freelancers apply. Once a choice is made, a digital agreement is created with a clear budget.",
      icon: <FileText size={24} />,
      color: "bg-blue-500"
    },
    {
      title: "2. The Secure Vault",
      desc: "Before work starts, the client sends funds to our Secure Vault (Escrow). The freelancer can see the money is safe but can't touch it yet.",
      icon: <Lock size={24} />,
      color: "bg-emerald-500"
    },
    {
      title: "3. Safe Release",
      desc: "Work is submitted and reviewed. Once the client is happy and approves, the money is instantly released to the freelancer.",
      icon: <Zap size={24} />,
      color: "bg-zinc-900"
    }
  ];

  const features = [
    {
      title: "Identity Checks",
      desc: "Every member goes through a quick check to prove they are a real person. This keeps our community safe for everyone.",
      icon: <UserCheck className="text-emerald-500" />
    },
    {
      title: "Keeping you safe",
      desc: "We use the same high-security standards as modern banks to keep your personal info and money safe.",
      icon: <ShieldCheck className="text-emerald-500" />
    },
    {
      title: "Dispute Support",
      desc: "If something doesn't go as planned, our professional moderators are here to help settle disagreements fairly.",
      icon: <ShieldAlert className="text-emerald-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Simple Navigation */}
      <nav className="px-6 py-8 flex justify-between items-center max-w-7xl mx-auto border-b border-zinc-50">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center shadow-xl shadow-zinc-900/10">
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <span className="text-sm font-black tracking-tighter text-zinc-900 uppercase">FreelanceGuard</span>
        </Link>
        <Link to="/login" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest">
          Sign In
        </Link>
      </nav>

      {/* 2. Hero Section */}
      <section className="px-6 py-20 lg:py-32 max-w-5xl mx-auto text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 mb-4"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Platform Protection</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-6xl font-black tracking-tighter text-zinc-900 leading-[0.9]"
        >
          HOW WE PROTECT <br /> <span className="text-emerald-500 italic">YOUR MONEY.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm lg:text-base text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          FreelanceGuard acts as a neutral middleman. We ensure that freelancers get paid for their work and that clients receive exactly what they purchased.
        </motion.p>
      </section>

      {/* 3. The 3-Step Process */}
      <section className="px-6 py-20 bg-zinc-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/20 space-y-8 group hover:border-emerald-500/20 transition-all"
            >
              <div className={`w-16 h-16 ${step.color} text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform`}>
                {step.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">{step.title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Security Highlights */}
      <section className="px-6 py-24 lg:py-40 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-zinc-900 leading-none">
              BANK-LEVEL SAFETY. <br /> <span className="text-zinc-400">WITHOUT THE HASSLE.</span>
            </h2>
            <p className="text-sm text-zinc-500 font-medium max-w-md">
              We've built FreelanceGuard on the same security standards used by modern banks to keep your funds and data safe.
            </p>
          </div>

          <div className="space-y-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-white border border-zinc-100 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  {f.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-zinc-900">{f.title}</h4>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full" />
          <div className="bg-zinc-900 rounded-[3rem] p-10 lg:p-16 text-white relative shadow-2xl space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Security Rating</p>
                <p className="text-xl font-black">99.9% Secure</p>
              </div>
            </div>
            
            <p className="text-zinc-400 font-medium italic text-lg leading-relaxed">
              "FreelanceGuard ensures that money only moves when everyone is happy. It's the new standard for professional trust."
            </p>

            <div className="pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Safe Payment System</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-[3rem] p-12 lg:p-20 space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none">READY TO WORK <br /> <span className="text-emerald-500">WITHOUT RISK?</span></h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <button className="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2">
                  Get Started Now <ArrowRight size={14} />
                </button>
              </Link>
              <Link to="/marketplace">
                <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Browse Projects
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-zinc-50 text-center">
        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
          © {new Date().getFullYear()} FreelanceGuard. Professional Payment Security.
        </p>
      </footer>
    </div>
  );
}
