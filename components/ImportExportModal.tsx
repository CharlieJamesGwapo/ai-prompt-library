'use client';

import { exportData, importData } from '@/lib/storage';
import { useState, useRef } from 'react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export default function ImportExportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportExportModalProps) {
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-library-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        importData(content);
        setImportError('');
        onImportSuccess?.();
        onClose();
      } catch (error) {
        setImportError('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
          Import / Export
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Export all your data (favorites, collections, custom prompts, ratings) as JSON
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              📥 Export Data
            </button>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Import previously exported data
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              className="w-full py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
            >
              📤 Import Data
            </button>
            {importError && (
              <p className="text-sm text-red-500 mt-2">{importError}</p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
