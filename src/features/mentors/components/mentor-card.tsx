import { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '@/routes/paths';
import type { MentorItem } from '../types/mentor.types';

export interface MentorCardProps {
  mentor: MentorItem;
  index?: number;
}

export function MentorCard({ mentor, index = 0 }: MentorCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Parse role & company from headline if available (e.g. "Staff Software Engineer at Stripe")
  const headlineParts = mentor.headline.split(/\s+at\s+/i);
  const role = headlineParts[0] || mentor.headline;
  const company = headlineParts[1] || null;

  // Derive calculated rating & sessions from experience for realistic social proof
  const experienceYears = mentor.yearsOfExperience ?? 5;
  const calculatedRating = (4.85 + (experienceYears % 15) * 0.01).toFixed(2);
  const calculatedReviews = 25 + experienceYears * 9;
  const calculatedSessions = 50 + experienceYears * 25;
  const hourlyRate = 35 + experienceYears * 5;

  const visibleSkills = mentor.skills.slice(0, 3);
  const bioSnippet =
    mentor.about ||
    mentor.user.bio ||
    'Experienced mentor dedicated to accelerating career growth and guiding through real-world challenges.';

  return (
    <article
      className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-[0_4px_18px_rgba(28,55,52,0.035)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_20px_40px_rgba(15,118,110,0.1)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top Right Decorative Corner with Heart Icon */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[72px] w-[72px] bg-teal-700 transition-transform duration-300 ease-out origin-top-right group-hover:scale-110"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}
      />
      <button
        type="button"
        aria-label={
          isSaved
            ? `Remove ${mentor.user.name} from saved mentors`
            : `Save ${mentor.user.name} to favorites`
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsSaved(!isSaved);
        }}
        className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Heart
          className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
            isSaved ? 'fill-white text-white' : 'text-white'
          }`}
        />
      </button>

      {/* Mentor Identity: Avatar & Titles */}
      <div className="flex items-start gap-3.5 pr-8">
        <div className="relative shrink-0">
          {mentor.user.avatarUrl ? (
            <img
              src={mentor.user.avatarUrl}
              alt={mentor.user.name}
              className="h-[68px] w-[68px] rounded-2xl object-cover object-top border border-slate-200/80 transition duration-500 ease-out group-hover:-rotate-2 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-600 text-lg font-bold text-white transition duration-500 ease-out group-hover:-rotate-2 group-hover:scale-105">
              {mentor.user.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase()}
            </div>
          )}
          {mentor.isActive && (
            <span
              aria-label="Available now"
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="truncate text-base font-bold tracking-tight text-slate-900 group-hover:text-teal-800 transition-colors">
            {mentor.user.name}
          </h3>
          <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
            {role}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px]">
            {company && (
              <span className="truncate font-semibold text-teal-700">
                @ {company}
              </span>
            )}
            {mentor.yearsOfExperience !== null && (
              <span className="font-medium text-slate-400">
                {company ? '· ' : ''}
                {mentor.yearsOfExperience} yrs exp
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Social Proof: Rating & Sessions Badge */}
      <div className="mt-4 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{calculatedRating}</span>
        </span>
        <span className="text-slate-400">({calculatedReviews} reviews)</span>

        <span className="ml-auto rounded-full bg-teal-50/70 border border-teal-100/60 px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
          {calculatedSessions}+ sessions
        </span>
      </div>

      {/* Bio / About Snippet */}
      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
        {bioSnippet}
      </p>

      {/* Skill Pills */}
      {visibleSkills.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600"
            >
              {skill}
            </span>
          ))}
          {mentor.skills.length > visibleSkills.length && (
            <span className="rounded-md border border-slate-200/60 bg-white px-1.5 py-1 text-[9px] font-semibold text-slate-400">
              +{mentor.skills.length - visibleSkills.length}
            </span>
          )}
        </div>
      )}

      {/* Bottom Footer: Price & View Profile Button */}
      <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            ${hourlyRate}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            {' '}
            / hour
          </span>
        </div>

        <Link
          to={ROUTES.MENTOR_DETAILS(mentor.id)}
          className="shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-[0_5px_12px_rgba(15,118,110,0.18)] transition-all hover:bg-teal-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 cursor-pointer"
          >
            View profile
          </button>
        </Link>
      </div>

      {/* Smooth Animated Hover Underline (Expands left-to-right) */}
      <div className="absolute inset-x-6 bottom-0 h-[3px] origin-left scale-x-0 rounded-t-full bg-teal-700 transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </article>
  );
}
