import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  CheckSquare,
  Clock,
  Navigation,
  ChevronRight
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
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

      <div className="space-y-4">
        {notifications.map(notif => (
          <Card 
            key={notif.id} 
            className={`p-5 transition-all hover:border-primary/30 cursor-pointer border-l-4 group shadow-sm hover:shadow-md ${notif.read ? 'border-l-line opacity-80' : 'border-l-primary bg-primary-tint/5'}`}
          >
            <div className="flex gap-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 ${notif.bg} ${notif.color}`}>
                <notif.icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-base font-bold ${notif.read ? 'text-ink-2' : 'text-ink'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  </div>
                  <span className="text-[10px] font-bold text-ink-4 flex items-center gap-1 uppercase tracking-widest bg-bg px-2 py-1 rounded-lg">
                    <Clock size={10} /> {timeAgo(notif.time)}
                  </span>
                </div>
                <p className="text-sm font-medium text-ink-3 leading-relaxed mb-3">
                  {notif.message}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    {!notif.read && (
                      <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                        Mark as read
                      </button>
                    )}
                    <button className="text-[10px] font-black text-ink-4 uppercase tracking-widest hover:text-urgent transition-colors">
                      Delete
                    </button>
                  </div>
                  <ChevronRight size={16} className="text-line opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-bg rounded-full flex items-center justify-center text-ink-4 mb-6">
            <Bell size={40} className="opacity-20" />
          </div>
          <h3 className="text-xl font-bold text-ink">All caught up!</h3>
          <p className="text-ink-3 max-w-xs mt-2">No new notifications at the moment. Check back later for system updates.</p>
        </div>
      )}

      <div className="pt-8 text-center">
        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-[0.2em]">Viewing last 30 days of activity</p>
      </div>
    </div>
  );
};

export default Notifications;
