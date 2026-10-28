import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ROUTES } from '@/routes/paths';
import type { UserProfile } from '../types/profile.types';

export interface FinishOnboardingBannerProps {
  profile: UserProfile;
}

export function FinishOnboardingBanner({
  profile,
}: FinishOnboardingBannerProps) {
  const hasCompletedInterests =
    profile.interests && profile.interests.length > 0;

  // If user already has learning interests, banner is not needed
  if (hasCompletedInterests) {
    return null;
  }

  return (
    <Card className="border-amber-200/90 bg-gradient-to-r from-amber-50/70 via-amber-50/30 to-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-4 ring-amber-50">
            <Compass className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">
              Finish Your Mentee Profile
            </h2>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              You haven&apos;t set your learning topics yet. Completing your
              profile helps us connect you with mentors matching your career
              ambitions.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Link to={ROUTES.ONBOARDING}>
            <Button
              variant="accent"
              size="sm"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              className="w-full sm:w-auto"
            >
              Finish Profile
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
