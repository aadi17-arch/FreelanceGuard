import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Zap,
  Fingerprint,
  Wallet,
  ArrowLeft,
  Settings,
  History,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Profile() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-5xl mx-auto space-y-10 lg:space-y-16 pb-20 px-4 lg:px-0">
      
      {/* 1. Professional Identity Header */}
      <header className="flex flex-col md:flex-row items-center md:items-end gap-8 border-b border-zinc-100 pb-12">
        <div className="relative">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] bg-zinc-900 text-white flex items-center justify-center text-4xl lg:text-5xl font-black shadow-2xl shadow-zinc-900/20">
            {user?.name?.[0]}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={18} strokeWidth={3} />
          </div>
        </div>
        
        <div className="space-y-3 flex-grow text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 font-bold">
             <Zap size={12} fill="currentColor" />
             <p className="text-[10px] uppercase tracking-[0.2em]">Verified Identity</p>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-zinc-900 uppercase leading-none">{user?.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-medium text-zinc-400">
             <span className="text-zinc-900 font-bold bg-zinc-100 px-3 py-1 rounded-lg uppercase tracking-widest text-[9px]">{user?.role} ACCOUNT</span>
             <span>•</span>
             <span>Member since {new Date(user?.createdAt).getFullYear()}</span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           <button className="flex-grow md:flex-none px-8 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
             Edit Profile
           </button>
        </div>
      </header>

      {/* 2. Professional Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
           
           {/* Glass Summary Card */}
           <div className="bg-white/40 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Professional Summary</h3>
                 <p className="text-lg lg:text-xl font-medium text-zinc-600 leading-relaxed italic">
                    "Experienced {user?.role?.toLowerCase()} focused on high-quality delivery and secure collaboration within the FreelanceGuard ecosystem."
                 </p>
              </div>
           </div>

           {/* Stats Row */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Earnings", value: `$${user?.totalEarned?.toLocaleString() || "0"}`, color: "text-emerald-500" },
                { label: "Completion", value: "98%", color: "text-blue-500" },
                { label: "Reliability", value: "A+", color: "text-amber-500" }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-zinc-50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-zinc-100/50 transition-all">
                   <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
                </div>
              ))}
           </div>

           {/* Detailed Information */}
           <div className="bg-zinc-50/50 rounded-[3rem] p-10 space-y-10 border border-zinc-100/50">
              <div className="flex items-center gap-3">
                 <User size={16} className="text-zinc-900" />
                 <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900">Personal Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {[
                   { label: "Email Address", value: user?.email },
                   { label: "Account ID", value: `ID-${user?.id?.slice(-12).toUpperCase()}`, font: "font-mono" },
                   { label: "Primary Role", value: user?.role },
                   { label: "Last Active", value: "Today" }
                 ].map((detail, i) => (
                   <div key={i} className="space-y-1.5">
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{detail.label}</p>
                      <p className={`text-sm font-bold text-zinc-900 ${detail.font || ""}`}>{detail.value}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar / Sidebar Activity Area */}
        <div className="lg:col-span-4 space-y-10">
           
           {/* Activity Timeline */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <History size={16} className="text-zinc-900" />
                 <h2 className="text-xs font-black uppercase tracking-widest text-zinc-900">Recent Activity</h2>
              </div>
              
              <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                 {[
                   { title: "Payment Received", time: "2 hours ago", icon: <Wallet className="text-emerald-500" /> },
                   { title: "Project Milstone", time: "Yesterday", icon: <ShieldCheck className="text-blue-500" /> },
                   { title: "Login Verified", time: "2 days ago", icon: <User className="text-zinc-400" /> }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                         {React.cloneElement(item.icon, { size: 14 })}
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-zinc-900">{item.title}</p>
                         <p className="text-[10px] font-medium text-zinc-400">{item.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Security Status Card */}
           <div className="bg-zinc-900 rounded-[2.5rem] p-8 space-y-6 text-white shadow-2xl shadow-zinc-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 text-emerald-500 relative z-10">
                 <ShieldCheck size={16} strokeWidth={3} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Account Health</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed relative z-10">
                 Your account is in excellent standing. 2FA is enabled and identity verification is complete.
              </p>
              <div className="pt-2 relative z-10">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Fully Protected</span>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
