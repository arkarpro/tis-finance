// src/pages/InventoryMovementsPage.tsx

import { useState, useEffect } from 'react';
import { Plus, Search, X, Pencil, Trash2, MoreHorizontal, ArrowRightLeft, PackagePlus, PackageMinus, Activity } from 'lucide-react';
import { googleSheetsService } from '../services/googleSheetsService';

export default function InventoryMovementsPage() {
  const SHEET_NAME = '5_Inventory_Movements';

  const [movements, setMovements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  // ကော်လံအမည်များ အတိအကျ အသုံးပြုထားပါသည်
  const initialForm = {
    Movement_ID: '', Date: new Date().toISOString().split('T')[0], 
    Transaction_Type: 'Goods Receipt', Reference_No: '', Location_ID: '', 
    Product_ID: '', Qty_In: '0', Qty_Out: '0', Balance_Qty: '0', 
    Unit_Cost: '0', Total_Value: '0', Remarks: ''
  };

  const [formData, setFormData] = useState<any>(initialForm);

  const fetchMovements = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsService.readData(SHEET_NAME);
      setMovements(data);
    } catch (err) {
      alert("Inventory Movements Data များ ရယူရာတွင် အခက်အခဲရှိနေပါသည်။");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMovements(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      let newData = { ...prev, [name]: value };
      
      // Auto-calculate Total Value
      if (['Qty_In', 'Qty_Out', 'Unit_Cost'].includes(name)) {
        const qtyIn = parseFloat(newData.Qty_In || '0');
        const qtyOut = parseFloat(newData.Qty_Out || '0');
        const cost = parseFloat(newData.Unit_Cost || '0');
        const activeQty = qtyIn > 0 ? qtyIn : qtyOut;
        newData.Total_Value = (activeQty * cost).toString();
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingRow) {
        await googleSheetsService.updateData(SHEET_NAME, { ...formData, _rowIndex: editingRow._rowIndex });
      } else {
        await googleSheetsService.writeData(SHEET_NAME, formData);
      }
      setIsModalOpen(false);
      setEditingRow(null);
      setFormData(initialForm);
      fetchMovements();
    } catch (err) {
      alert("Data သိမ်းဆည်းရာတွင် အမှားအယွင်းဖြစ်ပေါ်ခဲ့ပါသည်။");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setIsDeleting(true);
    try {
      await googleSheetsService.deleteData(SHEET_NAME, deleteConfirmId);
      setMovements(prev => prev.filter(p => p._rowIndex !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert("Data ဖျက်ရာတွင် အမှားအယွင်းဖြစ်ပေါ်ခဲ့ပါသည်။");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMovements = movements.filter(mov => 
    (mov.Product_ID?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (mov.Reference_No?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const totalQtyIn = filteredMovements.reduce((sum, mov) => sum + Number(mov.Qty_In || 0), 0);
  const totalQtyOut = filteredMovements.reduce((sum, mov) => sum + Number(mov.Qty_Out || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory Movements</h2>
          <p className="text-sm text-slate-500">Track all IN and OUT transactions</p>
        </div>
        <button onClick={() => { setEditingRow(null); setFormData(initialForm); setIsModalOpen(true); }} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-700">
          <Plus className="w-4 h-4" /> Add Movement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 flex items-center justify-center rounded-lg"><Activity className="text-blue-600 w-5 h-5"/></div>
          <div><p className="text-xs text-slate-500">Total Transactions</p><p className="text-xl font-bold">{filteredMovements.length}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 flex items-center justify-center rounded-lg"><PackagePlus className="text-emerald-600 w-5 h-5"/></div>
          <div><p className="text-xs text-slate-500">Total Qty In</p><p className="text-xl font-bold text-emerald-600">+{totalQtyIn}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="w-11 h-11 bg-orange-50 flex items-center justify-center rounded-lg"><PackageMinus className="text-orange-600 w-5 h-5"/></div>
          <div><p className="text-xs text-slate-500">Total Qty Out</p><p className="text-xl font-bold text-orange-600">-{totalQtyOut}</p></div>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center gap-4 bg-slate-50">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by Product ID or Ref No..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full max-w-sm px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Movement ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Product ID</th>
                <th className="p-4 text-right">Qty In</th>
                <th className="p-4 text-right">Qty Out</th>
                <th className="p-4 text-right">Balance</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMovements.map((mov, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4">{mov.Date}</td>
                  <td className="p-4 font-bold">{mov.Movement_ID}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${mov.Transaction_Type?.includes('Receipt') ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {mov.Transaction_Type}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{mov.Product_ID}</td>
                  <td className="p-4 text-right text-emerald-600 font-bold">{Number(mov.Qty_In) > 0 ? `+${mov.Qty_In}` : '-'}</td>
                  <td className="p-4 text-right text-orange-600 font-bold">{Number(mov.Qty_Out) > 0 ? `-${mov.Qty_Out}` : '-'}</td>
                  <td className="p-4 text-right font-bold">{mov.Balance_Qty}</td>
                  <td className="p-4 relative text-center">
                    <button onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)} className="p-1 hover:bg-slate-200 rounded"><MoreHorizontal className="w-4 h-4"/></button>
                    {openMenuIndex === i && (
                      <div className="absolute right-12 top-2 w-32 bg-white shadow-xl border rounded-lg z-20 text-left">
                        <button onClick={() => { setEditingRow(mov); setFormData(mov); setIsModalOpen(true); setOpenMenuIndex(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-slate-50"><Pencil className="w-4 h-4"/> Edit</button>
                        <button onClick={() => { setDeleteConfirmId(mov._rowIndex); setOpenMenuIndex(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-slate-50"><Trash2 className="w-4 h-4"/> Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-4xl space-y-4 my-8">
            <h3 className="font-bold text-lg flex items-center gap-2"><ArrowRightLeft className="w-5 h-5"/> {editingRow ? "Edit" : "New"} Movement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(initialForm).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-semibold uppercase mb-1">{key.replace(/_/g, ' ')}</label>
                  {key === 'Transaction_Type' ? (
                     <select name={key} value={formData[key]} onChange={handleInputChange} className="w-full border p-2 rounded text-sm bg-white">
                        <option value="Goods Receipt">Goods Receipt</option>
                        <option value="Goods Issue">Goods Issue</option>
                        <option value="Adjustment">Adjustment</option>
                     </select>
                  ) : key === 'Date' || key === 'Last_Updated' ? (
                    <input type="date" name={key} value={formData[key]} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                  ) : (
                    <input name={key} value={formData[key]} onChange={handleInputChange} className="w-full border p-2 rounded text-sm" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-brand-600 text-white rounded">{isSubmitting ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}