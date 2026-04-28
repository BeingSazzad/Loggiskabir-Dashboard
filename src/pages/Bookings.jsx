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
  CreditCard,
  AlertCircle,
  Truck
} from 'lucide-react';
import { Card, Avatar, Badge, Button, TripStatusBadge } from '../components/UI';
import { trips, drivers } from '../data/mockData';
import { formatTime, formatDateTime, formatShortDate, timeAgo, tripTypeLabel, money } from '../utils/helpers';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const [localTrips, setLocalTrips] = useState(trips);

  const filteredBookings = localTrips.filter(t => {
    if (activeTab === 'pending') return t.status === 'pending_review';
    if (activeTab === 'approved') return t.status === 'assigned' || t.status === 'confirmed';
    if (activeTab === 'rejected') return t.status === 'cancelled';
    return false;
  });

  const selectedBooking = selectedBookingId ? localTrips.find(t => t.id === selectedBookingId) : null;

  const availableDrivers = drivers.filter(d => d.onDuty && d.status === 'available');

  const handleAssign = (driverId) => {
    if (!selectedBooking) return;
    setLocalTrips(prev => prev.map(t => 
      t.id === selectedBooking.id ? { ...t, status: 'assigned', driverId } : t
    ));
    setIsAssigning(false);
    setActiveTab('approved');
  };

  const handleReject = () => {
    if (!selectedBooking) return;
    setLocalTrips(prev => prev.map(t => 
      t.id === selectedBooking.id ? { ...t, status: 'cancelled' } : t
    ));
    setActiveTab('rejected');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Bookings</h1>
          <p className="text-ink-3 font-medium">Review and process ride requests</p>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-line-2">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
        >
          Pending Review <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'pending' ? 'bg-primary-light' : 'bg-bg'}`}>{localTrips.filter(t => t.status === 'pending_review').length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'approved' ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
        >
          Approved <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-bg text-[10px]">{localTrips.filter(t => t.status === 'assigned' || t.status === 'confirmed').length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'rejected' ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
        >
          Rejected <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-bg text-[10px]">{localTrips.filter(t => t.status === 'cancelled').length}</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Table List */}
        <div className={`transition-all duration-300 ease-in-out ${selectedBookingId ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-4 overflow-y-auto pr-2`}>
          {filteredBookings.length > 0 ? (
            <div className="bg-white border border-line-2 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-bg border-b border-line-2">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Trip Ref</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Rider</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Route</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-ink-4 uppercase tracking-widest hidden lg:table-cell">Details</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Scheduled</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-ink-4 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2">
                  {filteredBookings.map(booking => (
                    <tr 
                      key={booking.id} 
                      onClick={() => setSelectedBookingId(booking.id)}
                      className={`cursor-pointer transition-colors ${selectedBookingId === booking.id ? 'bg-primary-tint/40 hover:bg-primary-tint/60' : 'hover:bg-bg'}`}
                    >
                      <td className="px-4 py-3 align-top w-28">
                        <span className="font-mono text-xs font-bold text-ink block mb-1">#{booking.id}</span>
                        <span className="text-[10px] font-bold text-ink-4">{timeAgo(booking.submittedTime)}</span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Avatar initials={booking.rider.initials} size="xs" />
                          <h4 className="text-sm font-bold text-ink">{booking.rider.name}</h4>
                        </div>
                        <p className="text-[10px] text-ink-3 ml-[30px]">{booking.rider.phone || '(804) 555-0142'}</p>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-1">
                          <span>{booking.pickup}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-ink-4">
                          <MapPin size={10} className="shrink-0" />
                          <span>{booking.dropoff}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top hidden lg:table-cell">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="primary">{booking.mobility}</Badge>
                          <Badge variant="neutral">{tripTypeLabel(booking.type)}</Badge>
                          <Badge variant="neutral">{money(booking.cost)}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <p className="text-xs font-bold text-ink mb-1">{formatShortDate(booking.scheduledTime)}</p>
                        <p className="text-[10px] font-semibold text-ink-3">{formatTime(booking.scheduledTime)}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:bg-primary-light/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBookingId(booking.id);
                          }}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-ink-4 border border-line-2 rounded-xl bg-white">
              <CheckCircle2 size={48} className="mb-4 opacity-20" />
              <p className="font-bold">All caught up!</p>
              <p className="text-sm">No bookings in this category.</p>
            </div>
          )}
        </div>

        {/* Right Detail Panel */}
        {selectedBookingId && (
          <div className="lg:col-span-5 transition-all duration-300 ease-in-out">
            {selectedBooking ? (
            <Card className="h-full flex flex-col sticky top-0 max-h-full overflow-hidden">
              <div className="p-6 border-b border-line-2 flex items-center justify-between bg-tint/10">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-ink-3">#{selectedBooking.id}</span>
                  <h2 className="text-lg font-bold font-display text-ink">Booking Request Details</h2>
                </div>
                <div className="flex items-center gap-4">
                  <TripStatusBadge status={selectedBooking.status} />
                  <button 
                    onClick={() => setSelectedBookingId(null)}
                    className="p-1 hover:bg-bg rounded-lg text-ink-4 hover:text-ink transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Rider Section */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar initials={selectedBooking.rider.initials} size="lg" />
                      <div>
                        <h3 className="text-xl font-bold text-ink">{selectedBooking.rider.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-ink-3">{selectedBooking.rider.age} years</span>
                          <span className="w-1 h-1 bg-line rounded-full"></span>
                          <span className="text-xs font-semibold text-ink-3">{selectedBooking.rider.phone || '(804) 555-0142'}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" icon={Phone}>Call Rider</Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Reason</p>
                      <p className="text-xs font-bold text-ink truncate">{selectedBooking.reason || 'Not specified'}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Trip Type</p>
                      <p className="text-xs font-bold text-ink">
                        {tripTypeLabel(selectedBooking.type)}
                        {selectedBooking.returnType === 'will_call' && <span className="text-warning ml-1">(Will Call)</span>}
                      </p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Passengers</p>
                      <p className="text-xs font-bold text-ink">{selectedBooking.passengers || 1} • {selectedBooking.mobility}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Pickup Time</p>
                      <p className="text-xs font-bold text-ink">{formatDateTime(selectedBooking.scheduledTime)}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Appt Time</p>
                      <p className="text-xs font-bold text-primary">{selectedBooking.appointmentTime || 'N/A'}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Auth ID</p>
                      <p className="text-xs font-bold font-mono text-ink truncate">{selectedBooking.authId}</p>
                    </div>
                  </div>
                </section>

                {/* Route Card */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Route</h4>
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 border-l border-dashed border-line"></div>
                    <div className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary-light"></div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Pickup</p>
                      <p className="text-sm font-bold text-ink">{selectedBooking.pickup}</p>
                    </div>
                    {selectedBooking.stop && (
                      <div className="relative">
                        <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-warning ring-4 ring-warning-light"></div>
                        <p className="text-[10px] font-bold text-warning uppercase tracking-wider mb-1">Stop</p>
                        <p className="text-sm font-bold text-ink">{selectedBooking.stop}</p>
                      </div>
                    )}
                    <div className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-urgent ring-4 ring-urgent-light"></div>
                      <p className="text-[10px] font-bold text-urgent uppercase tracking-wider mb-1">Dropoff</p>
                      <p className="text-sm font-bold text-ink">{selectedBooking.dropoff}</p>
                    </div>
                  </div>
                </section>

                {/* Payment Details */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Payment Details</h4>
                  <div className="bg-bg rounded-xl border border-line-2 overflow-hidden">
                    <div className="p-4 border-b border-line-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-ink-4" />
                        <div>
                          <p className="text-xs font-bold text-ink">{selectedBooking.paymentMethod || 'Insurance Covered'}</p>
                          <p className="text-[10px] text-ink-4">Payment Method</p>
                        </div>
                      </div>
                      <Badge variant={selectedBooking.paymentStatus === 'Auth Hold' ? 'warning' : 'neutral'}>
                        {selectedBooking.paymentStatus || 'Pending'}
                      </Badge>
                    </div>
                    <div className="p-4 bg-white flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-3">Total Estimated Cost</span>
                      <span className="text-lg font-bold font-mono text-ink">{money(selectedBooking.cost)}</span>
                    </div>
                  </div>
                </section>

                {/* Special Instructions */}
                {selectedBooking.notes && (
                  <section>
                    <div className="bg-warning-light p-4 rounded-xl border border-warning/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-warning" />
                        <h4 className="text-xs font-bold text-warning uppercase tracking-widest">Special Instructions</h4>
                      </div>
                      <p className="text-sm font-medium text-warning-dark">{selectedBooking.notes}</p>
                    </div>
                  </section>
                )}

                {/* Driver Assignment */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Driver Assignment</h4>
                  {!isAssigning ? (
                    <div 
                      className="bg-primary-tint/50 border border-primary/10 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-light/50 transition-all group"
                      onClick={() => setIsAssigning(true)}
                    >
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Users size={28} />
                      </div>
                      <h5 className="text-base font-bold text-ink mb-1">Assign a Driver</h5>
                      <p className="text-xs font-medium text-ink-3 mb-5 max-w-[240px]">This trip requires a driver assignment from the active on-duty pool.</p>
                      <Button variant="primary" size="md">Select Available Driver</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-ink-3">{availableDrivers.length} Available Drivers</p>
                        <button onClick={() => setIsAssigning(false)} className="text-xs font-bold text-primary">Cancel</button>
                      </div>
                      {availableDrivers.map(driver => (
                        <Card key={driver.id} hover className="p-3 flex items-center justify-between border-line-2">
                          <div className="flex items-center gap-3">
                            <Avatar initials={driver.initials} size="sm" online />
                            <div>
                              <p className="text-sm font-bold text-ink">{driver.name}</p>
                              <p className="text-[10px] text-ink-3">
                                {driver.vehicle.type} · <span className="font-mono">{driver.vehicle.plate}</span> · ★{driver.rating}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleAssign(driver.id)}>Assign</Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <div className="p-4 bg-white border-t border-line-2 flex gap-3">
                <Button variant="ghost" className="text-urgent hover:bg-urgent-light flex-1" onClick={handleReject}>Reject Booking</Button>
                <Button 
                  variant="primary" 
                  className="flex-1" 
                  onClick={() => setIsAssigning(true)}
                  disabled={selectedBooking.status !== 'pending_review'}
                >
                  {selectedBooking.status === 'pending_review' ? 'Approve & Assign Driver' : 'Driver Assigned'}
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-line-2 rounded-xl">
              <p className="text-ink-4 font-bold">Select a booking to view details</p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
