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
    <div className="w-full space-y-6 pb-20 px-6 bg-[#ffffff]">
      
      {/* 1. Professional Identity Header */}
      <header className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 border-b border-[#e5e5e5] pb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="relative">
            {/* Reduced avatar size */}
            <div className="w-16 h-16 rounded-[10px] bg-[#111111] text-white flex items-center justify-center text-2xl font-black">
              {user?.name?.[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-[4px] bg-[#10b981] flex items-center justify-center text-white">
              <ShieldCheck size={12} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="space-y-1">
            {/* Sentence case name */}
            <h1 className="text-2xl font-black tracking-tight text-[#111111] leading-none">
              {user?.name}
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs font-bold text-[#666666]">
              {/* Sentence case account role */}
              <span className="text-[#111111]">
                {user?.role === "CLIENT" ? "Client account" : "Freelancer account"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Member since {new Date(user?.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto">
          {/* Sentence case black background edit button */}
          <button className="w-full md:w-auto px-5 py-2.5 bg-[#111111] hover:bg-[#333333] text-white rounded-[8px] text-xs font-bold transition-all shadow-sm">
            Edit profile
          </button>
        </div>
      </header>

      {/* 2. Professional Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Glass Summary Card */}
           <div className="bg-[#ffffff] border border-[#e5e5e5] p-6 rounded-[10px] shadow-sm relative overflow-hidden">
              <div className="space-y-2">
                 <h3 className="text-xs font-bold text-[#666666]">About me</h3>
                 <p className="text-xs font-medium text-[#111111] leading-relaxed">
                    Experienced {user?.role?.toLowerCase() === "client" ? "client" : "freelancer"} focused on high-quality delivery and secure collaboration within the FreelanceGuard ecosystem.
                 </p>
              </div>
           </div>

           {/* Stats Row */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Earnings", value: `$${user?.totalEarned?.toLocaleString() || "0"}` },
                { label: "Completion", value: "98%" },
                { label: "Reliability", value: "Verified" }
              ].map((stat, i) => (
                <div key={i} className="bg-[#ffffff] border border-[#e5e5e5] p-4 rounded-[10px] shadow-sm">
                   <p className="text-xs font-bold text-[#666666] mb-1">{stat.label}</p>
                   <p className={`text-[28px] font-black tracking-tight leading-none ${
                     stat.label === "Reliability" ? "text-[#10b981]" : "text-[#111111]"
                   }`}>{stat.value}</p>
                </div>
              ))}
           </div>

           {/* Detailed Information */}
           <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-6 space-y-6">
              <div className="flex items-center gap-2">
                 <User size={14} className="text-[#10b981]" />
                 <h2 className="text-xs font-bold text-[#111111]">Personal details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { label: "Email", value: user?.email },
                   { label: "Account ID", value: `ID-${user?.id?.slice(-12).toUpperCase()}`, font: "font-mono" },
                   { label: "Role", value: user?.role === "CLIENT" ? "Client" : "Freelancer" },
                   { label: "Last active", value: "Today" }
                 ].map((detail, i) => (
                   <div key={i} className="space-y-1">
                      <p className="text-xs font-bold text-[#666666]">{detail.label}</p>
                      <p className={`text-xs font-medium text-[#111111] ${detail.font || ""}`}>{detail.value}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Activity Area */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Activity Timeline */}
           <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                 <History size={14} className="text-[#10b981]" />
                 <h2 className="text-xs font-bold text-[#111111]">Recent activity</h2>
              </div>
              
              <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[10px] p-4 space-y-4 shadow-sm">
                 {[
                   { title: "Payment received", time: "2 hours ago", icon: <Wallet size={14} className="text-[#10b981]" /> },
                   { title: "Project milestone", time: "Yesterday", icon: <ShieldCheck size={14} className="text-[#10b981]" /> },
                   { title: "Login verified", time: "2 days ago", icon: <User size={14} className="text-[#10b981]" /> }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-[6px] bg-[#f9f9f9] border border-[#e5e5e5] flex items-center justify-center shrink-0">
                         {item.icon}
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-xs font-bold text-[#111111]">{item.title}</p>
                         <p className="text-[10px] font-medium text-[#666666]">{item.time}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
