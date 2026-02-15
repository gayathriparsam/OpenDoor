import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeadProvider } from './context/LeadContext';
import Header from './components/layout/Header';
import CallSimulator from './pages/CallSimulator';
import Dashboard from './pages/Dashboard';
import Outbound from './pages/Outbound';
import Analytics from './pages/Analytics';
import Properties from './pages/Properties';

import Traces from './pages/Traces';

import Login from './pages/Login';
import MockGoogleAuth from './pages/MockGoogleAuth';

// Layout component wraps protected pages to show Header
const AppLayout = () => {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

// ProtectedRoute component handles access control
const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, user, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) {
    return <Navigate to="/simulator" replace />;
  }

  return <AppLayout />;
};

function App() {
  return (
    <AuthProvider>
      <LeadProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/google-auth" element={<MockGoogleAuth />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute adminOnly={false} />}>
            <Route path="/simulator" element={<CallSimulator />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/outbound" element={<Outbound />} />
            <Route path="/traces" element={<Traces />} />
          </Route>

          {/* Fallback for authenticated users who hit unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </LeadProvider>
    </AuthProvider>
  );
}

export default App;
