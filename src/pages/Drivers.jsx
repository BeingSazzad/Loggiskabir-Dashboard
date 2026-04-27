import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Car, 
  MapPin, 
  ShieldCheck, 
  CalendarClock, 
  AlertTriangle,
  Star,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Card, Avatar, Badge, Button } from '../components/UI';
import { drivers } from '../data/mockData';
import { docExpiryStatus } from '../utils/helpers';

const Drivers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDriverId, setSelectedDriverId] = useState('DRV-2024-8421');

  const filteredDrivers = drivers.filter(d => {
    if (activeTab === 'on_duty') return d.onDuty;
    if (activeTab === 'off_duty') return !d.onDuty;
    if (activeTab === 'attention') return d.pendingDocUpdates > 0;
    return true;
  });

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  const getStatusBadge = (status) => {
    const config = {
      available: { variant: 'accent', label: 'Available' },
      in_trip: { variant: 'solid_accent', label: 'In Trip' },
      break: { variant: 'warning', label: 'On Break' },
      off_duty: { variant: 'neutral', label: 'Off Duty' },
    };
    const { variant, label } = config[status] || { variant: 'neutral', label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Drivers</h1>
          <p className="text-ink-3 font-medium">Manage driver pool and vehicle assignments</p>
        </div>
        <Button variant="primary" icon={Plus}>Onboard New Driver</Button>
      </div>

      <div className="flex items-center gap-1 border-b border-line-2">
        {['all', 'on_duty', 'off_duty', 'attention'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
          >
            {tab.replace('_', ' ')}
            {tab === 'attention' && drivers.some(d => d.pendingDocUpdates > 0) && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-urgent-light text-urgent text-[10px]">1</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        {/* Left Column: List */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2">
          {filteredDrivers.map(driver => (
            <Card 
              key={driver.id} 
              hover 
              onClick={() => setSelectedDriverId(driver.id)}
              className={`p-4 ${selectedDriverId === driver.id ? 'border-primary bg-primary-tint/30' : ''}`}
            >
              <div className="flex items-center gap-4">
                <Avatar initials={driver.initials} size="md" online={driver.onDuty} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-ink truncate">{driver.name}</h4>
                    {getStatusBadge(driver.status)}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] font-bold text-ink-4 tracking-tighter uppercase">{driver.id}</span>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-warning">
                      <Star size={10} fill="currentColor" />
                      {driver.rating}
                    </span>
                    <span className="text-[10px] text-ink-3">{driver.totalTrips} trips</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-ink-4 uppercase">{driver.vehicle.plate}</span>
                    {driver.insurance.status === 'expiring' && <Badge variant="warning">Insurance Expiring</Badge>}
                    {driver.insurance.status === 'expired' && <Badge variant="urgent">Insurance Expired</Badge>}
                  </div>
                </div>
                <ChevronRight size={16} className="text-ink-4" />
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column: Detail */}
        <div className="lg:col-span-7 overflow-y-auto pr-2">
          {selectedDriver ? (
            <Card className="overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark p-6 h-32 relative">
                <div className="absolute -bottom-8 left-6">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                    <Avatar initials={selectedDriver.initials} size="xl" className="w-full h-full rounded-xl overflow-hidden" />
                  </div>
                </div>
              </div>

              <div className="pt-12 px-6 pb-6 space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold font-display text-ink leading-tight">{selectedDriver.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-bold text-ink-4 tracking-tight uppercase">{selectedDriver.id}</span>
                      <span className="text-xs text-ink-3">Member since 2022</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-lg font-bold text-warning">
                      <Star size={18} fill="currentColor" />
                      {selectedDriver.rating}
                    </span>
                    {selectedDriver.onDuty && <Badge variant="accent" dot>On Duty</Badge>}
                  </div>
                </div>

                {/* Today's Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-bg rounded-xl p-4 border border-line-2">
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Today's Trips</p>
                    <p className="text-lg font-bold text-ink">{selectedDriver.tripsToday}</p>
                  </div>
                  <div className="bg-bg rounded-xl p-4 border border-line-2">
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Completed</p>
                    <p className="text-lg font-bold text-accent">{selectedDriver.completedToday}</p>
                  </div>
                  <div className="bg-bg rounded-xl p-4 border border-line-2">
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Remaining</p>
                    <p className="text-lg font-bold text-ink">{selectedDriver.tripsToday - selectedDriver.completedToday}</p>
                  </div>
                </div>

                {/* Contact */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-bg rounded-xl border border-line-2">
                      <div className="p-2 bg-white rounded-lg text-ink-3"><Phone size={16} /></div>
                      <span className="text-sm font-bold text-ink">{selectedDriver.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-bg rounded-xl border border-line-2">
                      <div className="p-2 bg-white rounded-lg text-ink-3"><Mail size={16} /></div>
                      <span className="text-sm font-bold text-ink">{selectedDriver.email}</span>
                    </div>
                  </div>
                </section>

                {/* Vehicle */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Vehicle Assignment</h4>
                  <Card className="p-4 flex items-center gap-4 bg-tint/10 border-primary/10">
                    <div className="p-3 bg-primary-light text-primary rounded-xl"><Car size={24} /></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink">{selectedDriver.vehicle.color} {selectedDriver.vehicle.make}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs font-bold text-ink-3 tracking-tighter uppercase">{selectedDriver.vehicle.plate}</span>
                        <Badge variant="neutral">{selectedDriver.vehicle.type}</Badge>
                      </div>
                    </div>
                  </Card>
                </section>

                {/* Counties */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Service Counties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDriver.counties.map(county => (
                      <div key={county} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg rounded-full border border-line-2 text-xs font-bold text-ink-2">
                        <MapPin size={12} className="text-ink-4" />
                        {county}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Documents */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Documents & Compliance</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Driver License', data: selectedDriver.license },
                      { label: 'Commercial Insurance', data: selectedDriver.insurance },
                      { label: 'NEMT Certification', data: selectedDriver.cert }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-bg rounded-xl border border-line-2">
                        <div className="flex items-center gap-3">
                          {doc.data.status === 'valid' ? <ShieldCheck size={18} className="text-accent" /> : (doc.data.status === 'expiring' ? <CalendarClock size={18} className="text-warning" /> : <AlertTriangle size={18} className="text-urgent" />)}
                          <div>
                            <p className="text-xs font-bold text-ink">{doc.label}</p>
                            <p className="text-[10px] font-mono text-ink-4 uppercase tracking-tighter">{doc.data.number} · Exp {doc.data.expires}</p>
                          </div>
                        </div>
                        <Badge variant={doc.data.status === 'valid' ? 'accent' : (doc.data.status === 'expiring' ? 'warning' : 'urgent')}>
                          {doc.data.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" icon={Phone}>Call Driver</Button>
                  <Button variant="outline" className="flex-1" icon={Mail}>Email</Button>
                  <Button variant="primary-light" className="flex-1" icon={ExternalLink}>Full Profile</Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-ink-4 font-bold">Select a driver to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drivers;
