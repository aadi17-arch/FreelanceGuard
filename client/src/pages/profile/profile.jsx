import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  User, 
  ShieldCheck, 
  TrendingUp, 
  CreditCard,
  ChevronRight
} from "lucide-react";

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
    <div className="space-y-10 pb-20">
      {/* 1. Header: Profile Analytics - Balanced */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-rui-gray-border/10 pb-10">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-rui-dark text-white flex items-center justify-center text-xl font-black shadow-xl shadow-black/10 transition-transform">
              {user?.name?.[0]}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-[#1D9E75] border-2 border-white flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={12} strokeWidth={3} />
            </div>
          </div>
          <div className="space-y-1">
            <h1>{user?.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1D9E75] bg-[#E1F5EE] px-3 py-0.5 rounded-md border border-[#1D9E75]/10 animate-pulse-subtle">
                Verified Node
              </span>
              <span className="label-caps !text-[9px] opacity-40">Account: {user?.id?.slice(-8).toUpperCase() || "PENDING"}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-grow md:flex-grow-0 px-6 py-2.5 bg-white border border-rui-gray-border/50 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rui-light transition-all shadow-sm">
            Edit Profile
          </button>
          <button className="flex-grow md:flex-grow-0 px-6 py-2.5 bg-rui-dark text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-[#1D9E75] transition-all shadow-xl shadow-black/5">
            Export History
          </button>
        </div>
      </header>

      {/* 2. Performance Dashboard - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Financial Chart */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-rui-gray-border/50 rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-10">
               <div className="space-y-0.5">
                 <h2 className="label-caps !text-rui-dark !text-[9px]">Revenue Analytics</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">System Performance</p>
               </div>
               <div className="text-right space-y-0.5">
                 <p className="label-caps !text-[8px]">Cumulative</p>
                 <p className="text-2xl font-financial text-rui-dark">${user?.totalEarned?.toLocaleString() || "0"}</p>
               </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }} 
                  />
                  <Area type="monotone" dataKey="value" stroke="#1D9E75" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Right: Security & Credentials */}
        <aside className="space-y-8">
          <div className="bg-white border border-rui-gray-border/50 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="label-caps !text-rui-dark !text-[9px] border-b border-rui-gray-border/5 pb-3">Security Clearance</h2>
            <div className="space-y-6">
              {[
                { label: "KYC Layer", status: "Verified", color: "text-[#1D9E75]" },
                { label: "2FA Protection", status: "Active", color: "text-[#1D9E75]" },
                { label: "Session Token", status: "Secured", color: "text-[#1D9E75]" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.label}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#E1F5EE]/30 border border-[#1D9E75]/10 rounded-2xl p-6 md:p-8 space-y-3">
             <div className="flex items-center gap-2 text-[#1D9E75]">
                <ShieldCheck size={16} strokeWidth={3} />
                <span className="text-[9px] font-black uppercase tracking-widest">Protocol Standing</span>
             </div>
             <p className="text-[10px] text-[#1D9E75] leading-relaxed font-bold opacity-80 uppercase tracking-tighter">
               Account fully synchronized. Total access enabled.
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
