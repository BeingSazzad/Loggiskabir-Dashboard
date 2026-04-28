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
    settings: Settings
  };

  if (!role) {
    return <Login setRole={setRole} />;
  }

  // Route protection for dispatcher
  if (role === 'dispatcher' && ['drivers', 'applications', 'reports', 'settings'].includes(page)) {
    setPage('operations'); // Force back to safe page
  }

  const PageComponent = PAGES[page] || Operations;

  const handleLogout = () => {
    setRole(null);
    setPage('operations');
  };

  return (
    <Shell currentPage={page} setPage={setPage} role={role} onLogout={handleLogout}>
      <div className="animate-fade-in">
        <PageComponent setPage={setPage} />
      </div>
    </Shell>
  );
}

export default App;
