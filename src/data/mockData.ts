// ============ TYPES ============
export type TransactionType = 'Receipt' | 'Payment';
export type TransactionStatus = 'Completed' | 'Pending' | 'Reconciled';

export interface CashBankTransaction {
  id: string;
  date: string;
  type: TransactionType;
  account: string;
  description: string;
  counterparty: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  reference: string;
}

export interface Account {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface ExchangeRate {
  id: string;
  currency: string;
  rate: number;
  date: string;
}

export interface Party {
  id: string;
  name: string;
  type: 'Customer' | 'Vendor';
  email: string;
  phone: string;
  balance: number;
  status: 'Active' | 'Inactive';
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  reorderLevel: number;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  manager: string;
  budget: number;
  spent: number;
  status: 'Active' | 'On Hold' | 'Completed';
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: 'Posted' | 'Draft' | 'Pending';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  vendor: string;
  total: number;
  status: 'Open' | 'Partially Received' | 'Received' | 'Closed';
  expectedDelivery: string;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customer: string;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Partial';
  dueDate: string;
}

export interface InventoryMovement {
  id: string;
  date: string;
  type: 'Inbound' | 'Outbound' | 'Transfer';
  product: string;
  sku: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  reference: string;
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
}

// ============ MOCK DATA ============

export const cashBankTransactions: CashBankTransaction[] = [
  { id: 'CB-001', date: '2026-07-01', type: 'Receipt', account: 'Bank - Operating', description: 'Customer payment - INV-2026-0042', counterparty: 'Acme Corporation', amount: 48500, currency: 'USD', status: 'Completed', reference: 'DEP-10231' },
  { id: 'CB-002', date: '2026-07-01', type: 'Payment', account: 'Bank - Operating', description: 'Office rent - July 2026', counterparty: 'Prime Properties LLC', amount: 12000, currency: 'USD', status: 'Completed', reference: 'CHK-55821' },
  { id: 'CB-003', date: '2026-07-02', type: 'Receipt', account: 'Cash - Petty', description: 'Cash sale - Retail counter', counterparty: 'Walk-in Customer', amount: 850, currency: 'USD', status: 'Completed', reference: 'CSH-0142' },
  { id: 'CB-004', date: '2026-07-03', type: 'Payment', account: 'Bank - Payroll', description: 'Payroll run - Bi-weekly', counterparty: 'Staff Payroll', amount: 64300, currency: 'USD', status: 'Completed', reference: 'PR-2026-14' },
  { id: 'CB-005', date: '2026-07-04', type: 'Receipt', account: 'Bank - Operating', description: 'Customer payment - INV-2026-0038', counterparty: 'Globex Industries', amount: 32100, currency: 'USD', status: 'Reconciled', reference: 'DEP-10232' },
  { id: 'CB-006', date: '2026-07-05', type: 'Payment', account: 'Bank - Operating', description: 'Vendor payment - PO-2026-0118', counterparty: 'Stark Supplies Co', amount: 18750, currency: 'USD', status: 'Completed', reference: 'ACH-77410' },
  { id: 'CB-007', date: '2026-07-06', type: 'Receipt', account: 'Bank - Operating', description: 'Customer payment - INV-2026-0045', counterparty: 'Wayne Enterprises', amount: 76000, currency: 'USD', status: 'Reconciled', reference: 'DEP-10233' },
  { id: 'CB-008', date: '2026-07-07', type: 'Payment', account: 'Cash - Petty', description: 'Office supplies purchase', counterparty: 'OfficeMax', amount: 320, currency: 'USD', status: 'Completed', reference: 'CSH-0143' },
  { id: 'CB-009', date: '2026-07-08', type: 'Receipt', account: 'Bank - Savings', description: 'Interest income - Q3', counterparty: 'First National Bank', amount: 2100, currency: 'USD', status: 'Reconciled', reference: 'INT-2026-Q3' },
  { id: 'CB-010', date: '2026-07-09', type: 'Payment', account: 'Bank - Operating', description: 'Utility bill - Electricity', counterparty: 'City Power & Light', amount: 4200, currency: 'USD', status: 'Pending', reference: 'ACH-77411' },
  { id: 'CB-011', date: '2026-07-10', type: 'Receipt', account: 'Bank - Operating', description: 'Customer payment - INV-2026-0051', counterparty: 'Umbrella Corp', amount: 54000, currency: 'USD', status: 'Completed', reference: 'DEP-10234' },
  { id: 'CB-012', date: '2026-07-11', type: 'Payment', account: 'Bank - Operating', description: 'Insurance premium - Annual', counterparty: 'SafeGuard Insurance', amount: 15000, currency: 'USD', status: 'Pending', reference: 'ACH-77412' },
  { id: 'CB-013', date: '2026-07-12', type: 'Receipt', account: 'Bank - Operating', description: 'Customer advance payment', counterparty: 'Cyberdyne Systems', amount: 25000, currency: 'USD', status: 'Completed', reference: 'DEP-10235' },
  { id: 'CB-014', date: '2026-07-12', type: 'Payment', account: 'Bank - Payroll', description: 'Bonus payment - Q2', counterparty: 'Staff Payroll', amount: 18000, currency: 'USD', status: 'Pending', reference: 'PR-2026-15' },
  { id: 'CB-015', date: '2026-07-13', type: 'Receipt', account: 'Cash - Petty', description: 'Refund received - Supplies', counterparty: 'OfficeMax', amount: 120, currency: 'USD', status: 'Completed', reference: 'CSH-0144' },
];

export const chartOfAccounts: Account[] = [
  { code: '1000', name: 'Cash on Hand', type: 'Asset', balance: 12500 },
  { code: '1010', name: 'Bank - Operating Account', type: 'Asset', balance: 485000 },
  { code: '1020', name: 'Bank - Payroll Account', type: 'Asset', balance: 92000 },
  { code: '1030', name: 'Bank - Savings Account', type: 'Asset', balance: 350000 },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 312400 },
  { code: '1200', name: 'Inventory - Raw Materials', type: 'Asset', balance: 178000 },
  { code: '1210', name: 'Inventory - Finished Goods', type: 'Asset', balance: 245000 },
  { code: '1500', name: 'Office Equipment', type: 'Asset', balance: 86000 },
  { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 142800 },
  { code: '2100', name: 'Accrued Expenses', type: 'Liability', balance: 28000 },
  { code: '2200', name: 'Short-term Loan', type: 'Liability', balance: 100000 },
  { code: '3000', name: 'Share Capital', type: 'Equity', balance: 500000 },
  { code: '3100', name: 'Retained Earnings', type: 'Equity', balance: 418100 },
  { code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 1240000 },
  { code: '4100', name: 'Service Revenue', type: 'Revenue', balance: 380000 },
  { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 720000 },
  { code: '5100', name: 'Salaries & Wages', type: 'Expense', balance: 410000 },
  { code: '5200', name: 'Rent Expense', type: 'Expense', balance: 84000 },
  { code: '5300', name: 'Utilities', type: 'Expense', balance: 32000 },
  { code: '5400', name: 'Insurance', type: 'Expense', balance: 15000 },
];

