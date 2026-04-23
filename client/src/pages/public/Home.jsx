import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Vault, Activity, Globe } from "lucide-react";

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
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white text-rui-dark flex flex-col items-center overflow-x-hidden"
    >
      {/* Navigation Bar - NO ICON */}
      <motion.nav 
        variants={itemVariants}
        className="w-full section-container py-6 md:py-10 flex flex-row justify-between items-center"
      >
        <div className="text-lg md:text-xl font-black tracking-tighter uppercase flex items-center gap-2">
          <div className="w-5 h-5 bg-rui-success rounded-sm"></div>
          Freelance<span className="text-rui-success">Guard</span>
        </div>
        <div className="flex items-center space-x-4 md:space-x-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <Link to="/login" className="hover:opacity-70 transition-opacity">Log in</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" className="bg-rui-success text-white px-6 py-2 md:px-10 md:py-4 rounded-full shadow-lg shadow-rui-success/20">Join now</Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="section-container text-center pt-12 md:pt-24 pb-16 md:pb-24 space-y-8 md:space-y-12">
        <div className="space-y-4 md:space-y-6">
          <motion.p 
            variants={itemVariants}
            className="text-[10px] md:text-xs font-black tracking-[0.4em] text-rui-success uppercase px-4"
          >
            The Global Operating System for Freelancers
          </motion.p>
          <motion.h1 
            variants={itemVariants}
            className="display-mega uppercase"
          >
            Work with<br />
            <span className="text-rui-success">Unfair</span> Advantage
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-xl text-rui-gray-muted max-w-2xl mx-auto font-medium px-4 leading-relaxed"
          >
            Secure your payments, automate your legal contracts, and manage your global clients in one unified interface.
          </motion.p>
        </div>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6"
        >
          <Link to="/register" className="w-full sm:w-auto min-w-[200px] md:min-w-[280px] py-4 bg-rui-success text-white rounded-lg text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-rui-success/20 flex items-center justify-center">
            Start protecting for free
          </Link>
          <button className="btn-pill-secondary w-full sm:w-auto min-w-[200px] md:min-w-[280px]">
             View demo
          </button>
        </motion.div>
      </section>

      {/* Features Grid - Clean & Prof Icons */}
      <motion.section 
        variants={containerVariants}
        className="w-full bg-rui-light py-20 md:py-32"
      >
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              { 
                title: "Smart Vault", 
                desc: "Secure escrow payments that release only when both parties are 100% satisfied.", 
                icon: <Vault size={28} strokeWidth={1.2} />,
                bg: "bg-rui-dark text-white"
              },
              { 
                title: "Legal Layer", 
                desc: "Automated, legally-binding contracts generated in seconds and tailored for your region.", 
                icon: <Activity size={28} strokeWidth={1.2} />,
                bg: "bg-rui-blue text-white"
              },
              { 
                title: "Direct Rails", 
                desc: "Direct banking integration for instant payouts in 30+ currencies with zero fees.", 
                icon: <Globe size={28} strokeWidth={1.2} />,
                bg: "bg-rui-success text-white"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="rui-card-organic flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
              >
                <div className={`p-6 ${feature.bg} rounded-[28px] shadow-2xl shadow-black/5 inline-block`}>
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-sm md:text-base text-rui-gray-muted font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      <motion.footer 
        variants={itemVariants}
        className="w-full section-container py-12 md:py-20 text-rui-gray-muted text-[10px] md:text-xs font-bold tracking-widest uppercase flex flex-col md:flex-row justify-between items-center gap-8 border-t border-rui-gray-border mt-auto"
      >
        <span>&copy; 2026 FreelanceGuard Tech</span>
        <div className="flex space-x-6 md:space-x-12">
          <a href="#" className="hover:text-rui-dark transition-colors">Privacy</a>
          <a href="#" className="hover:text-rui-dark transition-colors" >Terms</a>
          <a href="#" className="hover:text-rui-dark transition-colors">Security</a>
        </div>
      </motion.footer>
    </motion.div>
  );
}
