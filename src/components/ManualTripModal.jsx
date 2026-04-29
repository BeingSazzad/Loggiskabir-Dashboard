import React, { useState } from 'react';
import { Search, X, MapPin, CalendarClock } from 'lucide-react';
import { Avatar, Button } from './UI';

export const ManualTripModal = ({ trips, onClose, onSave }) => {
  const [userType, setUserType] = useState('new');
  const [existingSearch, setExistingSearch] = useState('');
  const [selectedExistingRider, setSelectedExistingRider] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    pickup: '',
    dropoff: '',
    scheduledTime: '',
    returnTime: '',
    willCall: false,
    mobility: 'Ambulatory',
    type: 'one_way',
  });

  const inputClass = "w-full bg-white border border-line rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none";

  // Unique riders from existing trips
  const existingRiders = Array.from(
    new Map(trips.map(t => [t.rider.name, t.rider])).values()
  );

  const filteredRiders = existingSearch
    ? existingRiders.filter(r =>
        r.name.toLowerCase().includes(existingSearch.toLowerCase()) ||
        (r.phone && r.phone.includes(existingSearch))
      )
    : [];

  const selectRider = (rider) => {
    const parts = rider.name.split(' ');
    setForm(prev => ({
      ...prev,
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      phone: rider.phone || '',
    }));
    setSelectedExistingRider(rider);
    setExistingSearch(rider.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === 'existing' && !selectedExistingRider) return;
    const fullName = `${form.firstName} ${form.middleName ? form.middleName + ' ' : ''}${form.lastName}`.trim();
    const initials = form.firstName && form.lastName
      ? form.firstName[0] + form.lastName[0]
      : form.firstName ? form.firstName[0] + (form.firstName[1] || '')
      : 'UN';
      
    onSave({
      ...form,
      id: `LOGISS-${Date.now().toString().slice(-4)}`,
      rider: { name: fullName || 'Unknown Rider', initials: initials.toUpperCase(), phone: form.phone },
      status: 'pending_review',
      submittedTime: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line-2">
          <h3 className="text-lg font-bold text-ink">Manual Booking Entry</h3>
          <button onClick={onClose} className="p-2 hover:bg-bg rounded-lg text-ink-4"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto p-6 scrollbar-hide">
          <div className="flex items-center bg-bg p-1 rounded-xl mb-6">
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${userType === 'new' ? 'bg-white shadow-sm text-ink' : 'text-ink-4 hover:text-ink-2'}`}
              onClick={() => setUserType('new')}
            >
              New Rider
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${userType === 'existing' ? 'bg-white shadow-sm text-ink' : 'text-ink-4 hover:text-ink-2'}`}
              onClick={() => setUserType('existing')}
            >
              Existing Rider
            </button>
          </div>

          <form id="manual-booking-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-ink uppercase tracking-widest border-b border-line-2 pb-2">Rider Information</h4>
              
              {userType === 'existing' ? (
                <div className="space-y-3">
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Search Rider</label>
                    <input
                      className={inputClass}
                      placeholder="Search by name or phone..."
                      value={existingSearch}
                      onChange={e => { setExistingSearch(e.target.value); setSelectedExistingRider(null); }}
                    />
                    <div className="absolute right-4 top-[30px] text-ink-4"><Search size={18} /></div>
                  </div>
                  {existingSearch && !selectedExistingRider && (
                    <div className="border border-line-2 rounded-xl overflow-hidden divide-y divide-line-2 max-h-48 overflow-y-auto">
                      {filteredRiders.length > 0 ? filteredRiders.map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectRider(r)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg transition-colors text-left"
                        >
                          <Avatar initials={r.initials} size="xs" />
                          <div>
                            <p className="text-xs font-bold text-ink">{r.name}</p>
                            <p className="text-[10px] text-ink-4">{r.phone || 'No phone on file'}</p>
                          </div>
                        </button>
                      )) : (
                        <p className="px-4 py-3 text-xs text-ink-4 font-medium">No riders found</p>
                      )}
                    </div>
                  )}
                  {selectedExistingRider && (
                    <div className="flex items-center gap-3 p-3 bg-accent-light/30 rounded-xl border border-accent/20">
                      <Avatar initials={selectedExistingRider.initials} size="xs" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-ink">{selectedExistingRider.name}</p>
                        <p className="text-[10px] text-ink-4">{selectedExistingRider.phone || 'No phone'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setSelectedExistingRider(null); setExistingSearch(''); }}
                        className="text-ink-4 hover:text-urgent transition-colors p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  {!selectedExistingRider && (
                    <p className="text-[10px] text-urgent font-bold">Select a rider before submitting</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">First Name *</label>
                    <input required={userType === 'new'} className={inputClass} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Middle Name</label>
                    <input className={inputClass} value={form.middleName} onChange={e => setForm({ ...form, middleName: e.target.value })} placeholder="Middle (Opt)" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Last Name *</label>
                    <input required={userType === 'new'} className={inputClass} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Phone Number</label>
                    <input className={inputClass} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(804) 555-0000" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-black text-ink uppercase tracking-widest border-b border-line-2 pb-2">Trip Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 relative">
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Pickup Address *</label>
                  <input required className={inputClass} value={form.pickup} onChange={e => setForm({ ...form, pickup: e.target.value })} placeholder="Enter pickup location" />
                  <div className="absolute right-4 top-[26px] text-ink-4"><MapPin size={18} /></div>
                </div>
                <div className="md:col-span-2 relative">
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Dropoff Address *</label>
                  <input required className={inputClass} value={form.dropoff} onChange={e => setForm({ ...form, dropoff: e.target.value })} placeholder="Enter dropoff location" />
                  <div className="absolute right-4 top-[26px] text-ink-4"><MapPin size={18} /></div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Date & Time *</label>
                  <input required type="datetime-local" className={inputClass} value={form.scheduledTime} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} />
                </div>
                <div className="md:col-span-2 mt-2">
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-2">Trip Type</label>
                  <div className="flex items-center bg-bg p-1 rounded-xl w-full border border-line-2">
                    <button 
                      type="button"
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${form.type === 'one_way' ? 'bg-white shadow-sm text-primary ring-1 ring-line' : 'text-ink-4 hover:text-ink-2'}`}
                      onClick={() => setForm({ ...form, type: 'one_way' })}
                    >
                      One Way
                    </button>
                    <button 
                      type="button"
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${form.type === 'round_trip' ? 'bg-white shadow-sm text-primary ring-1 ring-line' : 'text-ink-4 hover:text-ink-2'}`}
                      onClick={() => setForm({ ...form, type: 'round_trip' })}
                    >
                      Round Trip
                    </button>
                  </div>
                </div>

                {form.type === 'round_trip' && (
                  <div className="md:col-span-2 mt-2 p-4 bg-bg rounded-xl border border-line-2 space-y-4 animate-in slide-in-from-top-2">
                    <h4 className="text-[10px] font-black text-ink uppercase tracking-widest flex items-center gap-2">
                      <CalendarClock size={12} className="text-primary" /> Return Schedule
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div>
                        <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Return Time</label>
                        <input 
                          type="datetime-local" 
                          className={`${inputClass} disabled:opacity-50 disabled:bg-line-2 disabled:cursor-not-allowed`}
                          value={form.returnTime} 
                          onChange={e => setForm({ ...form, returnTime: e.target.value })} 
                          disabled={form.willCall}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white border border-line-2 rounded-xl">
                        <div className="flex-1 pr-3">
                          <p className="text-sm font-bold text-ink">Will Call Return</p>
                          <p className="text-[10px] font-medium text-ink-4 leading-tight mt-0.5">Driver will return when passenger is ready</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, willCall: !form.willCall, returnTime: '' })}
                          className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${form.willCall ? 'bg-primary' : 'bg-line-2'}`}
                        >
                          <span className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all shadow-sm ${form.willCall ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Mobility Requirements</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Ambulatory', 'Wheelchair', 'Stretcher', 'Cane'].map(m => (
                      <div 
                        key={m}
                        onClick={() => setForm({ ...form, mobility: m })}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${form.mobility === m ? 'border-primary bg-primary-tint/10 text-primary ring-1 ring-primary' : 'border-line hover:border-line-2 bg-white text-ink-3'}`}
                      >
                        <span className="text-xs font-bold">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-line-2 bg-bg flex gap-3 mt-auto shrink-0 rounded-b-2xl">
          <Button variant="ghost" className="flex-1 bg-white border border-line" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="manual-booking-form" className="flex-1">Create Booking</Button>
        </div>
      </div>
    </div>
  );
};
