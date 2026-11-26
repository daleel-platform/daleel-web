import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/badge';
import { buttonClassName } from '@/components/button-styles';
import { ROUTES } from '@/routes/paths';
import { useRecommendedMentors } from '../hooks/use-mentors';
import { MentorCard } from './mentor-card';

const MIN_RECOMMENDATION_SCORE = 60;
const MAX_RECOMMENDED_CARDS = 3;

export function RecommendedMentorsSection() {
  const { data, isLoading, isError } = useRecommendedMentors(
    MAX_RECOMMENDED_CARDS,
  );

  if (isError) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="space-y-4" aria-label="Recommended mentors">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="h-5 w-24 rounded-md bg-slate-100 animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: MAX_RECOMMENDED_CARDS }).map((_, idx) => (
            <div
              key={idx}
              className="min-h-[255px] rounded-2xl border border-slate-200/80 bg-white p-5 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-200 shrink-0" />
                  <div className="h-6 w-16 rounded-full bg-slate-100 shrink-0" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
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
      </section>
    );
  }

  // When the user has no learning interests yet, never show unpersonalized cards.
  if (data?.isFallback) {
    return (
      <section aria-label="Personalized recommendations prompt">
        <div className="flex flex-col gap-3 rounded-2xl border border-teal-200/80 bg-teal-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Unlock AI mentor recommendations
              </p>
              <p className="text-xs text-slate-600">
                Add your learning topics so Daleel can match you with mentors
                aligned to your goals.
              </p>
            </div>
          </div>

          <Link
            to={ROUTES.ONBOARDING}
            className={buttonClassName({
              variant: 'primary',
              size: 'sm',
              className: 'shrink-0 self-start sm:self-auto',
            })}
          >
            <span>Add Learning Topics</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const recommendations = (data?.items ?? [])
    .filter(
      (item) =>
        item.matchScore !== null && item.matchScore >= MIN_RECOMMENDATION_SCORE,
    )
    .slice(0, MAX_RECOMMENDED_CARDS);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-label="Recommended mentors">
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
          <span>Recommended for You</span>
        </h2>
        <Badge variant="primary" size="sm">
          {data?.semanticScoring ? 'AI-Matched' : 'Skill-Matched'}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((item) => (
          <MentorCard
            key={item.mentor.id}
            mentor={item.mentor}
            recommendation={{
              matchScore: item.matchScore,
              rationale: item.rationale,
              matchedSkills: item.matchedSkills,
            }}
          />
        ))}
      </div>
    </section>
  );
}
