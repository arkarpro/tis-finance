import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CashBankPage from './pages/CashBankPage';
import {
  ChartOfAccountsPage,
  ExchangeRatesPage,
  PartiesPage,
  ProductsPage,
  ProjectsPage,
  JournalVouchersPage,
  PurchaseOrdersPage,
  SalesInvoicesPage,
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
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Master Data */}
          <Route path="/master/chart-of-accounts" element={<ChartOfAccountsPage />} />
          <Route path="/master/exchange-rates" element={<ExchangeRatesPage />} />
          <Route path="/master/parties" element={<PartiesPage />} />
          <Route path="/master/products" element={<ProductsPage />} />
          <Route path="/master/projects" element={<ProjectsPage />} />

          {/* Transactions */}
          <Route path="/transactions/cash-bank" element={<CashBankPage />} />
          <Route path="/transactions/journal-vouchers" element={<JournalVouchersPage />} />
          <Route path="/transactions/purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="/transactions/sales-invoices" element={<SalesInvoicesPage />} />

          {/* Inventory */}
          <Route path="/inventory/goods-receipt" element={<GoodsReceiptPage />} />
          <Route path="/inventory/goods-issue" element={<GoodsIssuePage />} />
          <Route path="/inventory/movements" element={<InventoryMovementsPage />} />
          <Route path="/inventory/stock-balance" element={<StockBalancePage />} />

          {/* Dashboards */}
          <Route path="/dashboards/ap-summary" element={<APSummaryPage />} />
          <Route path="/dashboards/ar-summary" element={<ARSummaryPage />} />
          <Route path="/dashboards/jv-summary" element={<JVSummaryPage />} />
          <Route path="/dashboards/cash-bank-register" element={<CashBankRegisterPage />} />

          {/* Reports */}
          <Route path="/reports/general-ledger" element={<GeneralLedgerPage />} />
          <Route path="/reports/trial-balance" element={<TrialBalancePage />} />
          <Route path="/reports/profit-loss" element={<ProfitLossPage />} />
          <Route path="/reports/balance-sheet" element={<BalanceSheetPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
