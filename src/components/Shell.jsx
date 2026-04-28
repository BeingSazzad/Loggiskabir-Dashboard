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
  Car
} from 'lucide-react';
import { Avatar, Badge, Button } from './UI';

const NavItem = ({ icon: Icon, label, badge, active, onClick, badgeVariant = 'neutral' }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group ${
      active ? 'bg-primary-light text-primary' : 'text-ink-2 hover:bg-bg'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-primary' : 'text-ink-3 group-hover:text-ink-2'} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <Badge variant={badgeVariant}>{badge}</Badge>
    )}
  </div>
);

const Shell = ({ children, currentPage, setPage, role, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-line fixed h-full flex flex-col z-20">
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Truck size={20} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-tight text-ink leading-none">LOGISS</h1>
            <span className="text-[9px] font-bold tracking-[0.2em] text-ink-4 uppercase">
              {role === 'admin' ? 'Admin Portal' : 'Dispatcher'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <div>
            <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-4">Operations</h3>
            <div className="space-y-1">
              <NavItem 
                icon={LayoutDashboard} 
                label="Operations" 
                active={currentPage === 'operations'} 
                onClick={() => setPage('operations')} 
              />
              <NavItem 
                icon={Inbox} 
                label="Bookings" 
                badge="3" 
                active={currentPage === 'bookings'} 
                onClick={() => setPage('bookings')} 
              />
              <NavItem 
                icon={Map} 
                label="Live Trips" 
                badge={
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot"></span>
                    1
                  </div>
                } 
                active={currentPage === 'live'} 
                onClick={() => setPage('live')} 
              />
              <NavItem 
                icon={Users} 
                label="Drivers" 
                active={currentPage === 'drivers'} 
                onClick={() => setPage('drivers')} 
              />
              {role === 'admin' && (
                <>
                  <NavItem 
                    icon={FileCheck} 
                    label="Applications" 
                    badge="3" 
                    active={currentPage === 'applications'} 
                    onClick={() => setPage('applications')} 
                  />
                  <NavItem 
                    icon={Flag} 
                    label="Reports" 
                    badge="2" 
                    badgeVariant="urgent"
                    active={currentPage === 'reports'} 
                    onClick={() => setPage('reports')} 
                  />
                </>
              )}
              <NavItem 
                icon={Truck} 
                label="Trip History" 
                active={currentPage === 'trips'} 
                onClick={() => setPage('trips')} 
              />
              <NavItem 
                icon={CalendarDays} 
                label="Schedule" 
                active={currentPage === 'schedule'} 
                onClick={() => setPage('schedule')} 
              />
              <NavItem 
                icon={Car} 
                label="Fleet" 
                active={currentPage === 'fleet'} 
                onClick={() => setPage('fleet')} 
              />
            </div>
          </div>
        </nav>

        {role === 'admin' && (
          <div className="p-3 border-t border-line">
            <NavItem 
              icon={Settings} 
              label="Settings" 
              active={currentPage === 'settings'} 
              onClick={() => setPage('settings')} 
            />
          </div>
        )}

        <div className="p-4 border-t border-line bg-tint/30 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar initials={role === 'admin' ? 'AD' : 'DS'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink truncate">
                {role === 'admin' ? 'Admin User' : 'Dispatcher User'}
              </p>
              <p className="text-[10px] font-semibold text-ink-3 capitalize">{role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-urgent bg-urgent-light/50 hover:bg-urgent-light rounded-xl transition-colors shadow-sm cursor-pointer z-50"
            title="Logout"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[240px] flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-line flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search trips, riders, drivers, plates..." 
                className="w-full bg-bg border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-ink-4 text-ink"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full border border-accent/10">
              <span className="w-2 h-2 rounded-full bg-accent pulse-dot"></span>
              <span className="text-xs font-bold text-accent">1 Live · 4 Drivers Active</span>
            </div>

            <button className="relative p-2 text-ink-3 hover:bg-bg rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-urgent border-2 border-white rounded-full"></span>
            </button>

            <Button variant="primary-light" size="sm" icon={Phone} className="font-mono">
              (804) 555-LOGI
            </Button>
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
