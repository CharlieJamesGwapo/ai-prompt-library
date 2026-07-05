'use client';

import { CATEGORIES, CATEGORY_LABELS } from '@/lib/prompts';
import { createCustomPrompt, updateCustomPrompt } from '@/lib/storage';
import { Prompt } from '@/lib/types';
import { useState } from 'react';

interface CustomPromptFormProps {
  prompt?: Prompt;
  onSuccess?: () => void;
}

export default function CustomPromptForm({
  prompt,
  onSuccess,
}: CustomPromptFormProps) {
  const [title, setTitle] = useState(prompt?.title || '');
  const [text, setText] = useState(prompt?.text || '');
  const [category, setCategory] = useState(prompt?.category || 'creative');
  const [description, setDescription] = useState(prompt?.description || '');
  const [useCase, setUseCase] = useState(prompt?.useCase || '');
  const [example, setExample] = useState(prompt?.example || '');
  const [tags, setTags] = useState(prompt?.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t);

      if (prompt) {
        updateCustomPrompt(
          prompt.id,
          title,
          text,
          category,
          description,
          useCase,
          example,
          tagArray
        );
      } else {
        createCustomPrompt(
          title,
          text,
          category,
          description,
          useCase,
          example,
          tagArray
        );
      }

      setTitle('');
      setText('');
      setCategory('creative');
      setDescription('');
      setUseCase('');
      setExample('');
      setTags('');

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
          Prompt Text *
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., ai, productivity, writing"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
          Description *
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Brief description of this prompt"
          className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
            Use Case
          </label>
          <input
            type="text"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="What is this prompt useful for?"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
            Example
          </label>
          <input
            type="text"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder="Example usage"
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : prompt ? 'Update Prompt' : 'Create Prompt'}
      </button>
    </form>
  );
}
