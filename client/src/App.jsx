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
import { Toaster } from "react-hot-toast";
import DisputeDetails from "./pages/disputes/DisputeDetails";
import DisputesList from "./pages/disputes/DisputesList";
import Proposals from "./pages/proposals/Proposals";
import Contracts from "./pages/contracts/Contracts";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import HowItWorks from "./pages/public/HowItWorks";
import { Zap } from "lucide-react";
import { LazyMotion, domAnimation } from "framer-motion";

// Simple Placeholder for upcoming features
const OperationalPlaceholder = ({ title }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center gap-6">
    <div className="w-16 h-16 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center text-zinc-200 shadow-inner text-2xl font-bold">
       <Zap size={32} />
    </div>
    <div className="text-center space-y-2">
       <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h2>
       <div className="flex items-center justify-center gap-2 text-emerald-500">
          <p className="text-xs font-bold">This feature is coming soon</p>
       </div>
    </div>
  </div>
);

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <Router>
        <Toaster
          position="top-right"
          reverseOrder={false}
          limit={5}
          toastOptions={{
            className: "custom-static-toast",
            duration: 2200, // Short duration
            style: {
              background: '#1c1c1e', // Solid dark background
              color: '#ffffff',
              borderRadius: '14px',
              padding: '12px 20px',
              fontSize: '11px',
              fontWeight: '700',
              border: '1px solid #2c2c2e', // Solid dark border
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            },
            success: {
              style: {
                background: '#f0fdf4', // Solid light green
                color: '#16a34a',
                border: '1px solid #bbf7d0', // Solid light green border
              },
              iconTheme: {
                primary: '#16a34a',
                secondary: '#ffffff',
              },
            },
            error: {
              style: {
                background: '#fef2f2', // Solid light red
                color: '#dc2626',
                border: '1px solid #fecaca', // Solid light red border
              },
              iconTheme: {
                primary: '#dc2626',
                secondary: '#ffffff',
              },
            },
            blank: {
              style: {
                background: '#fffbeb', // Solid light yellow
                color: '#d97706',
                border: '1px solid #fef3c7', // Solid light yellow border
              }
            }
          }}
        />
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
          <Route path="/marketplace" element={<ProtectedRoute allowedRoles={["FREELANCER"]}><DashboardLayout><Market /></DashboardLayout></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><DashboardLayout><ProjectDetails /></DashboardLayout></ProtectedRoute>} />
          <Route path="/escrow" element={<ProtectedRoute><DashboardLayout><EscrowDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
          <Route path="/kyc" element={<ProtectedRoute><DashboardLayout><KYC /></DashboardLayout></ProtectedRoute>} />
          
          {/* Dispute & Resolution */}
          <Route path="/disputes" element={<ProtectedRoute><DashboardLayout><DisputesList /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dispute/:id" element={<ProtectedRoute><DashboardLayout><DisputeDetails /></DashboardLayout></ProtectedRoute>} />

          {/* Restored Strategic Roadmap Routes (Placeholders) */}
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