export const exchangeRates: ExchangeRate[] = [
  { id: '1', currency: 'USD', rate: 1.0, date: '2026-07-13' },
  { id: '2', currency: 'EUR', rate: 1.089, date: '2026-07-13' },
  { id: '3', currency: 'GBP', rate: 1.275, date: '2026-07-13' },
  { id: '4', currency: 'JPY', rate: 0.0062, date: '2026-07-13' },
  { id: '5', currency: 'CAD', rate: 0.731, date: '2026-07-13' },
  { id: '6', currency: 'AUD', rate: 0.674, date: '2026-07-13' },
  { id: '7', currency: 'CHF', rate: 1.124, date: '2026-07-13' },
  { id: '8', currency: 'CNY', rate: 0.139, date: '2026-07-13' },
  { id: '9', currency: 'AED', rate: 0.272, date: '2026-07-13' },
  { id: '10', currency: 'INR', rate: 0.012, date: '2026-07-13' },
];

export const parties: Party[] = [
  { id: 'P-001', name: 'Acme Corporation', type: 'Customer', email: 'finance@acme.com', phone: '+1 (555) 100-2000', balance: 48500, status: 'Active' },
  { id: 'P-002', name: 'Globex Industries', type: 'Customer', email: 'ap@globex.com', phone: '+1 (555) 100-2001', balance: 32100, status: 'Active' },
  { id: 'P-003', name: 'Wayne Enterprises', type: 'Customer', email: 'billing@wayne.com', phone: '+1 (555) 100-2002', balance: 76000, status: 'Active' },
  { id: 'P-004', name: 'Umbrella Corp', type: 'Customer', email: 'ar@umbrella.com', phone: '+1 (555) 100-2003', balance: 54000, status: 'Active' },
  { id: 'P-005', name: 'Cyberdyne Systems', type: 'Customer', email: 'finance@cyberdyne.com', phone: '+1 (555) 100-2004', balance: 25000, status: 'Active' },
  { id: 'P-006', name: 'Stark Supplies Co', type: 'Vendor', email: 'sales@starksupplies.com', phone: '+1 (555) 100-2005', balance: -18750, status: 'Active' },
  { id: 'P-007', name: 'Prime Properties LLC', type: 'Vendor', email: 'leasing@prime.com', phone: '+1 (555) 100-2006', balance: -12000, status: 'Active' },
  { id: 'P-008', name: 'OfficeMax', type: 'Vendor', email: 'b2b@officemax.com', phone: '+1 (555) 100-2007', balance: -320, status: 'Active' },
  { id: 'P-009', name: 'SafeGuard Insurance', type: 'Vendor', email: 'premiums@safeguard.com', phone: '+1 (555) 100-2008', balance: -15000, status: 'Active' },
  { id: 'P-010', name: 'Initech LLC', type: 'Customer', email: 'finance@initech.com', phone: '+1 (555) 100-2009', balance: 0, status: 'Inactive' },
];

