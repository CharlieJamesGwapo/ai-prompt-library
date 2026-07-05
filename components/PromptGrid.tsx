import { Prompt } from '@/lib/types';
import PromptCard from './PromptCard';

export default function PromptGrid({
  prompts,
  empty = 'No prompts found',
}: {
  prompts: Prompt[];
  empty?: string;
}) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 text-lg">{empty}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
