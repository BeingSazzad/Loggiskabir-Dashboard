import React, { useState } from 'react';
import { 
  Plus, Search, Phone, Mail, Car, MapPin, ShieldCheck,
  CalendarClock, AlertTriangle, Star, ChevronRight, ExternalLink,
  X, UserPlus, Truck, FileCheck
} from 'lucide-react';
import { Card, Avatar, Badge, Button, Pagination } from '../components/UI';
import { drivers } from '../data/mockData';

const COUNTIES = ['Chesterfield', 'Henrico', 'Richmond City', 'Hanover', 'Goochland', 'Powhatan'];
const VEHICLE_TYPES = ['Ambulatory Van', 'Wheelchair Van', 'Stretcher Van'];

const EMPTY_FORM = {
  name: '', email: '', phone: '',
  licenseNumber: '', licenseExpiry: '',
  insurancePolicy: '', insuranceExpiry: '',
  certNumber: '', certExpiry: '',
  vehicleMake: '', vehicleModel: '', vehicleYear: '',
  vehiclePlate: '', vehicleColor: '', vehicleType: 'Ambulatory Van',
  counties: [],
};

const AddDriverModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [step, setStep] = useState(1); 

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleCounty = (county) => set('counties', form.counties.includes(county)
    ? form.counties.filter(c => c !== county)
    : [...form.counties, county]);

  const steps = ['Personal', 'Documents', 'Vehicle'];

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-line-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center text-primary">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-ink">Create Driver Account</h2>
              <p className="text-[10px] text-ink-4 font-medium">Step {step} of 3 — {steps[step-1]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg text-ink-4 hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex px-6 pt-4 gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${step > i ? 'bg-primary' : 'bg-line-2'}`} />
              <p className={`text-[10px] font-bold mt-1 ${step === i+1 ? 'text-primary' : 'text-ink-4'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input className="input-base w-full" placeholder="David Wilson" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Email *</label>
                  <input className="input-base w-full" type="email" placeholder="driver@logiss.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Phone *</label>
                  <input className="input-base w-full" placeholder="(804) 555-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-2">Service Counties *</label>
                <div className="flex flex-wrap gap-2">
                  {COUNTIES.map(c => (
                    <button
                      key={c} type="button"
                      onClick={() => toggleCounty(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${form.counties.includes(c) ? 'bg-primary text-white border-primary' : 'bg-bg text-ink-3 border-line hover:border-primary/40'}`}
                    >{c}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-bg rounded-xl p-4 border border-line-2 space-y-4">
                <p className="text-xs font-extrabold text-ink flex items-center gap-2"><ShieldCheck size={14} className="text-accent" /> Driver License</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">License No. *</label>
                    <input className="input-base w-full" placeholder="DL-VA-00000" value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Expiry Date *</label>
                    <input className="input-base w-full" type="date" value={form.licenseExpiry} onChange={e => set('licenseExpiry', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="bg-bg rounded-xl p-4 border border-line-2 space-y-4">
                <p className="text-xs font-extrabold text-ink flex items-center gap-2"><FileCheck size={14} className="text-primary" /> Commercial Insurance</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Policy No. *</label>
                    <input className="input-base w-full" placeholder="INS-00000" value={form.insurancePolicy} onChange={e => set('insurancePolicy', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Expiry Date *</label>
                    <input className="input-base w-full" type="date" value={form.insuranceExpiry} onChange={e => set('insuranceExpiry', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="bg-bg rounded-xl p-4 border border-line-2 space-y-4">
                <p className="text-xs font-extrabold text-ink flex items-center gap-2"><Star size={14} className="text-warning" /> NEMT Certification</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Cert No. *</label>
                    <input className="input-base w-full" placeholder="NEMT-VA-00000" value={form.certNumber} onChange={e => set('certNumber', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Expiry Date *</label>
                    <input className="input-base w-full" type="date" value={form.certExpiry} onChange={e => set('certExpiry', e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Make *</label>
                  <input className="input-base w-full" placeholder="Ford" value={form.vehicleMake} onChange={e => set('vehicleMake', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Model *</label>
                  <input className="input-base w-full" placeholder="Transit" value={form.vehicleModel} onChange={e => set('vehicleModel', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Year *</label>
                  <input className="input-base w-full" type="number" placeholder="2023" value={form.vehicleYear} onChange={e => set('vehicleYear', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Plate No. *</label>
                  <input className="input-base w-full font-mono" placeholder="VA · 0AA-0000" value={form.vehiclePlate} onChange={e => set('vehiclePlate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Color</label>
                  <input className="input-base w-full" placeholder="White" value={form.vehicleColor} onChange={e => set('vehicleColor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5">Vehicle Type *</label>
                  <select className="input-base w-full" value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
                    {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="bg-primary-tint/30 border border-primary/10 rounded-xl p-4">
                <p className="text-xs font-bold text-ink mb-1">⚠️ Note</p>
                <p className="text-xs text-ink-3">The new driver will receive an email invitation to set up their password. Their account will be inactive until they complete onboarding.</p>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-line-2 flex items-center justify-between">
          <button onClick={onClose} className="text-sm font-bold text-ink-4 hover:text-ink transition-colors">Cancel</button>
          <div className="flex gap-3">
            {step > 1 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>← Back</Button>}
            {step < 3
              ? <Button variant="primary" onClick={() => setStep(s => s + 1)}>Continue →</Button>
              : <Button variant="primary" icon={UserPlus} onClick={() => { onSave(form); onClose(); }}>Create Account</Button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const Drivers = ({ role }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    let matchesTab = true;
    if (activeTab === 'on_duty') matchesTab = d.onDuty;
    if (activeTab === 'off_duty') matchesTab = !d.onDuty;
    if (activeTab === 'attention') matchesTab = d.pendingDocUpdates > 0;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredDrivers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  if (selectedDriver) {
    return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300 pb-12">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedDriverId(null)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-ink-3 hover:text-ink hover:bg-white rounded-xl transition-all shadow-sm border border-line-2 bg-bg"
          >
            ← Back to Drivers List
          </button>
          <div className="flex gap-3">
            <Button variant="outline" icon={Phone}>Call</Button>
            <Button variant="outline" icon={Mail}>Email</Button>
            {role === 'admin' && <Button variant="primary">Edit Driver</Button>}
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark p-8 h-40 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-xl">
                <Avatar initials={selectedDriver.initials} size="full" shape="square" className="rounded-xl overflow-hidden" />
              </div>
            </div>
          </div>

          <div className="pt-14 px-8 pb-8 space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-extrabold font-display text-ink leading-tight">{selectedDriver.name}</h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-mono text-sm font-bold text-ink-4 tracking-tight uppercase">{selectedDriver.id}</span>
                  <span className="text-sm text-ink-3">Member since 2022</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="flex items-center gap-1.5 text-xl font-bold text-warning">
                  <Star size={20} fill="currentColor" />
                  {selectedDriver.rating}
                </span>
                {selectedDriver.onDuty && <Badge variant="accent" dot>On Duty</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-bg rounded-xl p-5 border border-line-2 text-center">
                <p className="text-xs font-bold text-ink-4 uppercase tracking-wider mb-1">Today's Trips</p>
                <p className="text-2xl font-extrabold text-ink">{selectedDriver.tripsToday}</p>
              </div>
              <div className="bg-bg rounded-xl p-5 border border-line-2 text-center">
                <p className="text-xs font-bold text-ink-4 uppercase tracking-wider mb-1">Completed</p>
                <p className="text-2xl font-extrabold text-accent">{selectedDriver.completedToday}</p>
              </div>
              <div className="bg-bg rounded-xl p-5 border border-line-2 text-center">
                <p className="text-xs font-bold text-ink-4 uppercase tracking-wider mb-1">Total Trips</p>
                <p className="text-2xl font-extrabold text-ink">{selectedDriver.totalTrips.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <section>
                  <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-bg rounded-xl border border-line-2">
                      <div className="p-2.5 bg-white rounded-lg text-ink-3 shadow-sm"><Phone size={18} /></div>
                      <span className="text-base font-bold text-ink">{selectedDriver.phone}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-bg rounded-xl border border-line-2">
                      <div className="p-2.5 bg-white rounded-lg text-ink-3 shadow-sm"><Mail size={18} /></div>
                      <span className="text-base font-bold text-ink">{selectedDriver.email}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-4">Service Counties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDriver.counties.map(county => (
                      <div key={county} className="flex items-center gap-2 px-4 py-2 bg-bg rounded-full border border-line-2 text-xs font-bold text-ink-2">
                        <MapPin size={14} className="text-ink-4" />
                        {county}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-4">Vehicle Assignment</h4>
                  <Card className="p-5 flex items-center gap-5 bg-tint/10 border-primary/10">
                    <div className="p-3.5 bg-primary-light text-primary rounded-xl"><Car size={28} /></div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-ink">{selectedDriver.vehicle.color} {selectedDriver.vehicle.make}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="font-mono text-sm font-bold text-ink-3 tracking-tighter uppercase">{selectedDriver.vehicle.plate}</span>
                        <Badge variant="neutral">{selectedDriver.vehicle.type}</Badge>
                      </div>
                    </div>
                  </Card>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-4">Documents & Compliance</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Driver License', data: selectedDriver.license },
                      { label: 'Commercial Insurance', data: selectedDriver.insurance },
                      { label: 'NEMT Certification', data: selectedDriver.cert }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-bg rounded-xl border border-line-2">
                        <div className="flex items-center gap-4">
                          {doc.data.status === 'valid' ? <ShieldCheck size={20} className="text-accent" /> : (doc.data.status === 'expiring' ? <CalendarClock size={20} className="text-warning" /> : <AlertTriangle size={20} className="text-urgent" />)}
                          <div>
                            <p className="text-sm font-bold text-ink">{doc.label}</p>
                            <p className="text-xs font-mono text-ink-4 uppercase tracking-tighter mt-0.5">{doc.data.number} · Exp {doc.data.expires}</p>
                          </div>
                        </div>
                        <Badge variant={doc.data.status === 'valid' ? 'accent' : (doc.data.status === 'expiring' ? 'warning' : 'urgent')}>
                          {doc.data.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300 pb-12">
      {showAddModal && (
        <AddDriverModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => { console.log('New driver data:', data); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Drivers</h1>
          <p className="text-ink-3 font-medium">Manage driver accounts and compliance</p>
        </div>
        {role === 'admin' && (
          <Button variant="primary" icon={UserPlus} onClick={() => setShowAddModal(true)}>Create Driver Account</Button>
        )}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Drivers',  value: drivers.length,                                          sub: 'registered accounts',  icon: Users,       color: 'bg-primary-light text-primary' },
          { label: 'On Duty',        value: drivers.filter(d => d.onDuty).length,                    sub: 'currently active',     icon: Car,         color: 'bg-accent-light text-accent'   },
          { label: 'In Trip',        value: drivers.filter(d => d.status === 'in_trip').length,      sub: 'on the road now',      icon: Truck,       color: 'bg-primary-light/60 text-primary' },
          { label: 'Needs Attention',value: drivers.filter(d => d.pendingDocUpdates > 0).length,     sub: 'document issues',      icon: AlertTriangle,color: 'bg-urgent-light text-urgent'  },
        ].map(s => (
          <Card key={s.label} className={`p-5 flex items-center gap-4 ${s.label === 'Needs Attention' && s.value > 0 ? 'border-urgent/20' : ''}`}>
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

      {/* Table Card */}
      <Card className="overflow-hidden border-line-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-line-2 bg-bg/30">
          <div className="flex items-center gap-1">
            {[
              { id: 'all',       label: 'All Drivers' },
              { id: 'on_duty',   label: 'On Duty' },
              { id: 'off_duty',  label: 'Off Duty' },
              { id: 'attention', label: `Needs Attention${drivers.some(d => d.pendingDocUpdates > 0) ? ' (1)' : ''}` },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-primary border border-line' : 'text-ink-3 hover:text-ink'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" size={14} />
            <input type="text" placeholder="Search name, ID..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-line rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none"
              value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg/40 border-b border-line-2">
              <tr>
                {['Driver', 'Driver ID', 'Status', 'Vehicle', 'Rating', 'Today', 'Total Trips', 'Contact', 'Docs', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold text-ink-4 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-2">
              {paginatedDrivers.map(driver => (
                <tr key={driver.id} className="hover:bg-bg/40 transition-colors group cursor-pointer" onClick={() => setSelectedDriverId(driver.id)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <Avatar initials={driver.initials} size="sm" />
                        {driver.onDuty && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-white"></span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-ink truncate">{driver.name}</p>
                        <p className="text-[10px] font-medium text-ink-4 truncate">{driver.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-[11px] font-bold text-ink-3 uppercase">{driver.id}</span>
                  </td>
                  <td className="px-5 py-4">{getStatusBadge(driver.status)}</td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold text-ink whitespace-nowrap">{driver.vehicle.make}</p>
                    <p className="font-mono text-[10px] text-ink-4 uppercase">{driver.vehicle.plate}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-xs font-bold text-warning">
                      <Star size={12} fill="currentColor" /> {driver.rating}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-ink">{driver.tripsToday}</span>
                    <span className="text-ink-4 text-[10px]"> / {driver.completedToday}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-ink">{driver.totalTrips.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-ink-3 whitespace-nowrap">{driver.phone}</span>
                  </td>
                  <td className="px-5 py-4">
                    {driver.pendingDocUpdates > 0 ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-urgent bg-urgent-light px-2 py-1 rounded-full w-fit whitespace-nowrap">
                        <AlertTriangle size={10} /> Attention
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent-light px-2 py-1 rounded-full w-fit whitespace-nowrap">
                        <ShieldCheck size={10} /> OK
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ChevronRight size={16} className="text-ink-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              ))}
              {paginatedDrivers.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center text-ink-4">
                    <Search size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-bold text-ink-3">No drivers match your filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredDrivers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
};

export default Drivers;
