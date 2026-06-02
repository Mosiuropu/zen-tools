import React, { useState } from 'react';
import { Download, Upload, Trash2, ShieldAlert, Check } from 'lucide-react';

const Settings = () => {
  const [importStatus, setImportStatus] = useState('');

  const handleExport = () => {
    const data = { ...localStorage };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zen-tools-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, data[key]);
        });
        setImportStatus('Data imported successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        setImportStatus('Failed to import data. Invalid file format.');
        setTimeout(() => setImportStatus(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure? This will delete all your local data including notes, habits, and priorities. This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-stone-900 rounded-md p-8 border border-stone-200 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-stone-900 dark:text-stone-100 rounded-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-50">Data Management</h3>
            <p className="text-stone-500 dark:text-stone-400">Your data never leaves your device. Manage your local storage here.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-6 bg-stone-50 dark:bg-stone-800/50 rounded-md border border-stone-100 dark:border-stone-800">
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-50 text-sm">Export Data</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Download all your habits, notes, and settings as a JSON file.</p>
            </div>
            <button 
              onClick={handleExport}
              className="zen-btn-primary flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-md"
            >
              <Download className="w-5 h-5" />
              Export Backup
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-6 bg-stone-50 dark:bg-stone-800/50 rounded-md border border-stone-100 dark:border-stone-800">
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-50 text-sm">Import Data</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Restore your data from a previous JSON backup file.</p>
            </div>
            <div className="w-full sm:w-auto relative">
              <input 
                type="file" 
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Select backup file"
              />
              <button className="flex items-center gap-2 px-6 py-3 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold rounded-md transition-all w-full sm:w-auto justify-center">
                <Upload className="w-5 h-5" />
                Import Backup
              </button>
            </div>
          </div>
          
          {importStatus && (
            <div className={`p-4 rounded-md flex items-center gap-3 ${importStatus.includes('success') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
              <Check className="w-5 h-5" />
              <p className="font-semibold">{importStatus}</p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h4 className="font-semibold text-red-600 dark:text-red-400 text-sm">Danger Zone</h4>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Permanently delete all local data from this browser.</p>
              </div>
              <button 
                onClick={handleClear}
                className="flex items-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 font-semibold rounded-md transition-all w-full sm:w-auto justify-center border border-red-200 dark:border-red-900/50"
              >
                <Trash2 className="w-5 h-5" />
                Clear All Data
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