export const products: Product[] = [
  { id: 'PRD-001', sku: 'RAW-STEEL-01', name: 'Steel Rods (1 inch)', category: 'Raw Materials', unit: 'kg', costPrice: 2.5, salePrice: 4.0, stock: 12000, reorderLevel: 5000 },
  { id: 'PRD-002', sku: 'RAW-ALUM-02', name: 'Aluminum Sheets', category: 'Raw Materials', unit: 'sheet', costPrice: 15.0, salePrice: 22.0, stock: 3400, reorderLevel: 2000 },
  { id: 'PRD-003', sku: 'FIN-BRACKET-03', name: 'Mounting Bracket A', category: 'Finished Goods', unit: 'pcs', costPrice: 5.5, salePrice: 12.0, stock: 8500, reorderLevel: 3000 },
  { id: 'PRD-004', sku: 'FIN-PANEL-04', name: 'Control Panel v2', category: 'Finished Goods', unit: 'pcs', costPrice: 85.0, salePrice: 145.0, stock: 420, reorderLevel: 200 },
  { id: 'PRD-005', sku: 'FIN-CABLE-05', name: 'Power Cable 10m', category: 'Finished Goods', unit: 'pcs', costPrice: 8.0, salePrice: 18.5, stock: 3200, reorderLevel: 1500 },
  { id: 'PRD-006', sku: 'RAW-PLAST-06', name: 'Plastic Granules HDPE', category: 'Raw Materials', unit: 'kg', costPrice: 1.2, salePrice: 2.8, stock: 800, reorderLevel: 2000 },
  { id: 'PRD-007', sku: 'FIN-SWITCH-07', name: 'Smart Switch Module', category: 'Finished Goods', unit: 'pcs', costPrice: 22.0, salePrice: 45.0, stock: 1500, reorderLevel: 800 },
  { id: 'PRD-008', sku: 'PKG-BOX-08', name: 'Shipping Box (Large)', category: 'Packaging', unit: 'pcs', costPrice: 1.5, salePrice: 3.0, stock: 12000, reorderLevel: 5000 },
];

