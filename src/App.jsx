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

function App() {
  const [role, setRole] = useState(null); // 'admin' | 'dispatcher' | null
  const [page, setPage] = useState('operations');

  const PAGES = {
    operations: Operations,
    bookings: Bookings,
    live: LiveTrips,
    drivers: Drivers,
    applications: Applications,
    reports: Reports,
    trips: TripHistory,
    settings: Settings,
    fleet: Fleet,
    schedule: Schedule,
    notifications: Notifications,
  };

  if (!role) {
    return <Login setRole={setRole} />;
  }

  // Basic permission gate for restricted pages
  if (role === 'dispatcher' && ['admin_only'].includes(page)) {
    setPage('operations');
  }

  const PageComponent = PAGES[page] || Operations;

  const handleLogout = () => {
    setRole(null);
    setPage('operations');
  };

  return (
    <Shell page={page} setPage={setPage} role={role} onLogout={handleLogout}>
      <div className="animate-fade-in">
        <PageComponent setPage={setPage} role={role} />
      </div>
    </Shell>
  );
}

export default App;
