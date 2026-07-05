'use client';

import { CATEGORIES, CATEGORY_LABELS } from '@/lib/prompts';

export default function CategoryFilter({
  selectedCategory,
  onChange,
}: {
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        All
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {CATEGORY_LABELS[category]}
        </button>
      ))}
    </div>
  );
}