export const projects: Project[] = [
  { id: 'PRJ-001', code: 'CC-2026-01', name: 'Factory Expansion', manager: 'Sarah Chen', budget: 500000, spent: 320000, status: 'Active' },
  { id: 'PRJ-002', code: 'CC-2026-02', name: 'Product Line B Launch', manager: 'James Wilson', budget: 250000, spent: 185000, status: 'Active' },
  { id: 'PRJ-003', code: 'CC-2026-03', name: 'ERP Migration', manager: 'Priya Patel', budget: 120000, spent: 45000, status: 'On Hold' },
  { id: 'PRJ-004', code: 'CC-2026-04', name: 'Warehouse Automation', manager: 'Mike Ross', budget: 380000, spent: 380000, status: 'Completed' },
  { id: 'PRJ-005', code: 'CC-2026-05', name: 'Q4 Marketing Campaign', manager: 'Lisa Kim', budget: 90000, spent: 12000, status: 'Active' },
];

export const journalEntries: JournalEntry[] = [
  { id: 'JV-001', date: '2026-07-01', reference: 'JV-2026-001', description: 'Monthly depreciation - Equipment', debitAccount: 'Depreciation Expense', creditAccount: 'Accumulated Depreciation', amount: 3200, status: 'Posted' },
  { id: 'JV-002', date: '2026-07-02', reference: 'JV-2026-002', description: 'Prepaid insurance amortization', debitAccount: 'Insurance Expense', creditAccount: 'Prepaid Insurance', amount: 1250, status: 'Posted' },
  { id: 'JV-003', date: '2026-07-03', reference: 'JV-2026-003', description: 'Accrual - Legal services', debitAccount: 'Legal Expense', creditAccount: 'Accrued Expenses', amount: 4500, status: 'Posted' },
  { id: 'JV-004', date: '2026-07-05', reference: 'JV-2026-004', description: 'Reclassification - AR adjustment', debitAccount: 'Allowance for Doubtful Accts', creditAccount: 'Accounts Receivable', amount: 2100, status: 'Draft' },
  { id: 'JV-005', date: '2026-07-08', reference: 'JV-2026-005', description: 'Inventory revaluation', debitAccount: 'Inventory - Finished Goods', creditAccount: 'Cost of Goods Sold', amount: 8400, status: 'Posted' },
  { id: 'JV-006', date: '2026-07-10', reference: 'JV-2026-006', description: 'Inter-company transfer', debitAccount: 'Bank - Operating', creditAccount: 'Bank - Payroll', amount: 50000, status: 'Pending' },
  { id: 'JV-007', date: '2026-07-11', reference: 'JV-2026-007', description: 'Write-off - Damaged inventory', debitAccount: 'Cost of Goods Sold', creditAccount: 'Inventory - Raw Materials', amount: 1800, status: 'Posted' },
  { id: 'JV-008', date: '2026-07-12', reference: 'JV-2026-008', description: 'Tax provision - Q3 estimate', debitAccount: 'Income Tax Expense', creditAccount: 'Income Tax Payable', amount: 22000, status: 'Draft' },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-001', poNumber: 'PO-2026-0118', date: '2026-06-28', vendor: 'Stark Supplies Co', total: 18750, status: 'Partially Received', expectedDelivery: '2026-07-15' },
  { id: 'PO-002', poNumber: 'PO-2026-0119', date: '2026-07-01', vendor: 'Stark Supplies Co', total: 42000, status: 'Open', expectedDelivery: '2026-07-20' },
  { id: 'PO-003', poNumber: 'PO-2026-0120', date: '2026-07-03', vendor: 'OfficeMax', total: 3200, status: 'Received', expectedDelivery: '2026-07-10' },
  { id: 'PO-004', poNumber: 'PO-2026-0121', date: '2026-07-05', vendor: 'Prime Properties LLC', total: 12000, status: 'Closed', expectedDelivery: '2026-07-05' },
  { id: 'PO-005', poNumber: 'PO-2026-0122', date: '2026-07-08', vendor: 'Stark Supplies Co', total: 28500, status: 'Open', expectedDelivery: '2026-07-25' },
  { id: 'PO-006', poNumber: 'PO-2026-0123', date: '2026-07-10', vendor: 'SafeGuard Insurance', total: 15000, status: 'Closed', expectedDelivery: '2026-07-10' },
];

