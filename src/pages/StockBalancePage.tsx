// src/pages/StockBalancePage.tsx

import { useState, useEffect } from 'react';
import { Search, AlertTriangle, Boxes, DollarSign, RefreshCw } from 'lucide-react';
import { googleSheetsService } from '../services/googleSheetsService';

export default function StockBalancePage() {
  const SHEET_NAME = '6_Inventory_Balance';

  const [balances, setBalances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBalances = async () => {
    setIsLoading(true);
    try {
      const data = await googleSheetsService.readData(SHEET_NAME);
      setBalances(data);
    } catch (err) {
      alert("Stock Balance Data များ ရယူရာတွင် အခက်အခဲရှိနေပါသည်။");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBalances(); }, []);

  const filteredBalances = balances.filter(b => 
    (b.Product_Name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (b.Product_ID?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const totalValue = filteredBalances.reduce((sum, b) => sum + Number(b.Total_Value || 0), 0);
  const lowStockCount = filteredBalances.filter(b => Number(b.Current_Qty) <= Number(b.Min_Stock_Level)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventory Balance</h2>
          <p className="text-sm text-slate-500">Real-time stock levels and valuation</p>
        </div>
        <button onClick={fetchBalances} className="p-2 border rounded-lg text-slate-500 hover:bg-slate-50 flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 flex items-center justify-center rounded-lg"><Boxes className="text-blue-600 w-5 h-5"/></div>
          <div><p className="text-xs text-slate-500">Total Items</p><p className="text-xl font-bold">{filteredBalances.length}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="w-11 h-11 bg-rose-50 flex items-center justify-center rounded-lg"><AlertTriangle className="text-rose-600 w-5 h-5"/></div>
          <div><p className="text-xs text-slate-500">Low Stock Alert</p><p className="text-xl font-bold text-rose-600">{lowStockCount}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 flex items-center justify-center rounded-lg"><DollarSign className="text-emerald-600 w-5 h-5"/></div>
          <div><p className="text-xs text-slate-500">Total Asset Value</p><p className="text-xl font-bold text-emerald-600">${totalValue.toLocaleString()}</p></div>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center gap-4 bg-slate-50">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by Product ID or Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full max-w-sm px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4">Product ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">UOM</th>
                <th className="p-4 text-right">Current Qty</th>
                <th className="p-4 text-right">Avg Unit Cost</th>
                <th className="p-4 text-right">Total Value</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredBalances.map((b, i) => {
                const isLowStock = Number(b.Current_Qty) <= Number(b.Min_Stock_Level);
                return (
                  <tr key={i} className={`hover:bg-slate-50 ${isLowStock ? 'bg-rose-50/30' : ''}`}>
                    <td className="p-4 font-bold text-brand-700">{b.Product_ID}</td>
                    <td className="p-4 font-medium">{b.Product_Name}</td>
                    <td className="p-4 text-slate-500">{b.Location_ID}</td>
                    <td className="p-4 text-center">{b.UOM}</td>
                    <td className={`p-4 text-right font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-800'}`}>
                      {b.Current_Qty} {isLowStock && <AlertTriangle className="inline w-3 h-3 ml-1" />}
                    </td>
                    <td className="p-4 text-right">${Number(b.Unit_Cost).toLocaleString()}</td>
                    <td className="p-4 text-right font-medium">${Number(b.Total_Value).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${isLowStock ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {b.Status || (isLowStock ? 'LOW STOCK' : 'IN STOCK')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}