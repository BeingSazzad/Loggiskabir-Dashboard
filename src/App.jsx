import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Operations from './pages/Operations';
import Bookings from './pages/Bookings';
import LiveTrips from './pages/LiveTrips';
import Drivers from './pages/Drivers';
import Applications from './pages/Applications';
import Reports from './pages/Reports';
import TripHistory from './pages/TripHistory';
import Settings from './pages/Settings';
import Fleet from './pages/Fleet';
import FleetDetails from './pages/FleetDetails';
import Schedule from './pages/Schedule';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import CMS from './pages/CMS';
import AdminDashboard from './pages/AdminDashboard';
import Transactions from './pages/Transactions';
import UserAccess from './pages/UserAccess';

// Protected Route Component
const ProtectedRoute = ({ children, role, allowedRoles }) => {
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect non-admins trying to access admin pages to operations
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [role, setRole] = useState(null); // 'admin' | 'dispatcher' | null

  const handleRoleSet = (newRole) => {
    setRole(newRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={role ? <Navigate to="/" replace /> : <Login setRole={handleRoleSet} />} />
        
        {/* Main Layout containing the Sidebar and Topbar */}
        <Route path="/" element={<ProtectedRoute role={role}><MainLayout role={role} onLogout={handleLogout} /></ProtectedRoute>}>
          
          {/* Default Route based on role */}
          <Route index element={<Navigate to={role === 'admin' ? "/dashboard" : "/operations"} replace />} />

          {/* Common Routes */}
          <Route path="operations" element={<Operations role={role} />} />
          <Route path="bookings" element={<Bookings role={role} />} />
          <Route path="live" element={<LiveTrips role={role} />} />
          <Route path="drivers" element={<Drivers role={role} />} />
          <Route path="applications" element={<Applications role={role} />} />
          <Route path="reports" element={<Reports role={role} />} />
          <Route path="trips" element={<TripHistory role={role} />} />
          <Route path="settings" element={<Settings role={role} />} />
          <Route path="profile" element={<Profile role={role} />} />
          <Route path="fleet">
            <Route index element={<Fleet role={role} />} />
            <Route path=":id" element={<FleetDetails role={role} />} />
          </Route>
          <Route path="schedule" element={<Schedule role={role} />} />
          <Route path="notifications" element={<Notifications role={role} />} />
          
          {/* Admin Only Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute role={role} allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="transactions" element={
            <ProtectedRoute role={role} allowedRoles={['admin']}><Transactions /></ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute role={role} allowedRoles={['admin']}><UserAccess /></ProtectedRoute>
          } />
          <Route path="cms" element={
            <ProtectedRoute role={role} allowedRoles={['admin']}><CMS /></ProtectedRoute>
          } />
          <Route path="support" element={
            <ProtectedRoute role={role} allowedRoles={['admin']}><CMS /></ProtectedRoute> // Reuse CMS for now as per original map
          } />
          
          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h1 className="text-6xl font-extrabold text-ink opacity-20 mb-4">404</h1>
              <p className="text-lg font-bold text-ink-3 mb-6">Page not found</p>
              <button onClick={() => window.history.back()} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Go Back</button>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
