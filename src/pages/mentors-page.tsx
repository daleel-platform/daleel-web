import { useState } from 'react';
import { MentorFilters } from '@/features/mentors/components/mentor-filters';
import { MentorGrid } from '@/features/mentors/components/mentor-grid';
import { MentorPagination } from '@/features/mentors/components/mentor-pagination';
import { RecommendedMentorsSection } from '@/features/mentors/components/recommended-mentors-section';
import { useMentors } from '@/features/mentors/hooks/use-mentors';
import { useDebounce } from '@/hooks/use-debounce';
import { usePageTitle } from '@/hooks/use-page-title';

export function MentorsPage() {
  usePageTitle('Find Mentors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minExperience, setMinExperience] = useState<number | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: mentorsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useMentors({
    page: currentPage,
    limit: 9,
    search: debouncedSearch.trim() || undefined,
    skills: selectedSkills.length > 0 ? selectedSkills : undefined,
    minExperience,
  });

  const mentorsList = mentorsData?.items ?? [];
  const meta = mentorsData?.meta;
  const totalCount = meta?.totalItems ?? mentorsList.length;

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedSkills.length > 0 ||
    minExperience !== undefined,
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.some((s) => s.toLowerCase() === skill.toLowerCase())
        ? prev.filter((s) => s.toLowerCase() !== skill.toLowerCase())
        : [...prev, skill],
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setMinExperience(undefined);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-10 space-y-8">
      {/* Page Title & Description */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Discover Mentors
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Connect 1-on-1 with industry practitioners who have walked the path.
          Filter by skill, headline, or experience to find the ideal guide for
          your next step.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <MentorFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        selectedSkills={selectedSkills}
        onToggleSkill={toggleSkill}
        minExperience={minExperience}
        onMinExperienceChange={(val) => {
          setMinExperience(val);
          setCurrentPage(1);
        }}
        onResetAll={handleResetFilters}
      />

      {/* AI Recommended Row (hidden while filtering/searching) */}
      {!hasActiveFilters && <RecommendedMentorsSection />}

      {/* All Mentors Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {hasActiveFilters ? 'Matching Mentors' : 'All Mentors'}
          </h2>

          {!isLoading && (
            <span className="text-xs font-medium text-slate-500">
              Showing <strong className="text-slate-800">{totalCount}</strong>{' '}
              {totalCount === 1 ? 'mentor' : 'mentors'}
            </span>
          )}
        </div>

        <MentorGrid
          mentors={mentorsList}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          onRetry={() => refetch()}
          onResetFilters={handleResetFilters}
        />
      </section>

      {/* Pagination */}
      <MentorPagination meta={meta} onPageChange={setCurrentPage} />
    </div>
  );
}

export default MentorsPage;
