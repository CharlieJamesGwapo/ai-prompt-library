export interface Prompt {
  id: string;
  title: string;
  text: string;
  category: string;
  description: string;
  useCase?: string;
  example?: string;
  author?: string;
  createdAt: number;
  isCustom?: boolean;
  tags?: string[];
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  promptIds: string[];
  createdAt: number;
}

export interface UserRating {
  [promptId: string]: number; // 1-5
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
}
