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
  const [step, setStep] = useState(1); // 1=Personal, 2=Documents, 3=Vehicle

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const toggleCounty = (county) => set('counties', form.counties.includes(county)
    ? form.counties.filter(c => c !== county)
    : [...form.counties, county]);

  const steps = ['Personal', 'Documents', 'Vehicle'];

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
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

        {/* Footer */}
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
  const [selectedDriverId, setSelectedDriverId] = useState('DRV-2024-8421');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  return (
    <div className="flex flex-col gap-6">
      {showAddModal && (
        <AddDriverModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log('New driver data:', data);
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Drivers</h1>
          <p className="text-ink-3 font-medium">Manage driver accounts and compliance</p>
        </div>
        {role === 'admin' && (
          <Button variant="primary" icon={UserPlus} onClick={() => setShowAddModal(true)}>Create Driver Account</Button>
        )}
      </div>

      <div className="flex items-center gap-1 border-b border-line-2">
        {['all', 'on_duty', 'off_duty', 'attention'].map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
          >
            {tab.replace('_', ' ')}
            {tab === 'attention' && drivers.some(d => d.pendingDocUpdates > 0) && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-urgent-light text-urgent text-[10px]">1</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2">
          {paginatedDrivers.map(driver => (
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
          <div className="mt-4">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredDrivers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Right Column: Detail */}
        <div className="lg:col-span-7 overflow-y-auto pr-2">
          {selectedDriver ? (
            <Card className="overflow-hidden">
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

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-bg rounded-xl p-4 border border-line-2 text-center">
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Today's Trips</p>
                    <p className="text-lg font-bold text-ink">{selectedDriver.tripsToday}</p>
                  </div>
                  <div className="bg-bg rounded-xl p-4 border border-line-2 text-center">
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Completed</p>
                    <p className="text-lg font-bold text-accent">{selectedDriver.completedToday}</p>
                  </div>
                  <div className="bg-bg rounded-xl p-4 border border-line-2 text-center">
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Total Trips</p>
                    <p className="text-lg font-bold text-ink">{selectedDriver.totalTrips.toLocaleString()}</p>
                  </div>
                </div>

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


