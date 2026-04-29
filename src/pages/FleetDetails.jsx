import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Truck, AlertTriangle, Wrench, ShieldCheck, 
  ChevronLeft, Calendar, FileText, Hash, 
  User, Star, Phone, Info, Loader2,
  Activity, MapPin, Gauge, Clock, Shield,
  MoreVertical, Settings, History, Layers
} from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../components/UI';
import { useFleet } from '../hooks/useFleet';
import { useDrivers } from '../hooks/useDrivers';
import { useTrips } from '../hooks/useTrips';

const StatBox = ({ label, value, sub, icon: Icon, color = "primary" }) => (
  <div className="bg-white rounded-2xl border border-line-2 p-5 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-xl bg-${color}-light/30 text-${color}`}>
        <Icon size={18} />
      </div>
      <MoreVertical size={14} className="text-ink-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <p className="text-2xl font-black text-ink tracking-tight">{value}</p>
    <p className="text-[10px] font-black text-ink-4 uppercase tracking-widest mt-1">{label}</p>
    {sub && <p className="text-[10px] font-bold text-accent mt-2">{sub}</p>}
  </div>
);

const FleetDetails = ({ role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, loading: fleetLoading, handleAssign, updateStatus } = useFleet();
  const { drivers, loading: driversLoading } = useDrivers();
  const { trips } = useTrips();
  
  const [vehicle, setVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (vehicles.length > 0) {
      const found = vehicles.find(v => v.id === id);
      if (found) {
        setVehicle(found);
      }
    }
  }, [id, vehicles]);

  if (fleetLoading || driversLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-ink-3">Initializing Vehicle Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8">
        <div className="w-20 h-20 bg-urgent-light text-urgent rounded-full flex items-center justify-center mb-6 shadow-lg">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-2xl font-black text-ink mb-2">Vehicle Not Found</h2>
        <p className="text-ink-3 mb-8 max-w-sm">The vehicle ID #{id} could not be located in the current fleet database.</p>
        <Button variant="primary" onClick={() => navigate('/fleet')}>Return to Fleet</Button>
      </div>
    );
  }

  const driver = (drivers || []).find(d => d.id === vehicle?.assignedDriverId);
  const vehicleTrips = (trips || []).filter(t => t.vehicleId === vehicle?.id || (driver && t.driverId === driver.id));
  
  const statusColors = {
    available: 'bg-accent text-white shadow-accent/20',
    in_trip: 'bg-primary text-white shadow-primary/20',
    maintenance: 'bg-urgent text-white shadow-urgent/20',
    break: 'bg-warning text-white shadow-warning/20',
    off_duty: 'bg-ink-4 text-white shadow-ink-4/20',
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    await updateStatus(vehicle.id, newStatus);
    setUpdatingStatus(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border border-line-2 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex items-center gap-6 relative z-10">
          <button 
            onClick={() => navigate('/fleet')}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-bg border border-line-2 text-ink-3 hover:text-primary hover:bg-white transition-all shadow-sm group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="w-24 h-24 rounded-3xl bg-primary-light flex items-center justify-center text-primary shadow-inner border border-primary/10">
            <Truck size={40} />
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-black text-ink tracking-tighter">{vehicle.make} {vehicle.model}</h1>
              <Badge variant={vehicle.status === 'available' ? 'accent' : 'primary'} className="h-6">
                {vehicle.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-ink-3">
              <span className="flex items-center gap-1.5"><Hash size={14} className="text-ink-4" /> {vehicle.id}</span>
              <span className="w-1 h-1 rounded-full bg-line-2" />
              <span className="flex items-center gap-1.5 font-mono"><Layers size={14} className="text-ink-4" /> {vehicle.plate}</span>
              <span className="w-1 h-1 rounded-full bg-line-2" />
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-ink-4" /> {vehicle.year}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button variant="outline" icon={Settings}>Config</Button>
          <Button variant="primary" icon={Wrench}>Maintenance</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Stats & Status */}
        <div className="lg:col-span-4 space-y-8">
          {/* Status Control Card */}
          <Card className="p-6 border-line-2 shadow-sm bg-ink text-white">
            <h3 className="text-xs font-black uppercase tracking-widest text-ink-4 mb-6">Operational Status</h3>
            <div className="space-y-3">
              {['available', 'in_trip', 'maintenance', 'off_duty'].map((s) => (
                <button
                  key={s}
                  disabled={updatingStatus}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all border-2 ${
                    vehicle.status === s 
                      ? 'bg-white/10 border-primary text-white shadow-lg' 
                      : 'bg-white/5 border-transparent text-ink-4 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      s === 'available' ? 'bg-accent' : 
                      s === 'in_trip' ? 'bg-primary' : 
                      s === 'maintenance' ? 'bg-urgent' : 'bg-slate-500'
                    }`} />
                    <span className="text-xs font-black uppercase tracking-widest">{s.replace('_', ' ')}</span>
                  </div>
                  {vehicle.status === s && <ShieldCheck size={16} className="text-primary" />}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-ink-4 mt-6 italic font-medium leading-relaxed">
              Changing the vehicle status affects driver availability and real-time dispatching visibility.
            </p>
          </Card>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Current Miles" value={vehicle.mileage.toLocaleString()} icon={Gauge} />
            <StatBox label="Fuel Level" value="84%" icon={Activity} color="accent" />
            <StatBox label="Trips (M)" value="128" icon={History} />
            <StatBox label="Next Svc" value="12d" icon={Clock} color="warning" />
          </div>

          {/* Active Driver Card */}
          <Card className="p-6 border-line-2 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <h3 className="text-xs font-black uppercase tracking-widest text-ink-4 mb-6">Active Assignment</h3>
            {driver ? (
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar initials={driver.initials} size="xl" online={driver.onDuty} className="ring-4 ring-bg" />
                  <div>
                    <p className="text-xl font-black text-ink tracking-tight">{driver.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={12} className="text-warning fill-warning" />
                      <span className="text-xs font-bold text-ink-3">{driver.rating} · Dispatch Verified</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 bg-bg rounded-2xl p-4 border border-line-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-ink-4 uppercase">Phone</span>
                    <span className="text-xs font-bold text-ink">{driver.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-ink-4 uppercase">Total Trips</span>
                    <span className="text-xs font-bold text-ink">{driver.totalTrips}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setAssigning(true)}>Change Assignment</Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <User size={40} className="mx-auto mb-4 text-ink-4 opacity-20" />
                <p className="text-sm font-bold text-ink-3 mb-6">No Driver Assigned</p>
                <Button variant="primary-light" size="sm" onClick={() => setAssigning(true)}>Assign Now</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Tabbed Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Tabbed Container */}
          <div className="bg-white rounded-3xl border border-line-2 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
            {/* Tabs Header */}
            <div className="flex border-b border-line-2 bg-slate-50/50">
              {['overview', 'maintenance', 'trips'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab ? 'text-primary bg-white' : 'text-ink-4 hover:text-ink hover:bg-white/50'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-lg" />
                  )}
                </button>
              ))}
            </div>

            {/* Tabs Content Area */}
            <div className="p-8 flex-1">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black text-ink uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                        <Info size={14} className="text-primary" /> Technical Specs
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {[
                          ['Vehicle Type', vehicle.type],
                          ['Seating Cap.', `${vehicle.seats} Passengers`],
                          ['Color Way', vehicle.color],
                          ['VIN Number', vehicle.vin, true],
                          ['Year Build', vehicle.year]
                        ].map(([l, v, m]) => (
                          <div key={l} className="flex items-center justify-between py-3 border-b border-line-2 last:border-0">
                            <span className="text-[10px] font-black text-ink-4 uppercase tracking-widest">{l}</span>
                            <span className={`text-xs font-bold text-ink ${m ? 'font-mono' : ''}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-bg rounded-3xl p-6 border border-line-2">
                       <h4 className="text-[10px] font-black text-ink-4 uppercase tracking-[0.15em] mb-4">Compliance Data</h4>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Shield size={18} className="text-accent" />
                              <div>
                                <p className="text-xs font-black text-ink">Commercial Policy</p>
                                <p className="text-[10px] font-bold text-ink-4 uppercase">{vehicle.insurance.policy}</p>
                              </div>
                            </div>
                            <Badge variant={vehicle.insurance.status === 'valid' ? 'accent' : 'urgent'}>
                              {vehicle.insurance.status}
                            </Badge>
                          </div>
                          <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-accent h-full w-[85%] rounded-full shadow-sm" />
                          </div>
                          <p className="text-[10px] font-bold text-ink-4 text-center">Renewal Date: {vehicle.insurance.expires}</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black text-ink uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                        <MapPin size={14} className="text-accent" /> Real-time Location
                      </h4>
                      <div className="aspect-video bg-bg rounded-3xl border border-line-2 overflow-hidden relative shadow-inner group">
                         <div className="absolute inset-0 bg-slate-200 animate-pulse group-hover:bg-slate-100 transition-colors" />
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-primary ring-4 ring-primary/20 animate-bounce">
                               <Truck size={24} className="text-primary" />
                            </div>
                            <p className="mt-4 text-[10px] font-black text-ink uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-md border border-line-2">
                              Chesterfield Ave, VA
                            </p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-primary-light/30 rounded-3xl border border-primary/10">
                       <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.15em] mb-3">Service Health Index</h4>
                       <div className="flex items-end gap-4">
                          <p className="text-4xl font-black text-primary tracking-tighter">98.4<span className="text-lg">%</span></p>
                          <div className="mb-1 flex-1">
                             <p className="text-[10px] font-bold text-primary mb-1">Excellent Performance</p>
                             <div className="h-1.5 bg-primary/10 rounded-full w-full">
                                <div className="h-full bg-primary rounded-full w-[98%]" />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-ink">Service Registry</h4>
                      <p className="text-xs font-bold text-ink-4 mt-1">Full maintenance and repair ledger</p>
                    </div>
                    {(role === 'admin' || role === 'dispatcher') && (
                      <Button variant="primary" icon={Layers}>Log Entry</Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {(vehicle.maintenance || []).map((log, i) => (
                      <div key={i} className="flex items-center gap-6 p-5 bg-bg rounded-3xl border border-line-2 hover:bg-white hover:shadow-xl hover:scale-[1.01] transition-all cursor-default group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                          log.type.toLowerCase().includes('oil') ? 'bg-primary-light text-primary' : 
                          log.type.toLowerCase().includes('tire') ? 'bg-accent-light text-accent' : 'bg-warning-light text-warning-dark'
                        }`}>
                          {log.type.toLowerCase().includes('oil') ? <Layers size={24} /> : <Wrench size={24} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-black text-ink">{log.type}</p>
                            <span className="text-sm font-black text-ink">${log.cost}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black text-ink-4 uppercase tracking-widest">
                            <span>{log.date}</span>
                            <span className="w-1 h-1 rounded-full bg-line-2" />
                            <span>{log.mileage.toLocaleString()} MI</span>
                            <span className="w-1 h-1 rounded-full bg-line-2" />
                            <span className="text-primary">{log.shop}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'trips' && (
                <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-ink">Trip Ledger</h4>
                      <p className="text-xs font-bold text-ink-4 mt-1">Historical deployment records</p>
                    </div>
                    <Button variant="outline" icon={FileText}>Export CSV</Button>
                  </div>

                  <div className="space-y-4">
                    {vehicleTrips.slice(0, 10).map((trip, i) => (
                      <div key={i} className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-bg transition-colors border-b border-line last:border-0">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <span className="text-[10px] font-black">#{trip.id.slice(-3)}</span>
                         </div>
                         <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                               <p className="text-xs font-black text-ink">{trip.rider.name}</p>
                               <p className="text-[9px] font-bold text-ink-4 uppercase tracking-widest">{new Date(trip.scheduledTime).toLocaleDateString()}</p>
                            </div>
                            <div className="min-w-0">
                               <p className="text-[10px] font-bold text-ink-4 truncate uppercase tracking-tight">{trip.pickup}</p>
                               <p className="text-[10px] font-bold text-primary truncate uppercase tracking-tight">{trip.dropoff}</p>
                            </div>
                            <div className="flex justify-end">
                               <Badge variant={trip.status === 'completed' ? 'accent' : 'neutral'} className="text-[8px] tracking-[0.1em]">
                                 {trip.status}
                               </Badge>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {assigning && (
        <div className="fixed inset-0 bg-ink/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <Card className="w-full max-w-lg bg-white overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-line-2 flex items-center justify-between bg-bg/50">
                 <h3 className="text-sm font-black text-ink uppercase tracking-widest">Reassign Vehicle Pilot</h3>
                 <button onClick={() => setAssigning(false)} className="text-ink-4 hover:text-ink"><Layers size={20} className="rotate-45" /></button>
              </div>
              <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto">
                 {drivers.filter(d => !d.vehicleId || d.vehicleId === vehicle.id).map(d => (
                   <button
                    key={d.id}
                    onClick={() => { handleAssign(vehicle.id, d.id); setAssigning(false); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-primary-light/30 transition-all border border-line-2 hover:border-primary/20 text-left group"
                   >
                     <Avatar initials={d.initials} size="md" online={d.onDuty} />
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-ink group-hover:text-primary transition-colors">{d.name}</p>
                        <p className="text-[10px] font-bold text-ink-4 uppercase">Status: {d.status}</p>
                     </div>
                     <Star size={16} className="text-warning fill-warning opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                 ))}
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};

export default FleetDetails;
