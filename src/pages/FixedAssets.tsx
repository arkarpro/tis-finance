// src/pages/FixedAssets.tsx

// ==========================================
// ၁။ လိုအပ်သော Packages နှင့် Services များကို ခေါ်ယူခြင်း
// ==========================================
import { useState, useEffect } from 'react';
import { Plus, Search, X, Pencil, Trash2, Briefcase } from 'lucide-react';
import { googleSheetsService } from '../services/googleSheetsService';

export default function FixedAssets() {
  // 🌟 Google Sheet အမည် 
  const SHEET_NAME = '3_Fixed_Assets';

  // ==========================================
  // ၂။ State များ ကြေညာခြင်း
  // ==========================================
  const [assets, setAssets] = useState<any[]>([]);
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
    Asset_ID: '',
    Asset_Name: '',
    Purchase_Date: '',
    Original_Cost: '',
    Depreciation_Rate: '',
    Asset_Account_Code: '',
    Acc_Dep_Account_Code: '',
    Dep_Expense_Account_Code: '',
    Status: 'Active' // Default
  };

  const [formData, setFormData] = useState(initialForm);

  // ==========================================
  // ၃။ Data ဆွဲယူခြင်း (Fetch Data)
  // ==========================================
  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsService.readData(SHEET_NAME);
      setAssets(data);
    } catch (err) {
      setError("စာရင်းများ ရယူရာတွင် အခက်အခဲရှိနေပါသည်။");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
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
      fetchAssets();
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
      setAssets(prev => prev.filter(a => a._rowIndex !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert("ဒေတာ ဖျက်ရာတွင် အမှားအယွင်းဖြစ်ပေါ်ခဲ့ပါသည်။");
    } finally {
      setIsDeleting(false);
    }
  };

  // Modal အဖွင့်အပိတ် Functions
  const openEditModal = (assetInfo: any) => {
    setEditingRow(assetInfo);
    setFormData({
      Asset_ID: assetInfo.Asset_ID || '',
      Asset_Name: assetInfo.Asset_Name || '',
      Purchase_Date: assetInfo.Purchase_Date || '',
      Original_Cost: assetInfo.Original_Cost || '',
      Depreciation_Rate: assetInfo.Depreciation_Rate || '',
      Asset_Account_Code: assetInfo.Asset_Account_Code || '',
      Acc_Dep_Account_Code: assetInfo.Acc_Dep_Account_Code || '',
      Dep_Expense_Account_Code: assetInfo.Dep_Expense_Account_Code || '',
      Status: assetInfo.Status || 'Active'
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
  const filteredAssets = assets.filter(asset => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (asset.Asset_ID?.toLowerCase() || '').includes(query) ||
      (asset.Asset_Name?.toLowerCase() || '').includes(query) ||
      (asset.Asset_Account_Code?.toLowerCase() || '').includes(query)
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
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Fixed Assets</h2>
            <p className="text-sm text-slate-500">Manage your organization's fixed assets and depreciation.</p>
          </div>
        </div>
        <button onClick={openAddModal} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* ၇.၂ Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Search assets by ID, name, or account code..." 
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        {/* ၇.၃ Table ဇယား */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Asset ID</th>
                <th className="px-4 py-3">Asset Name</th>
                <th className="px-4 py-3">Purchase Date</th>
                <th className="px-4 py-3 text-right">Original Cost</th>
                <th className="px-4 py-3 text-right">Dep. Rate</th>
                <th className="px-4 py-3">Accounts (Asset / Acc / Exp)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {isLoading && assets.length === 0 ? (
                 <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-500">Loading assets...</td></tr>
              ) : filteredAssets.length === 0 ? (
                 <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-500">No assets found.</td></tr>
              ) : (
                filteredAssets.map((asset, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-800">{asset.Asset_ID}</td>
                    <td className="px-4 py-3 font-medium whitespace-normal min-w-[200px]">{asset.Asset_Name}</td>
                    <td className="px-4 py-3 text-xs">{asset.Purchase_Date || '-'}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600">{asset.Original_Cost ? Number(asset.Original_Cost).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 text-right text-xs">{asset.Depreciation_Rate || '-'}</td>
                    
                    {/* Accounts ကို တစ်ခုတည်းမှာ စုပြပေးထားသည် */}
                    <td className="px-4 py-3 text-[11px] leading-tight font-mono text-slate-500">
                      <div className="mb-0.5"><span className="text-slate-400">Ast:</span> {asset.Asset_Account_Code || '-'}</div>
                      <div className="mb-0.5"><span className="text-slate-400">Acc:</span> {asset.Acc_Dep_Account_Code || '-'}</div>
                      <div><span className="text-slate-400">Exp:</span> {asset.Dep_Expense_Account_Code || '-'}</div>
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${asset.Status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                          asset.Status === 'Disposed' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                        {asset.Status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2 items-center h-full">
                      <button onClick={() => openEditModal(asset)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors mt-2" title="Edit">
                        <Pencil className="w-4 h-4"/>
                      </button>
                      <button onClick={() => setDeleteConfirmId(asset._rowIndex)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors mt-2" title="Delete">
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Asset?</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete this asset? This action cannot be undone.</p>
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
              <h3 className="text-lg font-bold text-slate-800">{editingRow ? "Edit Fixed Asset" : "New Fixed Asset"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Asset ID <span className="text-rose-500">*</span></label>
                  <input type="text" name="Asset_ID" value={formData.Asset_ID} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Asset Name <span className="text-rose-500">*</span></label>
                  <input type="text" name="Asset_Name" value={formData.Asset_Name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Purchase Date</label>
                  <input type="date" name="Purchase_Date" value={formData.Purchase_Date} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Original Cost</label>
                  <input type="number" step="any" name="Original_Cost" value={formData.Original_Cost} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Depreciation Rate (e.g. 10%)</label>
                  <input type="text" name="Depreciation_Rate" value={formData.Depreciation_Rate} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                  <select name="Status" value={formData.Status} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Linked Accounts</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Asset A/C Code</label>
                    <input type="text" name="Asset_Account_Code" value={formData.Asset_Account_Code} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Acc. Dep A/C Code</label>
                    <input type="text" name="Acc_Dep_Account_Code" value={formData.Acc_Dep_Account_Code} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Dep. Exp A/C Code</label>
                    <input type="text" name="Dep_Expense_Account_Code" value={formData.Dep_Expense_Account_Code} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Saving...' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}