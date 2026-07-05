'use client';

import { useState, useMemo } from 'react';
import { getCustomPrompts, deleteCustomPrompt } from '@/lib/storage';
import CustomPromptForm from '@/components/CustomPromptForm';
import SearchBar from '@/components/SearchBar';
import PromptCard from '@/components/PromptCard';

export default function MyPromptsPage() {
  const [customPrompts, setCustomPrompts] = useState(getCustomPrompts());
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredPrompts = useMemo(() => {
    return customPrompts.filter((prompt) => {
      const matchesSearch =
        searchQuery === '' ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery, customPrompts]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      deleteCustomPrompt(id);
      setCustomPrompts(getCustomPrompts());
    }
  };

  const handleSuccess = () => {
    setCustomPrompts(getCustomPrompts());
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
          My Prompts
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Create and manage your custom prompts
        </p>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          + Create Custom Prompt
        </button>
      )}

      {showForm && (
        <div className="mb-12 p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Create New Prompt
          </h2>
          <CustomPromptForm
            onSuccess={() => {
              handleSuccess();
            }}
          />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            ← Cancel
          </button>
        </div>
      )}

      {customPrompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No custom prompts yet. Create your first one!
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Search Prompts
            </h2>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No prompts match your search
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Your Prompts
                </h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredPrompts.length} prompt
                  {filteredPrompts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-4">
                {filteredPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {prompt.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {prompt.category}
                        </span>
                        {prompt.tags &&
                          prompt.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-1 text-xs rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a
                        href={`/prompt/${prompt.id}`}
                        className="text-lg hover:scale-110 transition-transform"
                      >
                        👁️
                      </a>
                      <button
                        onClick={() => handleDelete(prompt.id)}
                        className="text-lg hover:scale-110 transition-transform"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
