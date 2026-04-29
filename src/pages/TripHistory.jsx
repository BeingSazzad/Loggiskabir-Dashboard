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
  const [editedTime, setEditedTime] = useState(trip.scheduledTime ? trip.scheduledTime.slice(11, 16) : '');
  const [editedDriverId, setEditedDriverId] = useState(trip.driverId);
  
  const driver = drivers.find(d => String(d.id) === String(editedDriverId));
  const canEdit = !['completed', 'cancelled', 'in_trip', 'en_route', 'arrived'].includes(trip.status);

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-line-2 bg-bg relative">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <TripStatusBadge status={trip.status} />
            <div>
              <h2 className="text-xl font-extrabold font-display text-ink uppercase tracking-tight flex items-center gap-2">
                Trip #{trip.id}
                {trip.rating && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp size={12}/> ★ {trip.rating}</span>}
              </h2>
              <p className="text-xs font-bold text-ink-3 mt-1">Submitted: {trip.submittedTime ? formatDateTime(trip.submittedTime) : 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canEdit && !editMode && (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>Modify Trip</Button>
            )}
            {editMode && (
              <Button variant="primary" size="sm" onClick={() => {
                trip.driverId = editedDriverId;
                trip.scheduledTime = trip.scheduledTime.slice(0, 11) + editedTime + trip.scheduledTime.slice(16);
                if (trip.status === 'pending_review' || !trip.status) trip.status = 'assigned';
                setEditMode(false);
              }}>Save Changes</Button>
            )}
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-line-2 hover:bg-line-2 hover:text-ink transition-colors text-ink-4 shadow-sm">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {trip.cancelReason && (
            <div className="mb-6 bg-urgent-light/40 border border-urgent/20 p-4 rounded-xl flex items-start gap-3">
              <XCircle className="text-urgent shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs font-black text-urgent uppercase tracking-widest mb-1">Cancellation Reason</p>
                <p className="text-sm font-medium text-ink">{trip.cancelReason}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Trip Details & Rider Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Trip Overview */}
              <section className="bg-white rounded-2xl border border-line-2 p-5 shadow-sm">
                <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Calendar size={14} /> Trip Overview
                </h3>
                
                {editMode && (
                  <div className="mb-5 p-4 bg-primary-tint/10 rounded-xl border border-primary/20">
                    <label className="block text-[10px] font-bold text-ink-3 uppercase mb-1">Reschedule Time</label>
                    <input 
                      type="time" 
                      value={editedTime} 
                      onChange={(e) => setEditedTime(e.target.value)}
                      className="w-full max-w-xs bg-white border border-line rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Scheduled Date</p>
                    <p className="text-sm font-bold text-ink">{trip.scheduledTime ? formatShortDate(trip.scheduledTime) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Scheduled Time</p>
                    <p className="text-sm font-bold text-ink">{trip.scheduledTime ? formatTime(trip.scheduledTime) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Appointment</p>
                    <p className="text-sm font-bold text-primary">{trip.appointmentTime || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Trip Type</p>
                    <p className="text-sm font-bold text-ink">{tripTypeLabel(trip.type)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Reason</p>
                    <p className="text-sm font-medium text-ink">{trip.reason || 'Medical Visit'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Est. Distance</p>
                    <p className="text-sm font-medium text-ink">{trip.distance || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Est. Duration</p>
                    <p className="text-sm font-medium text-ink">{trip.duration || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Return Type</p>
                    <p className="text-sm font-medium text-ink capitalize">{trip.returnType ? trip.returnType.replace('_', ' ') : 'N/A'}</p>
                  </div>
                </div>
              </section>

              {/* Route Anatomy */}
              <section className="bg-white rounded-2xl border border-line-2 p-5 shadow-sm">
                <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Navigation size={14} /> Route & Timeline
                </h3>
                
                <div className="relative pl-4 space-y-6">
                  <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-line-2"></div>

                  <div className="relative z-10 flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Pickup Location</p>
                        {trip.actualPickup && <Badge variant="neutral" className="text-[9px]">Actual: {trip.actualPickup}</Badge>}
                      </div>
                      <p className="text-sm font-bold text-ink leading-snug max-w-lg">{trip.pickup}</p>
                    </div>
                  </div>

                  {trip.stop && (
                    <div className="relative z-10 flex gap-4">
                      <div className="w-5 h-5 rounded-full bg-white border-2 border-accent flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-accent"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Intermediate Stop</p>
                          {trip.actualStop && <Badge variant="neutral" className="text-[9px]">Actual: {trip.actualStop}</Badge>}
                        </div>
                        <p className="text-sm font-bold text-ink leading-snug max-w-lg">{trip.stop}</p>
                      </div>
                    </div>
                  )}

                  <div className="relative z-10 flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-urgent flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <MapPin size={10} className="text-urgent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Drop-off Location</p>
                        {trip.actualDropoff ? <Badge variant="neutral" className="text-[9px]">Actual: {trip.actualDropoff}</Badge> : trip.actualArrived ? <Badge variant="neutral" className="text-[9px]">Arrived: {trip.actualArrived}</Badge> : null}
                      </div>
                      <p className="text-sm font-bold text-ink leading-snug max-w-lg">{trip.dropoff}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rider Info */}
              <section className="bg-white rounded-2xl border border-line-2 p-5 shadow-sm">
                <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={14} /> Passenger Information
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center gap-4 border-r border-line-2 pr-6">
                    <Avatar initials={trip.rider.initials} size="lg" />
                    <div>
                      <h4 className="text-lg font-extrabold text-ink">{trip.rider.name}</h4>
                      <p className="text-xs text-ink-4 mt-0.5 font-medium">{trip.rider.phone || 'No phone provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Age</p>
                      <p className="text-sm font-bold text-ink">{trip.rider.age || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Mobility Need</p>
                      <p className="text-sm font-bold text-ink flex items-center gap-1.5">
                        <Badge variant="primary">{trip.mobility || 'Ambulatory'}</Badge>
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Passengers</p>
                      <p className="text-sm font-bold text-ink">{trip.passengers || 1}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Escort/Attendant</p>
                      <p className="text-sm font-bold text-ink">{trip.escort || 'None'}</p>
                    </div>
                  </div>
                </div>

                {trip.notes && (
                  <div className="mt-5 p-4 bg-bg rounded-xl border border-line-2">
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Special Instructions / Notes</p>
                    <p className="text-sm font-medium text-ink">{trip.notes}</p>
                  </div>
                )}
              </section>

            </div>

            {/* Right Col: Driver & Financials */}
            <div className="space-y-6">
              
              {/* Driver Assignment */}
              <section className="bg-white rounded-2xl border border-line-2 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <TruckIcon size={14} /> Fleet & Driver
                  </h3>
                  {editMode && <Badge variant="warning">Editing</Badge>}
                </div>

                {editMode ? (
                  <div className="space-y-2">
                    {drivers.slice(0, 5).map(d => (
                      <button 
                        key={d.id}
                        onClick={() => setEditedDriverId(d.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${editedDriverId === d.id ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'hover:bg-bg border-line-2'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar initials={d.initials} size="xs" />
                          <div className="text-left">
                            <p className="text-xs font-bold leading-tight">{d.name}</p>
                            <p className="text-[10px] font-medium opacity-80">{d.vehicle.type}</p>
                          </div>
                        </div>
                        {editedDriverId === d.id && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>
                ) : (
                  driver ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={driver.initials} size="md" online={driver.onDuty} />
                        <div>
                          <p className="text-base font-extrabold text-ink">{driver.name}</p>
                          <p className="text-xs text-ink-3 font-medium">{driver.phone}</p>
                        </div>
                      </div>
                      
                      <div className="bg-bg rounded-xl p-3 border border-line-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-ink-4 uppercase">Vehicle Type</span>
                          <span className="text-xs font-bold text-ink">{driver.vehicle.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-ink-4 uppercase">Plate Number</span>
                          <span className="text-xs font-bold font-mono text-ink bg-white px-2 py-0.5 rounded border border-line">{driver.vehicle.plate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-ink-4 uppercase">Driver Rating</span>
                          <span className="text-xs font-bold text-ink">★ {driver.rating}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" icon={Phone}>Call</Button>
                        <Button variant="outline" size="sm" className="flex-1" icon={MessageSquare}>Message</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center bg-bg/50 border border-dashed border-line-2 rounded-xl">
                      <Car size={32} className="text-ink-4 mb-3 opacity-50" />
                      <p className="text-sm font-bold text-ink mb-1">Unassigned Request</p>
                      <p className="text-xs text-ink-4 mb-4">No driver has been assigned yet.</p>
                      {canEdit && <Button variant="primary" size="sm" onClick={() => setEditMode(true)}>Assign Driver</Button>}
                    </div>
                  )
                )}
              </section>

              {/* Financial & Billing */}
              <section className="bg-white rounded-2xl border border-line-2 p-5 shadow-sm">
                <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CreditCard size={14} /> Billing & Payment
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-end justify-between bg-bg p-4 rounded-xl border border-line-2">
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Total Trip Cost</p>
                      <p className="text-2xl font-extrabold text-primary leading-none">{money(trip.cost)}</p>
                    </div>
                    <Badge variant={trip.paymentStatus === 'Paid' || trip.paymentStatus === 'Approved' || trip.paymentStatus === 'charged' ? 'accent' : 'warning'}>
                      {trip.paymentStatus || 'Pending'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Payment Method</p>
                      <p className="text-sm font-bold text-ink truncate" title={trip.paymentMethod || 'N/A'}>{trip.paymentMethod || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Auth / Claim ID</p>
                      <p className="text-sm font-bold font-mono text-ink truncate" title={trip.authId || 'N/A'}>{trip.authId || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Action Logs / Audits (Placeholder) */}
              <section className="bg-white rounded-2xl border border-line-2 p-5 shadow-sm">
                <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Shield size={14} /> Audit Trail
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-line-2 mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-xs font-medium text-ink-3">Trip submitted by <span className="font-bold text-ink">Dispatcher Portal</span></p>
                      <p className="text-[10px] text-ink-4">{trip.submittedTime ? formatDateTime(trip.submittedTime) : 'N/A'}</p>
                    </div>
                  </div>
                  {trip.driverId && (
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                      <div>
                        <p className="text-xs font-medium text-ink-3">Assigned to <span className="font-bold text-ink">{driver?.name || trip.driverId}</span></p>
                        <p className="text-[10px] text-ink-4">System Auto-log</p>
                      </div>
                    </div>
                  )}
                </div>
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
