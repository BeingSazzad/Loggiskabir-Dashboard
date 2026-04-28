import React, { useState } from 'react';
import {
  Search,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  CheckCircle2,
  XCircle,
  User,
  Users,
  Calendar,
  AlertCircle,
  Truck,
  Star,
  AlertTriangle,
  Edit2,
  Plus,
  X,
  ArrowRight,
  MoveRight,
  Repeat,
  Check,
  Eye,
  RefreshCcw,
  Trash2,
  MoreVertical,
  Maximize2,
  ExternalLink,
  AlertOctagon
} from 'lucide-react';
import { Card, Avatar, Badge, Button, TripStatusBadge, Pagination } from '../components/UI';
import { trips, drivers } from '../data/mockData';
import { formatTime, formatDateTime, formatShortDate, timeAgo, tripTypeLabel, money } from '../utils/helpers';
import { CancelTripModal } from './Reports';

// Helper: check if two time windows overlap (within 1.5 hours either side)
const hasTimeConflict = (existingTrip, candidateTime) => {
  if (!existingTrip.scheduledTime || !candidateTime) return false;
  const existing = new Date(existingTrip.scheduledTime).getTime();
  const candidate = new Date(candidateTime).getTime();
  const BUFFER_MS = 90 * 60 * 1000; // 1.5 hour buffer
  return Math.abs(existing - candidate) < BUFFER_MS;
};

// Helper: check if driver vehicle type matches trip mobility need
const isVehicleMatch = (driver, booking) => {
  if (!booking?.mobility) return false;
  const need = booking.mobility.toLowerCase();
  const type = driver.vehicle?.type?.toLowerCase() || '';
  if (need === 'wheelchair' || need === 'stretcher') return type.includes(need.split(' ')[0]);
  return true; // ambulatory / cane can use any van
};

const ManualTripModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    riderName: '',
    phone: '',
    pickup: '',
    dropoff: '',
    scheduledTime: '',
    mobility: 'Ambulatory',
    type: 'one_way',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      id: `LOGISS-${Math.floor(1000 + Math.random() * 9000)}`,
      rider: { name: form.riderName, initials: form.riderName.split(' ').map(n => n[0]).join(''), phone: form.phone },
      status: 'pending_review',
      submittedTime: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line-2">
          <h3 className="text-lg font-bold text-ink">New Manual Trip Entry</h3>
          <button onClick={onClose} className="p-2 hover:bg-bg rounded-lg text-ink-4"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Rider Name</label>
              <input required className="input-base w-full" value={form.riderName} onChange={e => setForm({ ...form, riderName: e.target.value })} placeholder="Full Name" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Phone</label>
              <input className="input-base w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(804) 555-0000" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Mobility</label>
              <select className="input-base w-full" value={form.mobility} onChange={e => setForm({ ...form, mobility: e.target.value })}>
                <option>Ambulatory</option>
                <option>Wheelchair</option>
                <option>Stretcher</option>
                <option>Cane</option>
              </select>
            </div>
            <div className="col-span-2 relative">
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Pickup Address</label>
              <input required className="input-base w-full" value={form.pickup} onChange={e => setForm({ ...form, pickup: e.target.value })} placeholder="Type to search address..." />
              <div className="absolute right-3 top-8 text-ink-4"><Search size={14} /></div>
            </div>
            <div className="col-span-2 relative">
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Dropoff Address</label>
              <input required className="input-base w-full" value={form.dropoff} onChange={e => setForm({ ...form, dropoff: e.target.value })} placeholder="Type to search address..." />
              <div className="absolute right-3 top-8 text-ink-4"><Search size={14} /></div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Scheduled Date & Time</label>
              <input required type="datetime-local" className="input-base w-full" value={form.scheduledTime} onChange={e => setForm({ ...form, scheduledTime: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1">Trip Type</label>
              <select className="input-base w-full" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="one_way">One Way</option>
                <option value="round_trip">Round Trip</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" className="flex-1">Create Booking</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Bookings = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [localTrips, setLocalTrips] = useState(trips);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredTrips = localTrips.filter(t => {
    if (activeTab === 'pending') return t.status === 'pending_review';
    if (activeTab === 'unassigned') return t.status === 'confirmed';
    return false;
  });

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedBookings = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleBulkAction = (action) => {
    if (action === 'approve') {
      setLocalTrips(prev => prev.map(t => selectedTrips.includes(t.id) ? { ...t, status: 'confirmed' } : t));
    } else if (action === 'cancel') {
      setLocalTrips(prev => prev.map(t => selectedTrips.includes(t.id) ? { ...t, status: 'cancelled' } : t));
    }
    setSelectedTrips([]);
  };

  const toggleSelectAll = () => {
    if (selectedTrips.length === filteredTrips.length && filteredTrips.length > 0) {
      setSelectedTrips([]);
    } else {
      setSelectedTrips(filteredTrips.map(t => t.id));
    }
  };

  const toggleSelectTrip = (id) => {
    setSelectedTrips(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleAssign = (driverId) => {
    setLocalTrips(prev => prev.map(t => t.id === selectedBookingId ? { ...t, driverId, status: 'confirmed' } : t));
    setIsAssigning(false);
  };

  const handleDispatch = () => {
    setLocalTrips(prev => prev.map(t => t.id === selectedBookingId ? { ...t, status: 'dispatched' } : t));
    setSelectedBookingId(null);
  };

  const handleReject = () => {
    setShowCancelModal(true);
  };

  const handleApprove = () => {
    setLocalTrips(prev => prev.map(t => t.id === selectedBookingId ? { ...t, status: 'confirmed' } : t));
  };

  const selectedBooking = selectedBookingId ? localTrips.find(t => t.id === selectedBookingId) : null;
  const assignedDriver = selectedBooking?.driverId ? drivers.find(d => d.id === selectedBooking.driverId) : null;
  const smartDrivers = drivers.filter(d => d.onDuty && isVehicleMatch(d, selectedBooking));

  return (
    <div className="flex flex-col gap-6">
      {showManualModal && (
        <ManualTripModal
          onClose={() => setShowManualModal(false)}
          onSave={(newTrip) => setLocalTrips([newTrip, ...localTrips])}
        />
      )}

      {showCancelModal && (
        <CancelTripModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={(reason) => {
            setLocalTrips(prev => prev.map(t => t.id === selectedBookingId ? { ...t, status: 'cancelled', cancelReason: reason } : t));
            setShowCancelModal(false);
            setSelectedBookingId(null);
          }}
        />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Bookings</h1>
          <p className="text-ink-3 font-medium">Manage and process medical transportation requests</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" icon={Plus} onClick={() => setShowManualModal(true)}>Manual Booking</Button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-line-2">
        {['pending', 'unassigned'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
          >
            {tab === 'pending' ? 'Pending Review' : tab}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-primary-light text-primary' : 'bg-bg text-ink-4'}`}>
              {localTrips.filter(t => 
                tab === 'pending' ? t.status === 'pending_review' : 
                t.status === 'confirmed'
              ).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 flex flex-col gap-4 overflow-y-auto pr-2 min-h-[500px]">
          {filteredTrips.length > 0 ? (
            <div className="bg-white border border-line-2 rounded-xl overflow-hidden flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-bg border-b border-line-2">
                  <tr>
                    <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedTrips.length === filteredTrips.length && filteredTrips.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-line text-primary focus:ring-primary/20 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Trip ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Rider</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Route</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Cost</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Scheduled</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2 bg-white">
                  {paginatedBookings.map(booking => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBookingId(booking.id)}
                      className={`cursor-pointer transition-colors group ${selectedBookingId === booking.id ? 'bg-primary-tint/20' : 'hover:bg-bg'} ${selectedTrips.includes(booking.id) ? 'bg-accent-light/10' : ''}`}
                    >
                      <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedTrips.includes(booking.id)}
                          onChange={() => toggleSelectTrip(booking.id)}
                          className="w-4 h-4 rounded border-line text-primary focus:ring-primary/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-ink uppercase">#{booking.id}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <Avatar initials={booking.rider.initials} size="xs" />
                          <span className="text-sm font-extrabold text-ink leading-tight">{booking.rider.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-0.5 relative pl-4">
                          <div className="absolute left-[5px] top-[7px] bottom-[7px] w-0.5 bg-line-2"></div>
                          <div className="flex items-center gap-2 text-xs font-bold text-ink relative">
                            <div className="absolute -left-[14px] w-2 h-2 rounded-full bg-primary border-2 border-white shadow-sm"></div>
                            <span className="truncate max-w-[150px] leading-tight">{booking.pickup}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-ink-3 relative mt-2">
                            <div className="absolute -left-[14px] w-2 h-2 rounded-full bg-urgent border-2 border-white shadow-sm"></div>
                            <span className="truncate max-w-[150px] leading-tight">{booking.dropoff}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <Badge variant="primary" className="w-fit">{booking.mobility}</Badge>
                          {booking.type === 'round_trip' ? (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 w-fit">
                              <Repeat size={10} strokeWidth={3} />
                              <span className="text-[9px] font-black uppercase tracking-tight">Round</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 w-fit">
                              <MoveRight size={10} strokeWidth={3} />
                              <span className="text-[9px] font-black uppercase tracking-tight">O/W</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-black font-mono text-ink">{money(booking.cost)}</span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-ink">{formatShortDate(booking.scheduledTime)}</span>
                          <span className="text-[10px] font-semibold text-ink-3 mt-0.5">{formatTime(booking.scheduledTime)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 transition-opacity">
                          {activeTab === 'pending' && (
                            <>
                              <button 
                                className="p-2 text-accent hover:bg-accent-light rounded-xl transition-all hover:scale-110 active:scale-95"
                                title="Approve"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocalTrips(prev => prev.map(t => t.id === booking.id ? { ...t, status: 'confirmed' } : t));
                                }}
                              >
                                <Check size={18} />
                              </button>
                              <button 
                                className="p-2 text-urgent hover:bg-urgent-light rounded-xl transition-all hover:scale-110 active:scale-95"
                                title="Reject"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBookingId(booking.id);
                                  setShowCancelModal(true);
                                }}
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}

                          {activeTab === 'unassigned' && (
                            <button 
                              className="p-2 text-primary hover:bg-primary-light rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center gap-1.5 px-3"
                              title="Assign Driver"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBookingId(booking.id);
                                setIsAssigning(true);
                              }}
                            >
                              <Users size={16} />
                              <span className="text-[10px] font-bold uppercase">Assign Driver</span>
                            </button>
                          )}
                          <button 
                            className="px-4 py-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-primary/20 rounded-lg transition-all active:scale-95 ml-2 whitespace-nowrap"
                            onClick={() => setSelectedBookingId(booking.id)}
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTrips.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-ink-4 border border-line-2 rounded-xl bg-white">
              <CheckCircle2 size={48} className="mb-4 opacity-20" />
              <p className="font-bold">All caught up!</p>
              <p className="text-sm">No bookings in this category.</p>
            </div>
          )}
        </div>
      </div>

      {selectedTrips.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-ink text-white px-8 py-5 rounded-[2.5rem] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.4)] flex items-center gap-10 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-black text-lg">
                {selectedTrips.length}
              </div>
              <div>
                <p className="text-sm font-black leading-none">Trips Selected</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">Ready for mass action</p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-white/10"></div>

            <div className="flex items-center gap-4">
              <Button 
                variant="primary" 
                size="md" 
                icon={Check} 
                className="bg-accent hover:bg-accent-dark border-none px-6"
                onClick={() => handleBulkAction('approve')}
              >
                Approve All
              </Button>
              <Button 
                variant="outline" 
                size="md" 
                icon={Trash2} 
                className="border-white/20 text-white hover:bg-white/10 px-6"
                onClick={() => handleBulkAction('cancel')}
              >
                Cancel All
              </Button>
              <button 
                onClick={() => setSelectedTrips([])}
                className="text-xs font-bold text-white/40 hover:text-white transition-colors ml-4"
              >
                Deselect
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBookingId && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedBookingId(null)}></div>
          <div className="relative w-full max-w-lg bg-white shadow-2xl h-full animate-in slide-in-from-right duration-300">
            {selectedBooking ? (
              <Card className="h-full flex flex-col sticky top-0 max-h-full overflow-hidden">
                <div className="px-5 py-4 border-b border-line-2 flex items-center justify-between bg-white">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-bold text-ink-4">#{selectedBooking.id}</span>
                      <TripStatusBadge status={selectedBooking.status} />
                    </div>
                    <h2 className="text-base font-bold text-ink">Booking Details</h2>
                  </div>
                  <button
                    onClick={() => setSelectedBookingId(null)}
                    className="p-1.5 hover:bg-bg rounded-lg text-ink-4 hover:text-ink transition-colors"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
                <div className={`px-6 py-3 border-b flex items-center gap-3 shrink-0 ${
                  !selectedBooking.driverId ? (activeTab === 'unassigned' ? 'bg-primary-light/30 border-primary/10' : 'bg-warning-light/30 border-warning/10') : 
                  assignedDriver?.hasConflict || (selectedBooking.mobility === 'Wheelchair' && assignedDriver?.vehicle.type === 'Standard') ? 'bg-urgent-light/30 border-urgent/10' : 
                  'bg-accent-light/20 border-accent/10'
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    !selectedBooking.driverId ? (activeTab === 'unassigned' ? 'bg-primary' : 'bg-warning') : 
                    assignedDriver?.hasConflict || (selectedBooking.mobility === 'Wheelchair' && assignedDriver?.vehicle.type === 'Standard') ? 'bg-urgent' : 
                    'bg-accent'
                  }`}></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-2">
                    {!selectedBooking.driverId ? (activeTab === 'unassigned' ? 'Assignment Required: Select a Driver' : 'Review Required: Process Request') : 
                     assignedDriver?.hasConflict ? 'Conflict Detected: Driver Busy' : 
                     (selectedBooking.mobility === 'Wheelchair' && assignedDriver?.vehicle.type === 'Standard') ? 'Equipment Mismatch: Vehicle is Standard' :
                     'Verified: Ready for Dispatch'}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {selectedBooking.id === 'LOGISS-2856' && (
                    <div className="bg-urgent-light/40 p-4 rounded-2xl border border-urgent/20 animate-in slide-in-from-top-4 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-urgent">
                          <AlertOctagon size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Active Incident Report</span>
                        </div>
                        <Badge variant="urgent">High Priority</Badge>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-urgent/5">
                        <div className="flex -space-x-2">
                          <Avatar initials="DW" size="xs" className="ring-2 ring-white" />
                          <div className="w-6 h-6 rounded-full bg-bg flex items-center justify-center ring-2 ring-white text-[10px] font-bold">VS</div>
                          <Avatar initials="TW" size="xs" className="ring-2 ring-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-ink">Driver vs Rider Conflict</p>
                          <p className="text-[9px] text-ink-3 font-medium">Issue: Rider behavior issue</p>
                        </div>
                        <Button variant="ghost" size="xs" icon={ChevronRight} onClick={() => setPage('reports')} />
                      </div>
                    </div>
                  )}
                  <section className="bg-bg rounded-xl p-4 border border-line-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={selectedBooking.rider.initials} size="md" />
                        <div>
                          <h3 className="text-sm font-bold text-ink">{selectedBooking.rider.name}</h3>
                          <p className="text-xs text-ink-3">{selectedBooking.rider.age} yrs · {selectedBooking.rider.phone || '(804) 555-0142'}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" icon={Phone}>Call</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Pickup Time</p>
                        <p className="text-xs font-bold text-ink">{formatDateTime(selectedBooking.scheduledTime)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Appointment</p>
                        <p className="text-xs font-bold text-primary">{selectedBooking.appointmentTime || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Trip Type</p>
                        <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                          {tripTypeLabel(selectedBooking.type)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Passengers</p>
                        <p className="text-xs font-bold text-ink">{selectedBooking.passengers || 1} · {selectedBooking.mobility}</p>
                      </div>
                    </div>
                  </section>
                  <section>
                    <p className="text-[10px] font-bold text-ink-4 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <Navigation size={11} className="text-primary" /> Trip Route
                    </p>
                    <div className="bg-bg rounded-xl p-4 border border-line-2 relative">
                      <div className="flex gap-3 relative z-10 mb-5">
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 border-2 border-primary shadow-sm mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Pickup</p>
                          <p className="text-xs font-bold text-ink leading-snug">{selectedBooking.pickup}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 relative z-10">
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 border-2 border-urgent-light shadow-sm mt-0.5">
                          <MapPin size={10} className="text-urgent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Drop-off</p>
                          <p className="text-xs font-bold text-ink leading-snug">{selectedBooking.dropoff}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-widest flex items-center gap-1.5">
                        <Users size={11} className="text-primary" /> Driver Assignment
                      </p>
                    </div>
                    {assignedDriver && !isAssigning ? (
                      <div className="border border-accent/20 bg-accent-light/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar initials={assignedDriver.initials} size="sm" online={assignedDriver.onDuty} />
                            <div 
                              className="cursor-pointer group"
                              onClick={() => setPage('drivers')}
                            >
                              <p className="text-sm font-bold text-ink group-hover:text-primary transition-colors flex items-center gap-1">
                                {assignedDriver.name}
                                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </p>
                              <p className="text-[10px] text-ink-3">{assignedDriver.phone}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsAssigning(true)}
                            className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                          >
                            <Edit2 size={10} /> Change
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-line-2">
                          <div>
                            <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Vehicle</p>
                            <p className="text-xs font-bold text-ink">{assignedDriver.vehicle.type}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Plate</p>
                            <p className="text-xs font-bold font-mono text-ink">{assignedDriver.vehicle.plate}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Rating</p>
                            <p className="text-xs font-bold text-ink">★ {assignedDriver.rating}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-0.5">Total Trips</p>
                            <p className="text-xs font-bold text-ink">{assignedDriver.totalTrips.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ) : !isAssigning ? (
                      <div
                        className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                          activeTab === 'unassigned' 
                          ? 'border-primary bg-primary-tint/30 ring-4 ring-primary/5 shadow-lg shadow-primary/5 hover:bg-primary-tint/50' 
                          : 'border-line-2 bg-bg hover:bg-line-2/50'
                        }`}
                        onClick={() => setIsAssigning(true)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm ${
                            activeTab === 'unassigned' ? 'text-primary' : 'text-ink-4'
                          }`}>
                            <Users size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-ink">Assign a Driver</p>
                            <p className="text-[10px] text-ink-3">Click to see {drivers.filter(d => d.onDuty && isVehicleMatch(d, selectedBooking)).length} available options</p>
                          </div>
                        </div>
                        <Button variant={activeTab === 'unassigned' ? 'primary' : 'outline'} size="sm">Select</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-ink-3">{smartDrivers.length} drivers · ranked by match</p>
                          <button onClick={() => setIsAssigning(false)} className="text-xs font-bold text-primary">Cancel</button>
                        </div>
                        {smartDrivers.map(driver => (
                          <div
                            key={driver.id}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              driver.hasConflict
                                ? 'border-warning/40 bg-warning-light/20 opacity-70'
                                : 'border-line-2 hover:border-primary/30 hover:bg-primary-tint/10'
                            } transition-colors`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Avatar initials={driver.initials} size="sm" online={driver.onDuty} />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-bold text-ink">{driver.name}</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {driver.id === selectedBooking?.driverId && (
                                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary text-white border border-primary shadow-sm">
                                        Current Choice
                                      </span>
                                    )}
                                    {!driver.onDuty && (
                                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-bg text-ink-4 border border-line">
                                        Off Duty
                                      </span>
                                    )}
                                    {driver.equipmentMismatch && (
                                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-urgent text-white border border-urgent">
                                        Equipment Mismatch
                                      </span>
                                    )}
                                    {driver.hasConflict && (
                                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-urgent-light text-urgent border border-urgent/10">
                                        Busy
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-[10px] text-ink-3">
                                  {driver.vehicle.type} · <span className="font-mono">{driver.vehicle.plate}</span> · ★{driver.rating}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssign(driver.id)}
                              disabled={driver.hasConflict}
                            >
                              {driver.hasConflict ? 'Busy' : 'Assign'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                </div>

                {/* Footer Actions */}
                <div className="px-6 py-5 bg-white border-t border-line-2 flex flex-col gap-3">
                  {selectedBooking.status === 'pending_review' ? (
                    <div className="flex flex-col gap-3">
                      {selectedBooking.driverId ? (
                        <Button 
                          variant="accent" 
                          className="w-full py-4 text-base shadow-lg shadow-accent/20 animate-in zoom-in-95 duration-200" 
                          icon={Navigation}
                          onClick={handleDispatch}
                        >
                          Approve & Dispatch Now
                        </Button>
                      ) : (
                        <div className="flex gap-3">
                          <Button variant="ghost" className="text-urgent hover:bg-urgent-light flex-1" onClick={handleReject}>Reject Request</Button>
                          <Button variant="primary" className="flex-1" onClick={handleApprove}>Approve Booking</Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {selectedBooking.driverId ? (
                        <Button 
                          variant="accent" 
                          className="w-full py-4 text-base shadow-lg shadow-accent/20 animate-in zoom-in-95 duration-200" 
                          icon={Navigation}
                          onClick={handleDispatch}
                        >
                          Dispatch Trip Now
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full py-4 text-primary border-primary/20 bg-primary-tint/10" 
                          onClick={() => setIsAssigning(true)}
                        >
                          Please Select a Driver
                        </Button>
                      )}
                      <Button variant="ghost" className="text-ink-4 hover:text-urgent hover:bg-urgent-light text-xs mt-2" onClick={handleReject}>
                        Cancel this Booking
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-center">
                <div>
                   <Search size={48} className="mx-auto mb-4 opacity-20" />
                   <p className="text-ink-4 font-bold">Booking not found</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
