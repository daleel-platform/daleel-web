import { RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/button';
import type { MentorItem } from '../types/mentor.types';
import { MentorCard } from './mentor-card';

export interface MentorGridProps {
  mentors: MentorItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onResetFilters: () => void;
}

export function MentorGrid({
  mentors,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onResetFilters,
}: MentorGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[255px] rounded-2xl border border-slate-200/80 bg-white p-5 animate-pulse flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex justify-between items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-200 shrink-0" />
                <div className="h-6 w-16 rounded-full bg-slate-100 shrink-0" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-1/2 rounded bg-slate-200" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
                <div className="h-2.5 w-1/3 rounded bg-slate-100" />
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-2.5 w-full rounded bg-slate-100" />
                <div className="h-2.5 w-4/5 rounded bg-slate-100" />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex gap-1.5">
              <div className="h-5 w-16 rounded-md bg-slate-100" />
              <div className="h-5 w-14 rounded-md bg-slate-100" />
              <div className="h-5 w-16 rounded-md bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-10 text-center space-y-3">
        <p className="text-sm font-bold text-red-900">Failed to load mentors</p>
        <p className="text-xs text-red-700 max-w-md mx-auto">
          {errorMessage ||
            'Unable to reach the mentor directory. Please verify your connection or try again.'}
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Search className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No mentors found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          We couldn&apos;t find any mentors matching your criteria. Try
          adjusting your search query, skills, or experience level.
        </p>
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  );
}
