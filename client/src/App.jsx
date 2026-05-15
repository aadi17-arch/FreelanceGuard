import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/public/Home";
import CreateProject from "./pages/projects/CreateProject";
import Market from "./pages/projects/Market";
import ProjectDetails from "./pages/projects/ProjectDetails";
import EscrowDashboard from "./pages/escrow/EscrowDashboard";
import Profile from "./pages/profile/profile";
import KYC from "./pages/kyc/KYC";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import SupportList from "./pages/support/SupportList";
import TicketDetails from "./pages/support/TicketDetails";
import AdminSupport from "./pages/admin/AdminSupport";
import DisputeDetails from "./pages/disputes/DisputeDetails";
import DisputesList from "./pages/disputes/DisputesList";
import Proposals from "./pages/proposals/Proposals";
import Contracts from "./pages/contracts/Contracts";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import HowItWorks from "./pages/public/HowItWorks";
import { LazyMotion, domAnimation } from "framer-motion";
import { Zap } from "lucide-react";

const OperationalPlaceholder = ({ title }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 p-12 bg-zinc-50/50 rounded-[2.5rem] border border-zinc-100 border-dashed animate-pulse">
    <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5 border border-zinc-100">
       <Zap size={36} strokeWidth={1.5} />
    </div>
    <div className="text-center space-y-3">
       <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h2>
       <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest px-3 py-1 bg-emerald-50 rounded-full">Coming Soon</p>
          <p className="text-[11px] font-medium text-zinc-400 max-w-[240px]">We are currently hardening the security protocols for this feature.</p>
       </div>
    </div>
  </div>
);

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/how-it-works" element={<HowItWorks />} />

          {/* Core Operational Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/create-project" element={<ProtectedRoute allowedRoles={["CLIENT"]}><DashboardLayout><CreateProject /></DashboardLayout></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute allowedRoles={["FREELANCER", "CLIENT"]}><DashboardLayout><Market /></DashboardLayout></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><DashboardLayout><ProjectDetails /></DashboardLayout></ProtectedRoute>} />
          <Route path="/escrow" element={<ProtectedRoute><DashboardLayout><EscrowDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
          <Route path="/kyc" element={<ProtectedRoute><DashboardLayout><KYC /></DashboardLayout></ProtectedRoute>} />
          
          {/* Support Hub */}
          <Route path="/support" element={<ProtectedRoute><DashboardLayout><SupportList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/support/ticket/:id" element={<ProtectedRoute><DashboardLayout><TicketDetails /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}><DashboardLayout><AdminSupport /></DashboardLayout></ProtectedRoute>} />

          {/* Dispute & Resolution */}
          <Route path="/disputes" element={<ProtectedRoute><DashboardLayout><DisputesList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dispute/:id" element={<ProtectedRoute><DashboardLayout><DisputeDetails /></DashboardLayout></ProtectedRoute>} />

          {/* Strategic Roadmap Routes */}
          <Route path="/contracts" element={<ProtectedRoute><DashboardLayout><Contracts /></DashboardLayout></ProtectedRoute>} />
          <Route path="/proposals" element={<ProtectedRoute><DashboardLayout><Proposals /></DashboardLayout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><OperationalPlaceholder title="Network Analytics" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><DashboardLayout><OperationalPlaceholder title="Secure Messaging" /></DashboardLayout></ProtectedRoute>} />

        </Routes>
      </Router>
    </LazyMotion>
  );
}
export default App;
