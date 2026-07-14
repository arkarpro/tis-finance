// src/components/Layout.tsx (အတိုချုပ် ပြင်ဆင်ပုံ)
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

// 🌟 ၁။ အသစ်တိုးလိုက်သော Props များ
interface LayoutProps {
  user?: any;
  onLogout?: () => void;
}

// 🌟 ၂။ Props များကို လက်ခံယူခြင်း
export default function Layout({ user, onLogout }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* 🌟 ၃။ Header ဆီသို့ user နှင့် onLogout ကို လက်ဆင့်ကမ်း ပို့ပေးခြင်း */}
        <Header user={user} onLogout={onLogout} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <Outlet /> {/* React Router မှ Route အလိုက် Pages များကို ဤနေရာတွင် လာပေါ်စေသည် */}
        </main>
      </div>
    </div>
  );
}