import React from 'react';
import { Phone, TrendingUp, TrendingDown } from 'lucide-react';

export const Badge = ({ variant = 'neutral', dot = false, children, className = '' }) => {
  const variants = {
    neutral: 'bg-bg text-ink-3 border-line',
    primary: 'bg-primary-light text-primary border-primary/10',
    accent: 'bg-accent-light text-accent border-accent/10',
    warning: 'bg-warning-light text-warning border-warning/10',
    urgent: 'bg-urgent-light text-urgent border-urgent/10',
    solid_accent: 'bg-accent text-white border-accent',
    solid_primary: 'bg-primary text-white border-primary',
    solid_warning: 'bg-warning text-white border-warning',
    solid_urgent: 'bg-urgent text-white border-urgent',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${variant.startsWith('solid') ? 'bg-white' : (variant === 'accent' || variant === 'solid_accent' ? 'bg-accent' : (variant === 'primary' ? 'bg-primary' : 'bg-current'))}`}></span>}
      {children}
    </span>
  );
};

export const TripStatusBadge = ({ status }) => {
  const config = {
    pending_review: { variant: 'warning', label: 'Pending Review' },
    assigned: { variant: 'primary', label: 'Assigned' },
    confirmed: { variant: 'primary', label: 'Confirmed' },
    en_route: { variant: 'solid_primary', label: 'En Route', dot: true },
    arrived: { variant: 'warning', label: 'Arrived' },
    in_trip: { variant: 'solid_accent', label: 'In Trip', dot: true },
    completed: { variant: 'accent', label: 'Completed' },
    cancelled: { variant: 'neutral', label: 'Cancelled' },
    no_show: { variant: 'urgent', label: 'No Show' },
  };

  const { variant, label, dot } = config[status] || { variant: 'neutral', label: status };
  return <Badge variant={variant} dot={dot}>{label}</Badge>;
};

export const Avatar = ({ initials, size = 'md', online = false, className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold tracking-tighter`}>
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export const Button = ({ variant = 'primary', size = 'md', icon: Icon, children, className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    accent: 'bg-accent text-white hover:bg-accent-dark',
    ghost: 'bg-transparent text-ink-2 hover:bg-bg',
    outline: 'bg-transparent border border-line text-ink-2 hover:bg-bg',
    danger: 'bg-urgent text-white hover:bg-urgent-dark',
    'primary-light': 'bg-primary-light text-primary hover:bg-primary/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-line-2 overflow-hidden ${hover ? 'hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-lg font-bold font-display text-ink">{title}</h2>
      {subtitle && <p className="text-xs text-ink-3">{subtitle}</p>}
    </div>
    {action && (
      <div className="text-sm font-semibold text-primary hover:underline cursor-pointer">
        {action}
      </div>
    )}
  </div>
);

export const StatCard = ({ label, value, sub, icon: Icon, accent = 'primary', trend }) => {
  const accents = {
    primary: 'text-primary bg-primary-light',
    accent: 'text-accent bg-accent-light',
    warning: 'text-warning bg-warning-light',
    urgent: 'text-urgent bg-urgent-light',
  };

  return (
    <Card className="p-4 relative">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-4">{label}</span>
        {Icon && (
          <div className={`p-1.5 rounded-lg ${accents[accent]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="text-2xl font-extrabold font-display text-ink mb-1">{value}</div>
      {(sub || trend) && (
        <div className="flex items-center gap-2">
          {trend && (
            <span className={`flex items-center text-[10px] font-bold ${trend.startsWith('+') ? 'text-accent' : 'text-urgent'}`}>
              {trend.startsWith('+') ? <TrendingUp size={10} className="mr-0.5" /> : <TrendingDown size={10} className="mr-0.5" />}
              {trend}
            </span>
          )}
          {sub && <span className="text-[10px] text-ink-4">{sub}</span>}
        </div>
      )}
    </Card>
  );
};

export const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center text-ink-4 mb-4">
      {Icon && <Icon size={32} />}
    </div>
    <h3 className="text-base font-bold text-ink mb-1">{title}</h3>
    <p className="text-sm text-ink-3 max-w-xs">{description}</p>
  </div>
);
