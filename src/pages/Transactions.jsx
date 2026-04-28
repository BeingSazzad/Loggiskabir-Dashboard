import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Download, 
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, Badge, Avatar, Button, StatCard } from '../components/UI';
import { trips } from '../data/mockData';
import { formatDateTime, formatShortDate, money } from '../utils/helpers';

const Transactions = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showRefundModal, setShowRefundModal] = useState(null);

  // Generate mock transactions based on trips
  const transactions = trips.map(t => ({
    id: `TXN-${t.id.split('-')[1]}`,
    tripId: t.id,
    amount: t.cost || 0,
    date: t.scheduledTime,
    rider: t.rider,
    method: 'Credit Card •••• 4242',
    status: t.status === 'completed' ? 'paid' : t.status === 'cancelled' ? 'refunded' : 'pending'
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredData = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.tripId.toLowerCase().includes(search.toLowerCase()) || t.rider.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === 'all' ? true : t.status === filter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transactions.filter(t => t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalRefunds = transactions.filter(t => t.status === 'refunded').reduce((acc, curr) => acc + curr.amount, 0);

  const handleRefund = () => {
    // In a real app, make API call here
    setShowRefundModal(null);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-ink tracking-tight">Financial Transactions</h1>
          <p className="text-ink-3 font-medium">Manage payments, refunds, and financial reports</p>
        </div>
        <Button variant="outline" icon={Download}>Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Revenue (All Time)" value={money(totalRevenue)} icon={CreditCard} accent="primary" />
        <StatCard label="Pending Payments" value={money(transactions.filter(t => t.status === 'pending').reduce((a,c) => a + c.amount, 0))} icon={Clock} accent="warning" />
        <StatCard label="Total Refunded" value={money(totalRefunds)} icon={RotateCcw} accent="urgent" />
      </div>

      <Card className="overflow-hidden border-line-2">
        <div className="p-6 border-b border-line-2 bg-bg/30 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-4" size={20} />
            <input 
              type="text" 
              placeholder="Search by TXN ID, Trip ID, or Rider..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm focus:ring-4 focus:ring-primary/10 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-bg border border-line p-1 rounded-xl">
            {['all', 'paid', 'pending', 'refunded'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white shadow-sm text-primary' : 'text-ink-3 hover:text-ink'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg/50 border-b border-line-2">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Transaction ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-ink-4 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-2">
              {filteredData.map(txn => (
                <tr key={txn.id} className="hover:bg-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-ink font-mono">{txn.id}</p>
                    <p className="text-[10px] text-ink-4 font-mono mt-0.5">Ref: {txn.tripId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-ink">{formatShortDate(txn.date)}</p>
                    <p className="text-[10px] text-ink-4 mt-0.5">{txn.date.split('T')[1].slice(0,5)}</p>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Avatar initials={txn.rider.initials} size="xs" />
                    <div>
                      <p className="text-xs font-bold text-ink">{txn.rider.name}</p>
                      <p className="text-[10px] text-ink-4 mt-0.5">{txn.method}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-extrabold text-ink">{money(txn.amount)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={txn.status === 'paid' ? 'accent' : txn.status === 'refunded' ? 'urgent' : 'warning'} className="uppercase">
                      {txn.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {txn.status === 'paid' && (
                      <Button variant="outline" size="sm" className="text-urgent hover:bg-urgent-light border-urgent/20" onClick={() => setShowRefundModal(txn)}>
                        Issue Refund
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-urgent-light text-urgent rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-extrabold text-ink mb-2">Issue Refund?</h3>
            <p className="text-sm text-ink-3 mb-6 leading-relaxed">
              Are you sure you want to refund <span className="font-bold text-ink">{money(showRefundModal.amount)}</span> to <span className="font-bold text-ink">{showRefundModal.rider.name}</span>? This action cannot be undone and the funds will be returned to their original payment method.
            </p>
            <div className="p-4 bg-bg rounded-xl border border-line-2 mb-6 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-4 font-bold uppercase">Transaction ID</span>
                <span className="text-ink font-mono font-bold">{showRefundModal.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-4 font-bold uppercase">Linked Trip</span>
                <span className="text-ink font-mono font-bold">{showRefundModal.tripId}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRefundModal(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" onClick={handleRefund}>Confirm Refund</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
