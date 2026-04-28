import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  CheckSquare,
  Clock,
  Navigation
} from 'lucide-react';
import { Card, Badge, Button, Avatar } from '../components/UI';
import { timeAgo } from '../utils/helpers';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Incident Report Filed',
      message: 'A high-severity incident report was filed for Trip #LOGISS-2842. Immediate review required.',
      time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
      icon: AlertTriangle,
      color: 'text-urgent',
      bg: 'bg-urgent-light'
    },
    {
      id: 2,
      type: 'success',
      title: 'Driver Application Approved',
      message: 'David Wilson\'s application has been successfully processed and approved for fleet operations.',
      time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
      icon: CheckCircle2,
      color: 'text-accent',
      bg: 'bg-accent-light'
    },
    {
      id: 3,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'System maintenance is scheduled for Sunday, May 2nd between 2:00 AM and 4:00 AM EST.',
      time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      read: true,
      icon: Info,
      color: 'text-primary',
      bg: 'bg-primary-light'
    },
    {
      id: 4,
      type: 'warning',
      title: 'No-Show Reported',
      message: 'Driver reported a rider no-show for Trip #LOGISS-2859 at Richmond Dental Specialists.',
      time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      read: true,
      icon: Navigation,
      color: 'text-warning',
      bg: 'bg-warning-light'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Notifications</h1>
          <p className="text-ink-3 font-medium">Stay updated with fleet and system activities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" icon={CheckSquare}>Mark all as read</Button>
          <Button variant="ghost" size="sm" icon={Trash2} className="text-ink-4">Clear all</Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <Card 
            key={notif.id} 
            className={`p-4 transition-all hover:border-primary/30 cursor-pointer border-l-4 ${notif.read ? 'border-l-line opacity-80' : 'border-l-primary bg-primary-tint/10 shadow-sm'}`}
          >
            <div className="flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.bg} ${notif.color}`}>
                <notif.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-bold ${notif.read ? 'text-ink-2' : 'text-ink'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-bold text-ink-4 flex items-center gap-1 uppercase tracking-wider">
                    <Clock size={10} /> {timeAgo(notif.time)}
                  </span>
                </div>
                <p className="text-xs font-medium text-ink-3 leading-relaxed mb-2">
                  {notif.message}
                </p>
                {!notif.read && (
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-8 text-center">
        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-[0.2em]">Viewing last 30 days of activity</p>
      </div>
    </div>
  );
};

export default Notifications;
