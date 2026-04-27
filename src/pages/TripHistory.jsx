import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  MapPin, 
  ArrowRight,
  Clock,
  User,
  Truck as TruckIcon,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Card, StatCard, Badge, Avatar, TripStatusBadge } from '../components/UI';
import { trips, drivers } from '../data/mockData';
import { formatTime, formatShortDate, formatDateTime, tripTypeLabel, money } from '../utils/helpers';

const TripHistory = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.id.toLowerCase().includes(search.toLowerCase()) ||
      trip.rider.name.toLowerCase().includes(search.toLowerCase()) ||
      (trip.pickup && trip.pickup.toLowerCase().includes(search.toLowerCase())) ||
      (trip.dropoff && trip.dropoff.toLowerCase().includes(search.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && ['in_trip', 'en_route', 'arrived', 'assigned'].includes(trip.status);
    if (filter === 'completed') return matchesSearch && trip.status === 'completed';
    if (filter === 'cancelled') return matchesSearch && trip.status === 'cancelled';
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Trip History</h1>
        <p className="text-ink-3 font-medium">Archived and active records for LOGISS fleet</p>
      </div>

      {/* KPI Cells */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Trips" value="2,852" icon={BarChart3} accent="primary" />
        <StatCard label="Completed" value="2,714" icon={CheckCircle2} accent="accent" />
        <StatCard label="Cancelled" value="128" icon={XCircle} accent="warning" />
        <StatCard label="Revenue Collected" value="$12,834" icon={TrendingUp} accent="primary" />
      </div>

      <Card className="overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-line-2 bg-bg/30 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, rider, or address..." 
              className="w-full bg-white border border-line rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-bg p-1 rounded-xl border border-line">
            {['all', 'active', 'completed', 'cancelled'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white shadow-sm text-primary' : 'text-ink-3 hover:text-ink-2'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 border-b border-line-2">
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
              {filteredTrips.map(trip => (
                <tr key={trip.id} className="hover:bg-primary-tint/20 transition-colors group cursor-pointer">
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
