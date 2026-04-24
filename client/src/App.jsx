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
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#111111',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '16px 24px',
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: {
              primary: '#1D9E75',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes with Sidebar Layout */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><DashboardLayout><CreateProject /></ProtectedRoute></DashboardLayout>} />
        <Route path="/marketplace" element={<ProtectedRoute><DashboardLayout><Market /></DashboardLayout></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><DashboardLayout><ProjectDetails /></DashboardLayout></ProtectedRoute>} />
        <Route path="/escrow" element={<ProtectedRoute><DashboardLayout><EscrowDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
export default App;
