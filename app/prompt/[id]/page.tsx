'use client';

import { useState, useMemo } from 'react';
import { DEFAULT_PROMPTS } from '@/lib/prompts';
import {
  getCustomPrompts,
  isFavorite,
  addFavorite,
  removeFavorite,
  getCollections,
  addPromptToCollection,
  deleteCustomPrompt,
} from '@/lib/storage';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RatingComponent from '@/components/RatingComponent';
import CustomPromptForm from '@/components/CustomPromptForm';

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const promptId = params.id as string;

  const allPrompts = useMemo(() => {
    const defaults = DEFAULT_PROMPTS;
    const custom = getCustomPrompts();
    return [...defaults, ...custom];
  }, []);

  const prompt = allPrompts.find((p) => p.id === promptId);
  const [isFav, setIsFav] = useState(isFavorite(promptId));
  const [copied, setCopied] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const collections = useMemo(() => getCollections(), []);

  if (!prompt) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Prompt not found
          </p>
          <Link href="/" className="text-blue-600 dark:text-blue-400 mt-4 inline-block">
            Back to Prompts
          </Link>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(prompt.id);
      setIsFav(false);
    } else {
      addFavorite(prompt.id);
      setIsFav(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCollection = (collectionId: string) => {
    addPromptToCollection(collectionId, prompt.id);
    setShowCollectionForm(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      deleteCustomPrompt(prompt.id);
      router.push('/my-prompts');
    }
  };

  const handleEditSuccess = () => {
    setEditMode(false);
    router.refresh();
  };

  if (editMode && prompt.isCustom) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <button
            onClick={() => setEditMode(false)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Prompt
          </button>
        </div>

        <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Edit Prompt
          </h2>
          <CustomPromptForm
            prompt={prompt}
            onSuccess={handleEditSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
      >
        ← Back to Prompts
      </Link>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {prompt.title}
            </h1>
            <div className="flex gap-2 flex-wrap mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                {prompt.category}
              </span>
              {prompt.author && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  by {prompt.author}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={toggleFavorite}
            className="text-4xl hover:scale-110 transition-transform"
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
              Description
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {prompt.description}
            </p>
          </div>

          {prompt.useCase && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                Use Case
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {prompt.useCase}
              </p>
            </div>
          )}

          {prompt.example && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                Example
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {prompt.example}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">
              Prompt Text
            </h2>
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white whitespace-pre-wrap break-words">
              {prompt.text}
            </div>
          </div>

          {prompt.tags && prompt.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
            <RatingComponent promptId={prompt.id} />
          </div>

          <div className="flex gap-3 flex-wrap border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
            <button
              onClick={copyToClipboard}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowCollectionForm(!showCollectionForm)}
                className="py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                📁 Add to Collection
              </button>

              {showCollectionForm && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 z-10 min-w-48">
                  {collections.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No collections yet.{' '}
                      <Link
                        href="/collections"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Create one
                      </Link>
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {collections.map((collection) => (
                        <button
                          key={collection.id}
                          onClick={() => handleAddToCollection(collection.id)}
                          className="block w-full text-left px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-sm text-slate-900 dark:text-white"
                        >
                          {collection.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {prompt.isCustom && (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="py-2 px-4 rounded-lg bg-red-200 dark:bg-red-950 text-red-900 dark:text-red-300 font-medium hover:bg-red-300 dark:hover:bg-red-900 transition-colors"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
