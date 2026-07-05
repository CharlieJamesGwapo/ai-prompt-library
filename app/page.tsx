'use client';

import { useState, useMemo } from 'react';
import { DEFAULT_PROMPTS, CATEGORY_LABELS } from '@/lib/prompts';
import { getCustomPrompts } from '@/lib/storage';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import PromptGrid from '@/components/PromptGrid';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allPrompts = useMemo(() => {
    const defaults = DEFAULT_PROMPTS;
    const custom = getCustomPrompts();
    return [...defaults, ...custom];
  }, []);

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter((prompt) => {
      const matchesSearch =
        searchQuery === '' ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prompt.tags &&
          prompt.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      const matchesCategory =
        selectedCategory === null || prompt.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allPrompts]);

  const trendingPrompts = useMemo(() => {
    return filteredPrompts.slice(0, 5);
  }, [filteredPrompts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
          Discover AI Prompts
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Browse, search, and organize curated prompts for your AI projects
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Search Prompts
          </h2>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Filter by Category
          </h2>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {filteredPrompts.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {selectedCategory ? CATEGORY_LABELS[selectedCategory] : 'All Prompts'}
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {filteredPrompts.length} prompt
                {filteredPrompts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <PromptGrid prompts={filteredPrompts} />
          </div>
        )}

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No prompts found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