export const salesInvoices: SalesInvoice[] = [
  { id: 'INV-001', invoiceNumber: 'INV-2026-0042', date: '2026-06-25', customer: 'Acme Corporation', total: 48500, status: 'Paid', dueDate: '2026-07-25' },
  { id: 'INV-002', invoiceNumber: 'INV-2026-0038', date: '2026-06-20', customer: 'Globex Industries', total: 32100, status: 'Paid', dueDate: '2026-07-20' },
  { id: 'INV-003', invoiceNumber: 'INV-2026-0045', date: '2026-06-28', customer: 'Wayne Enterprises', total: 76000, status: 'Paid', dueDate: '2026-07-28' },
  { id: 'INV-004', invoiceNumber: 'INV-2026-0051', date: '2026-07-02', customer: 'Umbrella Corp', total: 54000, status: 'Paid', dueDate: '2026-08-01' },
  { id: 'INV-005', invoiceNumber: 'INV-2026-0052', date: '2026-07-05', customer: 'Cyberdyne Systems', total: 25000, status: 'Partial', dueDate: '2026-08-04' },
  { id: 'INV-006', invoiceNumber: 'INV-2026-0048', date: '2026-06-15', customer: 'Globex Industries', total: 18500, status: 'Overdue', dueDate: '2026-07-15' },
  { id: 'INV-007', invoiceNumber: 'INV-2026-0053', date: '2026-07-08', customer: 'Acme Corporation', total: 62000, status: 'Unpaid', dueDate: '2026-08-07' },
  { id: 'INV-008', invoiceNumber: 'INV-2026-0054', date: '2026-07-10', customer: 'Wayne Enterprises', total: 38000, status: 'Unpaid', dueDate: '2026-08-09' },
];

export const inventoryMovements: InventoryMovement[] = [
  { id: 'IM-001', date: '2026-07-01', type: 'Inbound', product: 'Steel Rods (1 inch)', sku: 'RAW-STEEL-01', quantity: 5000, fromLocation: 'Supplier', toLocation: 'Warehouse A', reference: 'GRN-001' },
  { id: 'IM-002', date: '2026-07-02', type: 'Outbound', product: 'Mounting Bracket A', sku: 'FIN-BRACKET-03', quantity: 1200, fromLocation: 'Warehouse B', toLocation: 'Customer', reference: 'INV-2026-0042' },
  { id: 'IM-003', date: '2026-07-03', type: 'Inbound', product: 'Control Panel v2', sku: 'FIN-PANEL-04', quantity: 200, fromLocation: 'Production', toLocation: 'Warehouse B', reference: 'PROD-014' },
  { id: 'IM-004', date: '2026-07-04', type: 'Outbound', product: 'Power Cable 10m', sku: 'FIN-CABLE-05', quantity: 800, fromLocation: 'Warehouse A', toLocation: 'Customer', reference: 'INV-2026-0045' },
  { id: 'IM-005', date: '2026-07-05', type: 'Transfer', product: 'Aluminum Sheets', sku: 'RAW-ALUM-02', quantity: 500, fromLocation: 'Warehouse A', toLocation: 'Production', reference: 'TRF-003' },
  { id: 'IM-006', date: '2026-07-07', type: 'Inbound', product: 'Smart Switch Module', sku: 'FIN-SWITCH-07', quantity: 300, fromLocation: 'Production', toLocation: 'Warehouse B', reference: 'PROD-015' },
  { id: 'IM-007', date: '2026-07-08', type: 'Outbound', product: 'Control Panel v2', sku: 'FIN-PANEL-04', quantity: 150, fromLocation: 'Warehouse B', toLocation: 'Customer', reference: 'INV-2026-0051' },
  { id: 'IM-008', date: '2026-07-10', type: 'Inbound', product: 'Shipping Box (Large)', sku: 'PKG-BOX-08', quantity: 5000, fromLocation: 'Supplier', toLocation: 'Warehouse A', reference: 'GRN-002' },
  { id: 'IM-009', date: '2026-07-11', type: 'Outbound', product: 'Smart Switch Module', sku: 'FIN-SWITCH-07', quantity: 450, fromLocation: 'Warehouse B', toLocation: 'Customer', reference: 'INV-2026-0053' },
  { id: 'IM-010', date: '2026-07-12', type: 'Transfer', product: 'Steel Rods (1 inch)', sku: 'RAW-STEEL-01', quantity: 2000, fromLocation: 'Warehouse A', toLocation: 'Production', reference: 'TRF-004' },
];

