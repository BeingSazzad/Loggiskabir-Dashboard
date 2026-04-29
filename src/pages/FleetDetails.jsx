import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Truck, AlertTriangle, Wrench, ShieldCheck, 
  ChevronLeft, Calendar, FileText, Hash, 
  User, Star, Phone, StarHalf, Info, Loader2
} from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../components/UI';
import { useFleet } from '../hooks/useFleet';
import { useDrivers } from '../hooks/useDrivers';
import { useTrips } from '../hooks/useTrips';

const DetailRow = ({ label, value, mono = false, icon: Icon }) => (
  <div className="flex items-start justify-between py-3 border-b border-line-2 last:border-0">
    <div className="flex items-center gap-2 text-[10px] font-bold text-ink-4 uppercase tracking-widest">
      {Icon && <Icon size={11} className="text-ink-4" />}
      {label}
    </div>
    <span className={`text-xs font-bold text-ink text-right max-w-[55%] ${mono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);

const FleetDetails = ({ role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, loading: fleetLoading, handleAssign } = useFleet();
  const { drivers, loading: driversLoading } = useDrivers();
  const { trips } = useTrips();
  
  const [vehicle, setVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [assigning, setAssigning] = useState(false);

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
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!vehicle && !fleetLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8">
        <div className="w-16 h-16 bg-urgent-light text-urgent rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-ink mb-2">Vehicle Not Found</h2>
        <p className="text-ink-3 mb-6">The vehicle ID #{id} does not exist in our system.</p>
        <Button onClick={() => navigate('/fleet')}>Back to Fleet</Button>
      </div>
    );
  }

  const driver = (drivers || []).find(d => d.id === vehicle?.assignedDriverId);
  const vehicleTrips = (trips || []).filter(t => t.vehicleId === vehicle?.id || (driver && t.driverId === driver.id));
  
  const nextServiceDate = vehicle?.nextService ? new Date(vehicle.nextService) : null;
  const nextServiceDays = nextServiceDate ? Math.ceil((nextServiceDate - new Date()) / 86400000) : null;
  const serviceWarning = nextServiceDays !== null && nextServiceDays < 60;

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300 pb-12">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/fleet')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-ink-3 hover:text-ink hover:bg-white rounded-xl transition-all shadow-sm border border-line-2 bg-bg"
        >
          <ChevronLeft size={16} /> Back to Fleet List
        </button>
        <div className="flex gap-3">
          {(role === 'admin' || role === 'dispatcher') && (
            <Button variant="outline" icon={Wrench}>Log Service</Button>
          )}
          {role === 'admin' && (
            <Button variant="primary">Edit Specifications</Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden border-line-2">
        {/* Visual Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-8 h-44 relative">
          <div className="absolute -bottom-12 left-8 flex items-end gap-6">
            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-2xl flex items-center justify-center border border-line">
              <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center text-primary relative overflow-hidden">
                {vehicle?.image ? (
                  <img src={vehicle.image} alt="vehicle" className="w-full h-full object-cover" />
                ) : (
                  <Truck size={48} />
                )}
              </div>
            </div>
            <div className="mb-4">
              <h1 className="text-3xl font-black text-ink leading-tight drop-shadow-sm">
                {vehicle?.year} {vehicle?.make} {vehicle?.model}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2 py-0.5 bg-ink text-white rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                  {vehicle?.plate}
                </span>
                <span className="text-xs font-bold text-ink-3">ID: {vehicle?.id}</span>
                <Badge variant={vehicle?.status === 'available' ? 'accent' : 'primary'}>
                   {vehicle?.status?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-16 px-8 border-b border-line-2">
          <div className="flex items-center gap-8">
            {['overview', 'maintenance', 'trips'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-primary' : 'text-ink-4 hover:text-ink'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary-rgb),0.3)]"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8 bg-slate-50/30">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h4 className="text-xs font-black text-ink uppercase tracking-widest opacity-40">Specifications</h4>
                <div className="bg-white rounded-2xl border border-line-2 px-5 py-2 shadow-sm">
                  <DetailRow label="Vehicle Type" value={vehicle?.type} icon={Info} />
                  <DetailRow label="Passenger Capacity" value={`${vehicle?.seats} Seats`} />
                  <DetailRow label="VIN Number" value={vehicle?.vin} mono />
                  <DetailRow label="Color" value={vehicle?.color} />
                  <DetailRow label="Last Inspection" value={vehicle?.lastService} icon={Calendar} />
                </div>
                
                <div className="bg-white rounded-2xl border border-line-2 px-5 py-4 shadow-sm">
                  <p className="text-[10px] font-black text-ink-4 uppercase tracking-widest mb-3">Mileage Status</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black text-ink font-mono tracking-tighter">
                        {(vehicle?.mileage || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] font-bold text-ink-4 uppercase">Total Miles Tracked</p>
                    </div>
                    <div className="text-right">
                       <p className={`text-sm font-bold ${serviceWarning ? 'text-urgent' : 'text-accent'}`}>
                         {serviceWarning ? 'Service Due' : 'Healthy'}
                       </p>
                       <p className="text-[10px] text-ink-4">Next: {vehicle?.nextService}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-xs font-black text-ink uppercase tracking-widest opacity-40">Driver Assignment</h4>
                {!assigning ? (
                  driver ? (
                    <Card className="p-5 flex items-center gap-5 border-line-2 bg-white shadow-sm">
                      <Avatar initials={driver.initials} size="xl" online={driver.onDuty} />
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-black text-ink truncate">{driver.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs font-bold text-ink-3">
                            <Star size={12} className="text-warning fill-warning" /> {driver.rating}
                          </span>
                          <span className="text-[10px] font-bold text-ink-4 px-2 py-0.5 bg-bg rounded uppercase">{driver.status}</span>
                        </div>
                        <p className="text-xs text-ink-3 mt-2 flex items-center gap-1.5"><Phone size={12} /> {driver.phone}</p>
                      </div>
                      {(role === 'admin' || role === 'dispatcher') && (
                        <Button variant="outline" size="sm" onClick={() => setAssigning(true)}>Change</Button>
                      )}
                    </Card>
                  ) : (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-line p-10 text-center">
                      <User size={32} className="mx-auto mb-3 text-ink-4 opacity-20" />
                      <p className="text-sm font-bold text-ink-3 mb-4">No driver currently assigned</p>
                      {(role === 'admin' || role === 'dispatcher') && (
                        <Button variant="primary-light" size="sm" onClick={() => setAssigning(true)}>Assign Driver</Button>
                      )}
                    </div>
                  )
                ) : (
                  <div className="bg-white rounded-2xl border border-primary/20 p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-line-2 pb-3">
                      <p className="text-xs font-black text-ink uppercase tracking-widest">Select Available Driver</p>
                      <button onClick={() => setAssigning(false)} className="text-xs font-bold text-urgent">Cancel</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                      {drivers.filter(d => !d.vehicleId || d.vehicleId === vehicle.id).map(d => (
                        <button
                          key={d.id}
                          onClick={() => { handleAssign(vehicle.id, d.id); setAssigning(false); }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-light/30 transition-all border border-transparent hover:border-primary/10"
                        >
                          <Avatar initials={d.initials} size="sm" />
                          <div className="text-left flex-1">
                            <p className="text-xs font-bold text-ink">{d.name}</p>
                            <p className="text-[10px] text-ink-4 uppercase">{d.status}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-line-2 p-5 shadow-sm">
                  <h5 className="text-[10px] font-black text-ink-4 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-accent" /> Compliance & Insurance
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-ink-3">Insurance Policy</span>
                      <span className="text-xs font-mono font-bold text-ink">{vehicle?.insurance?.policy}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-ink-3">Expiry Date</span>
                      <Badge variant={vehicle?.insurance?.status === 'valid' ? 'accent' : 'urgent'}>
                        {vehicle?.insurance?.expires}
                      </Badge>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-5 border-line-2 shadow-sm bg-white">
                  <p className="text-[10px] font-black text-ink-4 uppercase tracking-widest mb-1">Lifetime Cost</p>
                  <p className="text-2xl font-black text-ink">${(vehicle?.maintenance || []).reduce((sum, log) => sum + log.cost, 0).toLocaleString()}</p>
                </Card>
                <Card className="p-5 border-line-2 shadow-sm bg-white">
                  <p className="text-[10px] font-black text-ink-4 uppercase tracking-widest mb-1">Avg Interval</p>
                  <p className="text-2xl font-black text-primary">5,400 mi</p>
                </Card>
                <Card className="p-5 border-line-2 shadow-sm bg-white">
                  <p className="text-[10px] font-black text-ink-4 uppercase tracking-widest mb-1">Health Score</p>
                  <p className="text-2xl font-black text-accent">98/100</p>
                </Card>
               </div>

               <Card className="overflow-hidden border-line-2 shadow-sm bg-white">
                 <div className="px-6 py-4 border-b border-line-2 bg-slate-50/50 flex items-center justify-between">
                    <h4 className="text-xs font-black text-ink uppercase tracking-widest">Maintenance Logs</h4>
                    {(role === 'admin' || role === 'dispatcher') && <Button variant="outline" size="sm">Add Log</Button>}
                 </div>
                 <table className="w-full text-left">
                   <thead className="bg-bg/40 border-b border-line-2">
                     <tr>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest">Date</th>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest">Type</th>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest text-right">Cost</th>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest text-right">Mileage</th>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest">Provider</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-line-2">
                     {(vehicle?.maintenance || []).map((log, i) => (
                       <tr key={i} className="hover:bg-bg/40 transition-colors">
                         <td className="px-6 py-4 text-xs font-bold text-ink">{log.date}</td>
                         <td className="px-6 py-4 text-xs font-medium text-ink">{log.type}</td>
                         <td className="px-6 py-4 text-xs font-black text-ink text-right">${log.cost}</td>
                         <td className="px-6 py-4 text-xs font-mono text-ink-3 text-right">{log.mileage.toLocaleString()}</td>
                         <td className="px-6 py-4 text-xs text-ink-3 font-medium">{log.shop}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </Card>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="space-y-6">
               <Card className="overflow-hidden border-line-2 shadow-sm bg-white">
                 <div className="px-6 py-4 border-b border-line-2 bg-slate-50/50 flex items-center justify-between">
                    <h4 className="text-xs font-black text-ink uppercase tracking-widest">Historical Performance</h4>
                    <Button variant="outline" size="sm">Export Data</Button>
                 </div>
                 <table className="w-full text-left">
                   <thead className="bg-bg/40 border-b border-line-2">
                     <tr>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest">Trip ID</th>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest">Date</th>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest">Rider</th>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest">Route</th>
                       <th className="px-6 py-3 text-[10px] font-black text-ink-4 uppercase tracking-widest text-right">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-line-2">
                     {vehicleTrips.slice(0, 15).map((trip, i) => (
                       <tr key={i} className="hover:bg-bg/40 transition-colors">
                         <td className="px-6 py-4 text-xs font-mono font-black text-primary">#{trip.id}</td>
                         <td className="px-6 py-4 text-xs font-bold text-ink">{new Date(trip.scheduledTime).toLocaleDateString()}</td>
                         <td className="px-6 py-4 text-xs font-bold text-ink">{trip.rider.name}</td>
                         <td className="px-6 py-4 text-[10px] text-ink-4 font-bold">
                            {trip.pickup} → {trip.dropoff}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <Badge variant={trip.status === 'completed' ? 'accent' : 'neutral'} className="text-[9px] uppercase tracking-tighter">
                              {trip.status}
                            </Badge>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FleetDetails;
