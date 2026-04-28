import React, { useState } from 'react';
import { 
  Search, Filter, Download, ChevronRight, MapPin, ArrowRight,
  Clock, User, Truck as TruckIcon, CheckCircle2, XCircle, TrendingUp,
  BarChart3, X, Calendar, Phone, CreditCard, Shield, Navigation, Car
} from 'lucide-react';
import { Card, StatCard, Badge, Avatar, TripStatusBadge, Pagination, Button } from '../components/UI';
import { trips, drivers } from '../data/mockData';
import { formatTime, formatShortDate, formatDateTime, tripTypeLabel, money } from '../utils/helpers';

const TripDetailsModal = ({ trip, onClose }) => {
  if (!trip) return null;
  const driver = drivers.find(d => d.id === trip.driverId);

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line-2 bg-bg/50">
          <div className="flex items-center gap-4">
            <TripStatusBadge status={trip.status} />
            <div>
              <h2 className="text-lg font-extrabold font-display text-ink uppercase tracking-tight">Trip #{trip.id}</h2>
              <p className="text-xs font-bold text-ink-3">{formatDateTime(trip.scheduledTime)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-ink-4 hover:text-ink transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column: Route & Rider */}
            <div className="space-y-6">
              {/* Route */}
              <section>
                <h3 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Navigation size={12}/> Route Anatomy</h3>
                <Card className="p-4 bg-bg border-line-2 relative overflow-hidden">
                  <div className="absolute left-7 top-7 bottom-7 w-0.5 bg-line-2"></div>
                  
                  <div className="flex gap-4 relative z-10 mb-6">
                    <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0 border-2 border-bg">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-0.5">Pickup</p>
                      <p className="text-sm font-bold text-ink">{trip.pickup}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-accent-light text-accent flex items-center justify-center flex-shrink-0 border-2 border-bg">
                      <MapPin size={12} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-0.5">Dropoff</p>
                      <p className="text-sm font-bold text-ink">{trip.dropoff}</p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Rider */}
              <section>
                <h3 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-3 flex items-center gap-1.5"><User size={12}/> Passenger Information</h3>
                <Card className="p-4 border-line-2 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar initials={trip.rider.initials} size="lg" />
                    <div>
                      <h4 className="text-base font-extrabold text-ink">{trip.rider.name}</h4>
                      <Badge variant="neutral">{tripTypeLabel(trip.type)}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line-2">
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-xs font-bold text-ink flex items-center gap-1"><Phone size={12} className="text-ink-3"/> {trip.rider.phone || '(555) 000-0000'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Mobility</p>
                      <p className="text-xs font-bold text-ink">{trip.type === 'wheelchair' ? 'Requires W/C Lift' : 'Ambulatory'}</p>
                    </div>
                  </div>
                  {trip.reason && (
                    <div className="pt-3 border-t border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Trip Reason</p>
                      <p className="text-xs text-ink">{trip.reason}</p>
                    </div>
                  )}
                </Card>
              </section>
            </div>

            {/* Right Column: Assigned Asset & Financials */}
            <div className="space-y-6">
              
              {/* Fleet & Driver */}
              <section>
                <h3 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-3 flex items-center gap-1.5"><TruckIcon size={12}/> Fleet Assignment</h3>
                {driver ? (
                  <Card className="p-4 border-line-2 border-primary/20 bg-primary-tint/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar initials={driver.initials} size="md" online={driver.onDuty} />
                      <div className="flex-1">
                        <p className="text-sm font-extrabold text-ink">{driver.name}</p>
                        <p className="text-[10px] text-ink-4">ID: {driver.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-ink flex items-center gap-1"><Phone size={12} className="text-ink-3"/> {driver.phone}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-3 border border-primary/10 flex items-center gap-3">
                      <div className="p-2 bg-bg rounded-lg text-ink-3"><Car size={16}/></div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-ink">{driver.vehicle.year} {driver.vehicle.make} {driver.vehicle.model}</p>
                        <p className="font-mono text-[10px] font-bold text-ink-3 uppercase tracking-tighter">{driver.vehicle.plate} · {driver.vehicle.type}</p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-8 border-line-2 border-dashed bg-bg/50 flex flex-col items-center justify-center text-center">
                    <User size={24} className="text-ink-4 mb-2 opacity-50" />
                    <p className="text-sm font-bold text-ink">No driver assigned</p>
                    <p className="text-xs text-ink-4">This trip is pending dispatch</p>
                  </Card>
                )}
              </section>

              {/* Financials */}
              <section>
                <h3 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-3 flex items-center gap-1.5"><CreditCard size={12}/> Billing Details</h3>
                <Card className="p-4 border-line-2">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Est. Distance</p>
                      <p className="text-lg font-bold text-ink">{trip.distance || '12.4'} mi</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Total Cost</p>
                      <p className="text-lg font-extrabold text-primary">{money(trip.cost)}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-line-2 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Payment Method</p>
                      <p className="text-xs font-bold text-ink">{trip.paymentMethod || 'Medicaid / LogistiCare'}</p>
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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInsights, setShowInsights] = useState(false);
  const itemsPerPage = 10;

  const filteredTrips = trips.filter(trip => {
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

    // Date Range Filter
    const tripDate = new Date(trip.scheduledTime).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate + 'T23:59:59').getTime() : Infinity;
    const matchesDate = tripDate >= start && tripDate <= end;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.scheduledTime) - new Date(a.scheduledTime);
    if (sortBy === 'oldest') return new Date(a.scheduledTime) - new Date(b.scheduledTime);
    if (sortBy === 'rider') return a.rider.name.localeCompare(b.rider.name);
    return 0;
  });

  const totalPages = Math.ceil(sortedTrips.length / itemsPerPage);
  const paginatedTrips = sortedTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const insightsData = {
    total: sortedTrips.length,
    completed: sortedTrips.filter(t => t.status === 'completed').length,
    cancelled: sortedTrips.filter(t => t.status === 'cancelled').length,
    revenue: sortedTrips.reduce((acc, t) => acc + (t.status === 'completed' ? t.cost : 0), 0),
    avgCost: sortedTrips.length > 0 ? (sortedTrips.reduce((acc, t) => acc + t.cost, 0) / sortedTrips.length).toFixed(2) : 0
  };

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
      <TripDetailsModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      
      {/* Insights Modal */}
      {showInsights && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-md p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-ink">Trip Analysis</h3>
              <button onClick={() => setShowInsights(false)} className="text-ink-4 hover:text-ink transition-colors"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-bg rounded-xl border border-line-2">
                <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Filtered Trips</span>
                <span className="text-sm font-black text-ink">{insightsData.total}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-bg rounded-xl border border-line-2">
                <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Completion Rate</span>
                <span className="text-sm font-black text-accent">{insightsData.total ? Math.round((insightsData.completed / insightsData.total) * 100) : 0}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-bg rounded-xl border border-line-2">
                <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Estimated Revenue</span>
                <span className="text-sm font-black text-primary">{money(insightsData.revenue)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-bg rounded-xl border border-line-2">
                <span className="text-xs font-bold text-ink-3 uppercase tracking-wider">Avg. Trip Cost</span>
                <span className="text-sm font-black text-ink">${insightsData.avgCost}</span>
              </div>
            </div>
            <Button className="w-full mt-8" onClick={() => setShowInsights(false)}>Close Insights</Button>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Trip History</h1>
          <p className="text-ink-3 font-medium">Archived and active records for LOGISS fleet</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button variant="outline" size="sm" icon={Download} onClick={handleExport} className="animate-fade-in whitespace-nowrap">
              Export {selectedIds.length} Marked
            </Button>
          )}
          <Button variant="primary" size="sm" icon={BarChart3} onClick={() => setShowInsights(true)}>View Insights</Button>
        </div>
      </div>

      {/* KPI Cells */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Trips" value="2,852" icon={BarChart3} accent="primary" />
        <StatCard label="Completed" value="2,714" icon={CheckCircle2} accent="accent" />
        <StatCard label="Cancelled" value="128" icon={XCircle} accent="warning" />
        <StatCard label="Revenue Collected" value="$12,834" icon={TrendingUp} accent="primary" />
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
                placeholder="Search by Trip ID, Rider Name, Pickup or Drop-off address..." 
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

          {/* Row 2: Date Range & Status */}
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
                {(startDate || endDate) && (
                  <button 
                    onClick={() => { setStartDate(''); setEndDate(''); setCurrentPage(1); }}
                    className="ml-2 text-ink-4 hover:text-urgent transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <span className="text-[10px] font-bold text-ink-4 uppercase tracking-widest">Date Range</span>
            </div>

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
                      <span className="text-xs font-bold text-ink">{drivers.find(d => d.id === trip.driverId)?.name}</span>
                    ) : (
                      <span className="text-xs italic text-ink-4">Unassigned</span>
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
                    <Badge variant="neutral">{tripTypeLabel(trip.type)}</Badge>
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

        {/* Footer */}
        <div className="px-6 py-4 bg-bg/30 border-t border-line-2 flex items-center justify-between">
          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider">
            Showing {filteredTrips.length} of {trips.length} trips
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-4 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
            Updated just now
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TripHistory;
