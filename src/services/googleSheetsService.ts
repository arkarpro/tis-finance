// src/services/googleSheetsService.ts

// 🌟 ဗဟိုထိန်းချုပ်စနစ် (Centralized API) အတွက် Master URL တစ်ခုတည်းကိုသာ အသုံးပြုပါမည်
const MASTER_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzsw6lbuGqM9Rb6WZzgE9vZMDPlo9XPBKYmiMSYFfGiOnxRE1CZI3zZIizFKHrLBJsy1Q/exec';

export const googleSheetsService = {
  readData: async (sheetName: string) => {
    try {
      const response = await fetch(`${MASTER_WEB_APP_URL}?action=read&sheet=${sheetName}`);
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error reading data');
    } catch (error) {
      console.error(`Error reading ${sheetName}:`, error);
      throw error;
    }
  },

  writeData: async (sheetName: string, data: any) => {
    try {
      const response = await fetch(`${MASTER_WEB_APP_URL}?action=write&sheet=${sheetName}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result;
      }
      throw new Error(result.message || 'Error writing data');
    } catch (error) {
      console.error(`Error writing to ${sheetName}:`, error);
      throw error;
    }
  },

  updateData: async (sheetName: string, data: any) => {
    try {
      const response = await fetch(`${MASTER_WEB_APP_URL}?action=update&sheet=${sheetName}`, {
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
      console.error(`Error updating ${sheetName}:`, error);
      throw error;
    }
  },

  deleteData: async (sheetName: string, rowIndex: number) => {
    try {
      const response = await fetch(`${MASTER_WEB_APP_URL}?action=delete&sheet=${sheetName}`, {
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
      console.error(`Error deleting from ${sheetName}:`, error);
      throw error;
    }
  }
};