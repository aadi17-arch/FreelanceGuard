import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Lock, ChevronRight, CheckCircle2, ArrowRight, UserCheck, Activity, Globe, FileText, Bell, CreditCard, Scale, Menu, X } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-rui-dark flex flex-col items-center overflow-x-hidden font-body selection:bg-rui-success/20">
      
      {/* 1. Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-5 py-5 md:py-6 flex items-center justify-between z-[100] sticky top-0 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-rui-success rounded flex items-center justify-center">
            <ShieldCheck size={12} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Freelance <span className="text-rui-success font-medium">Guard</span></span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-600">
          <a href="#features" className="hover:text-rui-dark transition-colors">Features</a>
          <a href="#pricing" className="hover:text-rui-dark transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-rui-dark transition-colors">Docs</a>
          <Link to="/login" className="hover:text-rui-dark transition-colors">Sign In</Link>
          <Link to="/register" className="bg-rui-success text-white px-5 py-2.5 rounded-lg font-bold hover:bg-rui-success/90 transition-all">Get started free</Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-rui-dark transition-colors"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-6 md:hidden shadow-xl"
            >
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-gray-600">Features</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-gray-600">Pricing</a>
              <a href="#docs" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-gray-600">Docs</a>
              <hr className="border-gray-50" />
              <Link to="/login" className="text-sm font-bold text-gray-600">Sign In</Link>
              <Link to="/register" className="bg-rui-success text-white py-4 rounded-lg font-bold text-center text-sm">Get started free</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section */}
      <section className="w-full max-w-5xl mx-auto pt-16 pb-28 md:pt-32 md:pb-40 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-rui-success/5 border border-rui-success/10 rounded-full mb-8 md:mb-10"
        >
          <div className="w-1 h-1 bg-rui-success rounded-full animate-pulse-subtle" />
          <span className="text-[9px] md:text-[10px] font-bold text-rui-success uppercase tracking-[0.15em]">Institutional escrow protocol active</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] md:leading-[0.95] mb-6 md:mb-8 text-rui-dark"
        >
          Secure your freelance projects <br className="hidden sm:block" />
          <span className="text-rui-success font-medium italic">from contract to payment</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium"
        >
          FreelanceGuard holds payments in escrow, releases them on milestone approval, and resolves disputes fairly. Both sides protected, always.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5"
        >
          <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-rui-success text-white rounded-md font-bold hover:shadow-xl hover:shadow-rui-success/25 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
            Start a project <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <button className="w-full sm:w-auto px-10 py-4 bg-white border border-gray-200 text-gray-600 rounded-md font-bold hover:bg-gray-50 transition-all active:scale-[0.98]">
            View live demo
          </button>
        </motion.div>
      </section>

      {/* 3. Stats Bar */}
      <section className="w-full max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-12 py-12 md:py-16 border-y border-gray-50">
        {[
          { label: "Secured in vault", value: "$2.4M+" },
          { label: "Projects managed", value: "1,200+" },
          { label: "Dispute resolution", value: "98%" },
          { label: "Average rating", value: "4.9★" }
        ].map((stat, i) => (
          <div key={i} className="text-center space-y-1.5 group">
            <p className="text-2xl md:text-3xl font-bold text-rui-dark transition-transform group-hover:scale-105">{stat.value}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* 4. Features Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-40" id="features">
        <div className="text-center space-y-4 md:space-y-5 mb-20 md:mb-32">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-rui-dark">Everything you need to work safely</h2>
          <p className="text-sm md:text-base text-gray-500 font-medium max-w-xl mx-auto">Built for independent professionals who want absolute peace of mind on every single engagement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-16 md:gap-y-24">
          {[
            { 
              title: "Vault-backed payments", 
              desc: "Funds are held in secure protocol nodes until milestones are verified. No more chasing invoices.", 
              icon: ShieldCheck 
            },
            { 
              title: "Milestone contracts", 
              desc: "Break projects into trackable milestones with automatic payment triggers on client approval.", 
              icon: Zap 
            },
            { 
              title: "Dispute resolution", 
              desc: "Institutional-grade dispute system with evidence upload and structured resolution workflow.", 
              icon: Scale 
            },
            { 
              title: "Legal layer signature", 
              desc: "Upload, sign, and store legally-binding contracts. Full document history for every project.", 
              icon: FileText 
            },
            { 
              title: "Real-time visibility", 
              desc: "Complete visibility into vault balances, released funds, and upcoming payment cycles.", 
              icon: Activity 
            },
            { 
              title: "Network alerts", 
              desc: "Instant notifications for milestones, payments, dispute updates, and contract signatures.", 
              icon: Bell 
            }
          ].map((feature, i) => (
            <div key={i} className="space-y-4 md:space-y-6 group">
              <div className="w-10 h-10 rounded-xl bg-rui-success/10 flex items-center justify-center text-rui-success transition-all group-hover:scale-110 group-hover:bg-rui-success group-hover:text-white">
                <feature.icon size={20} strokeWidth={2} />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-base md:text-lg font-bold text-rui-dark">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How it Works */}
      <section className="w-full bg-gray-50/40 py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20 md:mb-32">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-rui-dark uppercase">The Protocol</h2>
            <p className="text-gray-500 font-medium text-[10px] md:text-sm tracking-widest uppercase">Three steps to a protected project.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
            {[
              { step: "01", title: "Initialize contract", desc: "Define scope, milestones, and payment amounts. Both parties sign digitally in seconds." },
              { step: "02", title: "Lock capital", desc: "Client deposits funds into the secure vault. Capital is protected until work is approved." },
              { step: "03", title: "Execute release", desc: "Complete a milestone, client approves, and capital releases instantly to your verified wallet." }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-6 md:space-y-8">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto text-rui-success font-black text-sm shadow-sm">
                  {item.step}
                </div>
                <div className="space-y-2 md:space-y-4">
                  <h3 className="text-lg md:text-xl font-bold text-rui-dark">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 md:py-40 border-t border-gray-50" id="pricing">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-rui-dark">Transparent, volume-based pricing</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">One simple fee to secure your entire project lifecycle. No hidden charges.</p>
        </div>
        
        <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 text-center shadow-2xl shadow-gray-200/50 space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-rui-success uppercase tracking-[0.2em]">Institutional Tier</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-rui-dark">1%</span>
              <span className="text-gray-400 font-medium">per release</span>
            </div>
          </div>
          
          <ul className="text-left space-y-4 py-8 border-y border-gray-50">
            {[
              "Unlimited milestone contracts",
              "Institutional escrow protection",
              "Structured dispute resolution",
              "Legal document vault storage",
              "Priority network support"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <CheckCircle2 size={16} className="text-rui-success" /> {item}
              </li>
            ))}
          </ul>
          
          <Link to="/register" className="block w-full py-4 bg-rui-dark text-white rounded-xl font-bold hover:bg-black transition-all active:scale-[0.98]">
            Get started now
          </Link>
        </div>
      </section>

      {/* 5.5 Docs/FAQ Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 md:py-40 border-t border-gray-50" id="docs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-rui-dark">Institutional Security FAQ</h2>
            <p className="text-gray-500 font-medium leading-relaxed">Everything you need to know about how the FreelanceGuard protocol protects your capital and your work.</p>
            <div className="pt-4">
              <button className="inline-flex items-center gap-2 text-rui-success font-bold text-sm hover:gap-3 transition-all">
                Access full documentation <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-10">
            {[
              { q: "How secure is the vault?", a: "Funds are held in segregated, institutional-grade escrow nodes. Access requires multi-party milestone verification." },
              { q: "What happens in a dispute?", a: "Our structured resolution layer allows both parties to upload evidence. An impartial mediator reviews the history to release funds fairly." },
              { q: "Are contracts legally binding?", a: "Yes. Every project includes a legally-binding digital signature layer, and all documents are hashed and stored in your private vault." }
            ].map((faq, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-base font-bold text-rui-dark">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="w-full px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto bg-rui-success rounded-3xl md:rounded-[40px] p-10 md:p-32 text-center text-white space-y-8 md:space-y-12 shadow-2xl shadow-rui-success/20">
          <h2 className="text-3xl md:text-7xl font-bold tracking-tighter leading-tight md:leading-none">Ready to protect<br />your business?</h2>
          <p className="text-white/80 max-w-xl mx-auto font-medium text-base md:text-lg">Join 10,000+ top-tier freelancers who secure their income with FreelanceGuard.</p>
          <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 bg-white text-rui-dark rounded-md font-bold hover:bg-gray-50 transition-all shadow-2xl shadow-black/10 text-[10px] md:text-xs uppercase tracking-widest active:scale-[0.98]">
            Create free account <ArrowRight size={16} className="ml-3" />
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gray-100">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-center md:text-left">&copy; 2026 FreelanceGuard. Institutional Protocol Layer.</p>
        <div className="flex gap-8 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-rui-success transition-colors">Privacy</a>
          <a href="#" className="hover:text-rui-success transition-colors">Terms</a>
          <a href="#" className="hover:text-rui-success transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
