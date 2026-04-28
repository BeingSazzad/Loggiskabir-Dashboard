import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Card, Avatar, Badge, Pagination } from '../components/UI';
import { drivers, trips } from '../data/mockData';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 6); // 6am – 6pm

const tripColor = {
  'in_trip':   'bg-primary text-white',
  'assigned':  'bg-accent text-white',
  'confirmed': 'bg-primary-tint text-primary border border-primary/30',
  'completed': 'bg-bg text-ink-3 border border-line-2',
};

function getDateStr(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatHeader(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const Schedule = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [weekStart, setWeekStart] = useState(today);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(drivers.length / itemsPerPage);
  const paginatedDrivers = drivers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Build driver → trip map keyed by date string
  const tripsByDriverAndDate = {};
  trips.forEach(trip => {
    if (!trip.driverId || !trip.scheduledTime) return;
    const dateStr = trip.scheduledTime.slice(0, 10);
    const key = `${trip.driverId}__${dateStr}`;
    if (!tripsByDriverAndDate[key]) tripsByDriverAndDate[key] = [];
    tripsByDriverAndDate[key].push(trip);
  });

  const todayStr = getDateStr(today);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Fleet Schedule</h1>
          <p className="text-ink-3 font-medium">Weekly driver & vehicle availability overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(d => addDays(d, -7))} className="w-9 h-9 border border-line rounded-lg flex items-center justify-center hover:bg-bg transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setWeekStart(today)} className="px-4 py-1.5 text-xs font-bold border border-line rounded-lg hover:bg-bg transition-colors">
            Today
          </button>
          <button onClick={() => setWeekStart(d => addDays(d, 7))} className="w-9 h-9 border border-line rounded-lg flex items-center justify-center hover:bg-bg transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {/* Day header */}
        <div className="grid border-b border-line-2" style={{ gridTemplateColumns: '200px repeat(7, 1fr)' }}>
          <div className="px-4 py-3 bg-bg/50 border-r border-line-2">
            <p className="text-[10px] font-bold text-ink-4 uppercase tracking-widest">Driver / Vehicle</p>
          </div>
          {days.map(day => {
            const ds = getDateStr(day);
            const isToday = ds === todayStr;
            return (
              <div key={ds} className={`px-3 py-3 text-center border-r border-line-2 last:border-r-0 ${isToday ? 'bg-primary-tint/30' : 'bg-bg/50'}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-primary' : 'text-ink-4'}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-extrabold ${isToday ? 'text-primary' : 'text-ink'}`}>
                  {day.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Driver Rows */}
        <div className="divide-y divide-line-2">
          {paginatedDrivers.map(driver => (
            <div key={driver.id} className="grid hover:bg-bg/30 transition-colors" style={{ gridTemplateColumns: '200px repeat(7, 1fr)' }}>
              {/* Driver info cell */}
              <div className="px-4 py-3 border-r border-line-2 flex items-center gap-3">
                <Avatar initials={driver.initials} size="xs" online={driver.onDuty} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink truncate">{driver.name}</p>
                  <p className="text-[10px] text-ink-4 truncate">{driver.vehicle.type}</p>
                </div>
              </div>

              {/* Day cells */}
              {days.map(day => {
                const ds = getDateStr(day);
                const isToday = ds === todayStr;
                const key = `${driver.id}__${ds}`;
                const dayTrips = tripsByDriverAndDate[key] || [];

                return (
                  <div key={ds} className={`px-2 py-2 border-r border-line-2 last:border-r-0 min-h-[72px] ${isToday ? 'bg-primary-tint/10' : ''}`}>
                    {dayTrips.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-ink-4/30">—</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {dayTrips.map(trip => (
                          <div
                            key={trip.id}
                            className={`rounded-md px-2 py-1.5 text-[10px] font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity ${tripColor[trip.status] || 'bg-bg text-ink border border-line-2'}`}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              <Clock size={9} />
                              <span>{trip.scheduledTime?.slice(11, 16)}</span>
                            </div>
                            <p className="truncate">{trip.rider.name}</p>
                            <p className="opacity-70 truncate">{trip.dropoff}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="px-6 py-3 bg-bg/30 border-t border-line-2 flex items-center gap-6">
          {[
            { color: 'bg-primary', label: 'In Trip' },
            { color: 'bg-accent', label: 'Assigned' },
            { color: 'bg-primary-tint border border-primary/30', label: 'Confirmed' },
            { color: 'bg-bg border border-line-2', label: 'Completed' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm ${l.color}`}></span>
              <span className="text-[10px] font-bold text-ink-4">{l.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={drivers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Schedule;
