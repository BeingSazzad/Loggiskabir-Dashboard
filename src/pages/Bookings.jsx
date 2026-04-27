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
  const [selectedBookingId, setSelectedBookingId] = useState('LOGISS-2850');
  const [isAssigning, setIsAssigning] = useState(false);

  const filteredBookings = trips.filter(t => {
    if (activeTab === 'pending') return t.status === 'pending_review';
    if (activeTab === 'approved') return t.status === 'assigned' || t.status === 'confirmed';
    if (activeTab === 'rejected') return t.status === 'cancelled';
    return false;
  });

  const selectedBooking = trips.find(t => t.id === selectedBookingId) || filteredBookings[0];

  const availableDrivers = drivers.filter(d => d.onDuty && d.status === 'available');

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
          Pending Review <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'pending' ? 'bg-primary-light' : 'bg-bg'}`}>{trips.filter(t => t.status === 'pending_review').length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'approved' ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
        >
          Approved <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-bg text-[10px]">3</span>
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'rejected' ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
        >
          Rejected <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-bg text-[10px]">0</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2">
          {filteredBookings.map(booking => (
            <Card 
              key={booking.id} 
              hover 
              onClick={() => setSelectedBookingId(booking.id)}
              className={`p-4 ${selectedBookingId === booking.id ? 'border-primary bg-primary-tint/30' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] font-bold text-ink-4 uppercase">#{booking.id}</span>
                <span className="text-[10px] font-bold text-ink-4">{timeAgo(booking.submittedTime)}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Avatar initials={booking.rider.initials} size="sm" />
                <div>
                  <h4 className="text-sm font-bold text-ink">{booking.rider.name}</h4>
                  <p className="text-[10px] font-semibold text-ink-3">
                    {formatShortDate(booking.scheduledTime)} at {formatTime(booking.scheduledTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-ink-4 mb-3 truncate">
                <MapPin size={10} />
                {booking.pickup} → {booking.dropoff}
              </div>
              <div className="flex gap-2">
                <Badge variant="primary">{booking.mobility}</Badge>
                <Badge variant="neutral">{tripTypeLabel(booking.type)}</Badge>
                <Badge variant="neutral">{money(booking.cost)}</Badge>
              </div>
            </Card>
          ))}
          {filteredBookings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-ink-4">
              <CheckCircle2 size={48} className="mb-4 opacity-20" />
              <p className="font-bold">All caught up!</p>
              <p className="text-sm">No bookings in this category.</p>
            </div>
          )}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-7">
          {selectedBooking ? (
            <Card className="h-full flex flex-col sticky top-0 max-h-full overflow-hidden">
              <div className="p-6 border-b border-line-2 flex items-center justify-between bg-tint/10">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-ink-3">#{selectedBooking.id}</span>
                  <h2 className="text-lg font-bold font-display text-ink">Booking Request Details</h2>
                </div>
                <TripStatusBadge status={selectedBooking.status} />
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
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Auth ID</p>
                      <p className="text-xs font-bold font-mono text-ink truncate">{selectedBooking.authId}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">County</p>
                      <p className="text-xs font-bold text-ink">Chesterfield</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Trip Type</p>
                      <p className="text-xs font-bold text-ink">{tripTypeLabel(selectedBooking.type)}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Mobility</p>
                      <p className="text-xs font-bold text-ink">{selectedBooking.mobility}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Scheduled</p>
                      <p className="text-xs font-bold text-ink">{formatDateTime(selectedBooking.scheduledTime)}</p>
                    </div>
                    <div className="bg-bg rounded-xl p-3 border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase tracking-wider mb-1">Estimated Cost</p>
                      <p className="text-xs font-bold font-mono text-ink">{money(selectedBooking.cost)}</p>
                    </div>
                  </div>
                </section>

                {/* Route Card */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Route</h4>
                  <div className="relative pl-6 space-y-8">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 border-l border-dashed border-line"></div>
                    <div className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary-light"></div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Pickup</p>
                      <p className="text-sm font-bold text-ink">{selectedBooking.pickup}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-urgent ring-4 ring-urgent-light"></div>
                      <p className="text-[10px] font-bold text-urgent uppercase tracking-wider mb-1">Dropoff</p>
                      <p className="text-sm font-bold text-ink">{selectedBooking.dropoff}</p>
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
                      className="border-2 border-dashed border-line rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-bg transition-colors"
                      onClick={() => setIsAssigning(true)}
                    >
                      <div className="w-12 h-12 bg-line-2 rounded-full flex items-center justify-center text-ink-4 mb-3">
                        <Truck size={24} />
                      </div>
                      <p className="text-sm font-bold text-ink mb-1">No driver assigned yet</p>
                      <p className="text-xs text-ink-4 mb-4">Click to assign from available on-duty pool</p>
                      <Button variant="primary-light" size="sm">Select Driver</Button>
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
                          <Button variant="outline" size="sm" onClick={() => setIsAssigning(false)}>Assign</Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <div className="p-4 bg-white border-t border-line-2 flex gap-3">
                <Button variant="ghost" className="text-urgent hover:bg-urgent-light flex-1">Reject Booking</Button>
                <Button 
                  variant="primary" 
                  className="flex-1" 
                  onClick={() => setIsAssigning(true)}
                >
                  Approve & Assign Driver
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-ink-4 font-bold">Select a booking to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
