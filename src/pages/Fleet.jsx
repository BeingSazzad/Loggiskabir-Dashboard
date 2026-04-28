import React, { useState } from 'react';
import {
  Truck, User, AlertTriangle, CheckCircle2, Clock,
  Wrench, Shield, Calendar, ChevronDown, Edit2, X, Check, ShieldCheck
} from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../components/UI';
import { vehicles as initialVehicles, drivers } from '../data/mockData';

const VEHICLE_TYPES = ['Ambulatory Van', 'Wheelchair Van', 'Stretcher Van'];

const EMPTY_VEHICLE_FORM = {
  make: '', model: '', year: '',
  plate: '', vin: '',
  type: 'Ambulatory Van', seats: '',
  mileage: '', nextService: '',
  insuranceProvider: '', insurancePolicy: '', insuranceExpiry: '',
};

const AddVehicleModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY_VEHICLE_FORM);
  const [step, setStep] = useState(1); // 1=Details, 2=Compliance

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const steps = ['Details', 'Compliance'];

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-line-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center text-primary">
              <Truck size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-ink">Add New Vehicle</h2>
              <p className="text-[10px] text-ink-4 font-medium">Step {step} of 2 — {steps[step-1]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-ink-4 hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-4 gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${step > i ? 'bg-primary' : 'bg-line-2'}`} />
              <p className={`text-[10px] font-bold mt-1 ${step === i+1 ? 'text-primary' : 'text-ink-4'}`}>{s}</p>
            </div>
          ))}
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Make *</label>
                <input className="input-base w-full" placeholder="Ford" value={form.make} onChange={e => set('make', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Model *</label>
                <input className="input-base w-full" placeholder="Transit" value={form.model} onChange={e => set('model', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Year *</label>
                <input className="input-base w-full" type="number" placeholder="2024" value={form.year} onChange={e => set('year', e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Plate No. *</label>
                <input className="input-base w-full font-mono" placeholder="VA · AAA-0000" value={form.plate} onChange={e => set('plate', e.target.value)} />
              </div>
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
                <div className="space-y-3">
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
              </div>
            </>
          )}
        </div>

        {/* Footer */}
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

const statusConfig = {
  available:  { label: 'Available',  color: 'bg-accent',   dot: 'bg-accent'  },
  in_trip:    { label: 'In Trip',    color: 'bg-primary',  dot: 'bg-primary' },
  break:      { label: 'On Break',   color: 'bg-warning',  dot: 'bg-warning' },
  off_duty:   { label: 'Off Duty',   color: 'bg-ink-4',    dot: 'bg-ink-4'   },
  maintenance:{ label: 'In Service', color: 'bg-urgent',   dot: 'bg-urgent'  },
};

const typeColor = {
  'Ambulatory Van': 'primary',
  'Wheelchair Van': 'accent',
  'Stretcher Van':  'warning',
};

const VehicleCard = ({ vehicle, allDrivers, onAssignDriver }) => {
  const [assigning, setAssigning] = useState(false);
  const assignedDriver = allDrivers.find(d => d.id === vehicle.assignedDriverId);
  const s = statusConfig[vehicle.status] || statusConfig.available;
  const insuranceOk = vehicle.insurance.status === 'valid';
  const nextServiceDays = Math.ceil((new Date(vehicle.nextService) - new Date()) / 86400000);

  return (
    <Card className="p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center">
            <Truck size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-ink">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
            <p className="font-mono text-xs font-bold text-ink-3">{vehicle.plate}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
          <span className="text-xs font-bold text-ink-3">{s.label}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg rounded-lg p-2 text-center">
          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider">Type</p>
          <p className="text-xs font-bold text-ink mt-0.5">{vehicle.type}</p>
        </div>
        <div className="bg-bg rounded-lg p-2 text-center">
          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider">Seats</p>
          <p className="text-xs font-bold text-ink mt-0.5">{vehicle.seats} pax</p>
        </div>
        <div className="bg-bg rounded-lg p-2 text-center">
          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider">Miles</p>
          <p className="text-xs font-bold text-ink mt-0.5">{vehicle.mileage.toLocaleString()}</p>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-1.5">
        {!insuranceOk && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-urgent bg-urgent-light/40 px-2.5 py-1.5 rounded-lg">
            <AlertTriangle size={12} /> Insurance {vehicle.insurance.status} · expires {vehicle.insurance.expires}
          </div>
        )}
        {nextServiceDays < 60 && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-warning-dark bg-warning-light/40 px-2.5 py-1.5 rounded-lg">
            <Wrench size={12} /> Service due in {nextServiceDays} days · {vehicle.nextService}
          </div>
        )}
      </div>

      {/* Driver Assignment */}
      <div className="border-t border-line-2 pt-3">
        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-2">Assigned Driver</p>
        {!assigning ? (
          <div className="flex items-center justify-between">
            {assignedDriver ? (
              <div className="flex items-center gap-2">
                <Avatar initials={assignedDriver.initials} size="xs" online={assignedDriver.onDuty} />
                <div>
                  <p className="text-xs font-bold text-ink">{assignedDriver.name}</p>
                  <p className="text-[10px] text-ink-4">★{assignedDriver.rating} · {assignedDriver.totalTrips} trips</p>
                </div>
              </div>
            ) : (
              <span className="text-xs italic text-ink-4">No driver assigned</span>
            )}
            <button
              onClick={() => setAssigning(true)}
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Edit2 size={11} /> {assignedDriver ? 'Change' : 'Assign'}
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[10px] text-ink-4 font-semibold mb-1.5">Select a driver</p>
            {allDrivers.map(d => (
              <button
                key={d.id}
                onClick={() => { onAssignDriver(vehicle.id, d.id); setAssigning(false); }}
                className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-bg rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Avatar initials={d.initials} size="xs" online={d.onDuty} />
                  <div className="text-left">
                    <p className="text-xs font-bold text-ink">{d.name}</p>
                    <p className="text-[10px] text-ink-4 capitalize">{d.status.replace('_', ' ')}</p>
                  </div>
                </div>
                {vehicle.assignedDriverId === d.id && <Check size={14} className="text-accent" />}
              </button>
            ))}
            <button onClick={() => { onAssignDriver(vehicle.id, null); setAssigning(false); }} className="w-full text-left px-2.5 py-2 text-xs font-bold text-urgent hover:bg-urgent-light/20 rounded-lg transition-colors">
              Remove assignment
            </button>
            <button onClick={() => setAssigning(false)} className="w-full text-xs font-bold text-ink-4 hover:text-ink text-center pt-1 transition-colors">Cancel</button>
          </div>
        )}
      </div>
    </Card>
  );
};

const Fleet = ({ role }) => {
  const [localVehicles, setLocalVehicles] = useState(initialVehicles);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAssignDriver = (vehicleId, driverId) => {
    setLocalVehicles(prev => prev.map(v =>
      v.id === vehicleId ? { ...v, assignedDriverId: driverId } : v
    ));
  };

  const filtered = localVehicles.filter(v => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const counts = {
    available: localVehicles.filter(v => v.status === 'available').length,
    in_trip: localVehicles.filter(v => v.status === 'in_trip').length,
    issues: localVehicles.filter(v => v.insurance.status !== 'valid').length,
  };

  return (
    <div className="space-y-8">
      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log('New vehicle data:', data);
            // TODO: Wire to API POST /vehicles
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Fleet Management</h1>
          <p className="text-ink-3 font-medium">Manage vehicles, assignments, and compliance</p>
        </div>
        {role === 'admin' && (
          <Button variant="primary" size="sm" icon={Truck} onClick={() => setShowAddModal(true)}>Add Vehicle</Button>
        )}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Vehicles', value: localVehicles.length, icon: Truck, color: 'text-primary' },
          { label: 'Available', value: counts.available, icon: CheckCircle2, color: 'text-accent' },
          { label: 'In Trip', value: counts.in_trip, icon: Clock, color: 'text-primary' },
          { label: 'Compliance Issues', value: counts.issues, icon: AlertTriangle, color: 'text-urgent' },
        ].map(stat => (
          <Card key={stat.label} className="p-4 flex items-center gap-4">
            <div className={`${stat.color}`}><stat.icon size={20} /></div>
            <div>
              <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-extrabold text-ink">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 bg-bg p-1 rounded-xl border border-line w-fit">
        {['all', 'available', 'in_trip', 'off_duty'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white shadow-sm text-primary' : 'text-ink-3 hover:text-ink-2'}`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(vehicle => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            allDrivers={drivers}
            onAssignDriver={handleAssignDriver}
          />
        ))}
      </div>
    </div>
  );
};

export default Fleet;
