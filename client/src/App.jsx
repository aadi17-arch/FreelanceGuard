import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Zap } from 'lucide-react';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/public/Home';
import KYC from './pages/kyc/KYC';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Market from './pages/projects/Market';
import CreateProject from './pages/projects/CreateProject';
import ProjectDetails from './pages/projects/ProjectDetails';
import Profile from './pages/profile/profile';
import EscrowDashboard from './pages/escrow/EscrowDashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-zinc-900 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return <DashboardLayout>{children}</DashboardLayout>;
  };

  const FeaturePlaceholder = ({ name }) => (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center text-zinc-200">
        <Zap size={40} />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{name} Coming Soon</h2>
        <p className="text-sm font-bold text-zinc-300 max-w-xs mx-auto">
          We are currently building this feature to provide you with a world-class experience.
        </p>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute><Market /></ProtectedRoute>} />
      <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/escrow" element={<ProtectedRoute><EscrowDashboard /></ProtectedRoute>} />
      <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
      
      {/* Feature Placeholders */}
      <Route path="/contracts" element={<ProtectedRoute><FeaturePlaceholder name="My Projects" /></ProtectedRoute>} />
      <Route path="/proposals" element={<ProtectedRoute><FeaturePlaceholder name="My Proposals" /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><FeaturePlaceholder name="Reports & Stats" /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><FeaturePlaceholder name="Messaging" /></ProtectedRoute>} />
      <Route path="/disputes" element={<ProtectedRoute><FeaturePlaceholder name="Support & Disputes" /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
