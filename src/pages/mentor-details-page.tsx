import { Link, useParams } from 'react-router';
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useMentor } from '@/features/mentors/hooks/use-mentors';
import { ROUTES } from '@/routes/paths';

export function MentorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: mentor,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMentor(id ?? '');

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8 md:py-10 space-y-8">
        <div className="h-4 w-40 rounded bg-slate-200 animate-pulse" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 animate-pulse space-y-5">
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-5/6 rounded bg-slate-100" />
                </div>
              </div>
            </div>
            <div className="h-44 rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 animate-pulse" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-72 rounded-3xl border border-slate-200/90 bg-white p-6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !mentor?.user) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 space-y-6">
        <Link
          to={ROUTES.MENTORS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Mentors Directory</span>
        </Link>

        <div className="flex min-h-[45vh] items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                Mentor profile unavailable
              </h1>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {error?.message ||
                  'We could not load this mentor profile. It may be inactive or no longer exist.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => refetch()}
                loading={isFetching}
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                Retry
              </Button>
              <Link to={ROUTES.MENTORS}>
                <Button variant="outline" size="sm">
                  Browse Mentors
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to={ROUTES.MENTORS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Mentors Directory</span>
        </Link>
      </div>

      {/* Main Grid: Profile Info & Action Sidebar */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left 8 Cols: Mentor Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <Avatar
                name={mentor.user.name}
                src={mentor.user.avatarUrl ?? undefined}
                size="xl"
                status={mentor.isActive ? 'online' : 'offline'}
                className="rounded-full ring-4 ring-teal-50"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {mentor.user.name}
                  </h1>
                  {mentor.isActive && (
                    <Badge variant="success" size="sm">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Active Mentor</span>
                    </Badge>
                  )}
                </div>

                <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  <span>{mentor.headline}</span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  {mentor.yearsOfExperience !== null && (
                    <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                      <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                      <span>
                        {mentor.yearsOfExperience} years of experience
                      </span>
                    </span>
                  )}

                  {mentor.linkedinUrl && (
                    <a
                      href={mentor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                    >
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {mentor.user.bio && (
                  <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                    {mentor.user.bio}
                  </p>
                )}

                {mentor.skills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {mentor.skills.map((skill) => (
                      <Badge key={skill} variant="default" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* About My Mentorship Section */}
          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">
              About My Mentorship
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {mentor.about ||
                'This mentor has not added a detailed mentorship overview yet.'}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  How Sessions Work
                </span>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Conducted 1-on-1 online. Align on your goals ahead of time to
                  get actionable guidance tailored to your career stage.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Preparation
                </span>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Bring 2–3 specific questions, projects, or career milestones
                  you want feedback on to make the most of your session.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right 4 Cols: Sticky Action Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md shadow-slate-200/50 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                  1-on-1 Mentorship
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  Connect with {mentor.user.name.split(' ')[0]}
                </span>
              </div>
              {mentor.isActive && (
                <Badge variant="primary" size="sm">
                  Available
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Clock className="h-4 w-4 text-teal-700" />
                <span>Focused 1-on-1 mentorship sessions</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Video className="h-4 w-4 text-teal-700" />
                <span>Online video or audio call</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="h-4 w-4 text-teal-700" />
                <span>Direct Q&amp;A and practical feedback</span>
              </div>
            </div>

            <Link to={ROUTES.SESSIONS} className="block">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<Calendar className="h-4 w-4" />}
              >
                Request Mentorship Session
              </Button>
            </Link>

            <Link to={ROUTES.MESSAGES} className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<MessageSquare className="h-4 w-4" />}
              >
                Send Message First
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
