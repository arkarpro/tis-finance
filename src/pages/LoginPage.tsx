// src/pages/LoginPage.tsx
import { useState } from 'react';
import { googleSheetsService } from '../services/googleSheetsService';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 0_Users sheet မှ data များကို ဆွဲယူမည်
      const users = await googleSheetsService.readData('0_Users');
      
      // Username နှင့် Password တိုက်စစ်မည်
      const validUser = users.find(
        (u: any) => u.Username === username && u.Password === password
      );

      if (validUser) {
        onLogin(validUser); // မှန်ကန်ပါက App.tsx သို့ User Data ပို့ပေးမည်
      } else {
        setError('Username သို့မဟုတ် Password မှားယွင်းနေပါသည်။');
      }
    } catch (err) {
      setError('စနစ်ချိတ်ဆက်မှု ပြဿနာရှိနေပါသည်။ အင်တာနက်စစ်ဆေးပါ။');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-brand-600 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg p-2">
            <img src="/images/tis_logo.png" alt="TIS Academy Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-white">TIS Academy</h2>
          <p className="text-brand-100 text-sm mt-1">Financial & Inventory System</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm text-center">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input 
              type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}