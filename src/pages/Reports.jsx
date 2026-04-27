import React, { useState } from 'react';
import { 
  AlertTriangle, 
  UserX, 
  ShieldAlert, 
  Clock, 
  ChevronRight, 
  MessageSquare, 
  Phone, 
  CheckCircle2,
  Flag,
  ArrowRight
} from 'lucide-react';
import { Card, Avatar, Badge, Button } from '../components/UI';
import { reports, trips } from '../data/mockData';
import { timeAgo, formatDateTime } from '../utils/helpers';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [selectedReportId, setSelectedReportId] = useState('RPT-2024-0042');

  const filteredReports = reports.filter(r => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  const selectedReport = reports.find(r => r.id === selectedReportId) || filteredReports[0];

  const getSeverityIcon = (severity) => {
    if (severity === 'high') return <AlertTriangle size={18} className="text-urgent" />;
    if (severity === 'medium') return <UserX size={18} className="text-warning" />;
    return <ShieldAlert size={18} className="text-ink-4" />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Incident Reports</h1>
        <p className="text-ink-3 font-medium">Monitor and resolve safety and service issues</p>
      </div>

      <div className="flex items-center gap-1 border-b border-line-2">
        {['open', 'reviewing', 'resolved', 'all'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
          >
            {tab}
            {tab === 'open' && reports.filter(r => r.status === 'open').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-urgent-light text-urgent text-[10px]">1</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2">
          {filteredReports.map(report => (
            <Card 
              key={report.id} 
              hover 
              onClick={() => setSelectedReportId(report.id)}
              className={`p-4 ${selectedReportId === report.id ? 'border-primary bg-primary-tint/30' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(report.severity)}
                  <span className="font-mono text-[10px] font-bold text-ink-4 tracking-tighter uppercase">#{report.id}</span>
                </div>
                <Badge variant={report.severity === 'high' ? 'urgent' : (report.severity === 'medium' ? 'warning' : 'neutral')}>
                  {report.severity}
                </Badge>
              </div>
              <h4 className="text-sm font-bold text-ink mb-1">{report.type}</h4>
              <p className="text-[10px] font-semibold text-ink-3 mb-3">Filed by {report.filedBy.role} · {report.filedBy.name}</p>
              <div className="flex justify-between items-center text-[10px] font-bold text-ink-4 uppercase tracking-wider">
                <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(report.submitted)}</span>
                <span className="font-mono">Trip {report.tripId}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column: Detail */}
        <div className="lg:col-span-7 overflow-y-auto pr-2">
          {selectedReport ? (
            <Card className="flex flex-col">
              <div className="p-6 border-b border-line-2 flex items-center justify-between bg-tint/10">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-ink-3 tracking-tighter">#{selectedReport.id}</span>
                  <h2 className="text-lg font-bold font-display text-ink uppercase tracking-tight">{selectedReport.type}</h2>
                </div>
                <Badge variant={selectedReport.status === 'open' ? 'urgent' : (selectedReport.status === 'reviewing' ? 'warning' : 'accent')}>
                  {selectedReport.status}
                </Badge>
              </div>

              <div className="p-6 space-y-8">
                {selectedReport.severity === 'high' && (
                  <div className="bg-urgent-light p-4 rounded-xl border border-urgent/20 flex items-center gap-3">
                    <AlertTriangle className="text-urgent" size={20} />
                    <div>
                      <p className="text-xs font-bold text-urgent uppercase tracking-widest">High Severity Alert</p>
                      <p className="text-sm font-medium text-urgent/80">This report requires immediate dispatcher intervention.</p>
                    </div>
                  </div>
                )}

                <section>
                  <h4 className="text-xs font-bold text-ink-4 uppercase tracking-widest mb-3">Description</h4>
                  <div className="bg-bg rounded-xl border border-line-2 p-4">
                    <p className="text-sm font-medium text-ink leading-relaxed">
                      {selectedReport.description}
                    </p>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-6">
                  {/* Parties */}
                  <section>
                    <h4 className="text-xs font-bold text-ink-4 uppercase tracking-widest mb-3">Filed By</h4>
                    <div className="p-3 bg-bg rounded-xl border border-line-2 flex items-center gap-3">
                      <Avatar initials={selectedReport.filedBy.name.split(' ').map(n => n[0]).join('')} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-ink">{selectedReport.filedBy.name}</p>
                        <p className="text-[10px] font-bold text-ink-3 uppercase">{selectedReport.filedBy.role}</p>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-xs font-bold text-ink-4 uppercase tracking-widest mb-3">Subject</h4>
                    <div className="p-3 bg-bg rounded-xl border border-line-2 flex items-center gap-3">
                      <Avatar initials={selectedReport.subject.name.split(' ').map(n => n[0]).join('')} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-ink">{selectedReport.subject.name}</p>
                        <p className="text-[10px] font-bold text-ink-3 uppercase">{selectedReport.subject.role}</p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Related Trip */}
                <section>
                  <h4 className="text-xs font-bold text-ink-4 uppercase tracking-widest mb-3">Related Trip</h4>
                  <Card hover className="p-4 flex items-center justify-between border-line-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary-light text-primary rounded-lg"><Flag size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-ink font-mono">{selectedReport.tripId}</p>
                        <p className="text-[10px] text-ink-3">{formatDateTime(selectedReport.submitted)}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-ink-4" />
                  </Card>
                </section>
              </div>

              <div className="p-4 bg-white border-t border-line-2 flex gap-3">
                <Button variant="outline" className="flex-1" icon={MessageSquare}>Contact Parties</Button>
                <Button variant="ghost" className="text-urgent hover:bg-urgent-light flex-1">Dismiss Report</Button>
                <Button variant="primary" className="flex-1" icon={CheckCircle2}>Mark Resolved</Button>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-ink-4 font-bold">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
