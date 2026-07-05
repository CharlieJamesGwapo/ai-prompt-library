'use client';

import { useState } from 'react';
import ImportExportModal from '@/components/ImportExportModal';

export default function SettingsPage() {
  const [showImportExport, setShowImportExport] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Manage your preferences and data
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Data Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Export your favorites, collections, custom prompts, and ratings. Import previously exported data.
          </p>
          <button
            onClick={() => {
              setShowImportExport(true);
              setImportMessage('');
            }}
            className="py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Import / Export Data
          </button>
          {importMessage && (
            <p className="mt-4 text-green-600 dark:text-green-400">{importMessage}</p>
          )}
        </div>

        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            About
          </h2>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <p>
              <strong>AI Prompt Library</strong> is a client-side web application for managing AI prompts.
            </p>
            <p>
              All your data is stored locally in your browser using localStorage. Nothing is sent to any server.
            </p>
            <p>
              Built with Next.js 14, TypeScript, React 18, and Tailwind CSS.
            </p>
            <p className="mt-4">
              Created by <strong>Charlie James</strong>
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
            <li>Browse 50+ curated AI prompts</li>
            <li>Search and filter by category</li>
            <li>Create custom prompts</li>
            <li>Save favorite prompts</li>
            <li>Organize prompts into collections</li>
            <li>Rate prompts (1-5 stars)</li>
            <li>Copy prompts to clipboard</li>
            <li>Dark mode support</li>
            <li>Import/export data</li>
            <li>100% client-side (no backend)</li>
          </ul>
        </div>
      </div>

      <ImportExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        onImportSuccess={() => {
          setImportMessage('Data imported successfully!');
          setTimeout(() => setImportMessage(''), 3000);
        }}
      />
    </div>
  );
}
