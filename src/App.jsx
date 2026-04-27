import React, { useState } from 'react';
import Shell from './components/Shell';
import Operations from './pages/Operations';
import Bookings from './pages/Bookings';
import LiveTrips from './pages/LiveTrips';
import Drivers from './pages/Drivers';
import Applications from './pages/Applications';
import Reports from './pages/Reports';
import TripHistory from './pages/TripHistory';
import Settings from './pages/Settings';

function App() {
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

  const PageComponent = PAGES[page] || Operations;

  return (
    <Shell currentPage={page} setPage={setPage}>
      <div className="animate-fade-in">
        <PageComponent setPage={setPage} />
      </div>
    </Shell>
  );
}

export default App;
