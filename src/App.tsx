// src/App.tsx

// ==========================================
// ၁။ လိုအပ်သော Packages နှင့် Components များကို ခေါ်ယူခြင်း (Imports)
// ==========================================
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
// 🌟 ဤနေရာတွင် ChartOfAccountsPage ကို သီးသန့် Import ပြန်လုပ်ပေးပါ
import ChartOfAccountsPage from './pages/ChartOfAccountsPage';

// သီးသန့်ရေးသားထားသော Pages များ
import Dashboard from './pages/Dashboard';
import CashBankPage from './pages/CashBankPage';

// 🌟 ယခုအသစ်ထည့်သွင်းမည့် Pages များ (ဤ ၄ ကြောင်းကို အသစ်ထည့်ပါ) 🌟
import ExchangeRates from './pages/ExchangeRates';
import CustomersVendors from './pages/CustomersVendors';
import FixedAssets from './pages/FixedAssets';
import InvoicePage from './pages/InvoicePage';

// Placeholder (ယာယီ) ထားရှိသော Pages များ
import {
  // ExchangeRatesPage,  <-- ဤနေရာကို ဖျက်ပါ (သို့) Comment ပိတ်ပါ
  // PartiesPage,        <-- ဤနေရာကို ဖျက်ပါ (သို့) Comment ပိတ်ပါ
  ProductsPage,
  ProjectsPage,
  JournalVouchersPage,
  PurchaseOrdersPage,
  // SalesInvoicesPage,  <-- ဤနေရာကို ဖျက်ပါ (သို့) Comment ပိတ်ပါ
  GoodsReceiptPage,
  GoodsIssuePage,
  InventoryMovementsPage,
  StockBalancePage,
  APSummaryPage,
  ARSummaryPage,
  JVSummaryPage,
  CashBankRegisterPage,
  GeneralLedgerPage,
  TrialBalancePage,
  ProfitLossPage,
  BalanceSheetPage,
} from './pages/PlaceholderPages';

export default function App() {
  // ==========================================
  // ၂။ Login User State ထိန်းသိမ်းခြင်း
  // ==========================================
  // Login ဝင်လာသော User ၏ Data (ဥပမာ- Name, Position) ကို ဤနေရာတွင် သိမ်းပါမည်
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // ==========================================
  // ၃။ Routing နှင့် Layout တည်ဆောက်ခြင်း (Render)
  // ==========================================
  // အကယ်၍ User က Login မဝင်ရသေးပါက (null ဖြစ်နေပါက)
  if (!currentUser) {
    // ၃.၁ Login Page ကိုသာ ပြသမည် (onLogin function ကိုပါ ထည့်ပေးလိုက်မည်)
    return <LoginPage onLogin={setCurrentUser} />;
  }

  // Login ဝင်ပြီးသွားပါက အောက်ပါ Main Layout နှင့် Routes များကို ပြသမည်
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ၃.၂ Main Layout ချိတ်ဆက်ခြင်း (Header သို့ currentUser ကို ပို့ပေးပါမည်) */}
        {/* Layout ထဲတွင် Header နှင့် Sidebar ပါဝင်ပါသည်။ ထို့ကြောင့် Layout ကိုပါ ပြင်ဆင်ရန် လိုအပ်ပါမည် */}
        <Route element={<Layout user={currentUser} onLogout={() => setCurrentUser(null)} />}>
          
          {/* Dashboard (မူလစာမျက်နှာ) */}
          <Route path="/" element={<Dashboard />} />

          {/* ========================================== */}
          {/* ၄။ စာမျက်နှာ လမ်းကြောင်းများ (Routes) */}
          {/* ========================================== */}
          
          {/* ၄.၁ Master Data အပိုင်း */}
          <Route path="/master/chart-of-accounts" element={<ChartOfAccountsPage />} />
          {/* 🌟 ပြင်ဆင်ထားသော လမ်းကြောင်းများ (ဒီ ၃ ကြောင်း ပြင်ထားပါသည်) 🌟 */}
          <Route path="/master/exchange-rates" element={<ExchangeRates />} />
          <Route path="/master/customers-vendors" element={<CustomersVendors />} />
          <Route path="/master/fixed-assets" element={<FixedAssets />} />
          
          <Route path="/master/products" element={<ProductsPage />} />
          <Route path="/master/projects" element={<ProjectsPage />} />

          {/* ၄.၂ ငွေကြေး နှင့် စာရင်းသွင်းခြင်း အပိုင်း (Transactions) */}
          <Route path="/transactions/cash-bank" element={<CashBankPage />} />
          <Route path="/transactions/journal-vouchers" element={<JournalVouchersPage />} />
          <Route path="/transactions/purchase-orders" element={<PurchaseOrdersPage />} />
          {/* 🌟 ပြင်ဆင်ထားသော လမ်းကြောင်း (ဒီ ၁ ကြောင်း ပြင်ထားပါသည်) 🌟 */}
          <Route path="/transactions/sales-invoices" element={<InvoicePage />} />

          {/* ၄.၃ ကုန်ပစ္စည်း စီမံခန့်ခွဲမှု အပိုင်း (Inventory) */}
          <Route path="/inventory/goods-receipt" element={<GoodsReceiptPage />} />
          <Route path="/inventory/goods-issue" element={<GoodsIssuePage />} />
          <Route path="/inventory/movements" element={<InventoryMovementsPage />} />
          <Route path="/inventory/stock-balance" element={<StockBalancePage />} />

          {/* ၄.၄ အနှစ်ချုပ် စာရင်းများ (Dashboards) */}
          <Route path="/dashboards/ap-summary" element={<APSummaryPage />} />
          <Route path="/dashboards/ar-summary" element={<ARSummaryPage />} />
          <Route path="/dashboards/jv-summary" element={<JVSummaryPage />} />
          <Route path="/dashboards/cash-bank-register" element={<CashBankRegisterPage />} />

          {/* ၄.၅ ငွေစာရင်း အစီရင်ခံစာများ (Reports) */}
          <Route path="/reports/general-ledger" element={<GeneralLedgerPage />} />
          <Route path="/reports/trial-balance" element={<TrialBalancePage />} />
          <Route path="/reports/profit-loss" element={<ProfitLossPage />} />
          <Route path="/reports/balance-sheet" element={<BalanceSheetPage />} />

          {/* ၄.၆ လမ်းကြောင်းမှားသွားပါက Dashboard သို့ ပြန်ပို့မည် (Catch-all Route) */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}