import { useState, type KeyboardEvent } from 'react';
import { Check, Plus, Tag } from 'lucide-react';
import { Badge } from '@/components/badge';
import { cn } from '@/utils/cn';

export interface InterestSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  error?: string;
  hideHeader?: boolean;
}

const DEFAULT_POPULAR_TOPICS = [
  'Frontend Development',
  'Backend Architecture',
  'System Design',
  'Cloud & DevOps',
  'Career Transition',
  'Tech Leadership',
  'AI & Machine Learning',
  'Mobile Development',
  'Data Engineering',
  'UI/UX Design',
  'Product Management',
  'Interview Preparation',
];

export function InterestSelector({
  selectedInterests,
  onChange,
  error,
  hideHeader = false,
}: InterestSelectorProps) {
  const [customInput, setCustomInput] = useState('');

  const toggleTopic = (topic: string) => {
    if (selectedInterests.includes(topic)) {
      onChange(selectedInterests.filter((t) => t !== topic));
    } else {
      onChange([...selectedInterests, topic]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedInterests.includes(trimmed)) {
      onChange([...selectedInterests, trimmed]);
    }
    setCustomInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  // Combine popular topics and any user-added custom topics
  const allDisplayTopics = Array.from(
    new Set([...DEFAULT_POPULAR_TOPICS, ...selectedInterests]),
  );

  return (
    <div className="space-y-2.5">
      {!hideHeader && (
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-teal-700" />
              <span>Topics you want guidance on</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <Badge
              variant={selectedInterests.length > 0 ? 'primary' : 'default'}
              size="sm"
            >
              {selectedInterests.length}{' '}
              {selectedInterests.length === 1 ? 'topic' : 'topics'} selected
            </Badge>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Select 2 to 5 topics to train your recommendation engine.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {allDisplayTopics.map((topic) => {
          const isSelected = selectedInterests.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              aria-pressed={isSelected}
              className={cn(
                'group inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer select-none border',
                'active:scale-[0.97]',
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs ring-2 ring-teal-100 font-semibold'
                  : 'bg-slate-50/90 text-slate-700 border-slate-200/90 hover:bg-teal-50/70 hover:border-teal-400 hover:text-teal-900',
              )}
            >
              {isSelected ? (
                <Check className="h-3 w-3 stroke-[3]" />
              ) : (
                <Plus className="h-3 w-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
              )}
              <span>{topic}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Topic Input */}
      <div className="pt-1 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add custom topic (press Enter)..."
            className="w-full h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={handleAddCustom}
          disabled={!customInput.trim()}
          className="h-8 px-3 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
