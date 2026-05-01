import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, LockKeyhole, Eye, Server } from 'lucide-react';

const LegalSection = ({ title, children }) => (
  <section className="space-y-4 py-8 border-b border-zinc-100 last:border-0">
    <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
    <div className="text-base leading-relaxed text-zinc-600 space-y-4">
      {children}
    </div>
  </section>
);

export default function PrivacyPolicy() {
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
              <LockKeyhole size={20} />
            </div>
            <span className="text-sm font-bold text-zinc-900">Privacy & Safety</span>
          </div>
        </div>
      </header>

      {/* Content Hub */}
      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-6 mb-16 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-500">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Your Data Protection</p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-sm font-medium">
            Last Updated: May 1, 2026
          </p>
        </div>

        <div className="bg-zinc-50 rounded-[2rem] p-8 mb-16 border border-zinc-100 flex items-center gap-4 text-zinc-600 text-base leading-relaxed">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-100">
              <Eye size={24} />
           </div>
           <p>
            "We believe your privacy is a right, not a choice. We only collect the information we absolutely need to keep your money safe."
           </p>
        </div>

        <LegalSection title="1. Your Identity Info">
          <p>
            When you prove who you are (ID check), we store that information in a private, locked vault. We never sell your personal details to other companies.
          </p>
        </LegalSection>

        <LegalSection title="2. Your Payments">
          <p>
            We keep a record of every payment and project milestone. This is only to help you and the client have a clear history of your work in case you need to look back at it.
          </p>
        </LegalSection>

        <LegalSection title="3. Cookies & Tracking">
          <p>
            We don't use annoying tracking tools to follow you around the internet. We only use simple cookies to keep you logged in and make the website work smoothly.
          </p>
        </LegalSection>

        <LegalSection title="4. Keeping Data Safe">
          <p>
            If you stop using the website for a long time (2 years), we will securely delete your personal information. We only keep what is legally required for tax and financial records.
          </p>
        </LegalSection>

        <div className="mt-20 pt-10 border-t border-zinc-100 flex flex-col items-center gap-8 text-center">
           <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 shadow-inner">
              <ShieldCheck size={32} />
           </div>
           <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              Your Privacy is Protected
           </p>
           <Link to="/register">
             <button className="px-10 py-5 bg-zinc-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-black/10 active:scale-95">
                Got it, let's go
             </button>
           </Link>
        </div>
      </main>
    </div>
  );
}
