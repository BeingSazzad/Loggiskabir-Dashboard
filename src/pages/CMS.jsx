import React, { useState } from 'react';
import {
  FileText,
  Shield,
  HelpCircle,
  Info,
  Save,
  RotateCcw,
  Clock,
  ExternalLink,
  Edit3,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { Card, Button, Badge } from '../components/UI';

const CMS = () => {
  const [activePage, setActivePage] = useState('terms');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [content, setContent] = useState({
    terms: `1. Acceptance of Terms\nBy using LOGISS, you agree to these terms...\n\n2. Dispatcher Responsibility\nDispatchers must verify all medical requirements before assignment...`,
    privacy: `Your privacy is important to us. This policy explains how we collect and use your data to provide medical transportation services...`,
    faq: `Q: How to reset dispatcher password?\nA: Go to Security settings...\n\nQ: What is a Will-Call trip?\nA: A trip where the return time is not fixed...`
  });

  const handleSave = () => {
    setIsSaving(true);
    // Mocking API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const pages = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, lastUpdate: '2026-04-10' },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, lastUpdate: '2026-04-12' },
    { id: 'faq', label: 'Help & FAQ', icon: HelpCircle, lastUpdate: '2026-04-15' },
    { id: 'about', label: 'About Us', icon: Info, lastUpdate: '2026-03-20' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Content Management (CMS)</h1>
          <p className="text-ink-3 font-medium">Update legal pages and help content for the platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={RotateCcw}>Reset Changes</Button>
          <Button 
            variant="primary" 
            icon={isSaving ? null : Save} 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-accent text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle size={20} />
          <span className="text-sm font-bold">Content updated successfully and deployed to live apps!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-2">
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                activePage === page.id 
                ? 'border-primary bg-primary-tint/20 shadow-md' 
                : 'border-transparent bg-white hover:border-line hover:bg-bg'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${activePage === page.id ? 'bg-primary text-white' : 'bg-bg text-ink-3 group-hover:text-primary'}`}>
                  <page.icon size={18} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${activePage === page.id ? 'text-primary' : 'text-ink'}`}>{page.label}</p>
                  <p className="text-[9px] font-bold text-ink-4 uppercase tracking-widest mt-0.5">Updated {page.lastUpdate}</p>
                </div>
              </div>
              <ChevronRight size={14} className={activePage === page.id ? 'text-primary' : 'text-line'} />
            </button>
          ))}
        </aside>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-6">
          <Card className="p-0 overflow-hidden border-line-2">
            <div className="p-6 border-b border-line-2 bg-bg/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit3 size={18} className="text-primary" />
                <h3 className="text-lg font-bold text-ink">Editor: {pages.find(p => p.id === activePage)?.label}</h3>
              </div>
              <Badge variant="accent">Live on Production</Badge>
            </div>
            
            <div className="p-8">
              <div className="relative group">
                <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-bold text-primary uppercase tracking-widest">Page Markdown Content</div>
                <textarea 
                  className="w-full h-[500px] p-6 bg-white border-2 border-line rounded-2xl text-ink font-mono text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none scrollbar-hide resize-none shadow-inner"
                  value={content[activePage] || ''}
                  onChange={(e) => setContent({ ...content, [activePage]: e.target.value })}
                  placeholder="Start typing content here..."
                />
              </div>

              <div className="mt-8 flex items-center justify-between p-4 bg-bg rounded-2xl border border-line-2">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-ink-3" />
                  <p className="text-xs font-bold text-ink-3 italic">Autosave is disabled during manual edits.</p>
                </div>
                <div className="flex gap-4">
                   <button className="flex items-center gap-1.5 text-xs font-bold text-ink-3 hover:text-primary transition-colors">
                     <ExternalLink size={14} /> Preview Page
                   </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CMS;
