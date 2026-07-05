'use client';

import { useState } from 'react';
import {
  getCollections,
  createCollection,
  deleteCollection,
  updateCollection,
} from '@/lib/storage';
import Link from 'next/link';

export default function CollectionsPage() {
  const [collections, setCollections] = useState(getCollections());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCollection(editingId, name, description);
      setEditingId(null);
    } else {
      createCollection(name, description);
    }
    setName('');
    setDescription('');
    setShowForm(false);
    setCollections(getCollections());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id);
      setCollections(getCollections());
    }
  };

  const handleEdit = (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || '');
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
          Collections
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Organize prompts into custom collections
        </p>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          + Create Collection
        </button>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
              Collection Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Writing Prompts"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this collection"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              {editingId ? 'Update' : 'Create'} Collection
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 px-4 rounded-lg bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white font-medium hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No collections yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
            >
              <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-lg dark:hover:shadow-lg hover:shadow-slate-200 dark:hover:shadow-slate-900 transition-all cursor-pointer group h-full">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {collection.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEdit(collection.id);
                      }}
                      className="text-lg hover:scale-110 transition-transform"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(collection.id);
                      }}
                      className="text-lg hover:scale-110 transition-transform"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {collection.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {collection.description}
                  </p>
                )}

                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {collection.promptIds.length} prompt
                  {collection.promptIds.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
