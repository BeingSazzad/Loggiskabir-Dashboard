import React, { useState } from 'react';
import {
  Truck, User, AlertTriangle, CheckCircle2, Clock,
  Wrench, Shield, Calendar, ChevronDown, Edit2, X, Check
} from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../components/UI';
import { vehicles as initialVehicles, drivers } from '../data/mockData';

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

const Fleet = () => {
  const [localVehicles, setLocalVehicles] = useState(initialVehicles);
  const [filter, setFilter] = useState('all');

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Fleet Management</h1>
          <p className="text-ink-3 font-medium">Manage vehicles, assignments, and compliance</p>
        </div>
        <Button variant="primary" size="sm" icon={Truck}>Add Vehicle</Button>
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
