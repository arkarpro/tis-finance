import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  ShoppingCart,
  FileText,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import {
  dashboardMetrics,
  incomeExpenseData,
  arAgingData,
  cashFlowData,
  salesInvoices,
  products,
} from '../data/mockData';

const metricCards = [
  {
    label: 'Total Cash',
    value: dashboardMetrics.totalCash,
    icon: Wallet,
    gradient: 'from-brand-500 to-brand-700',
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-600',
    change: '+8.2%',
    changeUp: true,
    link: '/dashboards/cash-bank-register',
  },
  {
    label: 'Total AR',
    value: dashboardMetrics.totalAR,
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-emerald-700',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    change: '+12.5%',
    changeUp: true,
    link: '/dashboards/ar-summary',
  },
  {
    label: 'Total AP',
    value: dashboardMetrics.totalAP,
    icon: TrendingDown,
    gradient: 'from-amber-500 to-amber-700',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    change: '-3.1%',
    changeUp: false,
    link: '/dashboards/ap-summary',
  },
  {
    label: 'Inventory Value',
    value: dashboardMetrics.totalInventoryValue,
    icon: Package,
    gradient: 'from-violet-500 to-violet-700',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    change: '+5.4%',
    changeUp: true,
    link: '/inventory/stock-balance',
  },
];

const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#94a3b8'];

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

export default function Dashboard() {
  const overdueInvoices = salesInvoices.filter((inv) => inv.status === 'Overdue' || inv.status === 'Unpaid');
  const lowStockProducts = products.filter((p) => p.stock < p.reorderLevel);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-slate-400 text-sm mb-1">Welcome back, Sarah</p>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Financial Overview</h1>
          <p className="text-slate-400 text-sm max-w-lg">
            Here's what's happening with your business finances today — July 13, 2026
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link
              to="/transactions/cash-bank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
            >
              <Receipt className="w-4 h-4" />
              New Transaction
            </Link>
            <Link
              to="/transactions/sales-invoices"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
            >
              <FileText className="w-4 h-4" />
              Create Invoice
            </Link>
            <Link
              to="/transactions/purchase-orders"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              New PO
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={2} />
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                  card.changeUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                }`}
              >
                {card.changeUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(card.value)}</p>
            <div className="flex items-center gap-1 mt-3 text-xs text-slate-400 group-hover:text-brand-600 transition-colors">
              View details
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Income vs Expenses */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Income vs Expenses</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 7 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-brand-500" />
                <span className="text-slate-600">Income</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400" />
                <span className="text-slate-600">Expenses</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incomeExpenseData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ fontSize: '12px', fontFamily: 'Inter' }}
              />
              <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expenses" fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AR Aging Pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-1">AR Aging</h3>
          <p className="text-xs text-slate-500 mb-4">Receivables by age</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={arAgingData}
                dataKey="amount"
                nameKey="bucket"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
              >
                {arAgingData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {arAgingData.map((item, i) => (
              <div key={item.bucket} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  <span className="text-slate-600">{item.bucket}</span>
                </span>
                <span className="font-semibold text-slate-800">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cash Flow */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Cash Flow — This Month</h3>
              <p className="text-xs text-slate-500 mt-0.5">Weekly inflow vs outflow</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Inflow</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="text-slate-600">Outflow</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2} fill="url(#inflowGrad)" />
              <Area type="monotone" dataKey="outflow" stroke="#fb7185" strokeWidth={2} fill="url(#outflowGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-4">Action Items</h3>
          <div className="space-y-3">
            {overdueInvoices.slice(0, 3).map((inv) => (
              <Link
                key={inv.id}
                to="/transactions/sales-invoices"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{inv.invoiceNumber}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {inv.customer} · {formatCurrency(inv.total)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 mt-1.5" />
              </Link>
            ))}
            {lowStockProducts.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                to="/inventory/stock-balance"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    Stock: {p.stock.toLocaleString()} / Reorder: {p.reorderLevel.toLocaleString()}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 mt-1.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
