// src/components/Header.tsx

// ==========================================
// ၁။ လိုအပ်သော Packages နှင့် Icons များ ခေါ်ယူခြင်း (LogOut Icon အသစ်ပါဝင်သည်)
// ==========================================
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, LogOut } from 'lucide-react';

// ==========================================
// ၂။ Header တွင် လက်ခံမည့် Props များ (User နှင့် Logout လုပ်ဆောင်ချက် ထပ်တိုးထားသည်)
// ==========================================
interface HeaderProps {
  onMenuClick?: () => void;
  user?: any;               // Login ဝင်ထားသော User Data
  onLogout?: () => void;    // ထွက်ရန် Function
}

// စာမျက်နှာအလိုက် ပေါ်မည့် ခေါင်းစဉ်များ
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Financial overview & key metrics' },
  '/master/chart-of-accounts': { title: 'Chart of Accounts', subtitle: 'Master data setup' },
  '/master/exchange-rates': { title: 'Exchange Rates', subtitle: 'Master data setup' },
  '/master/parties': { title: 'Customers & Vendors', subtitle: 'Master data setup' },
  '/master/products': { title: 'Products / Items', subtitle: 'Master data setup' },
  '/master/projects': { title: 'Projects / Cost Centers', subtitle: 'Master data setup' },
  '/transactions/cash-bank': { title: 'Cash & Bank', subtitle: 'Receipts & payments' },
  '/transactions/journal-vouchers': { title: 'Journal Vouchers', subtitle: 'Core transactions' },
  '/transactions/purchase-orders': { title: 'Purchase Orders', subtitle: 'Core transactions' },
  '/transactions/sales-invoices': { title: 'Sales Invoices (AR)', subtitle: 'Core transactions' },
  '/inventory/goods-receipt': { title: 'Goods Receipt', subtitle: 'Inbound from PO' },
  '/inventory/goods-issue': { title: 'Goods Issue', subtitle: 'Outbound from invoices' },
  '/inventory/movements': { title: 'Stock Movements', subtitle: 'Stock ledger' },
  '/inventory/stock-balance': { title: 'Stock Balance', subtitle: 'Real-time inventory' },
  '/dashboards/ap-summary': { title: 'AP Summary', subtitle: 'Accounts payable dashboard' },
  '/dashboards/ar-summary': { title: 'AR Summary', subtitle: 'Accounts receivable dashboard' },
  '/dashboards/jv-summary': { title: 'JV Summary', subtitle: 'Journal voucher dashboard' },
  '/dashboards/cash-bank-register': { title: 'Cash & Bank Register', subtitle: 'Cash flow dashboard' },
  '/reports/general-ledger': { title: 'General Ledger', subtitle: 'Consolidated transactions' },
  '/reports/trial-balance': { title: 'Trial Balance', subtitle: 'Financial reporting' },
  '/reports/profit-loss': { title: 'Profit & Loss', subtitle: 'Financial reporting' },
  '/reports/balance-sheet': { title: 'Balance Sheet', subtitle: 'Financial reporting' },
};

export default function Header({ onMenuClick, user, onLogout }: HeaderProps) {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const page = pageTitles[location.pathname] ?? { title: 'Nexus ERP', subtitle: '' };

  const notifications = [
    { id: 1, text: 'Invoice INV-2026-0048 is overdue', time: '2h ago', color: 'bg-red-500' },
    { id: 2, text: 'PO-2026-0122 awaiting approval', time: '5h ago', color: 'bg-amber-500' },
    { id: 3, text: 'Stock below reorder: Plastic Granules', time: '1d ago', color: 'bg-orange-500' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      
      {/* ========================================== */}
      {/* ၃။ ဘယ်ဘက်ခြမ်း (Menu ခလုတ် နှင့် စာမျက်နှာ ခေါင်းစဉ်) */}
      {/* ========================================== */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">{page.title}</h2>
          <p className="text-xs text-slate-500">{page.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        
        {/* ========================================== */}
        {/* ၄။ ညာဘက်ခြမ်း (Search Bar) */}
        {/* ========================================== */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 lg:w-64 pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          />
        </div>

        {/* ========================================== */}
        {/* ၅။ အသိပေးချက်များ (Notifications) */}
        {/* ========================================== */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-40 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.color}`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full px-4 py-2.5 text-sm text-brand-600 font-medium hover:bg-slate-50 rounded-b-xl">
                  View all notifications
                </button>
              </div>
            </>
          )}
        </div>

        {/* ========================================== */}
        {/* ၆။ User Profile နှင့် Logout ခလုတ် (Dynamic အဖြစ် ပြင်ဆင်ထားသည်) */}
        {/* ========================================== */}
        <div className="flex items-center gap-2.5 pl-2 lg:pl-3 lg:border-l border-slate-200">
          
          {/* User ရဲ့ နာမည် ပထမဆုံး စာလုံးကို ယူပြမည် */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
            {user?.Username ? user.Username.charAt(0).toUpperCase() : 'U'}
          </div>
          
          {/* User Name နှင့် Position */}
          <div className="hidden lg:block pr-2">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.Username || 'Admin User'}
            </p>
            <p className="text-[11px] text-slate-500">
              {user?.Position || 'Staff'}
            </p>
          </div>

          {/* Logout ခလုတ် */}
          <button 
            onClick={onLogout}
            className="p-2 ml-1 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors flex items-center"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>

        </div>
      </div>
    </header>
  );
}