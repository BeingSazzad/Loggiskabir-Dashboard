import React from 'react';
import { 
  Truck, 
  Users, 
  BarChart3, 
  AlertTriangle,
  ChevronRight,
  Phone,
  MessageSquare,
  Clock,
  MapPin
} from 'lucide-react';
import { Card, StatCard, SectionHeader, Avatar, Badge, Button, TripStatusBadge } from '../components/UI';
import { opsStats, trips, drivers, applications, reports } from '../data/mockData';
import { formatTime, formatShortDate } from '../utils/helpers';

const Operations = ({ setPage }) => {
  const liveTrip = trips.find(t => t.id === 'LOGISS-2847');
  const liveDriver = drivers.find(d => d.id === liveTrip.driverId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Operations</h1>
        <p className="text-ink-3 font-medium">Tuesday, October 22, 2024</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Today's Trips" 
          value={opsStats.todaysTrips} 
          sub="1 in progress · 3 pending" 
          icon={Truck} 
          accent="primary"
        />
        <StatCard 
          label="Drivers On Duty" 
          value={`${opsStats.driversOnDuty}/${opsStats.driversTotal}`} 
          sub="3 available · 1 in trip" 
          icon={Users} 
          accent="accent"
        />
        <StatCard 
          label="Completion Rate" 
          value={`${opsStats.completionRate}%`} 
          sub="★ 4.83 avg rating" 
          icon={BarChart3} 
          accent="accent"
          trend="+2.1% vs last week"
        />
        <StatCard 
          label="Action Required" 
          value={opsStats.pendingReview + reports.length} 
          sub="3 bookings · 2 reports" 
          icon={AlertTriangle} 
          accent="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Trip Card */}
          <section>
            <SectionHeader title="Live Trip" />
            <Card className="overflow-hidden">
              <div className="bg-accent-light/30 border-b border-line-2 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent-light rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot"></span>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">In Trip</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-ink-3">#{liveTrip.id}</span>
                </div>
                <span className="text-xs font-semibold text-ink-3 flex items-center gap-1.5">
                  <Clock size={12} />
                  Started 8:32 AM
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <Avatar initials={liveTrip.rider.initials} size="lg" />
                    <div>
                      <h3 className="text-xl font-bold text-ink mb-1">{liveTrip.rider.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-ink-3">{liveTrip.rider.age} years</span>
                        <span className="w-1 h-1 bg-line rounded-full"></span>
                        <span className="text-xs font-medium text-ink-3">{liveTrip.rider.phone}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="primary">{liveTrip.mobility}</Badge>
                        <Badge variant="neutral">{liveTrip.type === 'round_trip' ? 'Round Trip' : 'One Way'}</Badge>
                        {liveTrip.escort && <Badge variant="neutral">Escort</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={Phone}>Call</Button>
                    <Button variant="outline" size="sm" icon={MessageSquare}>Msg</Button>
                  </div>
                </div>

                <div className="bg-bg rounded-xl p-4 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Avatar initials={liveDriver.initials} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-ink">{liveDriver.name}</p>
                      <p className="text-[10px] font-mono text-ink-4 uppercase tracking-tighter">
                        Plate {liveDriver.vehicle.plate} · ★{liveDriver.rating}
                      </p>
                    </div>
                  </div>
                  <Badge variant="accent">On Task</Badge>
                </div>

                {/* Route Timeline */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
                      <span className="text-xs font-bold text-ink uppercase tracking-wide">Picked up</span>
                    </div>
                    <p className="text-xs font-bold text-ink leading-tight">{liveTrip.actualPickup}</p>
                    <p className="text-[10px] text-ink-4 truncate">2401 Robious Rd, Chesterfield</p>
                  </div>
                  <div className="space-y-2 relative">
                    <div className="absolute top-1.25 left-[-33%] right-[-33%] h-0.5 border-t border-dashed border-line"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
                      <span className="text-xs font-bold text-ink uppercase tracking-wide">Stop CVS</span>
                    </div>
                    <p className="text-xs font-bold text-ink leading-tight">{liveTrip.actualStop}</p>
                    <p className="text-[10px] text-ink-4 truncate">CVS Pharmacy, 7201 Midlothian Tpke</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-urgent"></div>
                      <span className="text-xs font-bold text-ink uppercase tracking-wide">Dropoff</span>
                    </div>
                    <p className="text-xs font-bold text-ink leading-tight">{liveTrip.actualDropoff}</p>
                    <p className="text-[10px] text-ink-4 truncate">{liveTrip.dropoff}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t border-line-2 pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Duration</p>
                    <p className="text-sm font-bold text-ink">{liveTrip.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Distance</p>
                    <p className="text-sm font-bold text-ink">{liveTrip.distance}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Estimated Cost</p>
                    <p className="text-sm font-bold font-mono text-ink">${liveTrip.cost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Upcoming Today */}
          <section>
            <SectionHeader title="Upcoming Today" action="View all →" />
            <div className="space-y-3">
              {trips.filter(t => t.status === 'assigned').map(trip => (
                <Card key={trip.id} hover className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 flex-shrink-0 text-center">
                      <p className="text-xs font-bold text-ink leading-none">{formatTime(trip.scheduledTime).split(' ')[0]}</p>
                      <p className="text-[10px] font-bold text-ink-4 uppercase">{formatTime(trip.scheduledTime).split(' ')[1]}</p>
                    </div>
                    <Avatar initials={trip.rider.initials} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-ink truncate">{trip.rider.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary">{trip.mobility}</Badge>
                        <p className="text-[10px] text-ink-4 truncate flex items-center gap-1">
                          <MapPin size={10} />
                          {trip.pickup} → {trip.dropoff}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Driver</p>
                      <p className="text-xs font-bold text-ink">{drivers.find(d => d.id === trip.driverId)?.name}</p>
                    </div>
                    <TripStatusBadge status={trip.status} />
                    <ChevronRight size={16} className="text-ink-4" />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Awaiting Approval */}
          <section>
            <SectionHeader title="Awaiting Approval" action="View all →" />
            <div className="space-y-3">
              {trips.filter(t => t.status === 'pending_review').map(trip => (
                <Card key={trip.id} hover className="p-3" onClick={() => setPage('bookings')}>
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-ink-4 uppercase tracking-tighter">#{trip.id}</span>
                    <TripStatusBadge status={trip.status} />
                  </div>
                  <h4 className="text-sm font-bold text-ink mb-1">{trip.rider.name}</h4>
                  <p className="text-[10px] text-ink-3 mb-2">{formatShortDate(trip.scheduledTime)} at {formatTime(trip.scheduledTime)}</p>
                  <div className="flex items-center gap-1 text-[10px] text-ink-4 truncate">
                    <MapPin size={10} />
                    {trip.dropoff}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Driver Applications */}
          <section>
            <SectionHeader title="Applications" action="View all →" />
            <div className="space-y-3">
              {applications.slice(0, 2).map(app => (
                <Card key={app.id} hover className="p-3" onClick={() => setPage('applications')}>
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-ink-4 uppercase tracking-tighter">#{app.id}</span>
                    <Badge variant="warning">Review</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar initials={app.initials} size="xs" />
                    <h4 className="text-sm font-bold text-ink">{app.name}</h4>
                  </div>
                  <p className="text-[10px] text-ink-3 mb-1">{app.county} · {app.vehicle.type}</p>
                  <div className="w-full bg-line-2 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-warning h-full" style={{ width: `${(app.stage / 4) * 100}%` }}></div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Open Reports */}
          <section>
            <SectionHeader title="Open Reports" action="View all →" />
            <div className="space-y-3">
              {reports.filter(r => r.status === 'open').map(report => (
                <Card key={report.id} hover className="p-3" onClick={() => setPage('reports')}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={12} className={report.severity === 'high' ? 'text-urgent' : 'text-warning'} />
                      <span className="font-mono text-[10px] font-bold text-ink-4 uppercase tracking-tighter">#{report.id}</span>
                    </div>
                    <Badge variant={report.severity === 'high' ? 'urgent' : 'warning'}>{report.severity}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-ink mb-1 truncate">{report.type}</h4>
                  <p className="text-[10px] text-ink-3">Filed by {report.filedBy.role} · {report.filedBy.name}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Operations;
