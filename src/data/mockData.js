export const drivers = [
  { id: 'DRV-2024-8421', name: 'David Wilson', initials: 'DW', phone: '(804) 555-0189',
    email: 'd.wilson@logiss-drivers.com', rating: 4.9, totalTrips: 1284,
    onDuty: true, status: 'in_trip', currentTripId: 'LOGISS-2847',
    vehicle: { make: 'Ford Transit', color: 'White', plate: 'VA · 4KL-8392', type: 'Ambulatory Van' },
    license: { number: 'DL-VA-94281', expires: '2027-12-14', status: 'valid' },
    insurance: { policy: 'INS-48291', expires: '2026-02-14', status: 'expiring' },
    cert: { number: 'NEMT-VA-3829', expires: '2027-08-12', status: 'valid' },
    counties: ['Chesterfield', 'Henrico', 'Richmond City'],
    tripsToday: 5, completedToday: 2, pendingDocUpdates: 1 },

  { id: 'DRV-2024-7710', name: 'Maria Garcia', initials: 'MG', phone: '(804) 555-0224',
    email: 'm.garcia@logiss-drivers.com', rating: 4.8, totalTrips: 967,
    onDuty: true, status: 'available', currentTripId: null,
    vehicle: { make: 'Honda Odyssey', color: 'Silver', plate: 'VA · 7XR-1129', type: 'Wheelchair Van' },
    license: { number: 'DL-VA-87392', expires: '2028-04-22', status: 'valid' },
    insurance: { policy: 'INS-39184', expires: '2026-08-30', status: 'valid' },
    cert: { number: 'NEMT-VA-2841', expires: '2026-11-15', status: 'valid' },
    counties: ['Henrico', 'Hanover'],
    tripsToday: 3, completedToday: 1, pendingDocUpdates: 0 },

  { id: 'DRV-2024-9082', name: 'James Carter', initials: 'JC', phone: '(804) 555-0341',
    email: 'j.carter@logiss-drivers.com', rating: 4.7, totalTrips: 612,
    onDuty: true, status: 'available', currentTripId: null,
    vehicle: { make: 'Toyota Sienna', color: 'Gray', plate: 'VA · 2HT-5560', type: 'Ambulatory Van' },
    license: { number: 'DL-VA-62815', expires: '2027-09-08', status: 'valid' },
    insurance: { policy: 'INS-50923', expires: '2026-03-12', status: 'valid' },
    cert: { number: 'NEMT-VA-4019', expires: '2026-05-20', status: 'valid' },
    counties: ['Chesterfield', 'Powhatan'],
    tripsToday: 4, completedToday: 0, pendingDocUpdates: 0 },

  { id: 'DRV-2024-6531', name: 'Patricia Lee', initials: 'PL', phone: '(804) 555-0492',
    email: 'p.lee@logiss-drivers.com', rating: 4.9, totalTrips: 1542,
    onDuty: false, status: 'off_duty', currentTripId: null,
    vehicle: { make: 'Ford Transit', color: 'White', plate: 'VA · 9KE-3320', type: 'Ambulatory Van' },
    license: { number: 'DL-VA-30182', expires: '2027-02-28', status: 'valid' },
    insurance: { policy: 'INS-29871', expires: '2026-01-10', status: 'expiring' },
    cert: { number: 'NEMT-VA-1208', expires: '2026-04-15', status: 'valid' },
    counties: ['Goochland', 'Henrico'],
    tripsToday: 0, completedToday: 0, pendingDocUpdates: 0 },

  { id: 'DRV-2024-4407', name: 'Robert Kim', initials: 'RK', phone: '(804) 555-0117',
    email: 'r.kim@logiss-drivers.com', rating: 4.6, totalTrips: 389,
    onDuty: true, status: 'break', currentTripId: null,
    vehicle: { make: 'Chrysler Pacifica', color: 'Blue', plate: 'VA · 5DL-7821', type: 'Wheelchair Van' },
    license: { number: 'DL-VA-71203', expires: '2026-12-01', status: 'valid' },
    insurance: { policy: 'INS-61029', expires: '2025-12-22', status: 'expired' },
    cert: { number: 'NEMT-VA-3712', expires: '2027-07-08', status: 'valid' },
    counties: ['Richmond City', 'Henrico'],
    tripsToday: 2, completedToday: 2, pendingDocUpdates: 1 },
];

