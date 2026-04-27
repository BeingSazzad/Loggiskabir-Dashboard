import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  User, 
  Car, 
  ShieldCheck, 
  AlertCircle, 
  Mail, 
  Phone, 
  FileCheck,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { Card, Avatar, Badge, Button } from '../components/UI';
import { applications } from '../data/mockData';
import { timeAgo } from '../utils/helpers';

const Applications = () => {
  const [selectedAppId, setSelectedAppId] = useState('APP-2024-1847');
  const selectedApp = applications.find(a => a.id === selectedAppId);

  const stages = [
    { id: 1, label: 'Submitted' },
    { id: 2, label: 'Under Review' },
    { id: 3, label: 'Background Check' },
    { id: 4, label: 'Approved' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Driver Applications</h1>
        <p className="text-ink-3 font-medium">Review and approve new driver onboarding requests</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2">
          {applications.map(app => (
            <Card 
              key={app.id} 
              hover 
              onClick={() => setSelectedAppId(app.id)}
              className={`p-4 ${selectedAppId === app.id ? 'border-primary bg-primary-tint/30' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] font-bold text-ink-4 tracking-tighter uppercase">#{app.id}</span>
                <span className="text-[10px] font-bold text-ink-4">{timeAgo(app.submitted)}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Avatar initials={app.initials} size="sm" />
                <div>
                  <h4 className="text-sm font-bold text-ink">{app.name}</h4>
                  <p className="text-[10px] font-semibold text-ink-3 flex items-center gap-1">
                    <MapPin size={10} /> {app.county}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <Badge variant="neutral">{app.vehicle.type}</Badge>
                <Badge variant="neutral">{app.experience} exp</Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className={app.stage === 4 ? 'text-accent' : 'text-warning'}>Stage {app.stage}/4: {stages.find(s => s.id === app.stage).label}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full ${s < app.stage ? 'bg-accent' : (s === app.stage ? 'bg-warning' : 'bg-line-2')}`}></div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column: Detail */}
        <div className="lg:col-span-7 overflow-y-auto pr-2">
          {selectedApp ? (
            <Card className="flex flex-col">
              <div className="p-6 border-b border-line-2 flex items-center justify-between bg-tint/10">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-ink-3 tracking-tighter">#{selectedApp.id}</span>
                  <h2 className="text-lg font-bold font-display text-ink">Application Details</h2>
                </div>
                <Badge variant="warning">{stages.find(s => s.id === selectedApp.stage).label}</Badge>
              </div>

              <div className="p-6 space-y-8">
                {/* Stage Timeline */}
                <section>
                  <div className="bg-bg p-4 rounded-xl border border-line-2">
                    <div className="flex justify-between relative">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-line-2 -translate-y-1/2 -z-10"></div>
                      {stages.map(s => (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-bg px-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            s.id < selectedApp.stage ? 'bg-accent border-accent text-white' : 
                            (s.id === selectedApp.stage ? 'bg-white border-warning text-warning ring-4 ring-warning-light' : 'bg-white border-line-2 text-ink-4')
                          }`}>
                            {s.id < selectedApp.stage ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{s.id}</span>}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${s.id === selectedApp.stage ? 'text-warning' : (s.id < selectedApp.stage ? 'text-accent' : 'text-ink-4')}`}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Personal Information */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-4">Personal Information</h4>
                  <div className="flex items-center gap-6">
                    <Avatar initials={selectedApp.initials} size="xl" />
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 flex-1">
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Full Name</p>
                        <p className="text-sm font-bold text-ink">{selectedApp.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">County</p>
                        <p className="text-sm font-bold text-ink">{selectedApp.county}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Phone</p>
                        <p className="text-sm font-bold text-ink">(804) 555-9218</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Email</p>
                        <p className="text-sm font-bold text-ink">{selectedApp.name.toLowerCase().replace(' ', '.')}@email.com</p>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-8">
                  {/* Driver's License */}
                  <section>
                    <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Driver's License</h4>
                    <div className="bg-bg rounded-xl border border-line-2 p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">License No.</p>
                        <p className="text-xs font-bold font-mono text-ink tracking-tight uppercase">{selectedApp.license.number}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Class</p>
                        <p className="text-xs font-bold text-ink">{selectedApp.license.class}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Expires</p>
                        <p className="text-xs font-bold text-ink">{selectedApp.license.expires}</p>
                      </div>
                    </div>
                  </section>

                  {/* Vehicle & Insurance */}
                  <section>
                    <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Vehicle & Insurance</h4>
                    <div className="bg-bg rounded-xl border border-line-2 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Car size={14} className="text-ink-4" />
                        <p className="text-xs font-bold text-ink">{selectedApp.vehicle.year} {selectedApp.vehicle.make}</p>
                        <Badge variant="neutral">{selectedApp.vehicle.type}</Badge>
                      </div>
                      <div className="flex justify-between items-center border-t border-line-2 pt-2">
                        <div>
                          <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Policy</p>
                          <p className="text-xs font-bold font-mono text-ink tracking-tight uppercase">INS-88291</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Expires</p>
                          <p className="text-xs font-bold text-ink">2025-12-14</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Certifications */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Certifications & Experience</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedApp.certs.map(cert => (
                      <Badge key={cert} variant="accent" className="py-1 px-3">{cert} Certified</Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-bg rounded-xl border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Experience</p>
                      <p className="text-xs font-bold text-ink">{selectedApp.experience}</p>
                    </div>
                    <div className="p-3 bg-bg rounded-xl border border-line-2">
                      <p className="text-[10px] font-bold text-ink-4 uppercase mb-0.5">Background Check</p>
                      <p className="text-xs font-bold text-accent flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Authorized
                      </p>
                    </div>
                  </div>
                </section>

                {/* Checklist */}
                <section>
                  <h4 className="text-xs font-bold text-ink uppercase tracking-widest mb-3">Document Verification</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Driver License Photo', verified: true },
                      { label: 'Insurance Certificate', verified: true },
                      { label: 'Vehicle Registration', verified: false },
                      { label: 'NEMT Certification', verified: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-bg border border-line-2">
                        <span className="text-xs font-bold text-ink">{item.label}</span>
                        {item.verified ? (
                          <div className="flex items-center gap-1.5 text-accent text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 size={14} /> Verified
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-warning text-[10px] font-bold uppercase tracking-wider">
                            <AlertCircle size={14} /> Pending
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-4 bg-white border-t border-line-2 flex gap-3">
                <Button variant="ghost" className="text-urgent hover:bg-urgent-light flex-1" icon={XCircle}>Reject</Button>
                <Button variant="outline" className="flex-1" icon={MoreHorizontal}>Request More Info</Button>
                <Button variant="primary" className="flex-1" icon={FileCheck}>Approve & Onboard</Button>
              </div>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-ink-4 font-bold">Select an application to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
