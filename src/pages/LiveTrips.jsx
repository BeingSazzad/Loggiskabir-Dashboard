import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  MapPin, 
  ChevronRight, 
  Clock, 
  Truck,
  Plus,
  Minus,
  Navigation,
  Battery,
  Wifi
} from 'lucide-react';
import { Card, Avatar, Badge, Button, TripStatusBadge } from '../components/UI';
import { trips, drivers, willCallQueue } from '../data/mockData';
import { tripTypeLabel } from '../utils/helpers';

const LiveTrips = () => {
  const [selectedTripId, setSelectedTripId] = useState('LOGISS-2847');
  
  const activeTrips = trips.filter(t => 
    ['en_route', 'arrived', 'in_trip', 'assigned'].includes(t.status)
  );

  const selectedTrip = trips.find(t => t.id === selectedTripId);
  const selectedDriver = selectedTrip ? drivers.find(d => d.id === selectedTrip.driverId) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Live Trips</h1>
        <p className="text-ink-3 font-medium">Monitoring {activeTrips.length} active assignments</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-ink-4 uppercase tracking-widest px-1">Active Trips</h3>
            {activeTrips.map(trip => (
              <Card 
                key={trip.id} 
                hover 
                onClick={() => setSelectedTripId(trip.id)}
                className={`p-3 ${selectedTripId === trip.id ? 'border-primary bg-primary-tint/30' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-bold text-ink-4 tracking-tighter uppercase">#{trip.id}</span>
                  <TripStatusBadge status={trip.status} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar initials={trip.rider.initials} size="xs" />
                  <h4 className="text-xs font-bold text-ink truncate">{trip.rider.name}</h4>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Truck size={10} className="text-ink-4" />
                    <span className="text-[10px] font-semibold text-ink-3">{drivers.find(d => d.id === trip.driverId)?.name || 'Unknown'}</span>
                  </div>
                  <span className="font-mono text-[10px] text-ink-4">{drivers.find(d => d.id === trip.driverId)?.vehicle?.plate || '---'}</span>
                </div>
              </Card>
            ))}
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-ink-4 uppercase tracking-widest px-1">Will Call Standby</h3>
            {willCallQueue.map(item => (
              <Card key={item.tripId} className="p-3 bg-warning-light/50 border-warning/10">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="warning">Awaiting Return</Badge>
                  <span className="font-mono text-[10px] font-bold text-ink-4 uppercase">#{item.tripId}</span>
                </div>
                <p className="text-xs font-bold text-ink mb-1">{item.rider}</p>
                <p className="text-[10px] text-ink-3 mb-3">Picked up at {item.pickupLocation}</p>
                <Button variant="outline" size="sm" className="w-full text-warning border-warning/20 hover:bg-warning-light">
                  Dispatch Return Trip
                </Button>
              </Card>
            ))}
          </section>
        </div>

        {/* Right Column: Map & Detail */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          {/* Stylized Map Container */}
          <div className="relative flex-1 bg-gradient-to-br from-primary-light to-accent-light rounded-2xl border border-line-2 overflow-hidden shadow-inner min-h-[420px]">
            {/* SVG Background */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(41, 105, 205, 0.05)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Road Lines */}
              <line x1="0" y1="35%" x2="100%" y2="35%" stroke="white" strokeWidth="4" strokeOpacity="0.4" />
              <line x1="0" y1="65%" x2="100%" y2="65%" stroke="white" strokeWidth="4" strokeOpacity="0.4" />
              <line x1="30%" y1="0" x2="30%" y2="100%" stroke="white" strokeWidth="4" strokeOpacity="0.4" />
               <line x1="70%" y1="0" x2="70%" y2="100%" stroke="white" strokeWidth="4" strokeOpacity="0.4" />
              
              {/* Building Silhouettes */}
              <rect x="5%" y="10%" width="15%" height="15%" rx="4" fill="rgba(255,255,255,0.1)" />
              <rect x="45%" y="40%" width="10%" height="10%" rx="4" fill="rgba(255,255,255,0.1)" />
              <rect x="75%" y="15%" width="20%" height="30%" rx="4" fill="rgba(255,255,255,0.1)" />
              <rect x="10%" y="70%" width="12%" height="18%" rx="4" fill="rgba(255,255,255,0.1)" />
              <rect x="40%" y="75%" width="15%" height="10%" rx="4" fill="rgba(255,255,255,0.1)" />
              
              {/* Active Trip Path (Curved) */}
              <path 
                d="M 30% 35% Q 50% 10% 70% 65%" 
                fill="none" 
                stroke="#0F6E56" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeOpacity="0.3"
              />
              <path 
                d="M 30% 35% Q 50% 10% 70% 65%" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeDasharray="4 4" 
                strokeLinecap="round"
              />

              {/* Destination Pin */}
              <g transform="translate(700, 480)">
                <circle r="8" fill="#A32D2D" />
                <circle r="12" fill="none" stroke="#A32D2D" strokeWidth="2" strokeOpacity="0.3">
                  <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            {/* Driver Markers (Absolute Divs) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Driver 1: DW (In Trip - Pulse Green) */}
              <div 
                className="absolute left-[30%] top-[35%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-accent rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white pointer-events-auto cursor-pointer group"
                style={{ left: '30%', top: '35%' }}
              >
                DW
                <div className="absolute inset-0 rounded-full pulse-dot"></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  David Wilson · In Trip
                </div>
              </div>

              {/* Driver 2: MG (Available - Blue) */}
              <div 
                className="absolute left-[70%] top-[20%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white pointer-events-auto cursor-pointer group"
              >
                MG
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Maria Garcia · Available
                </div>
              </div>

              {/* Driver 3: JC (Available - Blue) */}
              <div 
                className="absolute left-[15%] top-[80%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white pointer-events-auto cursor-pointer group"
              >
                JC
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  James Carter · Available
                </div>
              </div>

              {/* Driver 4: RK (Break - Amber) */}
              <div 
                className="absolute left-[85%] top-[75%] w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-warning rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-white pointer-events-auto cursor-pointer group"
              >
                RK
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ink text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Robert Kim · On Break
                </div>
              </div>

              {/* Destination Label */}
              <div className="absolute left-[70%] top-[65%] ml-4 mt-2">
                <div className="bg-white px-2 py-1 rounded-lg border border-line-2 shadow-sm">
                  <p className="text-[10px] font-bold text-ink">Chippenham Medical</p>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-1">
              <button className="w-8 h-8 bg-white rounded-lg border border-line-2 flex items-center justify-center text-ink hover:bg-bg"><Plus size={16} /></button>
              <button className="w-8 h-8 bg-white rounded-lg border border-line-2 flex items-center justify-center text-ink hover:bg-bg"><Minus size={16} /></button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-line-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span className="text-[10px] font-bold text-ink-3">In Trip</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-[10px] font-bold text-ink-3">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                <span className="text-[10px] font-bold text-ink-3">On Break</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-urgent"></span>
                <span className="text-[10px] font-bold text-ink-3">Destination</span>
              </div>
            </div>
          </div>

          {/* Selected Trip Detail Card */}
          {selectedTrip && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-ink-3 tracking-tighter">#{selectedTrip.id}</span>
                  <TripStatusBadge status={selectedTrip.status} />
                  <span className="text-xs font-semibold text-ink-4">Started {selectedTrip.actualPickup || '8:30 AM'}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" icon={Phone}>Call Rider</Button>
                  <Button variant="outline" size="sm" icon={Phone}>Call Driver</Button>
                  <Button variant="danger" size="sm" icon={AlertTriangle}>Emergency</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Rider Info */}
                <div className="flex gap-4">
                  <Avatar initials={selectedTrip.rider.initials} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-ink mb-1">{selectedTrip.rider.name}</h4>
                    <p className="text-[10px] font-semibold text-ink-3 mb-2">{selectedTrip.rider.phone || '(804) 555-0142'}</p>
                    <div className="flex gap-1.5">
                      <Badge variant="primary">{selectedTrip.mobility}</Badge>
                      <Badge variant="neutral">{tripTypeLabel(selectedTrip.type)}</Badge>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="flex gap-4">
                  <Avatar initials={selectedDriver?.initials || '??'} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-ink mb-1">{selectedDriver?.name}</h4>
                    <p className="text-[10px] font-semibold text-ink-3 mb-2">
                      {selectedDriver?.vehicle?.make || 'No Vehicle'} · <span className="font-mono">{selectedDriver?.vehicle?.plate || '---'}</span>
                    </p>
                    <Badge variant="accent">{selectedDriver?.vehicle?.type || 'Standard'}</Badge>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-ink-3">
                      <span className="flex items-center gap-1"><Battery size={12} className="text-accent" /> 84%</span>
                      <span className="flex items-center gap-1"><Wifi size={12} className="text-accent" /> LTE</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-line-2">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Origin</p>
                    <p className="text-xs font-bold text-ink max-w-[180px] truncate">{selectedTrip.pickup}</p>
                  </div>
                  <div className="text-ink-4">
                    <ChevronRight size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Destination</p>
                    <p className="text-xs font-bold text-ink max-w-[180px] truncate">{selectedTrip.dropoff}</p>
                  </div>
                </div>
                <Button variant="primary-light" size="sm" icon={MessageSquare}>Message Dispatch</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTrips;
