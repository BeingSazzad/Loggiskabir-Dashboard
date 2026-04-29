import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Mail, 
  Phone, 
  Key, 
  Smartphone, 
  MapPin, 
  Lock,
  ChevronRight,
  Camera,
  History,
  ShieldCheck,
  Globe,
  Loader2
} from 'lucide-react';
import { Card, Avatar, Button, Badge } from '../components/UI';

const Profile = ({ role }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account Info', icon: User },
    { id: 'security', label: 'Security & Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line-2 pb-8">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-bg">
              <Avatar initials={role === 'admin' ? 'AD' : 'DS'} size="full" shape="square" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg hover:bg-primary-dark transition-all scale-90 group-hover:scale-100">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">{role === 'admin' ? 'Admin User' : 'Dispatcher User'}</h1>
              <Badge variant="primary-light" className="text-[10px] uppercase tracking-widest">{role}</Badge>
            </div>
            <p className="text-ink-3 font-medium mt-1 italic">Joined LOGISS Operations on Jan 2026</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={History}>Login History</Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Nav */}
        <aside className="lg:w-64 flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'text-ink-3 hover:bg-bg'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Right Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'account' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Card className="p-8 space-y-8 border-line-2 shadow-sm">
                <section>
                  <h4 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User size={12} className="text-primary" /> Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-ink-3 ml-1">Full Name</label>
                      <div className="relative group">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4 group-focus-within:text-primary transition-colors" />
                        <input className="input-base w-full pl-12 h-12 bg-bg border-2 border-transparent focus:bg-white focus:border-primary/20" defaultValue={role === 'admin' ? 'Admin User' : 'Dispatcher User'} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-ink-3 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4 group-focus-within:text-primary transition-colors" />
                        <input className="input-base w-full pl-12 h-12 bg-bg border-2 border-transparent focus:bg-white focus:border-primary/20" defaultValue={role === 'admin' ? 'admin@logiss.com' : 'dispatcher@logiss.com'} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-ink-3 ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4 group-focus-within:text-primary transition-colors" />
                        <input className="input-base w-full pl-12 h-12 bg-bg border-2 border-transparent focus:bg-white focus:border-primary/20" defaultValue="(804) 555-0100" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-ink-3 ml-1">Reporting Region</label>
                      <div className="relative group">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4 group-focus-within:text-primary transition-colors" />
                        <input className="input-base w-full pl-12 h-12 bg-bg border-2 border-transparent focus:bg-white focus:border-primary/20" defaultValue="Richmond, VA" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="pt-8 border-t border-line-2">
                  <h4 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-6">Language & Locale</h4>
                  <div className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-line-2 hover:border-line transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-ink-3 shadow-sm border border-line-2">
                        <Globe size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">English (United States)</p>
                        <p className="text-[10px] text-ink-4 font-semibold uppercase tracking-wider">Default Dashboard Language</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-line" />
                  </div>
                </section>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Card className="p-8 border-line-2 shadow-sm">
                <h4 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <ShieldCheck size={12} className="text-accent" /> Security Overview
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-line-2 hover:border-primary/20 transition-all group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-light rounded-2xl flex items-center justify-center text-accent shadow-sm border border-accent/10 transition-transform group-hover:scale-110">
                        <Key size={24} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-ink">Change Password</p>
                        <p className="text-xs text-ink-3 font-medium mt-1">Last changed 4 months ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" icon={ChevronRight} />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-line-2 hover:border-primary/20 transition-all group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/10 transition-transform group-hover:scale-110">
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-ink">Two-Factor Authentication</p>
                        <p className="text-xs text-ink-3 font-medium mt-1 italic">Not enabled (Recommended)</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-urgent-light/30 rounded-2xl border border-urgent/10 flex items-start gap-4">
                  <Shield size={24} className="text-urgent mt-1" />
                  <div>
                    <p className="text-sm font-extrabold text-urgent uppercase tracking-widest mb-1">Critical Security Alert</p>
                    <p className="text-xs font-medium text-urgent/80 leading-relaxed">
                      Always ensure you sign out from public terminals. Your account access is audited for every login session from new IP addresses.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
