// src/services/googleSheetsService.ts

// 🌟 ၁။ ယခင် Data (Cash & Bank, COA) များအတွက် App Script Link အဟောင်း (ဒီနေရာမှာ သင့် Link အဟောင်း ပြန်ထည့်ပါ)
const DATA_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzIhbs0Wnhc-I1bjPicNUu5sxlhV86fC9gzNwDr2cl5gbntk1Zvf6JH36JoKogjLODy/exec'; 

// ယခု User Login အတွက် ဖန်တီးလိုက်သော App Script Link အသစ်
const AUTH_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwoMlr_08HP2Q3Qz1GPPK4j_z3ZMy_DcgtQkfZIBipRyZqOD6NyliT4NtSQoZ6F6XIrcg/exec';

// Sheet နာမည်ကို ကြည့်ပြီး ဘယ် Link ကို သုံးမလဲ ဆုံးဖြတ်ပေးမည့် Function
const getTargetUrl = (sheetName: string) => {
  return sheetName === '0_Users' ? AUTH_WEB_APP_URL : DATA_WEB_APP_URL;
};

export const googleSheetsService = {
  readData: async (sheetName: string) => {
    const baseUrl = getTargetUrl(sheetName);
    try {
      // 🌟 Apps Script က လက်ခံမည့် ?action=read&sheet=... ဟု အတိအကျ ပို့ပေးရမည်
      const response = await fetch(`${baseUrl}?action=read&sheet=${sheetName}`);
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error reading data');
    } catch (error) {
      console.error('Error reading from Google Sheets:', error);
      throw error;
    }
  },

  writeData: async (sheetName: string, data: any) => {
    const baseUrl = getTargetUrl(sheetName);
    try {
      // 🌟 POST ဖြစ်သော်လည်း URL ထဲတွင် action နှင့် sheet ကို ထည့်ပေးရမည် (Apps Script ၏ e.parameter အတွက်)
      const response = await fetch(`${baseUrl}?action=write&sheet=${sheetName}`, {
        method: 'POST',
        body: JSON.stringify(data), // Payload အလွတ်သာ ပို့မည်
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result;
      }
      throw new Error(result.message || 'Error writing data');
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      throw error;
    }
  },

  updateData: async (sheetName: string, data: any) => {
    const baseUrl = getTargetUrl(sheetName);
    try {
      const response = await fetch(`${baseUrl}?action=update&sheet=${sheetName}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result;
      }
      throw new Error(result.message || 'Error updating data');
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
      throw error;
    }
  },

  deleteData: async (sheetName: string, rowIndex: number) => {
    const baseUrl = getTargetUrl(sheetName);
    try {
      const response = await fetch(`${baseUrl}?action=delete&sheet=${sheetName}`, {
        method: 'POST',
        body: JSON.stringify({ _rowIndex: rowIndex }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result;
      }
      throw new Error(result.message || 'Error deleting data');
    } catch (error) {
      console.error('Error deleting from Google Sheets:', error);
      throw error;
    }
  }
};