import { useState, type FormEvent } from 'react';
import { Plus, RotateCcw, Search, X } from 'lucide-react';
import { Button } from '@/components/button';

const EXPERIENCE_OPTIONS = [
  { label: 'Any experience', value: '' },
  { label: '3+ years', value: '3' },
  { label: '5+ years', value: '5' },
  { label: '8+ years', value: '8' },
  { label: '10+ years', value: '10' },
  { label: '12+ years', value: '12' },
];

export interface MentorFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  minExperience?: number;
  onMinExperienceChange: (value: number | undefined) => void;
  onResetAll: () => void;
}

export function MentorFilters({
  searchQuery,
  onSearchChange,
  selectedSkills,
  onToggleSkill,
  minExperience,
  onMinExperienceChange,
  onResetAll,
}: MentorFiltersProps) {
  const [skillInput, setSkillInput] = useState('');

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedSkills.length > 0 ||
    minExperience !== undefined,
  );

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const alreadySelected = selectedSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!alreadySelected) {
      onToggleSkill(trimmed);
    }
    setSkillInput('');
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs space-y-3">
      {/* Single Compact Filter Row */}
      <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search mentors by name, role, or company..."
            aria-label="Search mentors"
            className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 transition-all"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <form
            onSubmit={handleAddSkill}
            className="flex flex-1 sm:flex-initial items-center gap-1.5"
          >
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Filter by skill (e.g. React)..."
              aria-label="Filter by skill"
              className="w-full sm:w-48 rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 transition-all"
            />
            <button
              type="submit"
              disabled={!skillInput.trim()}
              aria-label="Add skill filter"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </form>

          <select
            aria-label="Filter by minimum experience"
            value={minExperience ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              onMinExperienceChange(val ? Number(val) : undefined);
            }}
            className="rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 cursor-pointer transition-all"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onResetAll}
              leftIcon={
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              }
              className="text-slate-500 hover:text-teal-700"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Skill Filter Chips (only shown when skills are applied) */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 mr-1">
            Skills:
          </span>
          {selectedSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => onToggleSkill(skill)}
              aria-label={`Remove ${skill} filter`}
              className="inline-flex items-center gap-1 rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-teal-800 cursor-pointer"
            >
              <span>{skill}</span>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
