'use client';

import { Prompt } from '@/lib/types';
import { isFavorite, addFavorite, removeFavorite } from '@/lib/storage';
import { useState } from 'react';
import Link from 'next/link';

export default function PromptCard({
  prompt,
  showCategory = true,
}: {
  prompt: Prompt;
  showCategory?: boolean;
}) {
  const [isFav, setIsFav] = useState(isFavorite(prompt.id));
  const [copied, setCopied] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(prompt.id);
      setIsFav(false);
    } else {
      addFavorite(prompt.id);
      setIsFav(true);
    }
  };

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/prompt/${prompt.id}`}>
      <div className="h-full p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg dark:hover:shadow-lg hover:shadow-slate-200 dark:hover:shadow-slate-900 transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {prompt.title}
          </h3>
          <button
            onClick={toggleFavorite}
            className="flex-shrink-0 text-xl hover:scale-110 transition-transform"
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-3">
          {prompt.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {showCategory && (
              <span className="inline-block px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {prompt.category}
              </span>
            )}
            {prompt.tags && prompt.tags.length > 0 && (
              <span className="inline-block px-2 py-1 text-xs rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                +{prompt.tags.length} tags
              </span>
            )}
          </div>
          <button
            onClick={copyToClipboard}
            className="text-sm px-3 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors whitespace-nowrap"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </div>
    </Link>
  );
}
