// src/pages/ExchangeRates.tsx

// ==========================================
// ၁။ လိုအပ်သော Packages နှင့် Services များကို ခေါ်ယူခြင်း
// ==========================================
import { useState, useEffect } from 'react';
import { Plus, Search, X, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { googleSheetsService } from '../services/googleSheetsService';

export default function ExchangeRates() {
  // 🌟 Google Sheet အမည် 
  const SHEET_NAME = '4_Exchange_Rates';

  // ==========================================
  // ၂။ State များ ကြေညာခြင်း
  // ==========================================
  const [rates, setRates] = useState<any[]>([]);
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

  // Form တွင် အသုံးပြုမည့် မူလ Data ပုံစံ (Columns ၅ ခု)
  const initialForm = {
    Date: '',
    USD_CBM: '',
    USD_Market: '',
    SGD_CBM: '',
    SGD_Market: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // ==========================================
  // ၃။ Data ဆွဲယူခြင်း (Fetch Data)
  // ==========================================
  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsService.readData(SHEET_NAME);
      setRates(data);
    } catch (err) {
      setError("စာရင်းများ ရယူရာတွင် အခက်အခဲရှိနေပါသည်။");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // ==========================================
  // ၄။ Form Actions (Input Change & Submit)
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      fetchRates();
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
      setRates(prev => prev.filter(r => r._rowIndex !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert("ဒေတာ ဖျက်ရာတွင် အမှားအယွင်းဖြစ်ပေါ်ခဲ့ပါသည်။");
    } finally {
      setIsDeleting(false);
    }
  };

  // Modal အဖွင့်အပိတ် Functions
  const openEditModal = (rateInfo: any) => {
    setEditingRow(rateInfo);
    setFormData({
      Date: rateInfo.Date || '',
      USD_CBM: rateInfo.USD_CBM || '',
      USD_Market: rateInfo.USD_Market || '',
      SGD_CBM: rateInfo.SGD_CBM || '',
      SGD_Market: rateInfo.SGD_Market || ''
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingRow(null);
    
    // Default Date ကို ဒီနေ့ရက်စွဲ ထည့်ပေးထားပါသည်
    const today = new Date().toISOString().split('T')[0];
    setFormData({ ...initialForm, Date: today });
    setIsModalOpen(true);
  };

  // ==========================================
  // ၆။ Search Filter
  // ==========================================
  const filteredRates = rates.filter(rateInfo => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (rateInfo.Date?.toLowerCase() || '').includes(query)
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
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Exchange Rates</h2>
            <p className="text-sm text-slate-500">Manage daily currency exchange rates (CBM & Market).</p>
          </div>
        </div>
        <button onClick={openAddModal} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-700 shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Rate
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* ၇.၂ Search Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Search by date (e.g. 2024-05-20)..." 
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
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">USD (CBM)</th>
                <th className="px-4 py-3 text-right">USD (Market)</th>
                <th className="px-4 py-3 text-right">SGD (CBM)</th>
                <th className="px-4 py-3 text-right">SGD (Market)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {isLoading && rates.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading exchange rates...</td></tr>
              ) : filteredRates.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No rates found.</td></tr>
              ) : (
                filteredRates.map((rateInfo, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{rateInfo.Date}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600">{rateInfo.USD_CBM ? Number(rateInfo.USD_CBM).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600">{rateInfo.USD_Market ? Number(rateInfo.USD_Market).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-600">{rateInfo.SGD_CBM ? Number(rateInfo.SGD_CBM).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 text-right font-mono text-blue-600">{rateInfo.SGD_Market ? Number(rateInfo.SGD_Market).toLocaleString() : '-'}</td>
                    
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button onClick={() => openEditModal(rateInfo)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                        <Pencil className="w-4 h-4"/>
                      </button>
                      <button onClick={() => setDeleteConfirmId(rateInfo._rowIndex)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Delete">
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Exchange Rate?</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>
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
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl my-8 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
              <h3 className="text-lg font-bold text-slate-800">{editingRow ? "Edit Exchange Rate" : "Add Exchange Rate"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date <span className="text-rose-500">*</span></label>
                <input type="date" name="Date" value={formData.Date} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                  <h4 className="text-sm font-semibold text-emerald-800 mb-3">USD Rates</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">USD (CBM)</label>
                      <input type="number" step="any" name="USD_CBM" value={formData.USD_CBM} onChange={handleInputChange} placeholder="e.g. 2100" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">USD (Market)</label>
                      <input type="number" step="any" name="USD_Market" value={formData.USD_Market} onChange={handleInputChange} placeholder="e.g. 3500" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3">SGD Rates</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">SGD (CBM)</label>
                      <input type="number" step="any" name="SGD_CBM" value={formData.SGD_CBM} onChange={handleInputChange} placeholder="e.g. 1500" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">SGD (Market)</label>
                      <input type="number" step="any" name="SGD_Market" value={formData.SGD_Market} onChange={handleInputChange} placeholder="e.g. 2600" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Saving...' : 'Save Rates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}