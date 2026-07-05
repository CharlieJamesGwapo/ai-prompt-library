'use client';

import { useState, useMemo } from 'react';
import { DEFAULT_PROMPTS } from '@/lib/prompts';
import { getFavorites, getCustomPrompts } from '@/lib/storage';
import SearchBar from '@/components/SearchBar';
import PromptGrid from '@/components/PromptGrid';

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const favoriteIds = useMemo(() => getFavorites(), []);

  const allPrompts = useMemo(() => {
    const defaults = DEFAULT_PROMPTS;
    const custom = getCustomPrompts();
    return [...defaults, ...custom];
  }, []);

  const favorites = useMemo(() => {
    return allPrompts.filter((prompt) => favoriteIds.includes(prompt.id));
  }, [allPrompts, favoriteIds]);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((prompt) => {
      const matchesSearch =
        searchQuery === '' ||
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery, favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
          Favorite Prompts
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Your saved favorite prompts
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
            Search Favorites
          </h2>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <PromptGrid
          prompts={filteredFavorites}
          empty="No favorite prompts yet. Start by saving some!"
        />
      </div>
    </div>
  );
}
