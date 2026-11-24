import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Avatar } from '@/components/avatar';
import { MentorFilters } from '@/features/mentors/components/mentor-filters';
import { MentorGrid } from '@/features/mentors/components/mentor-grid';
import { MentorPagination } from '@/features/mentors/components/mentor-pagination';
import { useMentors } from '@/features/mentors/hooks/use-mentors';
import { useDebounce } from '@/hooks/use-debounce';

const FALLBACK_HERO_AVATARS = [
  { name: 'Sarah Mansour', src: undefined },
  { name: 'Omar Sherif', src: undefined },
  { name: 'Lina Haddad', src: undefined },
  { name: 'Khaled El-Sayed', src: undefined },
];

export function MentorsPage() {
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

  const heroAvatars =
    mentorsList.length >= 4
      ? mentorsList.slice(0, 4).map((m) => ({
          name: m.user.name,
          src: m.user.avatarUrl ?? undefined,
        }))
      : FALLBACK_HERO_AVATARS;

  return (
    <div className="pb-12">
      {/* 1. Full-Bleed Hero Section Fading Smoothly Into Page Canvas */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 pt-14 pb-68 sm:pt-16 sm:pb-65 text-white">
        <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute top-10 -left-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        {/* Smooth, gradual bottom fade into page background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-background/55 to-background" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-teal-200 backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>500+ Verified Industry Mentors</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.18]">
              Learn from leaders who&apos;ve{' '}
              <span className="text-teal-300 underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-4">
                been there.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed max-w-xl">
              Connect 1-on-1 with senior engineers, product leaders, and
              designers from top global companies. Accelerate your career with
              structured guidance.
            </p>
          </div>

          {/* Social Proof Badge */}
          <div className="flex items-center gap-4 shrink-0 rounded-2xl bg-white/10 border border-white/15 px-4 py-3 backdrop-blur-xs">
            <div className="flex -space-x-2.5">
              {heroAvatars.map((person) => (
                <Avatar
                  key={person.name}
                  name={person.name}
                  src={person.src}
                  size="sm"
                  className="rounded-full ring-2 ring-teal-900"
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">
                4.95 Average Rating
              </p>
              <p className="text-[11px] font-medium text-teal-200/80">
                from 3,500+ booked sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 space-y-8">
        {/* 2. Elevated White Filter Card Floating Over the Fade */}
        <div className="-mt-46">
          <MentorFilters
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            selectedSkills={selectedSkills}
            onToggleSkill={toggleSkill}
            onClearSkills={() => {
              setSelectedSkills([]);
              setCurrentPage(1);
            }}
            minExperience={minExperience}
            onMinExperienceChange={(val) => {
              setMinExperience(val);
              setCurrentPage(1);
            }}
            onResetAll={handleResetFilters}
          />
        </div>

        {/* 3. Section Heading + Main Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                {searchQuery.trim()
                  ? 'Search results'
                  : 'Mentors you might like'}
              </h2>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            {!isLoading && (
              <span className="text-xs font-medium text-slate-400">
                {meta?.totalItems ?? mentorsList.length} mentors
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
        </div>

        {/* 4. Pagination */}
        <MentorPagination meta={meta} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

export default MentorsPage;
