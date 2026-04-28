import React from 'react';
import { LogOut, ArrowRight, Truck } from 'lucide-react';
import { Button, Card } from '../components/UI';

const Logout = ({ onBackToLogin }) => {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-md p-10 text-center shadow-2xl border-line-2 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-primary-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/10">
          <LogOut size={40} className="text-primary" />
        </div>
        
        <h1 className="text-3xl font-extrabold font-display text-ink mb-2">Successfully Signed Out</h1>
        <p className="text-ink-3 font-medium mb-8">
          Your dispatch session has been securely ended. See you next time!
        </p>

        <div className="bg-bg/50 rounded-2xl p-6 border border-line-2 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
            <Truck size={24} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-ink-4 uppercase tracking-widest leading-none mb-1">LOGISS Console</p>
            <p className="text-sm font-bold text-ink">v1.0.4 Production Build</p>
          </div>
        </div>

        <Button 
          variant="primary" 
          fullWidth 
          className="h-12 text-lg shadow-lg shadow-primary/20" 
          icon={ArrowRight}
          onClick={onBackToLogin}
        >
          Back to Login
        </Button>

        <p className="mt-8 text-[10px] font-bold text-ink-4 uppercase tracking-[0.2em]">
          &copy; 2026 LOGISS Transportation Inc.
        </p>
      </Card>
    </div>
  );
};

export default Logout;