export const trips = [
  {
    id: 'LOGISS-2847',
    rider: { name: 'Margaret Thompson', age: 68, phone: '(804) 555-0142', initials: 'MT' },
    status: 'in_trip',
    driverId: 'DRV-2024-8421',
    type: 'round_trip',
    mobility: 'Ambulatory',
    escort: 'Daughter Sarah accompanies',
    pickup: '2401 Robious Rd, Chesterfield',
    stop: 'CVS Pharmacy, 7201 Midlothian Tpke (3 min)',
    dropoff: 'Chippenham Medical Center',
    scheduledTime: '2024-10-22T08:30:00',
    actualPickup: '8:32 AM',
    actualStop: '8:52 AM',
    actualDropoff: '9:08 AM',
    duration: '36 min',
    distance: '8.2 miles',
    cost: 4.50,
    paymentStatus: 'pending',
    authId: 'CH-2024-8491-MT',
    notes: 'Door-to-door assistance needed. Call when arrived.',
    appointmentTime: '9:15 AM'
  },
  {
    id: 'LOGISS-2848',
    rider: { name: 'Robert Johnson', age: 72, initials: 'RJ' },
    status: 'assigned',
    driverId: 'DRV-2024-7710',
    type: 'one_way',
    mobility: 'Wheelchair',
    pickup: '8720 Meadowbridge Rd Mechanicsville',
    dropoff: 'Memorial Regional Medical Center',
    scheduledTime: '2024-10-22T11:15:00',
    distance: '12.4 mi',
    cost: 5.50,
    authId: 'HA-2024-3318-RJ'
  },
  {
    id: 'LOGISS-2849',
    rider: { name: 'Elizabeth Harris', age: 64, initials: 'EH' },
    status: 'assigned',
    driverId: 'DRV-2024-9082',
    type: 'one_way',
    mobility: 'Cane',
    pickup: '1547 Huguenot Rd Chesterfield',
    dropoff: 'Johnston-Willis Hospital',
    scheduledTime: '2024-10-22T14:00:00',
    distance: '5.8 mi',
    cost: 4.50,
    authId: 'CH-2024-7702-EH'
  },
  {
    id: 'LOGISS-2850',
    rider: { name: 'William Foster', age: 79, initials: 'WF', phone: '(804) 555-0142' },
    status: 'pending_review',
    type: 'round_trip',
    returnType: 'will_call',
    reason: 'Medical Appointment',
    passengers: 1,
    mobility: 'Ambulatory',
    pickup: '6210 Forest Hill Ave Richmond',
    stop: 'CVS Pharmacy - 7201 Midlothian Tpke',
    dropoff: 'VCU Medical Center',
    scheduledTime: '2024-10-23T09:15:00',
    appointmentTime: '10:00 AM',
    cost: 4.50,
    paymentMethod: 'Card ending in 5512',
    paymentStatus: 'Auth Hold',
    authId: 'RC-2024-9912-WF',
    submittedTime: '2024-10-21T16:32:00',
    notes: 'First-time rider. Needs orientation.'
  },
  {
    id: 'LOGISS-2851',
    rider: { name: 'Susan Mitchell', age: 81, initials: 'SM' },
    status: 'pending_review',
    type: 'one_way',
    mobility: 'Wheelchair',
    escort: 'Son James accompanies',
    pickup: 'Henrico',
    dropoff: "Bon Secours St. Mary's",
    scheduledTime: '2024-10-23T12:00:00',
    cost: 5.50
  },
  {
    id: 'LOGISS-2852',
    rider: { name: 'Charles Brown', age: 70, initials: 'CB' },
    status: 'pending_review',
    type: 'one_way',
    mobility: 'Ambulatory',
    pickup: 'Richmond',
    dropoff: 'MCV Hospital',
    scheduledTime: '2024-10-23T08:00:00',
    cost: 3.50
  },
  {
    id: 'LOGISS-2801',
    rider: { name: 'Margaret Thompson', initials: 'MT' },
    status: 'completed',
    type: 'round_trip',
    pickup: 'Richmond',
    dropoff: 'VCU Medical',
    scheduledTime: '2024-10-14T10:00:00',
    distance: '11.2 mi',
    cost: 4.50,
    paymentStatus: 'charged',
    rating: 5
  },
  {
    id: 'LOGISS-2802',
    rider: { name: 'Margaret Thompson', initials: 'MT' },
    status: 'completed',
    type: 'one_way',
    pickup: 'Richmond',
    dropoff: 'Bon Secours St. Francis',
    scheduledTime: '2024-10-08T09:00:00',
    distance: '9.4 mi',
    cost: 3.50
  },
  {
    id: 'LOGISS-2803',
    rider: { name: 'Margaret Thompson', initials: 'MT' },
    status: 'cancelled',
    type: 'round_trip',
    pickup: 'Richmond',
    dropoff: 'Medical Office',
    scheduledTime: '2024-10-03T14:30:00',
    cancelReason: 'Patient rescheduled appointment'
  }
];

