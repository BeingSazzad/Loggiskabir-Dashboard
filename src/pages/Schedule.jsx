import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Clock, Truck, Users,
  Search, AlertTriangle, CheckCircle2, Coffee
} from 'lucide-react';
import { Card, Avatar, Badge } from '../components/UI';
import { drivers, vehicles } from '../data/mockData';

/* ── Helpers ─────────────────────────────────────────────────────── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 0=Mon

// Deterministic mock shift pattern per driver+day
const getShift = (driverIdx, dayIdx) => {
  const seed = (driverIdx * 7 + dayIdx) % 5;
  if (seed === 0) return { type: 'full',  label: 'Full Shift',   time: '07:00 – 15:00', color: 'primary' };
  if (seed === 1) return { type: 'split', label: 'Split Shift',  time: '06:00 – 10:00\n14:00 – 18:00', color: 'warning' };
  if (seed === 2) return null; // Off
  if (seed === 3) return { type: 'full',  label: 'Full Shift',   time: '15:00 – 23:00', color: 'primary' };
  return { type: 'leave', label: 'Leave',  time: 'All Day', color: 'neutral' };
};

const shiftStyle = {
  primary: 'bg-primary-tint/40 border-primary/20 text-primary',
  warning: 'bg-warning-light/50 border-warning/20 text-warning-dark',
  neutral: 'bg-bg border-line-2 text-ink-3',
  accent:  'bg-accent-light/40 border-accent/20 text-accent-dark',
};

/* ── Schedule Page ───────────────────────────────────────────────── */
const Schedule = () => {
  const [activeTab, setActiveTab]     = useState('driver');
  const [viewMode, setViewMode]       = useState('week');
  const [searchTerm, setSearchTerm]   = useState('');
  const [weekOffset, setWeekOffset]   = useState(0);

  // Week date labels
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - TODAY_IDX + weekOffset * 7);
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const isToday = (d) => {
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth();
  };

  // Fleet derived from vehicles
  const fleet = vehicles.map(v => ({
    id:       v.id,
    plate:    v.plate,
    make:     v.make,
    type:     v.type,
    image:    v.image,
    status:   v.status === 'maintenance' || v.status === 'urgent' ? 'maintenance' : 'active',
  }));

  const items = activeTab === 'driver' ? drivers : fleet;
  const filtered = items.filter(item => {
    const q = searchTerm.toLowerCase();
    return !q
      || (item.name  || '').toLowerCase().includes(q)
      || (item.plate || '').toLowerCase().includes(q);
  });

  // Summary stats
  const onDutyCount   = drivers.filter(d => d.onDuty).length;
  const offDutyCount  = drivers.length - onDutyCount;

  return (
    <div className="space-y-6 pb-12">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">
            Fleet &amp; Driver Schedule
          </h1>
          <p className="text-ink-3 font-medium mt-0.5">
            Coordinate shifts, vehicle availability and driver assignments
          </p>
        </div>

        {/* Week nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="w-8 h-8 rounded-xl border border-line-2 bg-white hover:bg-bg flex items-center justify-center text-ink-3 hover:text-ink transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="px-4 py-2 bg-white border border-line-2 rounded-xl text-xs font-bold text-ink min-w-[130px] text-center">
            {weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : weekOffset === -1 ? 'Last Week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
          </div>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="w-8 h-8 rounded-xl border border-line-2 bg-white hover:bg-bg flex items-center justify-center text-ink-3 hover:text-ink transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Summary Stats Strip ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users,        label: 'Total Drivers',  value: drivers.length,  color: 'bg-primary-light text-primary' },
          { icon: CheckCircle2, label: 'On Duty Today',  value: onDutyCount,     color: 'bg-accent-light text-accent'   },
          { icon: Coffee,       label: 'Off Duty Today', value: offDutyCount,    color: 'bg-bg border text-ink-3'       },
          { icon: Truck,        label: 'Fleet Vehicles', value: fleet.length,    color: 'bg-primary-light text-primary' },
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-extrabold text-ink mt-0.5">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Tab Bar + Search ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line-2 pb-3">
        <div className="flex gap-1 bg-bg p-1 rounded-xl border border-line-2 w-fit">
          {[
            { id: 'driver', label: 'Driver Schedule', icon: Users  },
            { id: 'fleet',  label: 'Fleet Schedule',  icon: Truck  },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-primary border border-line'
                  : 'text-ink-3 hover:text-ink'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
          <input
            className="pl-9 pr-4 py-2 text-xs font-medium bg-white border border-line-2 rounded-xl w-56 focus:ring-2 focus:ring-primary/10 outline-none"
            placeholder={activeTab === 'driver' ? 'Search driver…' : 'Search plate…'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── Calendar Grid ────────────────────────────────────────── */}
      <Card className="overflow-hidden border-line-2">

        {/* Column headers */}
        <div className="grid border-b border-line-2 bg-bg/50" style={{ gridTemplateColumns: '220px repeat(7, 1fr)' }}>
          <div className="px-4 py-3 border-r border-line-2">
            <p className="text-[10px] font-bold text-ink-4 uppercase tracking-widest">
              {activeTab === 'driver' ? 'Driver' : 'Vehicle'}
            </p>
          </div>
          {weekDates.map((d, i) => (
            <div
              key={i}
              className={`px-3 py-3 text-center border-r border-line-2 last:border-r-0 ${isToday(d) ? 'bg-primary-tint/20' : ''}`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isToday(d) ? 'text-primary' : 'text-ink-4'}`}>
                {DAYS[i]}
              </p>
              <p className={`text-sm font-extrabold mt-0.5 ${isToday(d) ? 'text-primary' : 'text-ink'}`}>
                {d.getDate()}
              </p>
              {isToday(d) && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-line-2">
          {filtered.length === 0 && (
            <div className="py-16 text-center text-sm font-bold text-ink-3">
              No results match your search.
            </div>
          )}

          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="grid hover:bg-bg/30 transition-colors group"
              style={{ gridTemplateColumns: '220px repeat(7, 1fr)' }}
            >
              {/* Identity Column */}
              <div className="px-4 py-3 border-r border-line-2 flex items-center gap-3 bg-white group-hover:bg-bg/20 transition-colors">
                {activeTab === 'driver' ? (
                  <>
                    <Avatar initials={item.initials} size="sm" online={item.onDuty} />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-ink truncate">{item.name}</p>
                      <p className="text-[10px] text-ink-4 font-semibold truncate">{item.vehicle?.type}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border overflow-hidden ${
                      item.status === 'active' ? 'bg-accent-light text-accent border-accent/10' : 'bg-urgent-light text-urgent border-urgent/10'
                    }`}>
                      {item.image ? (
                        <img src={item.image} alt={item.plate} className="w-full h-full object-cover" />
                      ) : (
                        <Truck size={15} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-ink font-mono truncate">{item.plate}</p>
                      <p className="text-[10px] text-ink-4 font-semibold truncate">{item.make} · {item.type}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Day Cells */}
              {weekDates.map((d, dayIdx) => {
                const shift = getShift(idx, dayIdx);
                return (
                  <div
                    key={dayIdx}
                    className={`px-2 py-2 border-r border-line-2 last:border-r-0 min-h-[72px] flex flex-col justify-center ${
                      isToday(d) ? 'bg-primary-tint/10' : ''
                    }`}
                  >
                    {shift ? (
                      <div className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold leading-tight ${shiftStyle[shift.color]}`}>
                        <div className="flex items-center gap-1 mb-1 opacity-70">
                          <Clock size={9} />
                          <span className="whitespace-pre-line">{shift.time}</span>
                        </div>
                        <p className="uppercase tracking-wide">{shift.label}</p>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-[9px] font-bold text-line uppercase tracking-widest">Off</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* ── Legend ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="flex flex-wrap items-center gap-5">
          {[
            { color: 'bg-primary',    label: 'Full Shift'  },
            { color: 'bg-warning',    label: 'Split Shift' },
            { color: 'bg-line',       label: 'Off Day'     },
            { color: 'bg-ink-4',      label: 'Leave'       },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
              <span className="text-[11px] font-bold text-ink-4 uppercase tracking-wider">{l.label}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-widest">Last sync: Just now</p>
      </div>
    </div>
  );
};

export default Schedule;
