import React, { useState } from 'react';
import { Truck, ShieldAlert, Navigation, ArrowRight, Mail, Lock } from 'lucide-react';
import { Button } from '../components/UI';

const Login = ({ setRole }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('demo@logiss.com');
  const [password, setPassword] = useState('password');

  const handleAuth = (e) => {
    e.preventDefault();
    // Simulate auth check, then move to role selection
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left Side: Image */}
      <div className="hidden lg:flex w-1/2 relative bg-ink items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent z-10 mix-blend-multiply pointer-events-none"></div>
        <img 
          src="/login-bg.png" 
          alt="Dispatch Center" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="relative z-20 text-left p-16 w-full max-w-2xl mt-auto">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20">
            <Truck size={32} />
          </div>
          <h1 className="font-display font-extrabold text-5xl tracking-tight text-white mb-4 leading-tight">
            Logistics &<br/>Fleet Operations
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            The market-standard SaaS platform for modern NEMT and fleet dispatching. Manage routes, drivers, and bookings in one place.
          </p>
        </div>
      </div>

      {/* Right Side: Auth */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white shadow-lg mb-4">
              <Truck size={24} />
            </div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-ink">LOGISS</h1>
          </div>

          {step === 1 ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-ink tracking-tight mb-2">Welcome back</h2>
                <p className="text-ink-3 text-sm font-medium">Enter your credentials to access the portal.</p>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-line rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-ink-3 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs font-bold text-primary hover:text-primary-dark">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-line rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full h-12 text-sm mt-4">
                  Continue <ArrowRight size={16} className="ml-2" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-ink tracking-tight mb-2">Select your role</h2>
                <p className="text-ink-3 text-sm font-medium">Choose your workspace to continue.</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setRole('dispatcher')}
                  className="w-full flex items-center justify-between p-5 border-2 border-line hover:border-primary hover:bg-primary-tint/20 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-bg rounded-lg flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                      <Navigation size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-bold text-ink mb-0.5">Dispatcher</h3>
                      <p className="text-xs font-medium text-ink-4">Manage bookings & live tracking</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </button>

                <button 
                  onClick={() => setRole('admin')}
                  className="w-full flex items-center justify-between p-5 border-2 border-line hover:border-accent hover:bg-accent-light/10 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-bg rounded-lg flex items-center justify-center text-accent group-hover:bg-white transition-colors">
                      <ShieldAlert size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-bold text-ink mb-0.5">System Admin</h3>
                      <p className="text-xs font-medium text-ink-4">Manage fleet, drivers & reports</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-accent opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </button>
              </div>
              
              <div className="mt-8">
                <button onClick={() => setStep(1)} className="text-sm font-bold text-ink-4 hover:text-ink transition-colors">
                  &larr; Back to login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
