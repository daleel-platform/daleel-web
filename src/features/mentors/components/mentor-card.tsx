import { ArrowUpRight, Briefcase, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { ROUTES } from '@/routes/paths';
import type { MentorItem } from '../types/mentor.types';

export interface MentorCardRecommendation {
  matchScore: number | null;
  rationale: string;
  matchedSkills: string[];
}

export interface MentorCardProps {
  mentor: MentorItem;
  recommendation?: MentorCardRecommendation;
}

/** Temporary deterministic placeholder until real mentor ratings are implemented. */
function getPlaceholderRating(mentor: MentorItem): {
  rating: string;
  reviewCount: number;
} {
  const seed = mentor.id
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rating = (4.7 + (seed % 4) * 0.1).toFixed(1);
  const reviewCount = 12 + (seed % 37);
  return { rating, reviewCount };
}

export function MentorCard({ mentor, recommendation }: MentorCardProps) {
  const headlineParts = mentor.headline.split(/\s+at\s+/i);
  const role = headlineParts[0] || mentor.headline;
  const company = headlineParts[1] || null;

  const visibleSkills = mentor.skills.slice(0, 3);
  const bioSnippet =
    mentor.about ||
    mentor.user.bio ||
    'Experienced mentor dedicated to accelerating career growth and guiding through real-world challenges.';

  const matchPercentage =
    recommendation?.matchScore !== null &&
    recommendation?.matchScore !== undefined
      ? Math.round(recommendation.matchScore)
      : null;

  const { rating, reviewCount } = getPlaceholderRating(mentor);

  return (
    <Link
      to={ROUTES.MENTOR_DETAILS(mentor.id)}
      className="block h-full group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
    >
      <Card
        hoverable
        className="flex h-full min-h-[255px] flex-col justify-between p-5"
      >
        <div>
          {/* Top Row: Avatar + Rating / Match Meta */}
          <div className="flex items-start justify-between gap-3">
            <Avatar
              name={mentor.user.name}
              src={mentor.user.avatarUrl ?? undefined}
              size="lg"
              status={mentor.isActive ? 'online' : 'offline'}
            />

            <div className="flex flex-col items-end gap-1.5">
              <span
                className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-900"
                aria-label={`Rated ${rating} out of 5 from ${reviewCount} reviews`}
              >
                <Star
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-500"
                  aria-hidden="true"
                />
                <span>{rating}</span>
                <span className="font-medium text-amber-700/80">
                  ({reviewCount})
                </span>
              </span>

              {matchPercentage !== null && (
                <Badge variant="primary" size="sm">
                  <Sparkles
                    className="h-3 w-3 text-amber-500"
                    aria-hidden="true"
                  />
                  <span>{matchPercentage}% match</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="mt-3.5">
            <h3 className="truncate text-base font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              {mentor.user.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-teal-700">
              <Briefcase className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {company ? `${role} · ${company}` : mentor.headline}
              </span>
            </div>
            {mentor.yearsOfExperience !== null && (
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                {mentor.yearsOfExperience}{' '}
                {mentor.yearsOfExperience === 1 ? 'yr' : 'yrs'} experience
              </p>
            )}
          </div>

          {/* Bio & Optional Rationale */}
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
            {bioSnippet}
          </p>

          {recommendation && (
            <p className="mt-1.5 line-clamp-1 text-[11px] font-medium text-teal-700/90">
              {recommendation.rationale}
            </p>
          )}
        </div>

        {/* Bottom Skills Strip + Subtle Click Affordance */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {visibleSkills.map((skill) => {
              const isMatched = recommendation?.matchedSkills.some(
                (matched) => matched.toLowerCase() === skill.toLowerCase(),
              );
              return (
                <Badge
                  key={skill}
                  variant={isMatched ? 'primary' : 'default'}
                  size="sm"
                >
                  {skill}
                </Badge>
              );
            })}
            {mentor.skills.length > visibleSkills.length && (
              <Badge variant="outline" size="sm">
                +{mentor.skills.length - visibleSkills.length}
              </Badge>
            )}
          </div>

          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-700"
            aria-hidden="true"
          />
        </div>
      </Card>
    </Link>
  );
}
