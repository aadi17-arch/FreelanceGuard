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
  History
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
  
  const chartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
    { name: "Jun", value: 900 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-12 pb-20 px-4 lg:px-0">
      {/* 1. Scaled Identity Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-zinc-100 pb-8 lg:pb-12">
        <div className="flex items-center gap-5 lg:gap-8">
          <div className="relative group">
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-2xl bg-zinc-900 text-white flex items-center justify-center text-xl lg:text-3xl font-black shadow-2xl shadow-zinc-900/20 transition-transform group-hover:rotate-6">
              {user?.name?.[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-7 lg:h-7 rounded-lg bg-emerald-500 border-4 border-white flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={12} strokeWidth={3} />
            </div>
          </div>
          <div className="space-y-1.5 lg:space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
               <Zap size={10} fill="currentColor" />
               <p className="text-[10px] font-bold">Verified Account</p>
            </div>
            <h1 className="text-xl lg:text-4xl font-black tracking-tighter text-zinc-900 leading-none">{user?.name}</h1>
            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                Identity Verified
              </span>
              <span className="text-[10px] font-bold text-zinc-300">UID: {user?.id?.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="flex-grow lg:flex-none px-6 py-2.5 bg-zinc-100 text-zinc-900 border border-zinc-100 rounded-xl text-[10px] font-bold hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2">
            <Settings size={14} /> Settings
          </button>
          <button className="flex-grow lg:flex-none px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
            <History size={14} /> Download Report
          </button>
        </div>
      </header>

      {/* 2. Scaled Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        
        {/* Left: Financial Performance Node */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-100 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-10 shadow-sm">
             <div className="flex justify-between items-center mb-8 lg:mb-12">
                <div className="space-y-1">
                  <h2 className="text-[10px] font-bold text-zinc-900">Total Earnings</h2>
                  <p className="text-[10px] text-zinc-300 font-bold">Verified Earnings Data</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-bold text-zinc-300">Total Earned</p>
                  <p className="text-xl lg:text-3xl font-black text-zinc-900 font-mono tracking-tighter">${user?.totalEarned?.toLocaleString() || "0"}</p>
                </div>
             </div>
            
            <div className="h-48 lg:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '9px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      padding: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Right: Security Clearance & Status */}
        <aside className="space-y-6 lg:space-y-10">
          <div className="bg-white border border-zinc-100 rounded-[1.5rem] p-6 lg:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
               <Fingerprint size={16} className="text-zinc-900" />
               <h2 className="text-[10px] font-bold text-zinc-900">Account Status</h2>
            </div>
            <div className="space-y-5">
              {[
                { label: "Identity Status", status: "Verified", color: "text-emerald-500" },
                { label: "Payment Status", status: "Connected", color: "text-emerald-500" },
                { label: "Reliability Score", status: "9.8 / 10", color: "text-zinc-900" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">{item.label}</span>
                  <span className={`text-[10px] font-bold ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-[1.5rem] p-6 lg:p-8 space-y-4 shadow-xl shadow-zinc-900/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="flex items-center gap-3 text-emerald-500 relative z-10">
                <ShieldCheck size={16} strokeWidth={3} />
                <span className="text-[10px] font-bold">Account Health</span>
             </div>
             <p className="text-[10px] text-zinc-400 leading-relaxed font-bold relative z-10">
               Your account is fully verified. All professional payment and withdrawal features are enabled.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
