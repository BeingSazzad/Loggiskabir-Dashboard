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
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  MoreVertical,
  Ban,
  Slash,
  Navigation,
  XCircle,
  X,
  LayoutGrid
} from 'lucide-react';
import { Card, Avatar, Badge, Button } from '../components/UI';
import { reports } from '../data/mockData';
import { timeAgo, formatDateTime } from '../utils/helpers';

// --- PROFESSIONAL WEB-DASHBOARD MODALS ---

const CreateReportModal = ({ onClose, onSave }) => {
  const [reason, setReason] = useState('Rider not present');
  const reasons = [
    { id: 'Rider not present', label: 'Rider not present', sub: 'Passenger is not available at the pickup location.' },
    { id: 'Incorrect pickup location', label: 'Incorrect pickup location', sub: 'Pickup address is missing or cannot be located.' },
    { id: 'Rider behavior issue', label: 'Rider behavior issue', sub: 'Passenger behavior caused a problem during the trip.' },
    { id: 'Excessive wait time', label: 'Excessive wait time', sub: 'Passenger caused an unusually long wait at pickup.' },
    { id: 'Other reason', label: 'Other reason', sub: "I'll explain to dispatch if needed" },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <Card className="relative w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl border-line-2">
        <div className="flex items-center justify-between p-6 border-b border-line-2 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-urgent-light rounded-xl flex items-center justify-center border border-urgent/10">
              <AlertOctagon size={20} className="text-urgent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink leading-none">Report Incident</h2>
              <p className="text-xs text-ink-3 mt-1 font-medium">Flag a safety or service issue for internal review.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg rounded-lg text-ink-4 transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasons.map(r => (
            <label key={r.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${reason === r.id ? 'border-urgent bg-urgent-light/20 shadow-sm' : 'border-line-2 hover:border-line'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${reason === r.id ? 'border-urgent' : 'border-line-2'}`}>
                {reason === r.id && <div className="w-2.5 h-2.5 rounded-full bg-urgent"></div>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{r.label}</p>
                <p className="text-[10px] font-medium text-ink-3 leading-tight mt-0.5">{r.sub}</p>
              </div>
              <input type="radio" className="hidden" name="reason" checked={reason === r.id} onChange={() => setReason(r.id)} />
            </label>
          ))}
        </div>

        <div className="p-6 bg-bg/50 border-t border-line-2 flex justify-end gap-3">
          <Button variant="ghost" className="px-8" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="px-8 bg-urgent hover:bg-urgent-dark border-none shadow-lg shadow-urgent/20" onClick={() => onSave(reason)}>File Report</Button>
        </div>
      </Card>
    </div>
  );
};

const CancelTripModal = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('Rider Request');
  const reasons = [
    { id: 'Rider Request', label: 'Rider Requested Cancellation', sub: 'Rider called to cancel due to personal reasons or schedule change.' },
    { id: 'No Driver', label: 'No Driver Available', sub: 'Could not find a compatible driver for this time/route.' },
    { id: 'Vehicle Issue', label: 'Vehicle / Technical Issue', sub: 'Assigned vehicle breakdown or system-related error.' },
    { id: 'No Show', label: 'Rider No-Show', sub: 'Driver reached pickup point but rider was not present.' },
    { id: 'Admin Error', label: 'Administrative / Duplicate', sub: "Incorrect data entry or duplicate booking found." },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <Card className="relative w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl border-line-2">
        <div className="flex items-center justify-between p-6 border-b border-line-2 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-urgent-light rounded-xl flex items-center justify-center border border-urgent/10">
              <AlertTriangle size={20} className="text-urgent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink leading-none">Cancel Booking</h2>
              <p className="text-xs text-ink-3 mt-1 font-medium">Please select the official reason for this cancellation.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg rounded-lg text-ink-4 transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          {reasons.map(r => (
            <label key={r.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${reason === r.id ? 'border-urgent bg-urgent-light/20 shadow-sm' : 'border-line-2 hover:border-line'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${reason === r.id ? 'border-urgent' : 'border-line-2'}`}>
                {reason === r.id && <div className="w-2.5 h-2.5 rounded-full bg-urgent"></div>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{r.label}</p>
                <p className="text-[10px] font-medium text-ink-3 leading-tight mt-0.5">{r.sub}</p>
              </div>
              <input type="radio" className="hidden" name="reason" checked={reason === r.id} onChange={() => setReason(r.id)} />
            </label>
          ))}
        </div>

        <div className="p-6 bg-bg/50 border-t border-line-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Clock size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Free cancellation window active</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="px-8" onClick={onClose}>Keep Booking</Button>
            <Button variant="primary" className="px-8 bg-urgent hover:bg-urgent-dark border-none shadow-lg shadow-urgent/20" onClick={() => onConfirm(reason)}>Confirm Cancellation</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- MAIN REPORTS COMPONENT ---

const Reports = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [filterType, setFilterType] = useState('all'); 
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredReports = reports.filter(r => {
    const matchesStatus = activeTab === 'all' ? true : r.status === activeTab;
    const matchesType = filterType === 'all' ? true : r.filedBy.role.toLowerCase() === filterType;
    return matchesStatus && matchesType;
  });

  const selectedReport = reports.find(r => r.id === selectedReportId) || filteredReports[0];

  const getSeverityIcon = (severity) => {
    if (severity === 'high') return <AlertOctagon size={18} className="text-urgent" />;
    if (severity === 'medium') return <AlertTriangle size={18} className="text-warning" />;
    return <ShieldAlert size={18} className="text-ink-4" />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Incident Center</h1>
          <p className="text-ink-3 font-medium">Manage and resolve reports between riders and drivers</p>
        </div>
        <div className="flex gap-3 items-center">
          <Button variant="outline" icon={AlertTriangle} onClick={() => setShowCreateModal(true)} className="border-urgent/20 text-urgent hover:bg-urgent-light">Manual Report</Button>
          <div className="flex bg-bg p-1 rounded-xl border border-line-2">
            {['all', 'rider', 'driver'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${filterType === type ? 'bg-white text-primary shadow-sm' : 'text-ink-3 hover:text-ink-2'}`}
              >
                {type === 'all' ? 'All Sources' : `${type}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && <CreateReportModal onClose={() => setShowCreateModal(false)} onSave={(res) => { setShowCreateModal(false); }} />}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[calc(100vh-250px)]">
        {/* Leftmost Navigation Tab Strip */}
        <div className="lg:col-span-1 flex flex-col gap-4 border-r border-line-2 pr-4">
          {['open', 'reviewing', 'resolved', 'all'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all gap-1.5 ${
                activeTab === tab 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                : 'text-ink-4 hover:bg-bg hover:text-ink'
              }`}
            >
              <div className="relative">
                {tab === 'open' && <AlertOctagon size={20} />}
                {tab === 'reviewing' && <Clock size={20} />}
                {tab === 'resolved' && <CheckCircle2 size={20} />}
                {tab === 'all' && <LayoutGrid size={20} />}
                
                {tab === 'open' && reports.filter(r => r.status === 'open').length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-urgent text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                    {reports.filter(r => r.status === 'open').length}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">{tab}</span>
            </button>
          ))}
        </div>

        {/* Middle Column: List */}
        <div className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
          {filteredReports.length > 0 ? filteredReports.map(report => (
            <Card 
              key={report.id} 
              hover 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedReportId(report.id);
              }}
              className={`p-4 border-2 transition-all cursor-pointer ${selectedReportId === report.id ? 'border-primary bg-primary-tint/5' : 'border-transparent'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(report.severity)}
                  <span className="font-mono text-[10px] font-bold text-ink-3">#{report.id}</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                  report.severity === 'high' ? 'bg-urgent-light text-urgent' : (report.severity === 'medium' ? 'bg-warning-light text-warning-dark' : 'bg-bg text-ink-4')
                }`}>
                  {report.severity}
                </div>
              </div>
              
              <h4 className="text-sm font-bold text-ink mb-3 line-clamp-1">{report.type}</h4>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Avatar initials={report.filedBy.name[0]} size="xs" className="ring-2 ring-white" />
                  <div className="w-6 h-6 rounded-full bg-bg flex items-center justify-center ring-2 ring-white">
                    <ArrowRight size={10} className="text-ink-4" />
                  </div>
                  <Avatar initials={report.subject.name[0]} size="xs" className="ring-2 ring-white" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-bold text-ink truncate">{report.filedBy.name}</p>
                   <p className="text-[9px] text-ink-3 font-semibold tracking-wide uppercase italic">vs {report.subject.name}</p>
                </div>
                <span className="text-[9px] font-bold text-ink-4 whitespace-nowrap">{timeAgo(report.submitted)}</span>
              </div>
            </Card>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-bg/50 rounded-2xl border-2 border-dashed border-line-2">
              <ShieldCheck size={40} className="text-ink-4 mb-3" />
              <p className="text-ink-3 font-bold">No reports found</p>
            </div>
          )}
        </div>

        {/* Right Column: Detail */}
        <div className="lg:col-span-8 overflow-hidden h-full">
          {selectedReport ? (
            <Card className="h-full flex flex-col overflow-hidden border-line-2 shadow-xl">
              <div className="p-6 border-b border-line-2 flex items-center justify-between bg-tint/5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${
                    selectedReport.severity === 'high' ? 'bg-urgent-light text-urgent' : 'bg-primary-light text-primary'
                  }`}>
                    {getSeverityIcon(selectedReport.severity)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display text-ink leading-tight">{selectedReport.type}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-bold text-ink-3">#{selectedReport.id}</span>
                      <span className="w-1 h-1 bg-line-2 rounded-full"></span>
                      <span className="text-xs font-bold text-primary italic uppercase tracking-wider">{selectedReport.status}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" icon={MoreVertical} />
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                {/* Summary Alert */}
                {selectedReport.severity === 'high' && (
                  <div className="bg-urgent-light/50 p-5 rounded-2xl border border-urgent/20 flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                    <AlertTriangle className="text-urgent mt-1" size={24} />
                    <div>
                      <p className="text-sm font-extrabold text-urgent uppercase tracking-widest mb-1">Immediate Attention Required</p>
                      <p className="text-sm font-medium text-urgent/80 leading-relaxed">
                        This incident has been flagged for potential safety violation. Review the details and contact the parties immediately.
                      </p>
                    </div>
                  </div>
                )}

                {/* Conflict View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-bg/50 p-5 rounded-2xl border border-line-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest">The Filer (Claimant)</h4>
                      <Badge variant="neutral">Filer</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar initials={selectedReport.filedBy.name[0]} size="lg" />
                      <div>
                        <p className="text-lg font-bold text-ink leading-tight">{selectedReport.filedBy.name}</p>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">{selectedReport.filedBy.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" icon={Phone}>Call</Button>
                      <Button variant="outline" size="sm" className="flex-1" icon={MessageSquare}>Chat</Button>
                    </div>
                  </section>

                  <section className="bg-bg/50 p-5 rounded-2xl border border-line-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest">The Subject (Accused)</h4>
                      <Badge variant="urgent">Subject</Badge>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar initials={selectedReport.subject.name[0]} size="lg" />
                      <div>
                        <p className="text-lg font-bold text-ink leading-tight">{selectedReport.subject.name}</p>
                        <p className="text-xs font-bold text-urgent uppercase tracking-widest">{selectedReport.subject.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" icon={Phone}>Call</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-urgent hover:bg-urgent-light" icon={Ban}>Restrict</Button>
                    </div>
                  </section>
                </div>

                {/* Incident Details */}
                <section>
                  <h4 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare size={14} /> Statement of Incident
                  </h4>
                  <div className="bg-white rounded-2xl border-2 border-line-2 p-6 shadow-sm italic relative">
                    <span className="absolute -top-3 left-6 bg-white px-2 text-2xl text-line font-serif">"</span>
                    <p className="text-sm font-medium text-ink-2 leading-relaxed">
                      {selectedReport.description}
                    </p>
                  </div>
                </section>

                {/* Related Trip Info */}
                <section>
                  <h4 className="text-[10px] font-bold text-ink-4 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Flag size={14} /> Associated Record
                  </h4>
                  <Card hover className="p-5 flex items-center justify-between bg-tint/5 border-line-2 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-line-2">
                        <Navigation size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink font-mono uppercase tracking-tighter">Trip ID: {selectedReport.tripId}</p>
                        <p className="text-[11px] text-ink-3 font-medium">Submitted on {formatDateTime(selectedReport.submitted)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" icon={ChevronRight} className="group-hover:translate-x-1 transition-transform" />
                  </Card>
                </section>
              </div>

              <div className="p-6 bg-white border-t border-line-2 flex flex-col md:flex-row gap-4 shrink-0">
                <div className="flex flex-1 gap-3">
                  <Button 
                    variant="outline" 
                    className="text-ink-4 hover:text-ink flex-1 h-12" 
                    icon={Slash}
                    onClick={() => setActiveTab('resolved')}
                  >
                    Dismiss
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-warning/20 text-warning-dark hover:bg-warning-light h-12" 
                    icon={AlertTriangle}
                  >
                    Warning
                  </Button>
                </div>
                <Button 
                  variant="primary" 
                  className="flex-1 h-12 shadow-lg shadow-primary/20" 
                  icon={CheckCircle2}
                  onClick={() => setActiveTab('resolved')}
                >
                  Resolve Case
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-bg/30 rounded-3xl border-2 border-dashed border-line-2">
              <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                <ShieldAlert size={48} className="text-ink-4" />
              </div>
              <p className="text-ink-3 font-bold">Select an incident to investigate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
export { CreateReportModal, CancelTripModal };
