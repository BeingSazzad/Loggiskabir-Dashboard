import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Car, 
  Calendar,
  Activity,
  AlertTriangle,
  FileCheck,
  CreditCard
} from 'lucide-react';
import { Card, StatCard, Badge, Avatar } from '../components/UI';
import { trips, drivers } from '../data/mockData';
import { money } from '../utils/helpers';

const AdminDashboard = ({ setPage }) => {
  const [yearFilter, setYearFilter] = useState('2026');

  // KPI Calculations
  const totalVehicles = drivers.filter(d => d.vehicle).length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const totalTripsThisMonth = trips.filter(t => new Date(t.scheduledTime).getMonth() === new Date().getMonth()).length;
  const revenueThisMonth = trips
    .filter(t => new Date(t.scheduledTime).getMonth() === new Date().getMonth() && t.status === 'completed')
    .reduce((acc, curr) => acc + curr.cost, 0);

  // Mock Monthly Revenue Data (for 12 months)
  const monthlyData = [
    { month: 'Jan', trips: 420, revenue: 12500 },
    { month: 'Feb', trips: 380, revenue: 11200 },
    { month: 'Mar', trips: 450, revenue: 13800 },
    { month: 'Apr', trips: totalTripsThisMonth + 300, revenue: revenueThisMonth + 10000 },
    { month: 'May', trips: 0, revenue: 0 },
    { month: 'Jun', trips: 0, revenue: 0 },
    { month: 'Jul', trips: 0, revenue: 0 },
    { month: 'Aug', trips: 0, revenue: 0 },
    { month: 'Sep', trips: 0, revenue: 0 },
    { month: 'Oct', trips: 0, revenue: 0 },
    { month: 'Nov', trips: 0, revenue: 0 },
    { month: 'Dec', trips: 0, revenue: 0 },
  ];

  const maxRevenue = 15000; // For chart scaling

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Executive Dashboard</h1>
        <p className="text-ink-3 font-medium">Platform-wide overview and business performance metrics</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Fleet Vehicles" 
          value={totalVehicles} 
          icon={Car} 
          trend="+2 this month"
          accent="primary"
        />
        <StatCard
          label="Total Active Drivers"
          value={activeDrivers}
          icon={Users}
          trend="8 pending approval"
          accent="accent"
        />
        <StatCard
          label="Total Trips (Month)"
          value={totalTripsThisMonth + 300}
          icon={Calendar}
          trend="+12% vs last month"
          accent="primary"
        />
        <StatCard
          label="Revenue (Month)"
          value={money(revenueThisMonth + 10000)}
          icon={TrendingUp}
          trend="+8% vs last month"
          accent="accent"
        />
      </div>

      {/* Revenue Chart Area */}
      <Card className="p-6 border-line-2">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Revenue & Trip Analytics</h3>
            <p className="text-sm font-medium text-ink-4">12-month performance overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-xs font-bold text-ink-3 mr-4">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary/20"></span> Trips Volume</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent"></span> Total Revenue</div>
            </div>
            <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-bg border border-line rounded-xl py-2 px-4 text-xs font-bold focus:ring-4 focus:ring-primary/10 outline-none"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>

        {/* CSS Bar Chart */}
        <div className="relative h-[300px] w-full flex items-end justify-between pt-6 mt-4 border-b border-line-2 pb-2">
          {/* Y-Axis Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
            {[4, 3, 2, 1, 0].map(line => (
              <div key={line} className="flex items-center w-full gap-4">
                <span className="w-12 text-right text-[10px] font-bold text-ink-4 font-mono">{money((maxRevenue / 4) * line)}</span>
                <div className="flex-1 border-t border-dashed border-line-2"></div>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="w-full flex items-end justify-around h-full pl-16 z-10 pb-6">
            {monthlyData.map((data, idx) => {
              const tripHeight = (data.trips / 500) * 100; // max 500 trips
              const revenueHeight = (data.revenue / maxRevenue) * 100;
              
              return (
                <div key={idx} className="relative flex flex-col items-center justify-end h-full w-full group">
                  <div className="flex items-end gap-1 w-full justify-center h-full">
                    {/* Trip Bar */}
                    <div 
                      className="w-3 md:w-5 bg-primary/20 rounded-t-sm transition-all duration-500 group-hover:bg-primary/40"
                      style={{ height: `${tripHeight}%` }}
                    ></div>
                    {/* Revenue Bar */}
                    <div 
                      className="w-3 md:w-5 bg-accent rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                      style={{ height: `${revenueHeight}%` }}
                    ></div>
                  </div>
                  <span className="absolute -bottom-8 text-[10px] font-bold text-ink-3 uppercase">{data.month}</span>
                  
                  {/* Tooltip */}
                  {data.revenue > 0 && (
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-ink text-white text-[10px] p-2 rounded-lg pointer-events-none whitespace-nowrap z-20">
                      <p className="font-bold">{data.trips} Trips</p>
                      <p className="text-primary-light font-mono">{money(data.revenue)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* System Status / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-line-2">
          <h3 className="text-sm font-extrabold text-ink mb-4 flex items-center gap-2"><Activity size={16} className="text-primary" /> System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-bg rounded-xl">
              <span className="text-xs font-bold text-ink-3">API Sync Status</span>
              <Badge variant="accent">Healthy</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-bg rounded-xl">
              <span className="text-xs font-bold text-ink-3">Payment Gateway</span>
              <Badge variant="accent">Online</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-urgent-light/30 rounded-xl border border-urgent/10">
              <span className="text-xs font-bold text-urgent flex items-center gap-1.5"><AlertTriangle size={12}/> Failed Webhooks</span>
              <span className="text-xs font-bold text-urgent">3 issues</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-line-2">
           <h3 className="text-sm font-extrabold text-ink mb-4 flex items-center gap-2"><FileCheck size={16} className="text-primary" /> Pending Approvals</h3>
           <div className="space-y-3">
             {[1,2,3].map(i => (
               <div key={i} className="flex items-center gap-3 p-3 bg-bg hover:bg-line-2 transition-colors rounded-xl cursor-pointer" onClick={() => setPage('applications')}>
                 <Avatar initials={`D${i}`} size="xs" />
                 <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-ink truncate">New Driver Registration</p>
                   <p className="text-[9px] text-ink-4 uppercase tracking-widest">Awaiting Background Check</p>
                 </div>
                 <Badge variant="warning">Review</Badge>
               </div>
             ))}
           </div>
        </Card>

        <Card className="p-6 border-line-2 bg-gradient-to-br from-primary-dark to-ink text-white">
          <h3 className="text-sm font-extrabold text-white mb-2 flex items-center gap-2"><CreditCard size={16} /> Subscription & Billing</h3>
          <p className="text-xs text-primary-light mb-6 leading-relaxed">Your SaaS enterprise plan will renew on May 1st, 2026. You have 24/50 dispatcher seats used.</p>
          
          <div className="space-y-3">
             <div className="flex justify-between text-xs">
                <span className="font-bold">Plan Usage</span>
                <span className="font-mono text-primary-tint">48%</span>
             </div>
             <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full w-[48%]"></div>
             </div>
          </div>
          
          <button onClick={() => setPage('settings')} className="mt-6 w-full py-2.5 bg-white text-ink text-xs font-bold rounded-xl hover:bg-bg transition-colors">
            Manage Subscription
          </button>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboard;
