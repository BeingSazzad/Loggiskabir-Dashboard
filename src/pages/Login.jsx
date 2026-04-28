import React from 'react';
import { Truck, ShieldAlert, Navigation } from 'lucide-react';
import { Button } from '../components/UI';

const Login = ({ setRole }) => {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-white border border-line-2 p-10 rounded-2xl shadow-xl w-full max-w-md z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-6">
            <Truck size={32} />
          </div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-ink mb-2">LOGISS Portal</h1>
          <p className="text-sm font-medium text-ink-3">Select your role to access the dashboard</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setRole('dispatcher')}
            className="w-full flex items-center justify-between p-4 border-2 border-line hover:border-primary hover:bg-primary-tint/20 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                <Navigation size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-ink">Dispatcher</h3>
                <p className="text-[10px] font-medium text-ink-4">Manage bookings & live tracking</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setRole('admin')}
            className="w-full flex items-center justify-between p-4 border-2 border-line hover:border-accent hover:bg-accent-light/10 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center text-accent group-hover:bg-white transition-colors">
                <ShieldAlert size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-ink">System Admin</h3>
                <p className="text-[10px] font-medium text-ink-4">Manage fleet, drivers & reports</p>
              </div>
            </div>
          </button>
        </div>
        
        <div className="mt-8 text-center border-t border-line-2 pt-6">
          <p className="text-[10px] font-semibold text-ink-4 uppercase tracking-widest">Secure Login Validation</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
