import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Truck, 
  Users, 
  Filter,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import { Card, Avatar, Badge, Button } from '../components/UI';
import { drivers, trips } from '../data/mockData';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('driver'); // 'driver' or 'fleet'
  const [viewMode, setViewMode] = useState('week'); // 'today', 'tomorrow', 'week', 'month'
  const [searchTerm, setSearchTerm] = useState('');

  const timeFilters = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  // Mock fleet data derived from drivers
  const fleet = drivers.map(d => ({
    id: d.id,
    plate: `VA-${1000 + d.id}`,
    model: d.vehicle.model || 'Toyota Sienna',
    type: d.vehicle.type,
    status: d.onDuty ? 'active' : 'maintenance',
    driver: d.name
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Fleet & Driver Schedule</h1>
          <p className="text-ink-3 font-medium">Coordinate vehicle availability and driver shifts</p>
        </div>
        <div className="flex items-center gap-2 bg-bg p-1 rounded-2xl border border-line-2 shadow-sm">
          {timeFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setViewMode(filter.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                viewMode === filter.id 
                ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
                : 'text-ink-4 hover:text-ink'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-line-2 pb-1">
        <div className="flex gap-8">
          <button 
            onClick={() => setActiveTab('driver')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'driver' ? 'text-primary' : 'text-ink-3 hover:text-ink'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={16} /> Driver Schedule
            </div>
            {activeTab === 'driver' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('fleet')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'fleet' ? 'text-primary' : 'text-ink-3 hover:text-ink'
            }`}
          >
            <div className="flex items-center gap-2">
              <Truck size={16} /> Fleet Schedule
            </div>
            {activeTab === 'fleet' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
          </button>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
            <input 
              className="input-base pl-9 py-1.5 text-xs w-64 h-9" 
              placeholder={activeTab === 'driver' ? "Search driver..." : "Search vehicle plate..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex border border-line-2 rounded-xl overflow-hidden shadow-sm">
             <button className="p-2 bg-white text-primary border-r border-line-2"><LayoutGrid size={16} /></button>
             <button className="p-2 bg-bg text-ink-3 hover:bg-white transition-colors"><List size={16} /></button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-line-2">
        <div className="grid grid-cols-8 border-b border-line-2 bg-bg/40">
          <div className="col-span-2 p-4 border-r border-line-2">
             <p className="text-[10px] font-black text-ink-4 uppercase tracking-widest">{activeTab === 'driver' ? 'Driver Details' : 'Vehicle Details'}</p>
          </div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-4 text-center border-r border-line-2 last:border-r-0">
               <p className="text-[10px] font-bold text-ink-4 uppercase mb-1">{day}</p>
               <p className="text-sm font-black text-ink">2{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(day) + 1}</p>
            </div>
          ))}
        </div>

        <div className="divide-y divide-line-2">
          {(activeTab === 'driver' ? drivers : fleet).map((item, idx) => (
            <div key={item.id} className="grid grid-cols-8 group">
              <div className="col-span-2 p-4 border-r border-line-2 flex items-center gap-3 bg-bg/10 group-hover:bg-bg/30 transition-colors">
                {activeTab === 'driver' ? (
                  <>
                    <Avatar initials={item.initials} size="xs" online={item.onDuty} />
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-ink truncate">{item.name}</p>
                      <p className="text-[10px] text-ink-4 font-bold uppercase tracking-wider">{item.vehicle.type}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-primary-light rounded-xl flex items-center justify-center text-primary border border-primary/10">
                      <Truck size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-ink truncate font-mono">{item.plate}</p>
                      <p className="text-[10px] text-ink-4 font-bold uppercase tracking-wider">{item.model}</p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Day slots */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="p-2 border-r border-line-2 last:border-r-0 min-h-[80px] hover:bg-bg transition-colors relative">
                   {/* Mock shifts/bookings */}
                   {((idx + i) % 3 === 0) && (
                     <div className={`p-2 rounded-xl text-[10px] font-black shadow-sm border ${
                       activeTab === 'driver' 
                       ? 'bg-primary-tint/30 text-primary border-primary/20' 
                       : 'bg-accent-light/40 text-accent-dark border-accent/20'
                     }`}>
                        <div className="flex items-center gap-1 mb-1 opacity-70">
                          <Clock size={10} /> 08:00 - 16:00
                        </div>
                        <p className="truncate uppercase">{activeTab === 'driver' ? 'Full Shift' : 'Reserved'}</p>
                     </div>
                   )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-between px-2 text-ink-4 font-bold text-[10px] uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>Driver Shift Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span>Vehicle Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-warning rounded-full" />
             <span>Maintenance Needed</span>
          </div>
        </div>
        <p>Last Sync: Just Now</p>
      </div>
    </div>
  );
};

export default Schedule;