export const applications = [
  { id: 'APP-2024-1847', name: 'Jennifer Carter', initials: 'JC', county: 'Richmond City', 
    license: { number: 'DL-VA-58291', expires: '2028-03-15', class: 'Class C' },
    vehicle: { make: 'Toyota Sienna', year: '2021', plate: 'VA · 6PR-2287', type: 'Ambulatory Van' },
    certs: ['NEMT', 'CPR'], experience: '5–10 years', stage: 2, status: 'under_review', submitted: '2024-10-22T11:14:00' },
  { id: 'APP-2024-1848', name: 'Marcus Williams', initials: 'MW', county: 'Henrico', 
    license: { number: 'DL-VA-90817', expires: '2027-08-22', class: 'Class C' },
    vehicle: { make: 'Honda Odyssey', year: '2020', plate: 'VA · 3WL-9001', type: 'Wheelchair Van' },
    certs: ['CPR', 'Defensive Driving'], experience: '3–5 yrs', stage: 3, status: 'bg_check' },
  { id: 'APP-2024-1849', name: 'Linda Rodriguez', initials: 'LR', county: 'Chesterfield', 
    license: { number: 'DL-VA-44529', expires: '2026-11-30', class: 'Class C' },
    vehicle: { make: 'Chrysler Pacifica', year: '2022', plate: 'VA · 8KM-4421', type: 'Wheelchair Van' },
    certs: ['NEMT', 'CPR', 'Wheelchair Securement'], experience: '10+ yrs', stage: 2, status: 'under_review' }
];

export const reports = [
  { id: 'RPT-2024-0042', status: 'open', severity: 'high', type: 'Reckless driving', 
    filedBy: { name: 'Linda Adams', role: 'rider' }, subject: { name: 'Robert Kim', role: 'driver', id: 'DRV-2024-4407' },
    tripId: 'LOGISS-2790', description: 'Driver was speeding through residential area and ran a stop sign', submitted: '2024-10-21T15:24:00' },
  { id: 'RPT-2024-0043', status: 'reviewing', severity: 'medium', type: 'No-show', 
    filedBy: { name: 'Maria Garcia', role: 'driver', id: 'DRV-2024-7710' }, subject: { name: 'Frank Murphy', role: 'rider' },
    tripId: 'LOGISS-2812', description: 'Passenger did not show after 8 minute wait' },
  { id: 'RPT-2024-0044', status: 'resolved', severity: 'low', type: 'Vehicle issue or unclean', 
    filedBy: { name: 'Helen Walker', role: 'rider' }, subject: { name: 'James Carter', role: 'driver', id: 'DRV-2024-9082' },
    tripId: 'LOGISS-2818', description: 'Vehicle had a strong odor and trash on the floor' }
];

export const willCallQueue = [
  { tripId: 'LOGISS-2840', rider: 'Dorothy Phillips', driverId: 'DRV-2024-8421', 
    pickupLocation: "St. Mary's Hospital", pickupTime: '8:15 AM', 
    returnAddress: '5421 Patterson Ave Richmond' }
];

export const opsStats = {
  todaysTrips: 23, inProgress: 1, pendingReview: 3, driversOnDuty: 4, driversTotal: 5,
  completionRate: 96, avgRating: 4.83, willCallStandby: 1, expiringDocuments: 2
};
