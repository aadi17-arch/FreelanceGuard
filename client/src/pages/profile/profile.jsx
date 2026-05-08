import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditBio(user.bio || "Experienced " + (user.role?.toLowerCase() === "client" ? "client" : "freelancer") + " focused on high-quality delivery and secure collaboration within the FreelanceGuard ecosystem.");
      setEditEmail(user.email || "");
    }
  }, [user]);
  const { user } = useAuth();

  return (
    <div className="w-full space-y-6 pb-20 px-6 bg-[#ffffff]">

      {/* 1. Professional Identity Header */}
      <header className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 border-b border-[#e5e5e5] pb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="relative">
            {/* Reduced avatar size */}
            <div className="w-16 h-16 rounded-[10px] bg-[#111111] text-white flex items-center justify-center text-2xl font-black">
              {editName?.[0] || user?.name?.[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-[4px] bg-[#10b981] flex items-center justify-center text-white">
              <ShieldCheck size={12} strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-1">
            {/* Sentence case name */}
            <h1 className="text-2xl font-black tracking-tight text-[#111111] leading-none">
              {editName || user?.name}
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
          <button onClick={() => setShowEditModal(true)} className="w-full md:w-auto px-5 py-2.5 bg-[#111111] hover:bg-[#333333] text-white rounded-[8px] text-xs font-bold transition-all shadow-sm">
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
                    {editBio}
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
                   { label: "Email", value: editEmail || user?.email },
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
  {/* Edit Profile overlay modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[#e5e5e5] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#e5e5e5] flex items-center justify-between">
                <h3 className="text-sm font-black text-[#111111]">
                  Edit Professional Profile
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-[#666666] font-bold text-sm transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={(e) => {
                e.preventDefault();
                // Local State Mock Update (Will update frontend immediately)
                setShowEditModal(false);
                import("react-hot-toast").then((m) => {
                  m.toast.success("Profile saved successfully!", {
                    style: { background: "#18181b", color: "#fff", borderRadius: "12px", fontSize: "13px" }
                  });
                });
              }} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#e5e5e5] rounded-[8px] text-xs font-medium focus:outline-none focus:border-[#10b981] transition-all text-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Professional Bio</label>
                  <textarea
                    rows={4}
                    required
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#e5e5e5] rounded-[8px] text-xs font-medium focus:outline-none focus:border-[#10b981] transition-all text-[#111111] resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#e5e5e5] rounded-[8px] text-xs font-medium focus:outline-none focus:border-[#10b981] transition-all text-[#111111]"
                  />
                </div>

                {/* Footer buttons inside body to make it contiguous */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e5e5e5]">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-[#111111] text-xs font-bold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#10b981] hover:bg-[#0d9488] text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
