import { Prompt, Collection, UserRating, UserSettings } from './types';

const STORAGE_KEYS = {
  FAVORITES: 'prompt_library_favorites',
  COLLECTIONS: 'prompt_library_collections',
  CUSTOM_PROMPTS: 'prompt_library_custom_prompts',
  RATINGS: 'prompt_library_ratings',
  SETTINGS: 'prompt_library_settings',
  RECENTLY_USED: 'prompt_library_recently_used',
};

// Favorites
export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addFavorite(promptId: string): void {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  if (!favorites.includes(promptId)) {
    favorites.push(promptId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }
}

export function removeFavorite(promptId: string): void {
  if (typeof window === 'undefined') return;
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== promptId);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
}

export function isFavorite(promptId: string): boolean {
  return getFavorites().includes(promptId);
}

// Collections
export function getCollections(): Collection[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function createCollection(name: string, description?: string): Collection {
  if (typeof window === 'undefined') throw new Error('Window not available');
  const collection: Collection = {
    id: Date.now().toString(),
    name,
    description,
    promptIds: [],
    createdAt: Date.now(),
  };
  const collections = getCollections();
  collections.push(collection);
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  return collection;
}

export function updateCollection(
  id: string,
  name: string,
  description?: string
): void {
  if (typeof window === 'undefined') return;
  const collections = getCollections();
  const collection = collections.find((c) => c.id === id);
  if (collection) {
    collection.name = name;
    collection.description = description;
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  }
}

export function deleteCollection(id: string): void {
  if (typeof window === 'undefined') return;
  const collections = getCollections().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
}

export function addPromptToCollection(
  collectionId: string,
  promptId: string
): void {
  if (typeof window === 'undefined') return;
  const collections = getCollections();
  const collection = collections.find((c) => c.id === collectionId);
  if (collection && !collection.promptIds.includes(promptId)) {
    collection.promptIds.push(promptId);
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  }
}

export function removePromptFromCollection(
  collectionId: string,
  promptId: string
): void {
  if (typeof window === 'undefined') return;
  const collections = getCollections();
  const collection = collections.find((c) => c.id === collectionId);
  if (collection) {
    collection.promptIds = collection.promptIds.filter((id) => id !== promptId);
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  }
}

// Custom Prompts
export function getCustomPrompts(): Prompt[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PROMPTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function createCustomPrompt(
  title: string,
  text: string,
  category: string,
  description: string,
  useCase?: string,
  example?: string,
  tags?: string[]
): Prompt {
  if (typeof window === 'undefined') throw new Error('Window not available');
  const prompt: Prompt = {
    id: `custom_${Date.now()}`,
    title,
    text,
    category,
    description,
    useCase,
    example,
    author: 'You',
    createdAt: Date.now(),
    isCustom: true,
    tags,
  };
  const prompts = getCustomPrompts();
  prompts.push(prompt);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_PROMPTS, JSON.stringify(prompts));
  return prompt;
}

export function updateCustomPrompt(
  id: string,
  title: string,
  text: string,
  category: string,
  description: string,
  useCase?: string,
  example?: string,
  tags?: string[]
): void {
  if (typeof window === 'undefined') return;
  const prompts = getCustomPrompts();
  const prompt = prompts.find((p) => p.id === id);
  if (prompt) {
    prompt.title = title;
    prompt.text = text;
    prompt.category = category;
    prompt.description = description;
    prompt.useCase = useCase;
    prompt.example = example;
    prompt.tags = tags;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PROMPTS, JSON.stringify(prompts));
  }
}

export function deleteCustomPrompt(id: string): void {
  if (typeof window === 'undefined') return;
  const prompts = getCustomPrompts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_PROMPTS, JSON.stringify(prompts));
}

// Ratings
export function getRatings(): UserRating {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RATINGS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function setRating(promptId: string, rating: number): void {
  if (typeof window === 'undefined') return;
  const ratings = getRatings();
  ratings[promptId] = Math.min(5, Math.max(1, rating));
  localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
}

export function getRating(promptId: string): number | null {
  const ratings = getRatings();
  return ratings[promptId] || null;
}

// Recently Used
export function getRecentlyUsed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENTLY_USED);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToRecentlyUsed(promptId: string): void {
  if (typeof window === 'undefined') return;
  let recent = getRecentlyUsed();
  recent = recent.filter((id) => id !== promptId);
  recent.unshift(promptId);
  if (recent.length > 10) {
    recent = recent.slice(0, 10);
  }
  localStorage.setItem(STORAGE_KEYS.RECENTLY_USED, JSON.stringify(recent));
}

// Settings
export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return { theme: 'system' };
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { theme: 'system' };
  } catch {
    return { theme: 'system' };
  }
}

export function updateSettings(settings: Partial<UserSettings>): void {
  if (typeof window === 'undefined') return;
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}

// Import/Export
export function exportData() {
  const data = {
    favorites: getFavorites(),
    collections: getCollections(),
    customPrompts: getCustomPrompts(),
    ratings: getRatings(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonData: string): void {
  if (typeof window === 'undefined') return;
  try {
    const data = JSON.parse(jsonData);

    if (data.favorites) {
      localStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(data.favorites)
      );
    }
    if (data.collections) {
      localStorage.setItem(
        STORAGE_KEYS.COLLECTIONS,
        JSON.stringify(data.collections)
      );
    }
    if (data.customPrompts) {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_PROMPTS,
        JSON.stringify(data.customPrompts)
      );
    }
    if (data.ratings) {
      localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(data.ratings));
    }
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
  } catch (error) {
    throw new Error('Invalid import data');
  }
}
