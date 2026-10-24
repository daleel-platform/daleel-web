import { Navigate } from 'react-router';
import { ROUTES } from '@/routes/paths';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { MenteeOnboardingWizard } from '@/features/onboarding/components/mentee-onboarding-wizard';
import { isOnboardingDismissed } from '@/features/onboarding/utils/onboarding-storage';

const CURRENT_YEAR = new Date().getFullYear();

export function OnboardingPage() {
  const { data: user, isLoading } = useCurrentUser();

  // If already dismissed or user already has interests set, redirect to mentors
  if (
    !isLoading &&
    user &&
    (isOnboardingDismissed(user.id) ||
      (user.interests && user.interests.length > 0))
  ) {
    return <Navigate to={ROUTES.MENTORS} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between py-6 px-4 sm:px-6">
      <main className="flex justify-center my-auto py-2">
        <MenteeOnboardingWizard />
      </main>

      <footer className="text-center text-xs text-slate-400 py-2">
        &copy; {CURRENT_YEAR} Daleel Platform. All rights reserved.
      </footer>
    </div>
  );
}
