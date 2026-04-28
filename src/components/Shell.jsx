import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Map, 
  Users, 
  FileCheck, 
  Flag, 
  Truck, 
  Settings, 
  Search, 
  Bell, 
  Phone, 
  ChevronDown,
  Menu,
  LogOut,
  CalendarDays,
  Car,
  User,
  Shield,
  HelpCircle,
  Lock,
  FileText,
  CreditCard,
  UserPlus
} from 'lucide-react';
import { Avatar, Badge, Button } from './UI';
import { trips, drivers } from '../data/mockData';

const NavItem = ({ icon: Icon, label, badge, active, onClick, badgeVariant = 'neutral' }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group relative ${
      active ? 'bg-primary text-white shadow-md shadow-primary/20 translate-x-1' : 'text-ink-2 hover:bg-bg hover:translate-x-1'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-white' : 'text-ink-3 group-hover:text-primary transition-colors'} />
      <span className={`text-xs ${active ? 'font-black' : 'font-bold'}`}>{label}</span>
    </div>
    {badge && (
      <Badge variant={active ? 'white' : badgeVariant}>{badge}</Badge>
    )}
    {active && (
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-full shadow-sm"></div>
    )}
  </div>
);

const Shell = ({ children, page, setPage, role, onLogout }) => {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const liveTripsCount = trips.filter(t => ['in_trip', 'en_route', 'arrived'].includes(t.status)).length;
  const activeDriversCount = drivers.filter(d => d.onDuty).length;

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleOutsideClick = () => setProfileOpen(false);
    if (profileOpen) window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [profileOpen]);

  return (
    <div className="flex h-screen bg-bg overflow-hidden font-sans text-ink">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-line fixed h-full flex flex-col z-20 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)]">
        <div className="p-6 flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Truck size={22} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-ink leading-none">LOGISS</h1>
            <span className="text-[10px] font-bold tracking-[0.2em] text-ink-4 uppercase">
              {role === 'admin' ? 'Admin Portal' : 'Dispatcher'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto scrollbar-hide">
          <div>
            <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-4">
              {role === 'admin' ? 'Admin Controls' : 'Operations'}
            </h3>
            <div className="space-y-1">
              {role === 'admin' ? (
                <>
                  <NavItem 
                    icon={LayoutDashboard} 
                    label="Dashboard" 
                    active={page === 'admin_dashboard' || page === 'operations'} 
                    onClick={() => setPage('admin_dashboard')} 
                  />
                  <NavItem 
                    icon={CreditCard} 
                    label="Transactions" 
                    active={page === 'transactions'} 
                    onClick={() => setPage('transactions')} 
                  />
                  <NavItem 
                    icon={UserPlus} 
                    label="User Access" 
                    active={page === 'users'} 
                    onClick={() => setPage('users')} 
                  />
                  <NavItem 
                    icon={FileText} 
                    label="Content Manager" 
                    active={page === 'cms'} 
                    onClick={() => setPage('cms')} 
                  />
                  
                  <h3 className="px-3 mt-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-4">Operations</h3>
                  <NavItem icon={Inbox} label="Bookings" badge="8" active={page === 'bookings'} onClick={() => setPage('bookings')} />
                  <NavItem 
                    icon={Map} 
                    label="Live Trips" 
                    badge={
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot"></span>
                        {liveTripsCount}
                      </div>
                    } 
                    active={page === 'live'} 
                    onClick={() => setPage('live')} 
                  />
                  <NavItem icon={Users} label="Drivers" active={page === 'drivers'} onClick={() => setPage('drivers')} />
                  <NavItem icon={FileCheck} label="Applications" badge="3" active={page === 'applications'} onClick={() => setPage('applications')} />
                  <NavItem icon={Flag} label="Reports" badge="2" badgeVariant="urgent" active={page === 'reports'} onClick={() => setPage('reports')} />
                  <NavItem icon={Truck} label="Trip History" active={page === 'trips'} onClick={() => setPage('trips')} />
                  <NavItem icon={CalendarDays} label="Schedule" active={page === 'schedule'} onClick={() => setPage('schedule')} />
                  <NavItem icon={Car} label="Fleet" active={page === 'fleet'} onClick={() => setPage('fleet')} />
                </>
              ) : (
                <>
                  <NavItem icon={LayoutDashboard} label="Operations" active={page === 'operations'} onClick={() => setPage('operations')} />
                  <NavItem icon={Inbox} label="Bookings" badge="8" active={page === 'bookings'} onClick={() => setPage('bookings')} />
                  <NavItem 
                    icon={Map} 
                    label="Live Trips" 
                    badge={
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot"></span>
                        {liveTripsCount}
                      </div>
                    } 
                    active={page === 'live'} 
                    onClick={() => setPage('live')} 
                  />
                  <NavItem icon={Users} label="Drivers" active={page === 'drivers'} onClick={() => setPage('drivers')} />
                  <NavItem icon={Truck} label="Trip History" active={page === 'trips'} onClick={() => setPage('trips')} />
                  <NavItem icon={CalendarDays} label="Schedule" active={page === 'schedule'} onClick={() => setPage('schedule')} />
                  <NavItem icon={Car} label="Fleet" active={page === 'fleet'} onClick={() => setPage('fleet')} />
                </>
              )}
            </div>
          </div>
        </nav>

        <div className="p-3 border-t border-line space-y-1">
          <NavItem 
            icon={Settings} 
            label="Settings" 
            active={page === 'settings'} 
            onClick={() => setPage('settings')} 
          />
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[260px] flex flex-col min-w-0 h-screen overflow-y-auto bg-bg/50">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-line flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search trips, riders, drivers, plates..." 
                className="w-full bg-bg border-2 border-transparent focus:border-primary/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-ink-4 text-ink shadow-inner font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full border border-accent/10">
              <span className="w-2 h-2 rounded-full bg-accent pulse-dot"></span>
              <span className="text-xs font-bold text-accent">{liveTripsCount} Live · {activeDriversCount} Drivers Active</span>
            </div>

            <button 
              onClick={() => setPage('notifications')}
              className={`relative p-2 rounded-lg transition-colors ${page === 'notifications' ? 'bg-primary-light text-primary' : 'text-ink-3 hover:bg-bg'}`}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-urgent border-2 border-white rounded-full"></span>
            </button>

            <Button variant="primary-light" size="sm" icon={Phone} className="font-mono">
              (804) 555-LOGI
            </Button>

            <div className="w-px h-6 bg-line-2 mx-1"></div>

            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen(!profileOpen);
                }}
                className={`w-9 h-9 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 hover:shadow-sm ${profileOpen || page === 'settings' ? 'border-primary' : 'border-line hover:border-primary'}`}
                title="Account Settings"
              >
                <Avatar initials={role === 'admin' ? 'AD' : 'DS'} size="sm" className="w-full h-full" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-line overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-5 border-b border-line bg-bg/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar initials={role === 'admin' ? 'AD' : 'DS'} size="md" />
                      <div>
                        <p className="text-sm font-black text-ink leading-none capitalize">{role} User</p>
                        <p className="text-[10px] font-bold text-ink-4 mt-1">ID: #LOG-{role === 'admin' ? '882' : '941'}</p>
                      </div>
                    </div>
                    <Badge variant="primary-light" className="w-full justify-center py-1 text-[9px] uppercase tracking-widest">{role === 'admin' ? 'Administrator' : 'Dispatch Officer'}</Badge>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={() => setPage('settings')}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-ink-2 hover:bg-bg transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-ink-3 group-hover:text-primary" /> 
                        <span>Account Info</span>
                      </div>
                      <ChevronDown size={14} className="text-ink-4 -rotate-90" />
                    </button>
                    <button 
                      onClick={() => setPage('settings')}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-ink-2 hover:bg-bg transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Settings size={16} className="text-ink-3 group-hover:text-primary" /> 
                        <span>Settings</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => setPage('settings')}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-ink-2 hover:bg-bg transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Lock size={16} className="text-ink-3 group-hover:text-primary" /> 
                        <span>Security & Privacy</span>
                      </div>
                    </button>
                  </div>

                  <div className="p-2 border-t border-line bg-bg/20">
                    <button 
                      onClick={() => setPage('support')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-ink-2 hover:bg-bg transition-all"
                    >
                      <HelpCircle size={16} className="text-ink-3" /> Help & Support
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-urgent hover:bg-urgent-light transition-all mt-1"
                    >
                      <LogOut size={16} /> Log Out Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Shell;
