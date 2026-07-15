// src/components/Sidebar.tsx

// ==========================================
// ၁။ လိုအပ်သော Packages များနှင့် Icons များ ခေါ်ယူခြင်း
// ==========================================
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  FileText,
  Landmark,
  BookOpen,
  Users,
  Boxes,
  FolderKanban,
  Receipt,
  ClipboardList,
  ShoppingCart,
  FileSpreadsheet,
  PackagePlus,
  PackageMinus,
  Scale,
  Wallet,
  TrendingUp,
  ScrollText,
  BookCopy,
  X,
  Briefcase,
  ArrowRightLeft,
  Tags,
  MapPin
} from 'lucide-react';

// ==========================================
// ၂။ Sidebar တွင် ပေါ်မည့် Menu စာရင်းများ
// ==========================================
interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// 💡 Database Structure (Finance & Inventory) နှင့် ကိုက်ညီအောင် ပြင်ဆင်ထားသော Menu များ
const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard }
    ],
  },
  {
    title: 'Master Data',
    items: [
      { label: 'Chart of Accounts', path: '/master/chart-of-accounts', icon: BookOpen }, // 1.1_coa
      { label: 'Voucher Types', path: '/master/voucher-types', icon: Tags }, // 1.2_vtypes
      { label: 'Exchange Rates', path: '/master/exchange-rates', icon: ArrowLeftRight }, // 1.4_fx
      { label: 'Customers & Vendors', path: '/master/customers-vendors', icon: Users }, // 1.9_partners
      { label: 'Projects', path: '/master/projects', icon: FolderKanban }, // 1.10_projects
      { label: 'Fixed Assets', path: '/master/fixed-assets', icon: Briefcase }, // 1.3_f_assets
      { label: 'Products & Items', path: '/master/products', icon: Boxes }, // 2.1_prd
      { label: 'Warehouse Locations', path: '/master/locations', icon: MapPin }, // 2.2_warehouse_loc
    ],
  },
  {
    title: 'Financial Management',
    items: [
      { label: 'Cash & Bank', path: '/transactions/cash-bank', icon: Wallet }, // 1.5_c_b
      { label: 'Accounts Receivable', path: '/transactions/accounts-receivable', icon: FileText }, // 1.6_ar
      { label: 'Accounts Payable', path: '/transactions/accounts-payable', icon: ShoppingCart }, // 1.7_ap
      { label: 'Journal Vouchers', path: '/transactions/journal-vouchers', icon: ScrollText }, // 1.8_jv
    ],
  },
  {
    title: 'Inventory Management',
    items: [
      { label: 'Goods Receipt (In)', path: '/inventory/goods-receipt', icon: PackagePlus }, // 2.3_stk_in
      { label: 'Goods Issue (Out)', path: '/inventory/goods-issue', icon: PackageMinus }, // 2.4_stk_out
      { label: 'Stock Movements', path: '/inventory/movements', icon: ArrowRightLeft }, // 2.5_stk_move
      { label: 'Stock Balance', path: '/inventory/stock-balance', icon: Scale }, // 2.6_stk_bal
    ],
  },
  {
    title: 'Reports & Analytics',
    items: [
      { label: 'General Ledger', path: '/reports/general-ledger', icon: BookCopy },
      { label: 'Trial Balance', path: '/reports/trial-balance', icon: FileSpreadsheet },
      { label: 'Profit & Loss', path: '/reports/profit-loss', icon: BarChart3 },
      { label: 'Balance Sheet', path: '/reports/balance-sheet', icon: Receipt },
      { label: 'Cash & Bank Register', path: '/reports/cash-bank-register', icon: Landmark },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden backdrop-blur-sm transition-opacity" onClick={onClose} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700/50 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center p-1 shadow-md shadow-brand-500/10">
              <img src="/images/tis_logo.png" alt="TIS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none tracking-tight">TIS Academy</h1>
              <p className="text-[10px] text-brand-400 uppercase tracking-widest mt-0.5 font-medium">Financial System</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6 custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`
                    }
                  >
                    <item.icon 
                      className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${
                        // Optional: isActive မဟုတ်လျှင် Icon လေးများကို အနည်းငယ် မှိန်ထားရန်
                        'group-hover:text-brand-400'
                      }`} 
                      strokeWidth={2} 
                    />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/95">
          <div className="flex items-center justify-center text-[11px] font-medium text-slate-500 tracking-wider">
            &copy; {new Date().getFullYear()} TIS Academy.
          </div>
        </div>
      </aside>
    </>
  );
}