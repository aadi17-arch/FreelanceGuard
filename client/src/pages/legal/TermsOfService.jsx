import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Scale, FileText, Lock } from 'lucide-react';

const LegalSection = ({ title, children }) => (
  <section className="space-y-4 py-8 border-b border-zinc-100 last:border-0">
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">{title}</h2>
    <div className="text-[13px] leading-relaxed text-zinc-500 space-y-4 font-medium">
      {children}
    </div>
  </section>
);

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/register" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-emerald-500 shadow-lg shadow-black/5">
              <Scale size={16} />
            </div>
            <span className="text-xs font-black text-zinc-900 tracking-tighter">Legal Framework</span>
          </div>
        </div>
      </header>

      {/* Content Hub */}
      <main className="max-w-3xl mx-auto px-6 py-20 lg:py-32">
        <div className="space-y-6 mb-16">
          <div className="flex items-center gap-2 text-emerald-500">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <p className="text-[8px] font-black uppercase tracking-[0.3em]">Institutional Protocol</p>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-zinc-900">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
            Last Updated: May 1, 2026 • Version 2.0.1
          </p>
        </div>

        <div className="bg-zinc-50 rounded-[2rem] p-8 mb-16 border border-zinc-100 italic text-zinc-500 text-sm leading-relaxed">
          "By accessing the FreelanceGuard network, you acknowledge that you are entering a legally binding escrow framework designed to protect capital and intellectual property through automated ledger enforcement."
        </div>

        <LegalSection title="1. The Escrow Protocol">
          <p>
            FreelanceGuard acts as a neutral third-party holding facility (the "Vault") for funds during active service contracts. 
            Funds deposited by the Client are held in an automated state until Milestone verification is achieved.
          </p>
          <p>
            Verification is completed upon Client approval or through the Dispute Resolution process. Once funds are released, 
            the transaction is considered final and non-reversible.
          </p>
        </LegalSection>

        <LegalSection title="2. Financial Obligations">
          <p>
            Clients are obligated to fund Milestones in full before work commences. Freelancers are obligated to deliver 
            proof of work that aligns with the specific parameters outlined in the Contract Ledger.
          </p>
          <p>
            All fees, including the 3% Security Fee, are deducted at the point of release to ensure the continued 
            maintenance of the neutral arbitration network.
          </p>
        </LegalSection>

        <LegalSection title="3. Dispute Arbitration">
          <p>
            In the event of a contractual deadlock, either party may initiate an "Active Case." 
            Our arbitration team will review Evidence provided by both parties. Decisions rendered by 
            FreelanceGuard arbitration are final to ensure liquidity in the marketplace.
          </p>
        </LegalSection>

        <div className="mt-20 pt-10 border-t border-zinc-100 flex flex-col items-center gap-8">
           <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={24} />
           </div>
           <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] text-center">
              End of Protocol
           </p>
           <Link to="/register">
             <button className="px-8 py-4 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-black/10 active:scale-95">
                Acknowledge & Continue
             </button>
           </Link>
        </div>
      </main>
    </div>
  );
}