export const stockBalances: StockItem[] = [
  { id: 'S-001', sku: 'RAW-STEEL-01', name: 'Steel Rods (1 inch)', warehouse: 'Warehouse A', quantity: 12000, unitCost: 2.5, totalValue: 30000 },
  { id: 'S-002', sku: 'RAW-ALUM-02', name: 'Aluminum Sheets', warehouse: 'Warehouse A', quantity: 3400, unitCost: 15.0, totalValue: 51000 },
  { id: 'S-003', sku: 'FIN-BRACKET-03', name: 'Mounting Bracket A', warehouse: 'Warehouse B', quantity: 8500, unitCost: 5.5, totalValue: 46750 },
  { id: 'S-004', sku: 'FIN-PANEL-04', name: 'Control Panel v2', warehouse: 'Warehouse B', quantity: 420, unitCost: 85.0, totalValue: 35700 },
  { id: 'S-005', sku: 'FIN-CABLE-05', name: 'Power Cable 10m', warehouse: 'Warehouse A', quantity: 3200, unitCost: 8.0, totalValue: 25600 },
  { id: 'S-006', sku: 'RAW-PLAST-06', name: 'Plastic Granules HDPE', warehouse: 'Warehouse A', quantity: 800, unitCost: 1.2, totalValue: 960 },
  { id: 'S-007', sku: 'FIN-SWITCH-07', name: 'Smart Switch Module', warehouse: 'Warehouse B', quantity: 1500, unitCost: 22.0, totalValue: 33000 },
  { id: 'S-008', sku: 'PKG-BOX-08', name: 'Shipping Box (Large)', warehouse: 'Warehouse A', quantity: 12000, unitCost: 1.5, totalValue: 18000 },
];

// ============ DASHBOARD SUMMARY DATA ============

export const dashboardMetrics = {
  totalCash: 939500,
  totalAR: 312400,
  totalAP: 142800,
  totalInventoryValue: 423000,
};

export const incomeExpenseData = [
  { month: 'Jan', income: 95000, expenses: 72000 },
  { month: 'Feb', income: 102000, expenses: 68000 },
  { month: 'Mar', income: 118000, expenses: 81000 },
  { month: 'Apr', income: 87000, expenses: 75000 },
  { month: 'May', income: 125000, expenses: 92000 },
  { month: 'Jun', income: 132000, expenses: 88000 },
  { month: 'Jul', income: 141000, expenses: 95000 },
];

export const arAgingData = [
  { bucket: 'Current', amount: 185000 },
  { bucket: '1-30 Days', amount: 78000 },
  { bucket: '31-60 Days', amount: 32000 },
  { bucket: '61-90 Days', amount: 12400 },
  { bucket: '90+ Days', amount: 5000 },
];

export const apAgingData = [
  { bucket: 'Current', amount: 62000 },
  { bucket: '1-30 Days', amount: 45000 },
  { bucket: '31-60 Days', amount: 22800 },
  { bucket: '61-90 Days', amount: 9000 },
  { bucket: '90+ Days', amount: 4000 },
];

export const cashFlowData = [
  { week: 'Week 1', inflow: 48500, outflow: 76300 },
  { week: 'Week 2', inflow: 76000, outflow: 18750 },
  { week: 'Week 3', inflow: 54000, outflow: 19200 },
  { week: 'Week 4', inflow: 25000, outflow: 18000 },
];
