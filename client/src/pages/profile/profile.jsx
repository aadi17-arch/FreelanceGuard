import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from '../../utils/toast';
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
  FileText,
  RefreshCcw
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditBio(
        user.bio ||
          "Professional platform administrator focused on system integrity and user resolution."
      );
      setEditEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        const res = await axios.get("/escrow/transactions");
        const recent = (res.data || []).slice(0, 4).map((tx) => {
          const isRelease = tx.type === "RELEASE";
          const isDeposit = tx.type === "DEPOSIT";

          let title = "Payment transaction";
          let icon = <Wallet size={14} className="text-emerald-500" />;

          if (isRelease) {
            title = `Payment released for ${tx.contract?.project?.title || "project"}`;
            icon = <CheckCircle2 size={14} className="text-emerald-500" />;
          } else if (isDeposit) {
            title = `Payment secured for ${tx.contract?.project?.title || "project"}`;
            icon = <CreditCard size={14} className="text-amber-500" />;
          }

          return {
            title,
            time: new Date(tx.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            }),
            icon
          };
        });

        if (recent.length === 0) {
          setActivities([
            {
              title: "Joined platform",
              time: "Welcome!",
              icon: <User size={14} className="text-emerald-500" />
            }
          ]);
        } else {
          setActivities(recent);
        }
      } catch (err) {
        setActivities([
          {
            title: "Last active",
            time: "Today",
            icon: <ShieldCheck size={14} className="text-emerald-500" />
          }
        ]);
      } finally {
        setLoadingActivities(false);
      }
    };

    if (user) {
      fetchActivities();
    }
  }, [user]);

  return (
    <div className="w-full space-y-6 pb-20 px-6">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-zinc-100 pb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold">
              {editName?.[0] || user?.name?.[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-[4px] bg-emerald-500 flex items-center justify-center text-white">
              <ShieldCheck size={12} strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-none">
              {editName || user?.name}
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs font-bold text-zinc-400">
              <span className="text-zinc-900">
                {user?.role === "ADMIN" ? "Administrator" : user?.role === "CLIENT" ? "Client" : "Freelancer"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Joined {new Date(user?.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <button onClick={() => setShowEditModal(true)} className="w-full md:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm">
            Edit profile
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
              <div className="space-y-2">
                 <h3 className="text-xs font-bold text-zinc-400">About me</h3>
                 <p className="text-xs font-medium text-zinc-900 leading-relaxed">
                    {editBio}
                 </p>
              </div>
           </div>

          { user?.role !== "ADMIN"?
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {[
                { label: "Total Earnings", value: `$${user?.totalEarned?.toLocaleString() || "0"}` }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm">
                   <p className="text-xs font-bold text-zinc-400 mb-1">{stat.label}</p>
                   <p className="text-[28px] font-bold tracking-tight leading-none text-zinc-900">{stat.value}</p>
                </div>
              ))}
            </div>
            :
            <div></div>
           }

           <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-2">
                 <User size={14} className="text-emerald-500" />
                 <h2 className="text-xs font-bold text-zinc-900">Personal details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { label: "Email", value: editEmail || user?.email },
                   { label: "User ID", value: `ID-${user?.id?.slice(-12)}`, font: "font-mono" },
                   { label: "Account type", value: user?.role === "ADMIN" ? "Administrator" : user?.role === "CLIENT" ? "Client" : "Freelancer" }
                 ].map((detail, i) => (
                   <div key={i} className="space-y-1">
                      <p className="text-xs font-bold text-zinc-400">{detail.label}</p>
                      <p className={`text-xs font-medium text-zinc-900 ${detail.font || ""}`}>{detail.value}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                 <History size={14} className="text-emerald-500" />
                 <h2 className="text-xs font-bold text-zinc-900">Recent activity</h2>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4 shadow-sm">
                {loadingActivities ? (
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                    <RefreshCcw size={14} className="text-emerald-500 animate-spin" />
                    <p className="text-[10px] font-bold text-zinc-400">Loading...</p>
                  </div>
                ) : (
                  activities.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                       <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                          {item.icon}
                       </div>
                       <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate">{item.title}</p>
                          <p className="text-[10px] font-medium text-zinc-400">{item.time}</p>
                       </div>
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            onClick={() => setShowEditModal(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 flex flex-col">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900">
                Edit your profile
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold text-sm transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.put("/auth/profile", {
                  name: editName,
                  email: editEmail,
                  bio: editBio
                });
                await refreshUser();
                setShowEditModal(false);
                toast.success("Profile saved successfully!");
              } catch (err) {
                toast.error(err.response?.data?.message || "Failed to update profile.");
              }
            }} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400">Full name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all text-zinc-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400">About you</label>
                <textarea
                  rows={4}
                  required
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all text-zinc-900 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400">Email address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500 transition-all text-zinc-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
