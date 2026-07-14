// src/pages/ChartOfAccountsPage.tsx

// ==========================================
// ၁။ လိုအပ်သော Packages နှင့် Services များကို ခေါ်ယူခြင်း
// ==========================================
import { useState, useEffect } from 'react';
import { Plus, Search, X, Pencil, Trash2, BookOpen } from 'lucide-react';
import { googleSheetsService } from '../services/googleSheetsService';

export default function ChartOfAccountsPage() {
  // 🌟 Google Sheet အမည် (သင့် Sheet တွင် 1_Chart_Of_Accounts ဟု ပေးထားသည်ဟု ယူဆပါသည်)
  const SHEET_NAME = '1_Chart_Of_Accounts';

  // ==========================================
  // ၂။ State များ ကြေညာခြင်း
  // ==========================================
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal နှင့် Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete Confirmation States
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');

  // Form တွင် အသုံးပြုမည့် မူလ Data ပုံစံ (Columns ၉ ခု)
  const initialForm = {
    Category_Code: '',
    Account_Category: '',
    Account_Code: '',
    Account_Name: '',
    Class_Of_Account: '',
    Account_Type: 'Detail', // Default
    Status: 'Active',       // Default
    Book: '',
    Description: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // ==========================================
  // ၃။ Data ဆွဲယူခြင်း (Fetch Data)
  // ==========================================
  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsService.readData(SHEET_NAME);
      setAccounts(data);
    } catch (err) {
      setError("စာရင်းများ ရယူရာတွင် အခက်အခဲရှိနေပါသည်။");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ==========================================
  // ၄။ Form Actions (Input Change & Submit)
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingRow) {
        // Edit
        const payload = { ...formData, _rowIndex: editingRow._rowIndex };
        await googleSheetsService.updateData(SHEET_NAME, payload);
      } else {
        // Add New
        await googleSheetsService.writeData(SHEET_NAME, formData);
      }
      setIsModalOpen(false);
      setEditingRow(null);
      setFormData(initialForm);
      fetchAccounts();
    } catch (err) {
      alert("ဒေတာ သိမ်းဆည်းရာတွင် အမှားအယွင်းဖြစ်ပေါ်ခဲ့ပါသည်။");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // ၅။ Delete Action
  // ==========================================
  const confirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setIsDeleting(true);
    try {
      await googleSheetsService.deleteData(SHEET_NAME, deleteConfirmId);
      setAccounts(prev => prev.filter(a => a._rowIndex !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert("ဒေတာ ဖျက်ရာတွင် အမှားအယွင်းဖြစ်ပေါ်ခဲ့ပါသည်။");
    } finally {
      setIsDeleting(false);
    }
  };

  // Modal အဖွင့်အပိတ် Functions
  const openEditModal = (account: any) => {
    setEditingRow(account);
    setFormData({
      Category_Code: account.Category_Code || '',
      Account_Category: account.Account_Category || '',
      Account_Code: account.Account_Code || '',
      Account_Name: account.Account_Name || '',
      Class_Of_Account: account.Class_Of_Account || '',
      Account_Type: account.Account_Type || 'Detail',
      Status: account.Status || 'Active',
      Book: account.Book || '',
      Description: account.Description || ''
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingRow(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  // ==========================================
  // ၆။ Search Filter
  // ==========================================
  const filteredAccounts = accounts.filter(acc => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (acc.Account_Code?.toLowerCase() || '').includes(query) ||
      (acc.Account_Name?.toLowerCase() || '').includes(query) ||
      (acc.Account_Category?.toLowerCase() || '').includes(query) ||
      (acc.Class_Of_Account?.toLowerCase() || '').includes(query)
    );
  });

  // ==========================================
  // ၇။ UI Render အပိုင်း
  // ==========================================
  return (
    <div className="space-y-6 relative">
      
      {/* ၇.၁ ခေါင်းစဉ်နှင့် Add ခလုတ် */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Chart of Accounts</h2>
            <p className="text-sm text-slate-500">Manage your organization's financial account structure.</p>
          </div>
        </div>
        <button onClick={openAddModal} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* ၇.၂ Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Search accounts by code, name, class..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        {/* ၇.၃ Table ဇယား */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3">Category Code</th>
                <th className="px-4 py-3">Account Category</th>
                <th className="px-4 py-3">Account Code</th>
                {/* Account Name ကို 1/3 အကျယ်ယူရန် w-1/3 ထည့်ထားပါသည် */}
                <th className="px-4 py-3 w-1/3">Account Name</th>
                <th className="px-4 py-3">Class Of Account</th>
                <th className="px-4 py-3">Account Type</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {isLoading && accounts.length === 0 ? (
                 <tr><td colSpan={10} className="px-6 py-8 text-center text-slate-500">Loading accounts...</td></tr>
              ) : filteredAccounts.length === 0 ? (
                 <tr><td colSpan={10} className="px-6 py-8 text-center text-slate-500">No accounts found.</td></tr>
              ) : (
                filteredAccounts.map((acc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 text-xs">{acc.Category_Code || '-'}</td>
                    <td className="px-4 py-3 text-xs">{acc.Account_Category || '-'}</td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-800">{acc.Account_Code}</td>
                    {/* Account Name စာသားများပါက အောက်ဆင်းသွားအောင် whitespace-normal ကိုအသုံးပြုထားပါသည် */}
                    <td className="px-4 py-3 font-medium whitespace-normal break-words w-1/3">{acc.Account_Name}</td>
                    
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium 
                        ${acc.Class_Of_Account?.includes('Asset') ? 'bg-blue-50 text-blue-600' : 
                          acc.Class_Of_Account?.includes('Liability') ? 'bg-orange-50 text-orange-600' : 
                          acc.Class_Of_Account?.includes('Equity') ? 'bg-purple-50 text-purple-600' : 
                          acc.Class_Of_Account?.includes('Revenue') || acc.Class_Of_Account?.includes('Income') ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-rose-50 text-rose-600'}`}>
                        {acc.Class_Of_Account}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{acc.Account_Type}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${acc.Status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {acc.Status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{acc.Book || '-'}</td>
                    <td className="px-4 py-3 text-xs max-w-[150px] truncate" title={acc.Description}>{acc.Description || '-'}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button onClick={() => openEditModal(acc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                        <Pencil className="w-4 h-4"/>
                      </button>
                      <button onClick={() => setDeleteConfirmId(acc._rowIndex)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ၇.၄ Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 text-center animate-fade-in">
            <Trash2 className="w-12 h-12 text-rose-500 mx-auto mb-4 bg-rose-50 p-2 rounded-full" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Account?</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete this account? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-70">
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ၇.၅ Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl my-8 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
              <h3 className="text-lg font-bold text-slate-800">{editingRow ? "Edit Account" : "New Account"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Account Code <span className="text-rose-500">*</span></label>
                  <input type="text" name="Account_Code" value={formData.Account_Code} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Account Name <span className="text-rose-500">*</span></label>
                  <input type="text" name="Account_Name" value={formData.Account_Name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Category Code</label>
                  <input type="text" name="Category_Code" value={formData.Category_Code} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Account Category</label>
                  <input type="text" name="Account_Category" value={formData.Account_Category} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Class Of Account</label>
                  <select name="Class_Of_Account" value={formData.Class_Of_Account} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                    <option value="">Select Class...</option>
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Equity">Equity</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Account Type</label>
                  <select name="Account_Type" value={formData.Account_Type} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                    <option value="Detail">Detail</option>
                    <option value="Header">Header</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                  <select name="Status" value={formData.Status} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Book (If Applicable)</label>
                  <input type="text" name="Book" value={formData.Book} onChange={handleInputChange} placeholder="e.g., Cash_MMK" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                  <input type="text" name="Description" value={formData.Description} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Saving...' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}