import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
          <div className={`p-1.5 rounded-lg ${accents[accent] || accents.primary}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="text-2xl font-black font-display text-ink mb-1">{value}</div>
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
