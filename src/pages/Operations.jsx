import React from 'react';
import { 
  Truck, Users, BarChart3, AlertTriangle,
  ChevronRight, Clock, MapPin, CheckCircle2,
  Circle, Loader2, XCircle, FileWarning, UserPlus
} from 'lucide-react';
import { Card, StatCard, Avatar, Badge, TripStatusBadge } from '../components/UI';
import { opsStats, trips, drivers, applications, reports } from '../data/mockData';
import { formatTime, formatShortDate } from '../utils/helpers';

const Operations = ({ setPage }) => {
  const today = new Date();
  const todayLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // All trips relevant to today (in_trip, assigned, pending_review)
  const activeTrips = trips.filter(t => ['in_trip', 'assigned', 'pending_review', 'en_route', 'arrived'].includes(t.status));
  const pendingTrips = trips.filter(t => t.status === 'pending_review');
  const openReports = reports.filter(r => r.status === 'open');

  const statusIcon = (status) => {
    if (status === 'in_trip' || status === 'en_route' || status === 'arrived')
      return <span className="w-2 h-2 rounded-full bg-accent pulse-dot flex-shrink-0" />;
    if (status === 'assigned')
      return <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />;
    if (status === 'pending_review')
      return <span className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />;
    if (status === 'completed')
      return <span className="w-2 h-2 rounded-full bg-ink-4 flex-shrink-0" />;
    return <span className="w-2 h-2 rounded-full bg-line flex-shrink-0" />;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Operations</h1>
        <p className="text-ink-3 font-medium">{todayLabel}</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Trips" value={opsStats.todaysTrips} sub="1 in progress · 3 pending" icon={Truck} accent="primary" />
        <StatCard label="Drivers On Duty" value={`${opsStats.driversOnDuty}/${opsStats.driversTotal}`} sub="3 available · 1 in trip" icon={Users} accent="accent" />
        <StatCard label="Completion Rate" value={`${opsStats.completionRate}%`} sub="★ 4.83 avg rating" icon={BarChart3} accent="accent" trend="+2.1% vs last week" />
        <StatCard label="Action Required" value={opsStats.pendingReview + openReports.length} sub={`${pendingTrips.length} bookings · ${openReports.length} reports`} icon={AlertTriangle} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Today's Trip Activity Table */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b border-line-2 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-ink">Today's Activity</h2>
              <button onClick={() => setPage('trips')} className="text-xs font-bold text-primary hover:underline">View all →</button>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg/60 border-b border-line-2">
                  <th className="px-5 py-2.5 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-2.5 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Rider</th>
                  <th className="px-5 py-2.5 text-[10px] font-bold text-ink-4 uppercase tracking-widest hidden md:table-cell">Route</th>
                  <th className="px-5 py-2.5 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Time</th>
                  <th className="px-5 py-2.5 text-[10px] font-bold text-ink-4 uppercase tracking-widest hidden md:table-cell">Driver</th>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-2">
                {activeTrips.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-ink-4 font-medium">No active trips today.</td>
                  </tr>
                ) : activeTrips.map(trip => {
                  const driver = drivers.find(d => d.id === trip.driverId);
                  const isLive = ['in_trip', 'en_route', 'arrived'].includes(trip.status);
                  return (
                    <tr
                      key={trip.id}
                      onClick={() => setPage(trip.status === 'pending_review' ? 'bookings' : 'live')}
                      className="hover:bg-bg cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {statusIcon(trip.status)}
                          <TripStatusBadge status={trip.status} />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={trip.rider.initials} size="xs" />
                          <div>
                            <p className="text-xs font-bold text-ink whitespace-nowrap">{trip.rider.name}</p>
                            <p className="text-[10px] text-ink-4">{trip.mobility}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell max-w-[180px]">
                        <p className="text-[10px] font-semibold text-ink truncate">{trip.pickup}</p>
                        <p className="text-[10px] text-ink-4 flex items-center gap-1 truncate">
                          <MapPin size={8} className="flex-shrink-0" /> {trip.dropoff}
                        </p>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <p className="text-xs font-bold text-ink">{formatTime(trip.scheduledTime)}</p>
                        <p className="text-[10px] text-ink-4">{formatShortDate(trip.scheduledTime)}</p>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        {driver ? (
                          <p className="text-xs font-bold text-ink whitespace-nowrap">{driver.name}</p>
                        ) : (
                          <span className="text-[10px] italic text-ink-4">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <ChevronRight size={15} className="text-ink-4 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-5 py-3 border-t border-line-2 bg-bg/30">
              <div className="flex items-center gap-4 text-[10px] font-bold text-ink-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent"></span> Live</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> Assigned</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning"></span> Pending</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Action Required */}
        <div className="space-y-4">

          {/* Pending Bookings */}
          <Card className="overflow-hidden">
            <div className="px-4 py-3.5 border-b border-line-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning pulse-dot"></span>
                <h3 className="text-xs font-extrabold text-ink">Pending Bookings</h3>
              </div>
              <button onClick={() => setPage('bookings')} className="text-[10px] font-bold text-primary hover:underline">Review all →</button>
            </div>
            <div className="divide-y divide-line-2">
              {pendingTrips.slice(0, 4).map(trip => (
                <div
                  key={trip.id}
                  onClick={() => setPage('bookings')}
                  className="px-4 py-3 flex items-center justify-between hover:bg-bg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar initials={trip.rider.initials} size="xs" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate">{trip.rider.name}</p>
                      <p className="text-[10px] text-ink-4 whitespace-nowrap">{formatShortDate(trip.scheduledTime)} · {formatTime(trip.scheduledTime)}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-ink-4 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity" />
                </div>
              ))}
              {pendingTrips.length === 0 && (
                <p className="px-4 py-5 text-xs text-ink-4 text-center font-medium">All bookings reviewed ✓</p>
              )}
            </div>
          </Card>

          {/* Open Reports */}
          <Card className="overflow-hidden">
            <div className="px-4 py-3.5 border-b border-line-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileWarning size={14} className="text-urgent" />
                <h3 className="text-xs font-extrabold text-ink">Open Reports</h3>
              </div>
              <button onClick={() => setPage('reports')} className="text-[10px] font-bold text-primary hover:underline">View all →</button>
            </div>
            <div className="divide-y divide-line-2">
              {openReports.slice(0, 3).map(report => (
                <div
                  key={report.id}
                  onClick={() => setPage('reports')}
                  className="px-4 py-3 flex items-center justify-between hover:bg-bg cursor-pointer transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{report.type}</p>
                    <p className="text-[10px] text-ink-4">By {report.filedBy.name}</p>
                  </div>
                  <Badge variant={report.severity === 'high' ? 'urgent' : 'warning'} className="flex-shrink-0 ml-2">{report.severity}</Badge>
                </div>
              ))}
              {openReports.length === 0 && (
                <p className="px-4 py-5 text-xs text-ink-4 text-center font-medium">No open reports ✓</p>
              )}
            </div>
          </Card>

          {/* Driver Applications */}
          <Card className="overflow-hidden">
            <div className="px-4 py-3.5 border-b border-line-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus size={14} className="text-primary" />
                <h3 className="text-xs font-extrabold text-ink">Applications</h3>
              </div>
              <button onClick={() => setPage('applications')} className="text-[10px] font-bold text-primary hover:underline">Review →</button>
            </div>
            <div className="divide-y divide-line-2">
              {applications.slice(0, 3).map(app => (
                <div
                  key={app.id}
                  onClick={() => setPage('applications')}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-bg cursor-pointer transition-colors"
                >
                  <Avatar initials={app.initials} size="xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{app.name}</p>
                    <div className="w-full bg-line-2 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-warning h-full rounded-full transition-all" style={{ width: `${(app.stage / 4) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-ink-4 flex-shrink-0">Step {app.stage}/4</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Operations;
