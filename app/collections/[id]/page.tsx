'use client';

import { useState, useMemo } from 'react';
import { DEFAULT_PROMPTS } from '@/lib/prompts';
import {
  getCollections,
  getCustomPrompts,
  removePromptFromCollection,
} from '@/lib/storage';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PromptGrid from '@/components/PromptGrid';

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = params.id as string;

  const collections = useMemo(() => getCollections(), []);
  const collection = collections.find((c) => c.id === collectionId);

  const allPrompts = useMemo(() => {
    const defaults = DEFAULT_PROMPTS;
    const custom = getCustomPrompts();
    return [...defaults, ...custom];
  }, []);

  const prompts = useMemo(() => {
    if (!collection) return [];
    return allPrompts.filter((prompt) =>
      collection.promptIds.includes(prompt.id)
    );
  }, [collection, allPrompts]);

  const [localPrompts, setLocalPrompts] = useState(prompts);

  const handleRemove = (promptId: string) => {
    if (collection) {
      removePromptFromCollection(collection.id, promptId);
      setLocalPrompts(
        localPrompts.filter((p) => p.id !== promptId)
      );
    }
  };

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Collection not found
          </p>
          <Link href="/collections" className="text-blue-600 dark:text-blue-400 mt-4 inline-block">
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/collections"
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
      >
        ← Back to Collections
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {collection.description}
          </p>
        )}
      </div>

      {localPrompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No prompts in this collection. Add some from the browse page!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Prompts in Collection
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {localPrompts.length} prompt
              {localPrompts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localPrompts.map((prompt) => (
              <div key={prompt.id} className="relative">
                <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-full">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex-1 line-clamp-2">
                      {prompt.title}
                    </h3>
                    <button
                      onClick={() => handleRemove(prompt.id)}
                      className="flex-shrink-0 text-xl hover:scale-110 transition-transform"
                    >
                      ❌
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
                    {prompt.description}
                  </p>

                  <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {prompt.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
