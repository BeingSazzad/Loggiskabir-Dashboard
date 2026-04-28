import React, { useState } from 'react';
import Shell from './components/Shell';
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
import Schedule from './pages/Schedule';
import Notifications from './pages/Notifications';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import CMS from './pages/CMS';
import AdminDashboard from './pages/AdminDashboard';
import Transactions from './pages/Transactions';
import UserAccess from './pages/UserAccess';

function App() {
  const [role, setRole] = useState(null); // 'admin' | 'dispatcher' | null
  const [page, setPage] = useState('operations');

  const PAGES = {
    operations: Operations,
    admin_dashboard: AdminDashboard,
    transactions: Transactions,
    users: UserAccess,
    bookings: Bookings,
    live: LiveTrips,
    drivers: Drivers,
    applications: Applications,
    reports: Reports,
    trips: TripHistory,
    settings: Settings,
    profile: Profile,
    fleet: Fleet,
    schedule: Schedule,
    notifications: Notifications,
    cms: CMS,
    support: CMS,
  };

  const handleLogout = () => {
    setPage('logged_out');
  };

  const handleRoleSet = (newRole) => {
    setRole(newRole);
    setPage(newRole === 'admin' ? 'admin_dashboard' : 'operations');
  };

  const handleBackToLogin = () => {
    setRole(null);
    setPage('operations');
  };

  if (page === 'logged_out') {
    return <Logout onBackToLogin={handleBackToLogin} />;
  }

  if (!role) {
    return <Login setRole={handleRoleSet} />;
  }

  const PageComponent = PAGES[page] || (role === 'admin' ? AdminDashboard : Operations);

  return (
    <Shell page={page} setPage={setPage} role={role} onLogout={handleLogout}>
      <div className="animate-fade-in">
        <PageComponent setPage={setPage} role={role} />
      </div>
    </Shell>
  );
}

export default App;
