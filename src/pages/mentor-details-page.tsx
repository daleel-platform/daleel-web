import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
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
  Star,
  Video,
} from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useCreateConversation } from '@/features/chat/hooks/use-create-conversation';
import { useMentor } from '@/features/mentors/hooks/use-mentors';
import { getPlaceholderRating } from '@/features/mentors/utils/mentor-rating';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/routes/paths';

export function MentorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: currentUser } = useCurrentUser();
  const createConversationMutation = useCreateConversation();
  const {
    data: mentor,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMentor(id ?? '');

  usePageTitle(mentor?.user.name ?? 'Mentor Profile');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isOwnProfile = Boolean(
    currentUser?.id && mentor?.user.id && currentUser.id === mentor.user.id,
  );

  const handleStartMessage = () => {
    if (!mentor?.user.id) return;

    createConversationMutation.mutate(mentor.user.id, {
      onSuccess: (conversation) => {
        navigate(`${ROUTES.MESSAGES}?conversationId=${conversation.id}`);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to start conversation.');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        <div className="h-4 w-40 rounded bg-slate-200 animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 animate-pulse space-y-5">
              <div className="flex items-start gap-5">
                <div className="h-16 w-16 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-6 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-4/5 rounded bg-slate-100" />
                </div>
              </div>
            </div>
            <div className="h-44 rounded-2xl border border-slate-200/80 bg-white p-6 animate-pulse" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-64 rounded-2xl border border-slate-200/80 bg-white p-6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !mentor?.user) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <Link
          to={ROUTES.MENTORS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Mentors Directory</span>
        </Link>

        <div className="flex min-h-[45vh] items-center justify-center">
          <Card className="max-w-md w-full p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
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
                leftIcon={
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                }
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

  const { rating, reviewCount } = getPlaceholderRating(mentor.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      {/* Back Navigation */}
      <div>
        <Link
          to={ROUTES.MENTORS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Mentors Directory</span>
        </Link>
      </div>

      {/* Main Grid: Profile Info & Action Sidebar */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Mentor Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <Avatar
                name={mentor.user.name}
                src={mentor.user.avatarUrl ?? undefined}
                size="xl"
                status={mentor.isActive ? 'online' : 'offline'}
                className="rounded-full ring-4 ring-teal-50"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                      {mentor.user.name}
                    </h1>
                    {mentor.isActive && (
                      <Badge variant="success" size="sm">
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        <span>Active Mentor</span>
                      </Badge>
                    )}
                  </div>

                  <span
                    className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900"
                    aria-label={`Rated ${rating} out of 5 from ${reviewCount} reviews`}
                  >
                    <Star
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-500"
                      aria-hidden="true"
                    />
                    <span>{rating}</span>
                    <span className="font-medium text-amber-700/80">
                      ({reviewCount} reviews)
                    </span>
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <Briefcase className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{mentor.headline}</span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  {mentor.yearsOfExperience !== null && (
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                      <Sparkles
                        className="h-3.5 w-3.5 text-teal-600"
                        aria-hidden="true"
                      />
                      <span>
                        {mentor.yearsOfExperience}{' '}
                        {mentor.yearsOfExperience === 1 ? 'year' : 'years'} of
                        experience
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
                      <ExternalLink
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </div>

                {mentor.user.bio && (
                  <p className="mt-4 text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {mentor.user.bio}
                  </p>
                )}

                {mentor.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
                    {mentor.skills.map((skill) => (
                      <Badge key={skill} variant="default" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* About My Mentorship Section */}
          <Card className="p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                About My Mentorship
              </h2>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {mentor.about ||
                  'This mentor has not added a detailed mentorship overview yet.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100">
              <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-4">
                <h3 className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                  How Sessions Work
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Conducted 1-on-1 online. Align on your goals ahead of time to
                  get actionable guidance tailored to your career stage.
                </p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                <h3 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Preparation
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Bring 2–3 specific questions, projects, or career milestones
                  you want feedback on to make the most of your session.
                </p>
              </div>
            </div>
          </Card>

          {/* Work Experience Timeline */}
          {mentor.experiences && mentor.experiences.length > 0 && (
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Briefcase
                  className="h-4 w-4 text-teal-700"
                  aria-hidden="true"
                />
                <h2 className="text-base font-bold text-slate-900">
                  Work Experience
                </h2>
              </div>

              <ol className="space-y-5">
                {mentor.experiences.map((exp, idx) => (
                  <li
                    key={exp.id ?? `${exp.company}-${exp.startYear}-${idx}`}
                    className="relative pl-5 border-l-2 border-slate-200 last:border-l-transparent"
                  >
                    <span
                      className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-700 ring-4 ring-white"
                      aria-hidden="true"
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {exp.title}
                        </h3>
                        <p className="text-xs font-semibold text-teal-700">
                          {exp.company}
                        </p>
                      </div>
                      <Badge variant="default" size="sm">
                        {exp.startYear} – {exp.endYear ?? 'Present'}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {exp.summary}
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>

        {/* Right 4 Cols: Sticky Action Sidebar */}
        <div className="lg:col-span-4">
          <Card className="sticky top-20 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  1-on-1 Mentorship
                </p>
                <h2 className="mt-0.5 text-lg font-extrabold text-slate-900">
                  Connect with {mentor.user.name.split(' ')[0]}
                </h2>
              </div>
              {mentor.isActive && (
                <Badge variant="primary" size="sm">
                  Available
                </Badge>
              )}
            </div>

            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <Clock
                  className="h-4 w-4 text-teal-700 shrink-0"
                  aria-hidden="true"
                />
                <span>Focused 1-on-1 mentorship sessions</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <Video
                  className="h-4 w-4 text-teal-700 shrink-0"
                  aria-hidden="true"
                />
                <span>Online video or audio call</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2
                  className="h-4 w-4 text-teal-700 shrink-0"
                  aria-hidden="true"
                />
                <span>Direct Q&amp;A and practical feedback</span>
              </li>
            </ul>

            <div className="space-y-2.5 pt-1">
              <Link to={ROUTES.SESSIONS} className="block">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  leftIcon={<Calendar className="h-4 w-4" aria-hidden="true" />}
                >
                  Request Mentorship Session
                </Button>
              </Link>

              {!isOwnProfile && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={handleStartMessage}
                  loading={createConversationMutation.isPending}
                  leftIcon={
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  }
                >
                  Send Message First
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
