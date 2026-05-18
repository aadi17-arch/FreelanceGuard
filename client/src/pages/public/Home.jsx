import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  Bell, 
  Scale, 
  Menu, 
  X, 
  Wallet, 
  Check 
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center overflow-x-hidden font-body selection:bg-emerald-100">
      <nav className="w-full max-w-7xl mx-auto px-5 py-5 md:py-6 flex items-center justify-between z-[100] sticky top-0 bg-white border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-900/10">
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">Freelance<span className="text-emerald-600">Guard</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-zinc-500">
          <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
          <Link to="/how-it-works" className="hover:text-zinc-900 transition-colors">How it works</Link>
          <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
          <Link to="/login" className="hover:text-zinc-900 transition-colors">Sign in</Link>
          <Link to="/register">
            <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-all text-[13px]">
              Create account
            </button>
          </Link>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-zinc-600 hover:text-zinc-900"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-100 p-6 flex flex-col gap-6 md:hidden shadow-xl z-[200]">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-zinc-600">Features</a>
            <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-zinc-600">How it works</Link>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-zinc-600">Pricing</a>
            <hr className="border-zinc-100" />
            <Link to="/login" className="text-sm font-bold text-zinc-600">Sign in</Link>
            <Link to="/register" className="bg-emerald-600 text-white py-4 rounded-xl font-bold text-center text-sm">
              Create account
            </Link>
          </div>
        )}
      </nav>

      <section className="w-full max-w-5xl mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-20 px-6 text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] md:leading-[1.05] text-zinc-900"
        >
          Get paid securely <br className="hidden sm:block" />
          for every <span className="text-emerald-600 italic font-medium">freelance project</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-base md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          FreelanceGuard holds payments in safe holding, releases them instantly on milestone approval, and protects both sides from payment risks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-4 w-full"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center">
            <Link to="/register" className="w-full sm:w-auto px-10 py-4 bg-zinc-900 text-white rounded-xl font-bold text-[15px] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/how-it-works" className="w-full sm:w-auto px-10 py-4 bg-white border border-zinc-200 text-zinc-600 rounded-xl font-bold text-[15px] hover:bg-zinc-50 transition-all flex items-center justify-center">
              See how it works
            </Link>
          </div>
          <p className="text-[11px] font-bold text-zinc-400">Takes 30 seconds · No credit card required</p>
        </motion.div>
      </section>

      <section className="w-full border-y border-zinc-100 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-12">
          <h3 className="text-center text-[10px] md:text-xs font-bold tracking-tight text-zinc-400">Trusted by freelancers worldwide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-16">
            {[
              { label: "Total payments secured", value: "$2.4M+" },
              { label: "Projects managed", value: "1,200+" },
              { label: "Success rate", value: "99.8%" },
              { label: "Active users", value: "10K+" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <p className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight">{stat.value}</p>
                <p className="text-[11px] font-bold text-emerald-600 tracking-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 py-20 md:py-32" id="features">
        <div className="text-center space-y-4 mb-20 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Everything you need to work safely</h2>
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-xl mx-auto">Built for independent professionals who want absolute peace of mind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 md:gap-y-16">
          { [
            {
              title: "Your money stays safe", 
              desc: "Funds are locked in safe holding until work is approved. No more chasing invoices.", 
              icon: ShieldCheck 
            },
            { 
              title: "Get paid step-by-step", 
              desc: "Break projects into trackable milestones and get paid as you complete each part.", 
              icon: Zap 
            },
            { 
              title: "Fair support", 
              desc: "Our team ensures you get paid for the work you've completed if a misunderstanding occurs.", 
              icon: Scale 
            },
            { 
              title: "Simple agreements", 
              desc: "Create and sign simple digital contracts with a full history of all changes.", 
              icon: FileText 
            },
            { 
              title: "Real-time visibility", 
              desc: "See your balances, released funds, and upcoming payments in a single dashboard.", 
              icon: Wallet 
            },
            { 
              title: "Instant alerts", 
              desc: "Get notified immediately for milestones, payments, and contract signatures.", 
              icon: Bell 
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="space-y-5"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-zinc-900">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="w-full bg-zinc-900 py-20 md:py-32 text-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
            <p className="text-emerald-500 font-bold text-sm">Three steps to a protected income</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              { step: "01", title: "Create agreement", desc: "Define your work and milestones. Both parties sign digitally in seconds." },
              { step: "02", title: "Safe holding", desc: "Funds are locked in a secure account. You start working knowing the money is there." },
              { step: "03", title: "Instant payment", desc: "Complete a milestone, client approves, and funds release to your wallet immediately." }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 md:mt-24 text-center">
            <Link to="/how-it-works" className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-800 text-white border border-zinc-700 rounded-2xl text-xs font-bold hover:bg-zinc-700 transition-all">
              Learn exactly how we protect you <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-32" id="pricing">
        <div className="text-center space-y-4 mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Simple and transparent</h2>
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-xl mx-auto">One small fee to secure your entire project.</p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto bg-white border border-zinc-200 rounded-[2.5rem] p-10 md:p-14 text-center shadow-xl space-y-10 relative overflow-hidden"
        >
          <div className="space-y-2">
            <p className="text-sm font-bold text-emerald-600 tracking-tight">Simple fee</p>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-7xl font-bold text-zinc-900 tracking-tight">1%</span>
              <span className="text-zinc-400 font-semibold text-sm">per release</span>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <p className="text-base font-bold text-zinc-900">Only 1% fee. No monthly costs.</p>
            <p className="text-xs font-medium text-zinc-400">Fee is only charged when you get paid.</p>
          </div>

          <ul className="text-left space-y-4 py-8 border-y border-zinc-100">
            {[
              "Unlimited simple contracts",
              "Multi-layer payment safety",
              "Expert support access",
              "Safe document storage",
              "No setup or monthly fees"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                <Check size={18} strokeWidth={3} className="text-emerald-600 shrink-0" /> {item}
              </li>
            ))}
          </ul>
          
          <Link to="/register" className="block w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg">
            Create account now
          </Link>
        </motion.div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-32 border-t border-zinc-100" id="docs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">Common questions</h2>
            <p className="text-base text-zinc-500 font-medium leading-relaxed">Everything you need to know about how we keep you safe.</p>
            <div className="pt-2">
              <Link to="/how-it-works" className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:gap-3 transition-all">
                See the full guide <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          <div className="space-y-10">
            {[
              { q: "What if the client doesn’t approve work?", a: "You are protected. If work is completed as per the contract, our team reviews the evidence and can release the funds to you." },
              { q: "How long does payout take?", a: "It is instant. Once the client approves, the money moves from safe holding to your wallet immediately." },
              { q: "Can I get a refund as a client?", a: "Only if the freelancer agrees. Funds are safely held and can only be released or refunded with mutual agreement or after a review." },
              { q: "How secure is my money?", a: "Completely secure. All funds are held in separate protected accounts used only for your specific project." }
            ].map((faq, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="space-y-3"
              >
                <h4 className="text-base font-bold text-zinc-900">{faq.q}</h4>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-5 py-20 md:py-32 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900 rounded-[3rem] p-12 md:p-24 text-center text-white space-y-8 md:space-y-12 shadow-2xl relative overflow-hidden"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight relative z-10">
            Stop worrying about payments. <br className="hidden md:block" /> 
            <span className="text-emerald-500 italic font-medium">Get paid safely every time.</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-medium text-base md:text-lg relative z-10">
            Join the professional freelancers who use FreelanceGuard to secure their work.
          </p>
          <div className="relative z-10 pt-4">
            <Link to="/register">
              <button className="w-full sm:w-auto px-12 py-4 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-white hover:text-zinc-900 transition-all shadow-xl">
                Start protecting your income
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="w-full max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row justify-between items-center gap-12 border-t border-zinc-100">
        <div className="flex flex-col items-center md:items-start gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-900/10">
              <ShieldCheck size={16} className="text-emerald-500" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900">Freelance<span className="text-emerald-600">Guard</span></span>
          </div>
          <p className="text-xs font-bold text-zinc-500 tracking-tight">&copy; {new Date().getFullYear()} FreelanceGuard. Simple and secure payments.</p>
        </div>
        <div className="flex gap-10 text-[11px] font-bold text-zinc-400 tracking-tight">
          <Link to="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms</Link>
          <Link to="/how-it-works" className="hover:text-emerald-600 transition-colors">How it works</Link>
        </div>
      </footer>
    </div>
  );
}
