import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { ChevronDown, Plus, Search, Tag, X } from 'lucide-react';
import { Badge } from '@/components/badge';
import { cn } from '@/utils/cn';

export interface InterestSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  error?: string;
  hideHeader?: boolean;
  placeholder?: string;
  maxItems?: number;
}

const SUGGESTED_TOPICS = [
  'Frontend Development',
  'Backend Architecture',
  'System Design',
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Cloud & DevOps',
  'AWS',
  'Kubernetes',
  'AI & Machine Learning',
  'LLMs',
  'Mobile Development',
  'Data Engineering',
  'UI/UX Design',
  'Figma',
  'Product Management',
  'Product Strategy',
  'Tech Leadership',
  'Career Transition',
  'Interview Preparation',
];

export function InterestSelector({
  selectedInterests,
  onChange,
  error,
  hideHeader = false,
  placeholder = 'Search or type a topic...',
  maxItems = 5,
}: InterestSelectorProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const isAtLimit = selectedInterests.length >= maxItems;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const selectedSet = new Set(selectedInterests.map((t) => t.toLowerCase()));

    return SUGGESTED_TOPICS.filter((topic) => {
      if (selectedSet.has(topic.toLowerCase())) return false;
      if (!normalizedQuery) return true;
      return topic.toLowerCase().includes(normalizedQuery);
    });
  }, [query, selectedInterests]);

  const trimmedQuery = query.trim();
  const canAddCustom =
    Boolean(trimmedQuery) &&
    !selectedInterests.some(
      (t) => t.toLowerCase() === trimmedQuery.toLowerCase(),
    ) &&
    !SUGGESTED_TOPICS.some(
      (t) => t.toLowerCase() === trimmedQuery.toLowerCase(),
    );

  const dropdownItems: { label: string; isCustom: boolean }[] = [
    ...filteredSuggestions.map((label) => ({ label, isCustom: false })),
    ...(canAddCustom ? [{ label: trimmedQuery, isCustom: true }] : []),
  ];

  const selectTopic = (topic: string) => {
    if (isAtLimit) return;
    const clean = topic.trim();
    if (!clean) return;
    if (
      selectedInterests.some((t) => t.toLowerCase() === clean.toLowerCase())
    ) {
      return;
    }
    onChange([...selectedInterests, clean]);
    setQuery('');
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const removeTopic = (topicToRemove: string) => {
    onChange(selectedInterests.filter((t) => t !== topicToRemove));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      if (dropdownItems.length > 0) {
        setHighlightedIndex((prev) => (prev + 1) % dropdownItems.length);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      if (dropdownItems.length > 0) {
        setHighlightedIndex(
          (prev) => (prev - 1 + dropdownItems.length) % dropdownItems.length,
        );
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (isAtLimit) return;
      const activeItem = dropdownItems[highlightedIndex];
      if (isOpen && activeItem) {
        selectTopic(activeItem.label);
      } else if (trimmedQuery) {
        selectTopic(trimmedQuery);
      }
      return;
    }

    if (e.key === 'Backspace' && !query && selectedInterests.length > 0) {
      removeTopic(selectedInterests[selectedInterests.length - 1]);
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {!hideHeader && (
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
              <span>Topics</span>
              <span className="text-red-500 font-bold">*</span>
            </label>
            <Badge
              variant={
                isAtLimit
                  ? 'accent'
                  : selectedInterests.length > 0
                    ? 'primary'
                    : 'default'
              }
              size="sm"
            >
              {selectedInterests.length}/{maxItems} selected
            </Badge>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Select up to {maxItems} topics from the list or type your own.
          </p>
        </div>
      )}

      {/* Selected Chips */}
      {selectedInterests.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedInterests.map((topic) => (
            <Badge
              key={topic}
              variant="primary"
              size="md"
              className="pr-1.5 py-1"
            >
              <span>{topic}</span>
              <button
                type="button"
                onClick={() => removeTopic(topic)}
                aria-label={`Remove ${topic}`}
                className="ml-1 rounded-sm p-0.5 text-teal-700 hover:bg-teal-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-700 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Searchable Combobox Input */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen && !isAtLimit}
          aria-controls={listboxId}
          aria-autocomplete="list"
          value={query}
          disabled={isAtLimit}
          onFocus={() => {
            if (!isAtLimit) {
              setIsOpen(true);
              setHighlightedIndex(0);
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isAtLimit ? `Maximum ${maxItems} topics selected` : placeholder
          }
          className={cn(
            'w-full rounded-xl border border-slate-300 bg-white pl-9 pr-9 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 transition-all',
            'focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/10',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            error &&
              'border-red-400 focus:border-red-500 focus:ring-red-500/10',
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={isAtLimit}
          onClick={() => {
            if (isAtLimit) return;
            if (isOpen) {
              setIsOpen(false);
            } else {
              setIsOpen(true);
              inputRef.current?.focus();
            }
          }}
          aria-label="Toggle topic suggestions"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 disabled:opacity-40 cursor-pointer"
        >
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-150',
              isOpen && !isAtLimit && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>

        {/* Suggestions Dropdown */}
        {isOpen && !isAtLimit && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 z-20 mt-1.5 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
          >
            {dropdownItems.length === 0 ? (
              <p className="px-3 py-2 text-xs text-slate-400 text-center">
                No matching topics. Keep typing to add a custom one.
              </p>
            ) : (
              dropdownItems.map((item, idx) => (
                <button
                  key={`${item.isCustom ? 'custom' : 'preset'}-${item.label}`}
                  type="button"
                  role="option"
                  aria-selected={idx === highlightedIndex}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectTopic(item.label);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer',
                    idx === highlightedIndex
                      ? 'bg-teal-50 text-teal-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                >
                  <span className="flex items-center gap-2">
                    {item.isCustom && (
                      <Plus
                        className="h-3.5 w-3.5 text-teal-700"
                        aria-hidden="true"
                      />
                    )}
                    <span>
                      {item.isCustom ? `Add "${item.label}"` : item.label}
                    </span>
                  </span>
                  {item.isCustom && (
                    <span className="text-[10px] font-medium text-teal-700">
                      Custom
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {isAtLimit && (
        <p className="text-[11px] text-slate-500">
          Maximum {maxItems} topics selected. Remove one to add another.
        </p>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
