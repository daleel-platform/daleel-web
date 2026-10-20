import { useState, type KeyboardEvent } from 'react';
import { Check, Plus, Tag } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface InterestSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  error?: string;
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-teal-700" />
          <span>Topics you want guidance on</span>
          <span className="text-red-500">*</span>
        </label>
        <span className="text-[11px] text-slate-500">
          {selectedInterests.length}{' '}
          {selectedInterests.length === 1 ? 'selected' : 'selected'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {allDisplayTopics.map((topic) => {
          const isSelected = selectedInterests.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              aria-pressed={isSelected}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer select-none border',
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-teal-500 hover:bg-teal-50/40 hover:text-teal-900',
              )}
            >
              {isSelected ? (
                <Check className="h-3 w-3 stroke-[3]" />
              ) : (
                <Plus className="h-3 w-3 text-slate-400" />
              )}
              <span>{topic}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Topic Input */}
      <div className="pt-2 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add custom topic (press Enter)..."
            className="w-full h-8.5 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          />
        </div>
        <button
          type="button"
          onClick={handleAddCustom}
          disabled={!customInput.trim()}
          className="h-8.5 px-3 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
