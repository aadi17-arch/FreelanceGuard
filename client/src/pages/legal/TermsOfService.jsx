import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Scale, FileText, LockKeyhole } from 'lucide-react';

const LegalSection = ({ title, children }) => (
  <section className="space-y-4 py-8 border-b border-zinc-100 last:border-0">
    <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
    <div className="text-base leading-relaxed text-zinc-600 space-y-4">
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
          <Link to="/register" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Sign Up</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-emerald-500 shadow-lg shadow-black/5">
              <Scale size={20} />
            </div>
            <span className="text-sm font-bold text-zinc-900">Legal Agreement</span>
          </div>
        </div>
      </header>

      {/* Content Hub */}
      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-6 mb-16 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-500">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Official Policy</p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            Last Updated: May 1, 2026
          </p>
        </div>

        <div className="bg-emerald-50 rounded-[2rem] p-8 mb-16 border border-emerald-100 text-emerald-800 text-base leading-relaxed font-medium flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
             <FileText size={24} />
          </div>
          <p>
            Our goal is to make freelancing safe and simple. These terms are here to protect your money and your work.
          </p>
        </div>

        <LegalSection title="1. Our Service">
          <p>
            FreelanceGuard provides a safe way for clients and freelancers to work together. We use a secure system to hold payments until the work is finished and approved.
          </p>
        </LegalSection>

        <LegalSection title="2. Safe Payments (Escrow)">
          <p>
            When a project starts, the client puts the money into our secure system. The freelancer can see that the money is there, but they can't touch it until the client confirms the work is done.
          </p>
        </LegalSection>

        <LegalSection title="3. Helping with Disagreements">
          <p>
            If there is a problem with the work or the payment, we provide a way to talk it out. If you can't agree, our team will look at the work and help make a fair decision for everyone.
          </p>
        </LegalSection>

        <LegalSection title="4. Identity Check">
          <p>
            To keep everyone safe, we ask users to prove who they are. This helps prevent scams and ensures that you are working with real people.
          </p>
        </LegalSection>

        <div className="mt-20 pt-10 border-t border-zinc-100 flex flex-col items-center gap-8 text-center">
           <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 shadow-inner">
              <ShieldCheck size={32} />
           </div>
           <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              Safe • Secure • Fair
           </p>
           <Link to="/register">
             <button className="px-10 py-5 bg-zinc-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-black/10 active:scale-95">
                I Understand & Accept
             </button>
           </Link>
        </div>
      </main>
    </div>
  );
}
