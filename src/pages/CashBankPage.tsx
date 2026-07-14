import { useState, useMemo } from 'react';
import {
  Plus,
  Filter,
  Download,
  Search,
  ArrowDownUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  X,
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import { cashBankTransactions } from '../data/mockData';
import type { CashBankTransaction, TransactionType, TransactionStatus } from '../data/mockData';
import Badge from '../components/Badge';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CashBankPage() {
  const [transactions, setTransactions] = useState<CashBankTransaction[]>(cashBankTransactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortField, setSortField] = useState<keyof CashBankTransaction>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.counterparty.toLowerCase().includes(search.toLowerCase()) ||
        t.reference.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || t.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [transactions, search, typeFilter, statusFilter, sortField, sortDir]);

  const totalReceipts = filtered.filter((t) => t.type === 'Receipt').reduce((sum, t) => sum + t.amount, 0);
  const totalPayments = filtered.filter((t) => t.type === 'Payment').reduce((sum, t) => sum + t.amount, 0);
  const netCash = totalReceipts - totalPayments;

  const handleSort = (field: keyof CashBankTransaction) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    setOpenMenuId(null);
  };

  const handleAdd = (newTx: Omit<CashBankTransaction, 'id'>) => {
    const id = `CB-${String(transactions.length + 1).padStart(3, '0')}`;
    setTransactions([{ ...newTx, id }, ...transactions]);
    setShowAddModal(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Date', 'Type', 'Account', 'Description', 'Counterparty', 'Amount', 'Currency', 'Status', 'Reference'];
    const rows = filtered.map((t) =>
      [t.id, t.date, t.type, t.account, `"${t.description}"`, `"${t.counterparty}"`, t.amount, t.currency, t.status, t.reference].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cash-bank-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = typeFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Receipts</p>
            <p className="text-xl font-bold text-slate-800">{formatCurrency(totalReceipts)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Payments</p>
            <p className="text-xl font-bold text-slate-800">{formatCurrency(totalPayments)}</p>
          </div>
        </div>
        <div className={`bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4`}>
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${netCash >= 0 ? 'bg-brand-50' : 'bg-red-50'}`}>
            <Wallet className={`w-5 h-5 ${netCash >= 0 ? 'text-brand-600' : 'text-red-500'}`} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Net Cash Flow</p>
            <p className={`text-xl font-bold ${netCash >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
              {formatCurrency(netCash)}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                hasActiveFilters
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 border-b border-slate-100 animate-fade-in">
            <div>
              <label className="text-xs font-medium text-slate-500 mr-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'All')}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
              >
                <option value="All">All Types</option>
                <option value="Receipt">Receipt</option>
                <option value="Payment">Payment</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mr-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'All')}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Reconciled">Reconciled</option>
              </select>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setTypeFilter('All');
                  setStatusFilter('All');
                }}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th
                  className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-800 select-none"
                  onClick={() => handleSort('id')}
                >
                  <span className="flex items-center gap-1">
                    ID
                    <ArrowDownUp className="w-3 h-3" />
                  </span>
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-800 select-none"
                  onClick={() => handleSort('date')}
                >
                  <span className="flex items-center gap-1">
                    Date
                    <ArrowDownUp className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Account</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Counterparty</th>
                <th
                  className="text-right px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-800 select-none"
                  onClick={() => handleSort('amount')}
                >
                  <span className="flex items-center justify-end gap-1">
                    Amount
                    <ArrowDownUp className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Reference</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="px-4 py-3 font-medium text-slate-700">{tx.id}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        tx.type === 'Receipt' ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {tx.type === 'Receipt' ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{tx.account}</td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{tx.description}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{tx.counterparty}</td>
                  <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                    <span className={tx.type === 'Receipt' ? 'text-emerald-600' : 'text-slate-800'}>
                      {tx.type === 'Receipt' ? '+' : '−'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={tx.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">{tx.reference}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === tx.id ? null : tx.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenuId === tx.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1 animate-fade-in">
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{transactions.length}</span> transactions
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-40" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-500 rounded-lg hover:bg-slate-100">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && <AddTransactionModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
    </div>
  );
}

function AddTransactionModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (tx: Omit<CashBankTransaction, 'id'>) => void;
}) {
  const [form, setForm] = useState<Omit<CashBankTransaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'Receipt',
    account: 'Bank - Operating',
    description: '',
    counterparty: '',
    amount: 0,
    currency: 'USD',
    status: 'Pending',
    reference: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.counterparty || form.amount <= 0) return;
    onAdd(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">New Transaction</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
              >
                <option value="Receipt">Receipt</option>
                <option value="Payment">Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Account</label>
            <select
              value={form.account}
              onChange={(e) => setForm({ ...form, account: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
            >
              <option value="Bank - Operating">Bank - Operating</option>
              <option value="Bank - Payroll">Bank - Payroll</option>
              <option value="Bank - Savings">Bank - Savings</option>
              <option value="Cash - Petty">Cash - Petty</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Customer payment - INV-2026-0060"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Counterparty</label>
            <input
              type="text"
              value={form.counterparty}
              onChange={(e) => setForm({ ...form, counterparty: e.target.value })}
              placeholder="e.g. Acme Corporation"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Amount</label>
              <input
                type="number"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
                required
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Reference</label>
              <input
                type="text"
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
                placeholder="e.g. DEP-10236"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TransactionStatus })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Reconciled">Reconciled</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
