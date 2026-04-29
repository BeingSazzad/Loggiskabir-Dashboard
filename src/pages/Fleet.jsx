import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Truck, AlertTriangle, CheckCircle2, Clock,
  Wrench, ShieldCheck, X, Check, Plus, Search,
  User, ChevronRight, FileText, Calendar, Gauge,
  CreditCard, MapPin, Star, Hash, Shield, Info, Loader2
} from 'lucide-react';
import { Card, Badge, Avatar, Button, Pagination } from '../components/UI';
import { useFleet } from '../hooks/useFleet';
import { useDrivers } from '../hooks/useDrivers';
import { useTrips } from '../hooks/useTrips';

const VEHICLE_TYPES = ['Ambulatory Van', 'Wheelchair Van', 'Stretcher Van'];

const EMPTY_FORM = {
  make: '', model: '', year: '', plate: '', vin: '',
  type: 'Ambulatory Van', seats: '',
  mileage: '', nextService: '',
  insuranceProvider: '', insurancePolicy: '', insuranceExpiry: '',
};

const AddVehicleModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [step, setStep] = useState(1);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-line-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center text-primary">
              <Truck size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-ink">Add New Vehicle</h2>
              <p className="text-[10px] text-ink-4 font-medium">Step {step} of 2 — {step === 1 ? 'Details' : 'Compliance'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-ink-4 hover:text-ink transition-colors"><X size={18} /></button>
        </div>

        <div className="flex px-6 pt-4 gap-2">
          {['Details', 'Compliance'].map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${step > i ? 'bg-primary' : 'bg-line-2'}`} />
              <p className={`text-[10px] font-bold mt-1 ${step === i + 1 ? 'text-primary' : 'text-ink-4'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              {[['Make *', 'make', 'Ford', 'text'], ['Model *', 'model', 'Transit', 'text'],
                ['Year *', 'year', '2024', 'number'], ['Plate No. *', 'plate', 'VA · AAA-0000', 'text']].map(([label, key, ph, type]) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">{label}</label>
                  <input className="input-base w-full" type={type} placeholder={ph} value={form[key]} onChange={e => set(key, e.target.value)} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">VIN *</label>
                <input className="input-base w-full font-mono" placeholder="1FD..." value={form.vin} onChange={e => set('vin', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Vehicle Type *</label>
                <select className="input-base w-full" value={form.type} onChange={e => set('type', e.target.value)}>
                  {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Passenger Seats *</label>
                <input className="input-base w-full" type="number" placeholder="4" value={form.seats} onChange={e => set('seats', e.target.value)} />
              </div>
            </div>
          )}
          {step === 2 && (
            <>
              <div className="bg-bg rounded-xl p-4 border border-line-2 space-y-4">
                <p className="text-xs font-extrabold text-ink flex items-center gap-2"><Wrench size={14} className="text-warning-dark" /> Maintenance</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Current Mileage *</label>
                    <input className="input-base w-full" type="number" placeholder="0" value={form.mileage} onChange={e => set('mileage', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Next Service Due *</label>
                    <input className="input-base w-full" type="date" value={form.nextService} onChange={e => set('nextService', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="bg-bg rounded-xl p-4 border border-line-2 space-y-4">
                <p className="text-xs font-extrabold text-ink flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> Commercial Insurance</p>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Provider *</label>
                  <input className="input-base w-full" placeholder="e.g., Progressive Commercial" value={form.insuranceProvider} onChange={e => set('insuranceProvider', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Policy No. *</label>
                    <input className="input-base w-full" placeholder="POL-00000" value={form.insurancePolicy} onChange={e => set('insurancePolicy', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Expiry Date *</label>
                    <input className="input-base w-full" type="date" value={form.insuranceExpiry} onChange={e => set('insuranceExpiry', e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-line-2 flex items-center justify-between">
          <button onClick={onClose} className="text-sm font-bold text-ink-4 hover:text-ink transition-colors">Cancel</button>
          <div className="flex gap-3">
            {step > 1 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>← Back</Button>}
            {step < 2
              ? <Button variant="primary" onClick={() => setStep(s => s + 1)}>Continue →</Button>
              : <Button variant="primary" icon={Check} onClick={() => { onSave(form); onClose(); }}>Add Vehicle</Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

};

const statusConfig = {
  available:   { label: 'Available',  dot: 'bg-accent',  text: 'text-accent'  },
  in_trip:     { label: 'In Trip',    dot: 'bg-primary', text: 'text-primary' },
  break:       { label: 'On Break',   dot: 'bg-warning', text: 'text-warning' },
  off_duty:    { label: 'Off Duty',   dot: 'bg-ink-4',   text: 'text-ink-4'   },
  maintenance: { label: 'In Service', dot: 'bg-urgent',  text: 'text-urgent'  },
};

const insuranceBadge = { valid: 'accent', expiring: 'warning', expired: 'urgent' };

const typeBadge = {
  'Ambulatory Van': 'primary',
  'Wheelchair Van': 'accent',
  'Stretcher Van':  'warning',
};

const AssignDriverCell = ({ vehicle, allDrivers, onAssign, role }) => {
  const [open, setOpen] = useState(false);
  const driver = allDrivers.find(d => d.id === vehicle.assignedDriverId);

  return (
    <div className="relative">
      {driver ? (
        <div className="flex items-center gap-2.5">
          <Avatar initials={driver.initials} size="xs" online={driver.onDuty} />
          <div className="min-w-0">
            <p className="text-xs font-bold text-ink truncate">{driver.name}</p>
            <p className="text-[10px] text-ink-4">★{driver.rating} · {driver.totalTrips} trips</p>
          </div>
          <button onClick={() => setOpen(o => !o)} className="ml-1 text-[10px] font-bold text-primary hover:underline whitespace-nowrap">
            Change
          </button>
        </div>
      ) : (
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-xs font-bold text-ink-4 hover:text-primary transition-colors">
          <User size={13} /> Assign
        </button>
      )}

      {open && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl border border-line shadow-xl z-30 py-1 animate-in slide-in-from-top-2 duration-150">
          {allDrivers.map(d => (
            <button key={d.id} onClick={() => { onAssign(vehicle.id, d.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-bg transition-colors">
              <Avatar initials={d.initials} size="xs" online={d.onDuty} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-bold text-ink truncate">{d.name}</p>
                <p className="text-[10px] text-ink-4 capitalize">{d.status.replace('_', ' ')}</p>
              </div>
              {vehicle.assignedDriverId === d.id && <Check size={13} className="text-accent flex-shrink-0" />}
            </button>
          ))}
          {vehicle.assignedDriverId && (
            <button onClick={() => { onAssign(vehicle.id, null); setOpen(false); }}
              className="w-full px-3 py-2 text-xs font-bold text-urgent hover:bg-urgent-light/20 transition-colors text-left border-t border-line-2 mt-1">
              Remove Assignment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Fleet = ({ role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles, loading: fleetLoading, error, addVehicle, handleAssign } = useFleet();
  const { drivers, loading: driversLoading } = useDrivers();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (id && vehicles.length > 0) {
      const v = vehicles.find(veh => veh.id === id);
      if (v) setSelectedVehicle(v);
    } else if (!id) {
      setSelectedVehicle(null);
    }
  }, [id, vehicles]);

  const handleSelectVehicle = (v) => {
    if (v) {
      navigate(`/fleet/${v.id}`);
    } else {
      navigate('/fleet');
    }
  };

  const loading = fleetLoading || driversLoading;

  const filtered = (vehicles || []).filter(v => {
    const q = (search || '').toLowerCase();
    const matchSearch = !q || (v?.make || '').toLowerCase().includes(q) || (v?.model || '').toLowerCase().includes(q)
      || (v?.plate || '').toLowerCase().includes(q) || (v?.id || '').toLowerCase().includes(q);
    const matchTab =
      filter === 'available' ? v?.status === 'available' :
      filter === 'in_trip'   ? v?.status === 'in_trip' :
      filter === 'issues'    ? (v?.insurance?.status !== 'valid') : true;
    return matchSearch && matchTab;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    total: (vehicles || []).length,
    available: (vehicles || []).filter(v => v?.status === 'available').length,
    inTrip: (vehicles || []).filter(v => v?.status === 'in_trip').length,
    issues: (vehicles || []).filter(v => v?.insurance?.status !== 'valid').length,
  };



  if (loading && vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-bold text-ink-3">Scanning Fleet...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-7 pb-12 animate-in slide-in-from-bottom-4 duration-300">
      {showAddModal && <AddVehicleModal onClose={() => setShowAddModal(false)} onSave={addVehicle} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Fleet Management</h1>
          <p className="text-ink-3 font-medium">Vehicles, assignments, mileage and compliance</p>
        </div>
        {role === 'admin' && (
          <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>Add Vehicle</Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Fleet',       value: stats.total,     sub: 'registered vehicles', icon: Truck,        color: 'bg-primary-light text-primary' },
          { label: 'Available Now',      value: stats.available, sub: 'ready to dispatch',   icon: CheckCircle2, color: 'bg-accent-light text-accent'   },
          { label: 'Currently In Trip',  value: stats.inTrip,    sub: 'active assignments',  icon: Clock,        color: 'bg-primary-light/60 text-primary' },
          { label: 'Compliance Issues',  value: stats.issues,    sub: 'need attention',      icon: AlertTriangle,color: 'bg-urgent-light text-urgent'   },
        ].map(s => (
          <Card key={s.label} className={`p-5 flex items-center gap-4 ${s.label === 'Compliance Issues' && stats.issues > 0 ? 'border-urgent/20' : ''}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider leading-none">{s.label}</p>
              <p className="text-3xl font-extrabold text-ink mt-1 leading-none">{s.value}</p>
              <p className="text-[10px] text-ink-4 mt-1">{s.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-line-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-line-2 bg-bg/30">
          <div className="flex items-center gap-1">
            {[
              { id: 'all',       label: 'All Vehicles' },
              { id: 'available', label: 'Available' },
              { id: 'in_trip',   label: 'In Trip' },
              { id: 'issues',    label: `Issues${stats.issues ? ` (${stats.issues})` : ''}` },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setFilter(tab.id); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === tab.id ? 'bg-white shadow-sm text-primary border border-line' : 'text-ink-3 hover:text-ink'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" size={14} />
            <input type="text" placeholder="Search make, plate, ID..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-line rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none"
              value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg/40 border-b border-line-2">
              <tr>
                {['Vehicle', 'Type', 'Status', 'Assigned Driver', 'Mileage', 'Next Service', 'Insurance', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold text-ink-4 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-2">
              {paginated.map(v => {
                const s = statusConfig[v.status] || statusConfig.available;
                const nextServiceDate = v?.nextService ? new Date(v.nextService) : null;
                const nextServiceDays = nextServiceDate ? Math.ceil((nextServiceDate - new Date()) / 86400000) : null;
                const serviceWarning = nextServiceDays !== null && nextServiceDays < 60;

                return (
                  <tr key={v.id} className="hover:bg-bg/40 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bg rounded-xl flex items-center justify-center flex-shrink-0 border border-line-2 group-hover:border-primary/20 overflow-hidden transition-colors relative">
                          {v.image ? (
                            <img src={v.image} alt={v.plate} className="w-full h-full object-cover" />
                          ) : (
                            <Truck size={16} className="text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-ink">{v.year} {v.make} {v.model}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] font-bold text-ink-3">{v.plate}</span>
                            <span className="text-[9px] text-ink-4 font-mono border border-line-2 px-1 rounded">{v.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={typeBadge[v.type] || 'neutral'}>{v.type}</Badge>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        v.status === 'available'   ? 'bg-accent-light text-accent border-accent/20' :
                        v.status === 'in_trip'     ? 'bg-primary-tint/40 text-primary border-primary/20' :
                        v.status === 'break'       ? 'bg-warning-light text-warning-dark border-warning/20' :
                        v.status === 'maintenance' ? 'bg-urgent-light text-urgent border-urgent/20' :
                        'bg-bg text-ink-3 border-line-2'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <AssignDriverCell vehicle={v} allDrivers={drivers} onAssign={handleAssign} role={role} />
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-ink font-mono">{(v?.mileage || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-ink-4">mi · {v?.seats || 0} seats</p>
                    </td>

                    <td className="px-5 py-4">
                      <div className={`flex items-center gap-1.5 ${serviceWarning ? 'text-warning-dark' : 'text-ink-3'}`}>
                        {serviceWarning && <Wrench size={12} className="flex-shrink-0" />}
                        <span className="text-xs font-bold">{v.nextService}</span>
                      </div>
                      {serviceWarning && <p className="text-[10px] font-bold text-warning-dark mt-0.5">Due in {nextServiceDays}d</p>}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={insuranceBadge[v.insurance.status] || 'neutral'} className="capitalize">
                        {v.insurance.status}
                      </Badge>
                      <p className="text-[10px] text-ink-4 mt-1 font-mono">Exp {v.insurance.expires}</p>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleSelectVehicle(v)}
                        className="flex items-center gap-1 text-xs font-bold text-ink-3 hover:text-primary transition-colors whitespace-nowrap"
                      >
                        Details <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <Truck size={32} className="text-line mx-auto mb-3" />
                    <p className="text-sm font-bold text-ink-3">No vehicles match your filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
};

export default Fleet;
