import { useState, type FormEvent } from 'react';
import { Plus, RotateCcw, Search, X } from 'lucide-react';
import { Button } from '@/components/button';

const POPULAR_SKILLS = [
  'System Design',
  'React',
  'TypeScript',
  'Product Strategy',
  'Figma',
  'Python',
  'AWS',
  'Kubernetes',
  'Tech Leadership',
  'DevOps',
  'LLMs',
];

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
  onClearSkills: () => void;
  minExperience?: number;
  onMinExperienceChange: (value: number | undefined) => void;
  onResetAll: () => void;
}

export function MentorFilters({
  searchQuery,
  onSearchChange,
  selectedSkills,
  onToggleSkill,
  onClearSkills,
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

  const customSelectedSkills = selectedSkills.filter(
    (skill) =>
      !POPULAR_SKILLS.some(
        (preset) => preset.toLowerCase() === skill.toLowerCase(),
      ),
  );

  const handleAddCustomSkill = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const matchingPreset = POPULAR_SKILLS.find(
      (preset) => preset.toLowerCase() === trimmed.toLowerCase(),
    );
    const canonicalSkill = matchingPreset ?? trimmed;

    const alreadySelected = selectedSkills.some(
      (s) => s.toLowerCase() === canonicalSkill.toLowerCase(),
    );
    if (!alreadySelected) {
      onToggleSkill(canonicalSkill);
    }
    setSkillInput('');
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] space-y-4">
      {/* Top Row: Search + Custom Skill Filter + Experience Dropdown + Conditional Reset */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search mentors by name or headline (e.g. Sarah, Stripe, Staff Engineer)..."
            className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 transition-all"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <form
            onSubmit={handleAddCustomSkill}
            className="flex flex-1 sm:flex-initial items-center gap-1.5"
          >
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Filter by skill (e.g. Python)..."
              aria-label="Filter by skill"
              className="w-full sm:w-48 rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 transition-all"
            />
            <button
              type="submit"
              disabled={!skillInput.trim()}
              aria-label="Add skill filter"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>

          <select
            aria-label="Filter by minimum experience"
            value={minExperience ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              onMinExperienceChange(val ? Number(val) : undefined);
            }}
            className="rounded-xl border border-slate-200/90 bg-slate-50/70 px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10 cursor-pointer transition-all"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetAll}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              className="text-slate-500 hover:text-teal-700"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Multi-Select Skill Pills */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3.5 pb-0.5 scrollbar-none">
        <button
          type="button"
          onClick={onClearSkills}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            selectedSkills.length === 0
              ? 'bg-teal-700 text-white shadow-[0_4px_12px_rgba(15,118,110,0.22)]'
              : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-800'
          }`}
        >
          All Skills
        </button>

        {customSelectedSkills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => onToggleSkill(skill)}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(15,118,110,0.22)] transition-all hover:bg-teal-800 cursor-pointer"
          >
            <span>{skill}</span>
            <X className="h-3 w-3" />
          </button>
        ))}

        {POPULAR_SKILLS.map((skill) => {
          const isSelected = selectedSkills.some(
            (s) => s.toLowerCase() === skill.toLowerCase(),
          );
          return (
            <button
              key={skill}
              type="button"
              onClick={() => onToggleSkill(skill)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-[0_4px_12px_rgba(15,118,110,0.22)]'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-800'
              }`}
            >
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}
