import { Mail, Sparkles } from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';

export function ProfilePage() {
  const { data: user } = useCurrentUser();

  const interests =
    user?.interests && user.interests.length > 0
      ? user.interests
      : [
          'System Design',
          'Cloud Architecture',
          'Career Transitions',
          'Product Management',
          'Tech Leadership',
        ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 md:py-10 space-y-8">
      {/* Header Profile Card */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <Avatar
            name={user?.name}
            size="xl"
            status="online"
            className="h-20 w-20 ring-4 ring-teal-50"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {user?.name || 'My Profile'}
              </h1>
              <Badge variant="primary" size="sm">
                Active Mentee
              </Badge>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>{user?.email || '—'}</span>
            </div>

            <p className="mt-3 text-xs text-slate-600 leading-relaxed max-w-xl">
              {user?.bio ||
                'Aspiring technology professional actively expanding knowledge through 1-on-1 mentorship.'}
            </p>
          </div>

          <div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Profile Details & Career Goals */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Personal Info */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Personal Information
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">
                Full Name
              </span>
              <span className="text-slate-900 font-semibold mt-0.5 block">
                {user?.name || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">
                Email Address
              </span>
              <span className="text-slate-900 font-semibold mt-0.5 block">
                {user?.email || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">
                Account Type
              </span>
              <span className="text-teal-700 font-semibold mt-0.5 block">
                Standard Member (Mentee & Potential Mentor)
              </span>
            </div>
          </div>
        </Card>

        {/* Interests & Learning Goals */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Topics I Want to Learn
            </h2>
            <span className="text-[11px] text-teal-700 font-semibold cursor-pointer hover:underline">
              Add Topic
            </span>
          </div>
          <p className="text-xs text-slate-500">
            These topics guide Daleel's recommendation engine when suggesting
            mentors for you.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {interests.map((interest) => (
              <Badge key={interest} variant="primary" size="sm">
                {interest}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Become a Mentor Prompt */}
      <section className="rounded-3xl border border-teal-200/80 bg-gradient-to-r from-teal-50 via-teal-50/40 to-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-teal-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Ready to Share Your Knowledge?</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Activate Your Mentor Profile
          </h3>
          <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
            Create your mentor offerings, set your hourly rate or offer free
            community sessions, and start guiding the next generation.
          </p>
        </div>

        <div className="shrink-0">
          <Button variant="primary" size="md">
            Apply to Become a Mentor
          </Button>
        </div>
      </section>
    </div>
  );
}
