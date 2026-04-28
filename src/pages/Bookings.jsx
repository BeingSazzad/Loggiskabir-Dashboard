import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  MapPin, 
  Phone, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  User,
  Users,
  Calendar, 
  CreditCard,
  AlertCircle,
  Truck,
  Star,
  AlertTriangle,
  Edit2,
  Plus,
  X,
  Inbox,
  TrendingUp,
  Download
} from 'lucide-react';
import { Card, StatCard, Avatar, Badge, Button, TripStatusBadge, Pagination } from '../components/UI';
import { trips, drivers } from '../data/mockData';
import { formatTime, formatDateTime, formatShortDate, timeAgo, tripTypeLabel, money } from '../utils/helpers';

// Helper: check if two time windows overlap (within 1.5 hours either side)
const hasTimeConflict = (existingTrip, candidateTime) => {
  if (!existingTrip.scheduledTime || !candidateTime) return false;
  const existing = new Date(existingTrip.scheduledTime).getTime();
  const candidate = new Date(candidateTime).getTime();
  const BUFFER_MS = 90 * 60 * 1000; // 1.5 hour buffer
  return Math.abs(existing - candidate) < BUFFER_MS;
};

// Helper: check if driver vehicle type matches trip mobility need
const isVehicleMatch = (driver, booking) => {
  if (!booking?.mobility) return false;
  const need = booking.mobility.toLowerCase();
  const type = driver.vehicle?.type?.toLowerCase() || '';
  if (need === 'wheelchair' || need === 'stretcher') return type.includes(need.split(' ')[0]);
  return true; // ambulatory / cane can use any van
};

const ManualTripModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    riderName: '',
    phone: '',
    pickup: '',
    dropoff: '',
    scheduledTime: '',
    mobility: 'Ambulatory',
    type: 'one_way',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      id: `LOGISS-${Math.floor(1000 + Math.random() * 9000)}`,
      rider: { name: form.riderName, initials: form.riderName.split(' ').map(n => n[0]).join(''), phone: form.phone },
      status: 'pending_review',
      submittedTime: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line-2">
          <h3 className="text-lg font-bold text-ink">New Manual Trip Entry</h3>
          <button onClick={onClose} className="p-2 hover:bg-bg rounded-lg text-ink-4"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Rider Name</label>
              <input required className="input-base w-full" value={form.riderName} onChange={e => setForm({...form, riderName: e.target.value})} placeholder="Full Name" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Phone</label>
              <input className="input-base w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="(804) 555-0000" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Mobility</label>
              <select className="input-base w-full" value={form.mobility} onChange={e => setForm({...form, mobility: e.target.value})}>
                <option>Ambulatory</option>
                <option>Wheelchair</option>
                <option>Stretcher</option>
                <option>Cane</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Pickup Address</label>
              <input required className="input-base w-full" value={form.pickup} onChange={e => setForm({...form, pickup: e.target.value})} placeholder="Street, City, State" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Dropoff Address</label>
              <input required className="input-base w-full" value={form.dropoff} onChange={e => setForm({...form, dropoff: e.target.value})} placeholder="Medical Facility / Home" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Scheduled Date & Time</label>
              <input required type="datetime-local" className="input-base w-full" value={form.scheduledTime} onChange={e => setForm({...form, scheduledTime: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Trip Type</label>
              <select className="input-base w-full" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="one_way">One Way</option>
                <option value="round_trip">Round Trip</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" className="flex-1">Create Booking</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Bookings = () => {
  const [localTrips, setLocalTrips] = useState(trips);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const stats = {
    pending: localTrips.filter(t => t.status === 'pending_review').length,
    approved: localTrips.filter(t => ['assigned', 'confirmed'].includes(t.status)).length,
    rejected: localTrips.filter(t => t.status === 'cancelled').length,
    totalToday: localTrips.filter(t => t.submittedTime && t.submittedTime.startsWith(new Date().toISOString().split('T')[0])).length
  };

  const filteredBookings = localTrips.filter(t => {
    // Tab Filter
    let tabMatch = false;
    if (activeTab === 'pending') tabMatch = t.status === 'pending_review';
    else if (activeTab === 'approved') tabMatch = ['assigned', 'confirmed'].includes(t.status);
    else if (activeTab === 'rejected') tabMatch = t.status === 'cancelled';

    // Search Filter
    const searchMatch = 
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.rider.name.toLowerCase().includes(search.toLowerCase()) ||
      t.pickup.toLowerCase().includes(search.toLowerCase()) ||
      t.dropoff.toLowerCase().includes(search.toLowerCase());

    // Date Filter
    const tripDate = new Date(t.scheduledTime).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate + 'T23:59:59').getTime() : Infinity;
    const dateMatch = tripDate >= start && tripDate <= end;

    return tabMatch && searchMatch && dateMatch;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.submittedTime) - new Date(a.submittedTime);
    if (sortBy === 'oldest') return new Date(a.submittedTime) - new Date(b.submittedTime);
    if (sortBy === 'rider') return a.rider.name.localeCompare(b.rider.name);
    return 0;
  });

  const paginatedBookings = sortedBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  const selectedBooking = selectedBookingId ? localTrips.find(t => t.id === selectedBookingId) : null;
  const assignedDriver = selectedBooking?.driverId ? drivers.find(d => d.id === selectedBooking.driverId) : null;

  const handleExport = () => {
    const itemsToExport = selectedIds.length > 0 
      ? localTrips.filter(t => selectedIds.includes(t.id))
      : sortedBookings;
    
    if (itemsToExport.length === 0) return;

    const headers = ['ID', 'Rider', 'Pickup', 'Dropoff', 'Time', 'Status', 'Cost'];
    const csvContent = [
      headers.join(','),
      ...itemsToExport.map(t => [
        t.id, 
        t.rider.name, 
        `"${t.pickup}"`, 
        `"${t.dropoff}"`, 
        formatDateTime(t.scheduledTime), 
        t.status, 
        t.cost
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bookings_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    setSelectedIds([]);
  };

  const handleReject = () => {
    if (!selectedBooking) return;
    setLocalTrips(prev => prev.map(t => 
      t.id === selectedBooking.id ? { ...t, status: 'cancelled' } : t
    ));
    setSelectedBookingId(null);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedBookings.length) setSelectedIds([]);
    else setSelectedIds(paginatedBookings.map(b => b.id));
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleApprove = () => {
    if (!selectedBooking) return;
    setLocalTrips(prev => prev.map(t => 
      t.id === selectedBooking.id ? { ...t, status: 'assigned' } : t
    ));
    setSelectedBookingId(null);
  };

  const handleAssign = (driverId) => {
    if (!selectedBooking) return;
    setLocalTrips(prev => prev.map(t => 
      t.id === selectedBooking.id ? { ...t, status: 'assigned', driverId } : t
    ));
    setIsAssigning(false);
    setSelectedBookingId(null);
  };

  const smartDrivers = drivers.map(driver => {
    const conflictingTrips = localTrips.filter(t =>
      t.driverId === driver.id &&
      t.id !== selectedBooking?.id &&
      ['assigned', 'confirmed', 'in_trip'].includes(t.status) &&
      hasTimeConflict(t, selectedBooking?.scheduledTime)
    );
    const hasConflict = conflictingTrips.length > 0;
    const isMatch = isVehicleMatch(driver, selectedBooking);
    return { ...driver, hasConflict, isMatch };
  }).sort((a, b) => {
    if (a.isMatch && !b.isMatch) return -1;
    if (!a.isMatch && b.isMatch) return 1;
    if (a.hasConflict && !b.hasConflict) return 1;
    if (!a.hasConflict && b.hasConflict) return -1;
    return 0;
  });

  return (
    <div className="space-y-8">
      {showManualModal && <ManualTripModal onClose={() => setShowManualModal(false)} onSave={(t) => setLocalTrips([t, ...localTrips])} />}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Bookings</h1>
          <p className="text-ink-3 font-medium">Review and process ride requests for today and future</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowManualModal(true)}>Manual Booking</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Review" value={stats.pending} icon={Inbox} accent="warning" />
        <StatCard label="Approved Trips" value={stats.approved} icon={CheckCircle2} accent="accent" />
        <StatCard label="Rejected / Cancelled" value={stats.rejected} icon={XCircle} accent="urgent" />
        <StatCard label="New Today" value={stats.totalToday} icon={TrendingUp} accent="primary" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table Content */}
        <div className={`transition-all duration-300 ease-in-out ${selectedBookingId ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <Card className="overflow-hidden border-line-2 shadow-sm">
            {/* Advanced Filter Bar */}
            <div className="p-6 border-b border-line-2 bg-bg/30 space-y-5">
              {/* Row 1: Search & Sort */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 max-w-2xl relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by ID, Rider Name, Pickup or Drop-off..." 
                    className="w-full bg-white border border-line rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-ink-4 uppercase tracking-widest whitespace-nowrap">Sort By</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-line rounded-xl py-2.5 px-4 text-xs font-bold text-ink focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="rider">Rider Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Date Range & Tabs */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-white border border-line rounded-xl px-3 py-1.5 shadow-sm">
                    <Calendar size={14} className="text-primary" />
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                      className="bg-transparent text-xs font-bold text-ink outline-none cursor-pointer"
                    />
                    <span className="text-ink-4 font-bold mx-1">→</span>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                      className="bg-transparent text-xs font-bold text-ink outline-none cursor-pointer"
                    />
                  </div>
                  
                  {selectedIds.length > 0 && (
                    <Button variant="outline" size="sm" icon={Download} onClick={handleExport} className="animate-fade-in whitespace-nowrap ml-2">
                      Export {selectedIds.length} Marked
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 bg-bg p-1.5 rounded-xl border border-line shadow-inner">
                  {[
                    { id: 'pending', label: 'Pending Review', count: stats.pending },
                    { id: 'approved', label: 'Approved', count: stats.approved },
                    { id: 'rejected', label: 'Rejected', count: stats.rejected }
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => { setActiveTab(t.id); setCurrentPage(1); setSelectedIds([]); }}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-white shadow-md text-primary' : 'text-ink-3 hover:text-ink-2 hover:bg-white/50'}`}
                    >
                      {t.label}
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === t.id ? 'bg-primary-light' : 'bg-line'}`}>{t.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg/50 border-b border-line-2">
                    <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length === paginatedBookings.length && paginatedBookings.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-line text-primary focus:ring-primary/20 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Trip Ref</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Rider</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Route</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest hidden lg:table-cell">Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Scheduled</th>
                    {activeTab !== 'pending' && <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Assignment</th>}
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2">
                  {paginatedBookings.map(booking => (
                    <tr 
                      key={booking.id} 
                      onClick={() => setSelectedBookingId(booking.id)}
                      className={`cursor-pointer transition-colors group ${selectedBookingId === booking.id ? 'bg-primary-tint/20' : 'hover:bg-bg'}`}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(booking.id)}
                          onChange={() => setSelectedIds(prev => prev.includes(booking.id) ? prev.filter(i => i !== booking.id) : [...prev, booking.id])}
                          className="w-4 h-4 rounded border-line text-primary focus:ring-primary/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-ink block mb-0.5 uppercase">#{booking.id}</span>
                        <span className="text-[10px] font-bold text-ink-4">{timeAgo(booking.submittedTime)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={booking.rider.initials} size="xs" />
                          <span className="text-xs font-bold text-ink">{booking.rider.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-primary uppercase w-7">From</span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                              <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0"></div>
                              <span className="truncate max-w-[140px]">{booking.pickup}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-accent uppercase w-7">To</span>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-3">
                              <MapPin size={10} className="flex-shrink-0 text-accent" />
                              <span className="truncate max-w-[140px]">{booking.dropoff}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-ink-4 uppercase">Mobility</span>
                            <Badge variant="primary">{booking.mobility}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-ink-4 uppercase">Type</span>
                            <Badge variant="neutral">{tripTypeLabel(booking.type)}</Badge>
                          </div>
                          <div className="flex items-center justify-between border-t border-line/50 pt-1 mt-1">
                            <span className="text-[9px] font-bold text-ink-4 uppercase">Price</span>
                            <span className="text-xs font-mono font-bold text-ink">{money(booking.cost)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-ink mb-0.5">{formatShortDate(booking.scheduledTime)}</span>
                          <span className="text-[10px] font-semibold text-ink-3">{formatTime(booking.scheduledTime)}</span>
                        </div>
                      </td>
                      {activeTab !== 'pending' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.driverId ? (
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                              <span className="text-[10px] font-bold text-ink uppercase tracking-wider">Assigned</span>
                            </div>
                          ) : (
                            <Badge variant="urgent" dot={true}>Needs Driver</Badge>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:bg-primary-light"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBookingId(booking.id);
                      }}
                    >
                      Review
                    </Button>
                  </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredBookings.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-ink-4 border border-line-2 rounded-xl bg-white">
              <CheckCircle2 size={48} className="mb-4 opacity-20" />
              <p className="font-bold">All caught up!</p>
              <p className="text-sm">No bookings in this category.</p>
            </div>
          )}
        </div>

        {/* Right Detail Panel */}
        {selectedBookingId && (
          <div className="lg:col-span-5 transition-all duration-300 ease-in-out">
            {selectedBooking ? (
            <Card className="h-full flex flex-col sticky top-0 max-h-full overflow-hidden">
              <div className="p-6 border-b border-line-2 flex items-center justify-between bg-tint/10">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-ink-3">#{selectedBooking.id}</span>
                  <h2 className="text-lg font-bold font-display text-ink">Booking Request Details</h2>
                </div>
                <div className="flex items-center gap-4">
                  <TripStatusBadge status={selectedBooking.status} />
                  <button 
                    onClick={() => setSelectedBookingId(null)}
                    className="p-1 hover:bg-bg rounded-lg text-ink-4 hover:text-ink transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Rider Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar initials={selectedBooking.rider.initials} size="lg" />
                      <div>
                        <h3 className="text-xl font-bold text-ink">{selectedBooking.rider.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-ink-3">{selectedBooking.rider.age} years</span>
                          <span className="w-1 h-1 bg-line rounded-full"></span>
                          <span className="text-xs font-semibold text-ink-3">{selectedBooking.rider.phone || '(804) 555-0142'}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" icon={Phone}>Call Rider</Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Reason</p>
                      <p className="text-sm font-bold text-ink truncate">{selectedBooking.reason || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Trip Type</p>
                      <p className="text-sm font-bold text-ink flex items-center gap-2">
                        {tripTypeLabel(selectedBooking.type)}
                        {selectedBooking.returnType === 'will_call' && <span className="text-[10px] bg-warning-light text-warning-dark px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Will Call</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Passengers</p>
                      <p className="text-sm font-bold text-ink flex items-center gap-2">
                        {selectedBooking.passengers || 1} <span className="text-ink-4">•</span> {selectedBooking.mobility}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Pickup Time</p>
                      <p className="text-sm font-bold text-ink">{formatDateTime(selectedBooking.scheduledTime)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Appt Time</p>
                      <p className="text-sm font-bold text-primary">{selectedBooking.appointmentTime || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Auth ID</p>
                      <p className="text-sm font-bold font-mono text-ink truncate">{selectedBooking.authId}</p>
                    </div>
                  </div>
                </section>

                {/* Route Card */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Route</h4>
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 border-l border-dashed border-line"></div>
                    <div className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary-light"></div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Pickup</p>
                      <p className="text-sm font-bold text-ink">{selectedBooking.pickup}</p>
                    </div>
                    {selectedBooking.stop && (
                      <div className="relative">
                        <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-warning ring-4 ring-warning-light"></div>
                        <p className="text-[10px] font-bold text-warning uppercase tracking-wider mb-1">Stop</p>
                        <p className="text-sm font-bold text-ink">{selectedBooking.stop}</p>
                      </div>
                    )}
                    <div className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-urgent ring-4 ring-urgent-light"></div>
                      <p className="text-[10px] font-bold text-urgent uppercase tracking-wider mb-1">Dropoff</p>
                      <p className="text-sm font-bold text-ink">{selectedBooking.dropoff}</p>
                    </div>
                  </div>
                </section>

                {/* Payment Details */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Payment Details</h4>
                  <div className="bg-bg rounded-xl border border-line-2 overflow-hidden">
                    <div className="p-4 border-b border-line-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-ink-4" />
                        <div>
                          <p className="text-xs font-bold text-ink">{selectedBooking.paymentMethod || 'Insurance Covered'}</p>
                          <p className="text-[10px] text-ink-4">Payment Method</p>
                        </div>
                      </div>
                      <Badge variant={selectedBooking.paymentStatus === 'Auth Hold' ? 'warning' : 'neutral'}>
                        {selectedBooking.paymentStatus || 'Pending'}
                      </Badge>
                    </div>
                    <div className="p-4 bg-white flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-3">Total Estimated Cost</span>
                      <span className="text-lg font-bold font-mono text-ink">{money(selectedBooking.cost)}</span>
                    </div>
                  </div>
                </section>

                {/* Special Instructions */}
                {selectedBooking.notes && (
                  <section>
                    <div className="bg-warning-light p-4 rounded-xl border border-warning/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-warning" />
                        <h4 className="text-xs font-bold text-warning uppercase tracking-widest">Special Instructions</h4>
                      </div>
                      <p className="text-sm font-medium text-warning-dark">{selectedBooking.notes}</p>
                    </div>
                  </section>
                )}
                {/* Driver Assignment — Only for Approved/Active trips */}
                {selectedBooking.status !== 'pending_review' && (
                  <section>
                    <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Driver Assignment</h4>

                  {/* Already assigned — show driver card */}
                  {assignedDriver && !isAssigning ? (
                    <div className="border border-accent/20 bg-accent-light/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar initials={assignedDriver.initials} size="sm" online={assignedDriver.onDuty} />
                          <div>
                            <p className="text-sm font-bold text-ink">{assignedDriver.name}</p>
                            <p className="text-[10px] text-ink-3">{assignedDriver.phone}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsAssigning(true)}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
                        >
                          <Edit2 size={11} /> Change
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Vehicle</p>
                          <p className="text-xs font-bold text-ink">{assignedDriver.vehicle.type}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Plate</p>
                          <p className="text-xs font-bold font-mono text-ink">{assignedDriver.vehicle.plate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Rating</p>
                          <p className="text-xs font-bold text-ink">★ {assignedDriver.rating}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Total Trips</p>
                          <p className="text-xs font-bold text-ink">{assignedDriver.totalTrips.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ) : !isAssigning ? (
                    /* Not assigned yet — CTA */
                    <div
                      className="bg-primary-tint/30 border border-primary/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-primary-tint/50 transition-colors"
                      onClick={() => setIsAssigning(true)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                          <Users size={20} />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-ink">Assign a Driver</h5>
                          <p className="text-[10px] font-medium text-ink-3">Smart suggestions based on schedule & vehicle type</p>
                        </div>
                      </div>
                      <Button variant="primary" size="sm">Select Driver</Button>
                    </div>
                  ) : (
                    /* Smart Driver Picker */
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-ink-3">{smartDrivers.length} Drivers · Ranked by match</p>
                        <button onClick={() => setIsAssigning(false)} className="text-xs font-bold text-primary">Cancel</button>
                      </div>
                      {smartDrivers.map(driver => (
                        <div
                          key={driver.id}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            driver.hasConflict
                              ? 'border-warning/40 bg-warning-light/20 opacity-70'
                              : 'border-line-2 hover:border-primary/30 hover:bg-primary-tint/10'
                          } transition-colors`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar initials={driver.initials} size="sm" online={driver.onDuty} />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-ink">{driver.name}</p>
                                {driver.isMatch && !driver.hasConflict && (
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-accent text-white flex items-center gap-0.5">
                                    <Star size={8} /> Best Match
                                  </span>
                                )}
                                {driver.hasConflict && (
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-warning-light text-warning-dark flex items-center gap-0.5">
                                    <AlertTriangle size={8} /> Conflict Risk
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-ink-3">
                                {driver.vehicle.type} · <span className="font-mono">{driver.vehicle.plate}</span> · ★{driver.rating}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant={driver.hasConflict ? 'outline' : 'outline'}
                            size="sm"
                            onClick={() => handleAssign(driver.id)}
                            disabled={driver.hasConflict}
                          >
                            {driver.hasConflict ? 'Busy' : 'Assign'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
              </div>

              <div className="p-4 bg-white border-t border-line-2 flex gap-3">
                {selectedBooking.status === 'pending_review' ? (
                  <>
                    <Button variant="ghost" className="text-urgent hover:bg-urgent-light flex-1" onClick={handleReject}>Reject</Button>
                    <Button variant="primary" className="flex-1" onClick={handleApprove}>Approve Booking</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="text-urgent hover:bg-urgent-light flex-1" onClick={handleReject}>Cancel Trip</Button>
                    <Button variant="outline" className="flex-1" onClick={() => setIsAssigning(true)}>
                      <Edit2 size={14} className="mr-1.5" /> Change Driver
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-line-2 rounded-xl">
              <p className="text-ink-4 font-bold">Select a booking to view details</p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
