export const formatTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const formatShortDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatDateTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

export const timeAgo = (iso) => {
  if (!iso) return 'just now';
  const now = new Date();
  const past = new Date(iso);
  const diffInMs = now - past;
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return 'just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

export const docExpiryStatus = (expires) => {
  if (!expires) return 'valid';
  const now = new Date();
  const expiryDate = new Date(expires);
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(now.getMonth() + 6);

  if (expiryDate < now) return 'expired';
  if (expiryDate < sixMonthsFromNow) return 'expiring';
  return 'valid';
};

export const findDriver = (drivers, id) => drivers.find(d => d.id === id);
export const findTrip = (trips, id) => trips.find(t => t.id === id);

export const tripTypeLabel = (type) => {
  const map = {
    'round_trip': 'Round Trip',
    'one_way': 'One Way'
  };
  return map[type] || type;
};

export const money = (n) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
};
