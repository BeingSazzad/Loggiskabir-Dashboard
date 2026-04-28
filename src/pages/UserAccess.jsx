import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  MoreVertical,
  Mail,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../components/UI';

const UserAccess = () => {
  const [users, setUsers] = useState([
    { id: 'LOG-882', name: 'Admin User', email: 'admin@logiss.com', role: 'admin', status: 'active', lastLogin: 'Just now' },
    { id: 'LOG-941', name: 'Dispatcher User', email: 'dispatcher@logiss.com', role: 'dispatcher', status: 'active', lastLogin: '2 hours ago' },
    { id: 'LOG-942', name: 'Sarah Jenkins', email: 's.jenkins@logiss.com', role: 'dispatcher', status: 'active', lastLogin: '1 day ago' },
    { id: 'LOG-943', name: 'Marcus Cole', email: 'm.cole@logiss.com', role: 'dispatcher', status: 'inactive', lastLogin: '2 weeks ago' }
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '', role: 'dispatcher' });

  const handleInvite = (e) => {
    e.preventDefault();
    const newUser = {
      id: `LOG-9${Math.floor(Math.random() * 90) + 10}`,
      ...inviteData,
      status: 'active',
      lastLogin: 'Never'
    };
    setUsers([...users, newUser]);
    setShowInviteModal(false);
    setInviteData({ name: '', email: '', role: 'dispatcher' });
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        if (u.id === 'LOG-882') return u; // Prevent self-deactivation
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">User Access</h1>
          <p className="text-ink-3 font-medium">Manage dispatcher and administrator access</p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setShowInviteModal(true)}>Invite User</Button>
      </div>

      <Card className="overflow-hidden border-line-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg/50 border-b border-line-2">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">User Profile</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Role Level</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Last Active</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-2">
              {users.map(user => (
                <tr key={user.id} className={`hover:bg-bg/50 transition-colors ${user.status === 'inactive' ? 'opacity-50 grayscale' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar initials={user.name.split(' ').map(n=>n[0]).join('')} size="sm" />
                      <div>
                        <p className="text-sm font-extrabold text-ink">{user.name}</p>
                        <p className="text-[10px] font-bold text-ink-4 flex items-center gap-1 mt-0.5">
                          <Mail size={10} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-light/20 text-primary rounded-md w-fit border border-primary/20">
                        <Shield size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Administrator</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-bg text-ink-3 rounded-md w-fit border border-line-2">
                        <Users size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Dispatcher</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'active' ? 'accent' : 'neutral'} className="uppercase">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-ink-3">{user.lastLogin}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.id !== 'LOG-882' && (
                      <button 
                        onClick={() => toggleStatus(user.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${user.status === 'active' ? 'text-urgent border-urgent hover:bg-urgent hover:text-white' : 'text-accent border-accent hover:bg-accent hover:text-white'}`}
                      >
                        {user.status === 'active' ? 'Revoke Access' : 'Restore Access'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-ink mb-1">Invite New User</h3>
            <p className="text-sm text-ink-3 mb-6">Send an invitation link to grant dashboard access.</p>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={inviteData.name}
                  onChange={e => setInviteData({...inviteData, name: e.target.value})}
                  className="w-full bg-bg border border-line rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={inviteData.email}
                  onChange={e => setInviteData({...inviteData, email: e.target.value})}
                  className="w-full bg-bg border border-line rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                  placeholder="jane@logiss.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase tracking-widest mb-1.5">Role Level</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setInviteData({...inviteData, role: 'dispatcher'})}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${inviteData.role === 'dispatcher' ? 'border-primary bg-primary-light/10 text-primary' : 'border-line-2 bg-bg text-ink-3 hover:border-primary/50'}`}
                  >
                    <Users size={20} />
                    <span className="text-xs font-bold">Dispatcher</span>
                  </div>
                  <div 
                    onClick={() => setInviteData({...inviteData, role: 'admin'})}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${inviteData.role === 'admin' ? 'border-primary bg-primary-light/10 text-primary' : 'border-line-2 bg-bg text-ink-3 hover:border-primary/50'}`}
                  >
                    <Shield size={20} />
                    <span className="text-xs font-bold">Admin</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 mt-2 border-t border-line-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1">Send Invite</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccess;
