import React, { useState } from 'react';
import {
  Search, Filter, Download, ChevronRight, MapPin, ArrowRight,
  Clock, User, Truck as TruckIcon, CheckCircle2, XCircle, TrendingUp,
  BarChart3, X, Calendar, Phone, CreditCard, Shield, Navigation, Car,
  MoveRight, Repeat, RefreshCcw, MessageSquare, UserPlus
} from 'lucide-react';
import { Card, StatCard, Badge, Avatar, TripStatusBadge, Pagination, Button } from '../components/UI';
import { trips, drivers } from '../data/mockData';
import { formatTime, formatShortDate, formatDateTime, tripTypeLabel, money } from '../utils/helpers';

const TripDetailsModal = ({ trip, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTime, setEditedTime] = useState(trip.scheduledTime.slice(11, 16));
  const [editedDriverId, setEditedDriverId] = useState(trip.driverId);
  
  // Robust search for driver (handling both string and number IDs)
  const driver = drivers.find(d => String(d.id) === String(editedDriverId));
  const canEdit = !['completed', 'cancelled', 'in_trip', 'en_route', 'arrived'].includes(trip.status);

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line-2 bg-bg/50">
          <div className="flex items-center gap-4">
            <TripStatusBadge status={trip.status} />
            <div>
              <h2 className="text-lg font-extrabold font-display text-ink uppercase tracking-tight">Trip #{trip.id}</h2>
              <p className="text-xs font-bold text-ink-3">{formatDateTime(trip.scheduledTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && !editMode && (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>Modify Trip</Button>
            )}
            {editMode && (
              <Button variant="primary" size="sm" onClick={() => {
                // Apply changes to the trip object
                trip.driverId = editedDriverId;
                trip.scheduledTime = trip.scheduledTime.slice(0, 11) + editedTime + trip.scheduledTime.slice(16);
                if (trip.status === 'pending_review' || !trip.status) trip.status = 'assigned';
                setEditMode(false);
              }}>Save Changes</Button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-ink-4 hover:text-ink transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column: Route & Rider */}
            <div className="space-y-6">
              {/* Schedule Edit Section */}
              {editMode && (
                <section className="bg-primary-tint/20 p-4 rounded-2xl border border-primary/20 animate-in slide-in-from-top-2">
                  <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock size={12} /> Reschedule Trip
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-[9px] font-bold text-ink-3 uppercase mb-1">New Scheduled Time</label>
                      <input 
                        type="time" 
                        value={editedTime} 
                        onChange={(e) => setEditedTime(e.target.value)}
                        className="w-full bg-white border border-line rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Route */}
              <section>
                <h3 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Navigation size={12} /> Route Anatomy</h3>
                <Card className="p-4 bg-bg border-line-2 relative overflow-hidden">
                  <div className="absolute left-7 top-7 bottom-7 w-0.5 bg-line-2"></div>

                  <div className="flex gap-4 relative z-10 mb-6">
                    <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0 border-2 border-bg shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-0.5">Pickup</p>
                      <p className="text-sm font-bold text-ink">{trip.pickup}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-accent-light text-accent flex items-center justify-center flex-shrink-0 border-2 border-bg shadow-sm">
                      <MapPin size={12} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-0.5">Dropoff</p>
                      <p className="text-sm font-bold text-ink">{trip.dropoff}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-line-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9" icon={Phone}>Call Rider</Button>
                    <Button variant="outline" size="sm" className="flex-1 h-9" icon={MessageSquare}>Message</Button>
                  </div>
                </Card>
              </section>

              {/* Rider */}
              <section>
                <h3 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-3 flex items-center gap-1.5"><User size={12} /> Passenger Information</h3>
                <Card className="p-4 border-line-2 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar initials={trip.rider.initials} size="lg" />
                    <div>
                      <h4 className="text-base font-extrabold text-ink">{trip.rider.name}</h4>
                      <Badge variant="neutral">{tripTypeLabel(trip.type)}</Badge>
                    </div>
                  </div>
                </Card>
              </section>
            </div>

            {/* Right Column: Assigned Asset & Financials */}
            <div className="space-y-6">

              {/* Fleet & Driver */}
              <section>
                <div className="flex items-center justify-between mb-3">
                   <h3 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest flex items-center gap-1.5"><TruckIcon size={12} /> Fleet Assignment</h3>
                   {editMode && <Badge variant="warning">Editing</Badge>}
                </div>
                
                {editMode ? (
                  <Card className="p-4 border-primary border-2 bg-primary-tint/5">
                    <p className="text-[9px] font-bold text-ink-3 uppercase mb-3">Select New Driver</p>
                    <div className="space-y-2">
                      {drivers.slice(0, 4).map(d => (
                        <button 
                          key={d.id}
                          onClick={() => setEditedDriverId(d.id)}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${editedDriverId === d.id ? 'bg-primary text-white shadow-md' : 'hover:bg-bg border border-transparent hover:border-line-2'}`}
                        >
                          <Avatar initials={d.initials} size="xs" />
                          <span className="text-xs font-bold">{d.name}</span>
                          {editedDriverId === d.id && <CheckCircle2 size={14} className="ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </Card>
                ) : (
                  driver ? (
                    <Card className="p-4 border-line-2 border-primary/20 bg-primary-tint/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar initials={driver.initials} size="md" online={driver.onDuty} />
                        <div className="flex-1">
                          <p className="text-sm font-extrabold text-ink">{driver.name}</p>
                          <p className="text-[10px] text-ink-4 font-mono uppercase">{driver.vehicle.plate} · {driver.vehicle.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="flex-1 h-9" icon={Phone}>Call</Button>
                         {canEdit && <Button variant="ghost" size="sm" className="flex-1 h-9 text-primary" onClick={() => setEditMode(true)}>Reassign</Button>}
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-8 border-line-2 border-dashed bg-bg/50 flex flex-col items-center justify-center text-center">
                      <User size={24} className="text-ink-4 mb-2 opacity-50" />
                      <p className="text-sm font-bold text-ink">No driver assigned</p>
                      {canEdit && <Button variant="primary" size="sm" className="mt-3" onClick={() => setEditMode(true)}>Assign Now</Button>}
                    </Card>
                  )
                )}
              </section>

              {/* Financials */}
              <section>
                <h3 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-3 flex items-center gap-1.5"><CreditCard size={12} /> Billing Details</h3>
                <Card className="p-4 border-line-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Total Cost</p>
                      <p className="text-xl font-extrabold text-primary">{money(trip.cost)}</p>
                    </div>
                    <Badge variant={trip.status === 'completed' ? 'accent' : 'warning'}>
                      {trip.status === 'completed' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                </Card>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TripHistory = () => {
  const historyTrips = trips.filter(t => t.status !== 'pending_review');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all'); // 'today', 'tomorrow', 'week', 'month', 'all'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTrips = historyTrips.filter(trip => {
    const matchesSearch =
      trip.id.toLowerCase().includes(search.toLowerCase()) ||
      trip.rider.name.toLowerCase().includes(search.toLowerCase()) ||
      (trip.pickup && trip.pickup.toLowerCase().includes(search.toLowerCase())) ||
      (trip.dropoff && trip.dropoff.toLowerCase().includes(search.toLowerCase()));

    // Status Filter
    let matchesStatus = true;
    if (filter === 'active') matchesStatus = ['in_trip', 'en_route', 'arrived', 'assigned'].includes(trip.status);
    else if (filter === 'completed') matchesStatus = trip.status === 'completed';
    else if (filter === 'cancelled') matchesStatus = trip.status === 'cancelled';

    // Time Filter Logic
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const now = new Date();
      const tripDate = new Date(trip.scheduledTime);
      
      const isToday = tripDate.toDateString() === now.toDateString();
      
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const isTomorrow = tripDate.toDateString() === tomorrow.toDateString();
      
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      const isThisWeek = tripDate >= weekAgo && tripDate <= now;
      
      const isThisMonth = tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear();

      if (timeFilter === 'today') matchesTime = isToday;
      else if (timeFilter === 'tomorrow') matchesTime = isTomorrow;
      else if (timeFilter === 'week') matchesTime = isThisWeek;
      else if (timeFilter === 'month') matchesTime = isThisMonth;
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.scheduledTime) - new Date(a.scheduledTime);
    if (sortBy === 'oldest') return new Date(a.scheduledTime) - new Date(b.scheduledTime);
    if (sortBy === 'rider') return a.rider.name.localeCompare(b.rider.name);
    return 0;
  });

  const totalPages = Math.ceil(sortedTrips.length / itemsPerPage);
  const paginatedTrips = sortedTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedTrips.length) setSelectedIds([]);
    else setSelectedIds(paginatedTrips.map(t => t.id));
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleExport = () => {
    const tripsToExport = selectedIds.length > 0
      ? trips.filter(t => selectedIds.includes(t.id))
      : sortedTrips;

    if (tripsToExport.length === 0) return;

    // Define headers
    const headers = ['Trip ID', 'Date', 'Time', 'Rider Name', 'Driver Name', 'Pickup', 'Dropoff', 'Status', 'Cost', 'Type'];

    // Map data to rows
    const rows = tripsToExport.map(trip => [
      trip.id,
      formatShortDate(trip.scheduledTime),
      formatTime(trip.scheduledTime),
      trip.rider.name,
      drivers.find(d => d.id === trip.driverId)?.name || 'Unassigned',
      `"${trip.pickup}"`,
      `"${trip.dropoff}"`,
      trip.status,
      trip.cost,
      trip.type
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LOGISS_Trips_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSelectedIds([]); // Clear selection after export
  };

  const now = new Date();
  const todayTrips = historyTrips.filter(t => new Date(t.scheduledTime).toDateString() === now.toDateString());
  const completedToday = todayTrips.filter(t => t.status === 'completed').length;
  const activeToday = todayTrips.filter(t => ['assigned', 'confirmed', 'in_trip', 'en_route', 'arrived'].includes(t.status)).length;
  const monthlyRevenue = historyTrips
    .filter(t => new Date(t.scheduledTime).getMonth() === now.getMonth())
    .reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-8">
      {selectedTrip && (
        <TripDetailsModal 
          key={selectedTrip.id} 
          trip={selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Trip History</h1>
          <p className="text-ink-3 font-medium">Archived and active records for LOGISS fleet</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      {/* KPI Cells */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Trips" value={todayTrips.length} icon={Calendar} accent="primary" />
        <StatCard label="Completed Today" value={completedToday} icon={CheckCircle2} accent="accent" />
        <StatCard label="Active / Pending" value={activeToday} icon={Clock} accent="warning" />
        <StatCard label="MTD Revenue" value={money(monthlyRevenue)} icon={TrendingUp} accent="primary" />
      </div>

      <Card className="overflow-hidden border-line-2 shadow-sm">
        {/* Advanced Filter Bar */}
        <div className="p-6 border-b border-line-2 bg-bg/30 space-y-5">
          {/* Row 1: Search & Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4" size={20} />
              <input
                type="text"
                placeholder="Search trips, riders, or locations..."
                className="w-full bg-white border border-line rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-ink-4 uppercase tracking-widest whitespace-nowrap">Time Period</span>
                <select
                  value={timeFilter}
                  onChange={(e) => { setTimeFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-line rounded-xl py-2.5 px-4 text-xs font-bold text-ink focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none cursor-pointer h-10 min-w-[140px]"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-ink-4 uppercase tracking-widest whitespace-nowrap">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-line rounded-xl py-2.5 px-4 text-xs font-bold text-ink focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none cursor-pointer h-10 min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rider">Rider Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-start gap-6 pt-2">
            <div className="flex items-center gap-2 bg-bg p-1.5 rounded-xl border border-line shadow-inner">
              {['all', 'active', 'completed', 'cancelled'].map(f => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setCurrentPage(1); }}
                  className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white shadow-md text-primary' : 'text-ink-3 hover:text-ink-2 hover:bg-white/50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-line-2">
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedTrips.length && paginatedTrips.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-line text-primary focus:ring-primary/20 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Trip ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Rider</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Driver</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Route</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest text-right">Cost</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-2">
              {paginatedTrips.map(trip => (
                <tr
                  key={trip.id}
                  onClick={() => setSelectedTrip(trip)}
                  className={`hover:bg-primary-tint/20 transition-colors group cursor-pointer ${selectedIds.includes(trip.id) ? 'bg-primary-tint/10' : ''}`}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(trip.id)}
                      onChange={(e) => toggleSelect(trip.id, e)}
                      className="w-4 h-4 rounded border-line text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-ink tracking-tight uppercase">#{trip.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-ink">{formatShortDate(trip.scheduledTime)}</span>
                      <span className="text-[10px] text-ink-3">{formatTime(trip.scheduledTime)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={trip.rider.initials} size="xs" />
                      <span className="text-xs font-bold text-ink whitespace-nowrap">{trip.rider.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {trip.driverId ? (
                      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                         <Avatar initials={drivers.find(d => String(d.id) === String(trip.driverId))?.initials} size="xs" />
                         <span className="text-xs font-bold text-ink">{drivers.find(d => String(d.id) === String(trip.driverId))?.name}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedTrip(trip); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider"
                      >
                        <UserPlus size={12} /> Assign
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-ink-3">
                      <MapPin size={10} className="flex-shrink-0" />
                      <span className="text-[10px] font-medium max-w-[150px] truncate">{trip.pickup}</span>
                      <ArrowRight size={10} className="flex-shrink-0" />
                      <span className="text-[10px] font-medium max-w-[150px] truncate">{trip.dropoff}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {trip.type === 'round_trip' ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 w-fit">
                        <Repeat size={10} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Round Trip</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 w-fit">
                        <MoveRight size={10} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-tight">One Way</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-xs font-bold text-ink">{money(trip.cost)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <TripStatusBadge status={trip.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight size={16} className="text-ink-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTrips.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
          {filteredTrips.length === 0 && (
            <div className="p-12 text-center text-ink-4">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">No trips found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TripHistory;
