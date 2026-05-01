import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Lock, ChevronRight, CheckCircle2, ArrowRight, UserCheck, Activity, Globe, FileText, Bell, CreditCard, Scale, Menu, X, Users, Wallet, Check } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center overflow-x-hidden font-body selection:bg-emerald-500/20">
      
      {/* 1. Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-5 py-5 md:py-6 flex items-center justify-between z-[100] sticky top-0 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">Freelance<span className="text-emerald-500">Guard</span></span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-zinc-500">
          <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
          <Link to="/login" className="hover:text-zinc-900 transition-colors">Sign In</Link>
          <Link to="/register" className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-black/5">Create Account</Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
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
              className="absolute top-full left-0 w-full bg-white border-b border-zinc-100 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
            >
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-zinc-500">Features</a>
              <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-zinc-500">How it works</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-zinc-500">Pricing</a>
              <hr className="border-zinc-50" />
              <Link to="/login" className="text-sm font-semibold text-zinc-500">Sign In</Link>
              <Link to="/register" className="bg-emerald-500 text-white py-4 rounded-xl font-bold text-center text-sm">Create Free Account</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section */}
      <section className="w-full max-w-5xl mx-auto pt-16 pb-28 md:pt-28 md:pb-36 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-8 md:mb-10"
        >
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] md:text-[11px] font-bold text-emerald-600 tracking-tight">Institutional Escrow Protocol Active</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] md:leading-[1.05] mb-6 text-zinc-900"
        >
          Get paid securely <br className="hidden sm:block" />
          for every <span className="text-emerald-500 italic font-medium">freelance project</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium"
        >
          FreelanceGuard holds payments in escrow, releases them instantly on milestone approval, and protects both sides from payment risks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold text-[15px] hover:bg-emerald-600 transition-all shadow-xl shadow-black/5 flex items-center justify-center gap-2 active:scale-95 group">
              Create Free Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-xl font-bold text-[15px] hover:bg-zinc-50 transition-all active:scale-95 flex items-center justify-center">
              See how it works
            </a>
          </div>
          <p className="text-[11px] font-medium text-zinc-400">Takes 30 seconds · No credit card required</p>
        </motion.div>
      </section>

      {/* 3. Stats Bar */}
      <section className="w-full border-y border-zinc-100 bg-zinc-50/30">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-10">
          <h3 className="text-center text-sm font-bold text-zinc-400">Trusted by freelancers worldwide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:gap-16">
            {[
              { label: "Secured in vault", value: "$2.4M+" },
              { label: "Projects managed", value: "1,200+" },
              { label: "Dispute success", value: "99.8%" },
              { label: "Global users", value: "10K+" }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2 group">
                <p className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight transition-transform group-hover:scale-105">{stat.value}</p>
                <p className="text-xs font-bold text-emerald-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32" id="features">
        <div className="text-center space-y-4 mb-20 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Everything you need to work safely</h2>
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-xl mx-auto">Built for independent professionals who want absolute peace of mind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-16">
          {[
            { 
              title: "Your money stays safe", 
              desc: "Funds are locked in secure escrow nodes until work is approved. No more chasing invoices.", 
              icon: ShieldCheck 
            },
            { 
              title: "Get paid step-by-step", 
              desc: "Break projects into trackable milestones and get paid as you complete each part.", 
              icon: Zap 
            },
            { 
              title: "Fair Dispute Resolution", 
              desc: "Institutional-grade dispute system ensures you get paid for the work you've completed.", 
              icon: Scale 
            },
            { 
              title: "Legal Signature Layer", 
              desc: "Upload, sign, and store legally-binding contracts with a full audit history.", 
              icon: FileText 
            },
            { 
              title: "Real-time Visibility", 
              desc: "See your vault balances, released funds, and upcoming payments in a single dashboard.", 
              icon: Wallet 
            },
            { 
              title: "Smart Network Alerts", 
              desc: "Instant notifications for milestones, payments, and contract signatures.", 
              icon: Bell 
            }
          ].map((feature, i) => (
            <div key={i} className="space-y-5 group">
              <div className="w-11 h-11 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 transition-all group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 shadow-sm">
                <feature.icon size={20} strokeWidth={2} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-900">{feature.title}</h3>
                <p className="text-[14px] text-zinc-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How it Works */}
      <section className="w-full bg-zinc-900 py-24 md:py-32 text-white overflow-hidden relative" id="how-it-works">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-20 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
            <p className="text-emerald-500 font-bold text-sm">Three steps to a protected income</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              { step: "01", title: "Create agreement", desc: "Define your scope and milestones. Both parties sign digitally in seconds." },
              { step: "02", title: "Client deposits money", desc: "Capital is locked in a secure vault. You start working knowing the money is there." },
              { step: "03", title: "Get paid instantly", desc: "Complete a milestone, client approves, and funds release to your wallet immediately." }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-6 group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-2xl shadow-emerald-500/20 group-hover:rotate-3 transition-transform">
                  {item.step}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-[14px] text-zinc-400 font-medium leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32" id="pricing">
        <div className="text-center space-y-4 mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Transparent Pricing</h2>
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-xl mx-auto">One simple fee to secure your entire project lifecycle.</p>
        </div>
        
        <div className="max-w-md mx-auto bg-white border border-zinc-100 rounded-[2rem] p-10 md:p-12 text-center shadow-2xl shadow-zinc-200/50 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="space-y-2 relative z-10">
            <p className="text-sm font-bold text-emerald-500">Security Standard</p>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-6xl font-bold text-zinc-900 tracking-tight">1%</span>
              <span className="text-zinc-400 font-semibold text-sm">per release</span>
            </div>
          </div>
          
          <div className="space-y-1.5 relative z-10">
            <p className="text-[15px] font-bold text-zinc-900">Only 1% fee. No hidden charges.</p>
            <p className="text-[12px] font-medium text-zinc-400">Fee is deducted only when you get paid.</p>
          </div>

          <ul className="text-left space-y-4 py-8 border-y border-zinc-50 relative z-10">
            {[
              "Unlimited Milestone Contracts",
              "Institutional Escrow Nodes",
              "Resolution Center Access",
              "Legal Document Storage",
              "No Setup Fee · Cancel Anytime"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[14px] font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">
                <Check size={16} strokeWidth={3} className="text-emerald-500" /> {item}
              </li>
            ))}
          </ul>
          
          <Link to="/register" className="block w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-[15px] hover:bg-emerald-600 transition-all shadow-xl shadow-black/5 active:scale-95">
            Create Account Now
          </Link>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32 border-t border-zinc-100" id="docs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">Common Questions</h2>
            <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">Everything you need to know about the protocol protection layers.</p>
            <div className="pt-2">
              <button className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:gap-3 transition-all">
                Access full documentation <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="space-y-10">
            {[
              { q: "What if the client doesn’t approve work?", a: "**You are protected.** If work is completed as per the contract, you can trigger a Dispute. Our resolution team reviews the evidence and can force the release of funds." },
              { q: "How long does payout take?", a: "**Instant.** Once the client clicks 'Approve', the funds are released from the vault to your wallet immediately with zero clearing time." },
              { q: "Can I get a refund as a client?", a: "**Only with freelancer consent.** Funds are locked in escrow; they can only be released to the freelancer or refunded to the client if both parties agree or a dispute is resolved." },
              { q: "How secure is the vault?", a: "**Institutional grade.** Funds are held in segregated escrow nodes and are never used for any other purpose than your specific contract release." }
            ].map((faq, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-[16px] font-bold text-zinc-900">{faq.q}</h4>
                <p className="text-[14px] text-zinc-500 leading-relaxed font-medium">
                  {faq.a.split("**").map((part, idx) => idx % 2 === 1 ? <span key={idx} className="text-zinc-900 font-bold">{part}</span> : part)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA Banner */}
      <section className="w-full px-4 md:px-6 py-24 md:py-32">
        <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white space-y-8 md:space-y-12 shadow-2xl shadow-zinc-900/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight leading-tight relative z-10">Stop worrying about payments. <br className="hidden md:block" /> <span className="text-emerald-500 italic font-medium">Get paid safely every time.</span></h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-medium text-base md:text-lg relative z-10">Join top-tier freelancers who secure every project with FreelanceGuard.</p>
          <div className="relative z-10 pt-4">
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-emerald-500 text-white rounded-xl font-bold text-[16px] hover:bg-white hover:text-zinc-900 transition-all shadow-2xl shadow-emerald-500/10 active:scale-95">
              Start Protecting Your Income
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-10 border-t border-zinc-100">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
              <ShieldCheck size={12} className="text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-zinc-900">FreelanceGuard</span>
          </div>
          <p className="text-[12px] font-medium text-zinc-400">&copy; 2026. Institutional Protocol Layer.</p>
        </div>
        <div className="flex gap-8 text-sm font-bold text-zinc-400">
          <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
