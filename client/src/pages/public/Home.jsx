import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Vault, Activity, Globe, ShieldCheck, Zap, Lock, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-white text-rui-dark flex flex-col items-center overflow-x-hidden font-body">
      {/* 1. Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full section-container py-8 flex flex-row justify-between items-center z-50"
      >
        <div className="text-xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-5 h-5 bg-rui-success rounded-sm"></div>
          FreelanceGuard
        </div>
        <div className="flex items-center space-x-8 text-[10px] font-black uppercase tracking-widest">
          <Link to="/login" className="hover:text-rui-success transition-colors">Login</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" className="bg-rui-dark text-white px-8 py-3 rounded-lg shadow-xl shadow-black/10 hover:bg-rui-success transition-colors">Register</Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* 2. Hero Section */}
      <section className="section-container pt-20 pb-32 flex flex-col items-center text-center relative">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-rui-success/5 blur-[120px] -z-10 rounded-full"></div>

        <div className="space-y-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-rui-success/10 border border-rui-success/20 rounded-full"
          >
            <ShieldCheck size={14} className="text-rui-success" />
            <span className="text-[10px] font-black text-rui-success uppercase tracking-[0.2em]">v2.0 Network Active</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]"
          >
            Enhance Your <br />
            <span className="text-rui-success italic">Business</span> Efficiency
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-rui-gray-muted max-w-2xl mx-auto font-medium leading-relaxed"
          >
            The global operating system for freelancers. Secure payments, automated legal layers, and institutional-grade escrow protection.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-rui-success text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all shadow-2xl shadow-rui-success/30 flex items-center justify-center gap-3">
            Start protecting for free <ArrowRight size={16} />
          </Link>
          <button className="w-full sm:w-auto px-10 py-4 bg-white border border-rui-gray-border text-rui-dark rounded-xl text-xs font-bold hover:bg-rui-light transition-all">
            View Live Demo
          </button>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-full max-w-5xl rounded-[32px] border border-rui-gray-border/20 shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden bg-white"
        >
          <img
            src="/dashboard_mockup_1776968809870.png"
            alt="FreelanceGuard Dashboard"
            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-1000"
          />
        </motion.div>
      </section>

      {/* 3. Trusted By / Social Proof */}
      <section className="w-full border-y border-rui-gray-border/30 py-12 bg-rui-light/30">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rui-gray-muted">Trusted by innovators at</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
            {['FORBES', 'WIRED', 'TECHCRUNCH', 'VERGE', 'FORTUNE'].map(logo => (
              <span key={logo} className="text-xl font-black tracking-tighter">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it Works */}
      <section className="w-full py-32 section-container">
        <div className="text-center space-y-4 mb-24">
          <p className="label-caps !text-rui-success">The Protocol</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Three Steps to Safety</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-24 left-0 w-full h-[1px] bg-rui-gray-border/50 -z-10"></div>

          {[
            { step: "01", title: "Initialize Contract", desc: "Define your milestones and legal terms in seconds using our automated legal layer.", icon: <FileText className="text-rui-success" /> },
            { step: "02", title: "Lock Capital", desc: "Funds are moved into institutional-grade escrow. Protected and visible to both parties.", icon: <Lock className="text-rui-success" /> },
            { step: "03", title: "Execute Payout", desc: "Upon milestone approval, capital is released instantly to your verified wallet.", icon: <Zap className="text-rui-success" /> }
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="space-y-6 text-center md:text-left bg-white p-8 rounded-3xl border border-rui-gray-border/20 shadow-sm hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-2xl bg-rui-success/10 flex items-center justify-center mx-auto md:mx-0">
                <div className="text-xl font-black text-rui-success">{item.step}</div>
              </div>
              <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
              <p className="text-rui-gray-muted font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Features Grid */}
      <section className="w-full py-32 bg-rui-dark text-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rui-success">Institutional Grade</p>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.95]">Total Financial<br />Protection</h2>
              </div>

              <div className="space-y-8">
                {[
                  { title: "Smart Escrow Vaults", desc: "Funds are held in individual secure nodes, never mixed, always protected." },
                  { title: "Zero-Latency Settlement", desc: "Once approved, capital moves across the network in under 2 seconds." },
                  { title: "Legal Signal Enforcement", desc: "Our contracts are legally binding across 140+ jurisdictions globally." }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="mt-1"><CheckCircle2 className="text-rui-success" size={20} /></div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black uppercase tracking-tight">{feat.title}</h4>
                      <p className="text-gray-400 text-sm font-medium">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-rui-success/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] space-y-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rui-success">Escrow Node #4920</p>
                    <p className="text-2xl font-black font-financial">$48,290.00</p>
                  </div>
                  <div className="px-4 py-1.5 bg-rui-success rounded-full text-[9px] font-black uppercase tracking-widest">Locked</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Syncing Protocol</span>
                    <span>98%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-rui-success w-[98%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="w-full py-40 text-center section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-rui-light/50 border border-rui-gray-border/50 p-20 rounded-[48px] space-y-10"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Ready for the<br /><span className="text-rui-success">Future of Work?</span></h2>
          <p className="text-lg text-rui-gray-muted max-w-xl mx-auto font-medium">Join 10,000+ top-tier freelancers who protect their business with FreelanceGuard.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="px-12 py-5 bg-rui-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rui-success transition-all shadow-2xl">
              Initialize Account
            </Link>
            <Link to="/login" className="px-12 py-5 bg-white border border-rui-gray-border text-rui-dark rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rui-light transition-all">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 7. Footer */}
      <footer className="w-full section-container py-20 border-t border-rui-gray-border/50 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-lg font-black tracking-tighter uppercase flex items-center gap-2">
          <div className="w-4 h-4 bg-rui-success rounded-sm"></div>
          Freelance<span className="text-rui-success">Guard</span>
        </div>
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-rui-gray-muted">
          <a href="#" className="hover:text-rui-success transition-colors">Twitter</a>
          <a href="#" className="hover:text-rui-success transition-colors">GitHub</a>
          <a href="#" className="hover:text-rui-success transition-colors">Discord</a>
        </div>
        <p className="text-[10px] font-black text-rui-gray-muted uppercase tracking-[0.2em]">&copy; 2026 Protocol Layer. All rights protected.</p>
      </footer>
    </div>
  );
}

// Add missing icon from lucide-react
function FileText({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
  )
}
