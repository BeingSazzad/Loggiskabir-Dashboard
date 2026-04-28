import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Mail,
  Smartphone,
  Info,
  AlertTriangle,
  UserX
} from 'lucide-react';
import { Card, Avatar, Button, Badge } from '../components/UI';

const Toggle = ({ label, sub, icon: Icon, active, onToggle }) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex gap-4">
      <div className="p-2 bg-bg rounded-lg text-ink-3">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-bold text-ink">{label}</p>
        <p className="text-[10px] font-semibold text-ink-3">{sub}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${active ? 'bg-primary' : 'bg-line'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : ''}`}></div>
    </button>
  </div>
);

const Settings = ({ role }) => {
  const [notifications, setNotifications] = useState({
    bookings: true,
    reports: true,
    noShow: true,
    expiry: true,
    summary: false
  });

  const toggleNotif = (key) => setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Settings</h1>
        <p className="text-ink-3 font-medium">Manage your profile and dispatch preferences</p>
      </div>

      {/* Profile & Authentication */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6 border-b border-line-2 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer w-16 h-16 rounded-2xl overflow-hidden border-2 border-line group-hover:border-primary transition-colors">
              <Avatar initials={role === 'admin' ? 'AD' : 'DS'} size="xl" className="w-full h-full" />
              <div className="absolute inset-0 bg-ink/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider text-center leading-tight">Change<br/>Photo</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink">{role === 'admin' ? 'Admin User' : 'Dispatcher User'}</h3>
              <p className="text-sm font-semibold text-ink-3 uppercase tracking-wider">{role}</p>
            </div>
          </div>
          {role === 'admin' && <Button variant="primary-light" size="sm">Save Changes</Button>}
        </div>
        
        <div className="space-y-5">
          <h4 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest flex items-center gap-2">
            <Shield size={12} className={role === 'admin' ? "text-primary" : "text-ink-4"} /> Authentication Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5 flex justify-between">
                Email Address
                {role !== 'admin' && <span className="text-urgent flex items-center gap-1"><Shield size={10}/> Admin Only</span>}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
                <input 
                  type="email" 
                  value={role === 'admin' ? 'admin@logiss.com' : 'dispatcher@logiss.com'} 
                  className={`input-base w-full pl-10 ${role !== 'admin' ? 'bg-bg text-ink-4 cursor-not-allowed border-line-2' : ''}`}
                  disabled={role !== 'admin'}
                  onChange={() => {}}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5 flex justify-between">
                Phone Number
                {role !== 'admin' && <span className="text-urgent flex items-center gap-1"><Shield size={10}/> Admin Only</span>}
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" />
                <input 
                  type="text" 
                  value="(804) 555-0100" 
                  className={`input-base w-full pl-10 ${role !== 'admin' ? 'bg-bg text-ink-4 cursor-not-allowed border-line-2' : ''}`}
                  disabled={role !== 'admin'}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-line-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-ink">Change Password</p>
                <p className="text-[10px] text-ink-4 font-semibold mt-0.5">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">Update Password</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Hotline & Contact */}
      <Card className="p-6">
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-4">Hotline & Contact</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-urgent-light rounded-xl border border-urgent/10">
            <div className="p-2 bg-white rounded-lg text-urgent"><Smartphone size={18} /></div>
            <div>
              <p className="text-xs font-bold text-urgent uppercase tracking-wider mb-0.5">Urgent Dispatch Hotline</p>
              <p className="text-sm font-bold font-mono text-ink">(804) 555-LOGI · 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-bg rounded-xl border border-line-2">
            <div className="p-2 bg-white rounded-lg text-ink-3"><Phone size={18} /></div>
            <div>
              <p className="text-xs font-bold text-ink-4 uppercase tracking-wider mb-0.5">General Dispatch Line</p>
              <p className="text-sm font-bold font-mono text-ink">(804) 555-DISP · Mon–Fri 6 AM – 8 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-bg rounded-xl border border-line-2">
            <div className="p-2 bg-white rounded-lg text-ink-3"><MapPin size={18} /></div>
            <div>
              <p className="text-xs font-bold text-ink-4 uppercase tracking-wider mb-0.5">Office Address</p>
              <p className="text-sm font-bold text-ink">2200 Broad St, Suite 400, Richmond VA 23230</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Counties */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-ink uppercase tracking-widest">Service Counties</h3>
          <Badge variant="primary">6 Active</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Chesterfield', 'Henrico', 'Hanover', 'Richmond City', 'Powhatan', 'Goochland'].map(county => (
            <div key={county} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg rounded-full border border-line-2 text-xs font-bold text-ink-2">
              <MapPin size={12} className="text-ink-4" />
              {county}
            </div>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-dashed border-line rounded-full text-xs font-bold text-ink-4 hover:bg-bg transition-colors">
            + Add County
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h3 className="text-xs font-bold text-ink uppercase tracking-widest mb-2">Notifications</h3>
        <div className="divide-y divide-line-2">
          <Toggle 
            icon={Bell} 
            label="New booking requests" 
            sub="Get notified when riders submit new requests" 
            active={notifications.bookings} 
            onToggle={() => toggleNotif('bookings')} 
          />
          <Toggle 
            icon={AlertTriangle} 
            label="Driver reports" 
            sub="Alerts for incident reports and safety flags" 
            active={notifications.reports} 
            onToggle={() => toggleNotif('reports')} 
          />
          <Toggle 
            icon={UserX} 
            label="No-show reports" 
            sub="Immediate notice for rider no-show events" 
            active={notifications.noShow} 
            onToggle={() => toggleNotif('noShow')} 
          />
          <Toggle 
            icon={Shield} 
            label="Document expiry warnings" 
            sub="Reminders for driver license and insurance expiry" 
            active={notifications.expiry} 
            onToggle={() => toggleNotif('expiry')} 
          />
          <Toggle 
            icon={Mail} 
            label="Daily summary email" 
            sub="End-of-day operations and performance summary" 
            active={notifications.summary} 
            onToggle={() => toggleNotif('summary')} 
          />
        </div>
      </Card>

      {/* Sign Out */}
      <Card className="p-4 bg-urgent-light/30 border-urgent/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-lg text-urgent"><LogOut size={18} /></div>
          <div>
            <p className="text-sm font-bold text-ink">Sign Out</p>
            <p className="text-[10px] font-semibold text-ink-3">End your current dispatch session</p>
          </div>
        </div>
        <Button variant="danger" size="sm">Sign Out</Button>
      </Card>

      <div className="text-center">
        <p className="text-[10px] font-bold text-ink-4 uppercase tracking-[0.2em]">LOGISS Dispatcher Console · Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;
