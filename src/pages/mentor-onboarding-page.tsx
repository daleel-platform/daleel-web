import { Navigate } from 'react-router';
import { ROUTES } from '@/routes/paths';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { MentorOnboardingWizard } from '@/features/onboarding/components/mentor-onboarding-wizard';

const CURRENT_YEAR = new Date().getFullYear();

export function MentorOnboardingPage() {
  const { data: user, isLoading } = useCurrentUser();

  // Users who already have a mentor profile manage it from their profile page
  if (!isLoading && user?.mentorProfile) {
    return <Navigate to={ROUTES.PROFILE} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between py-6 px-4 sm:px-6">
      <main className="flex justify-center my-auto py-2">
        <MentorOnboardingWizard />
      </main>

      <footer className="text-center text-xs text-slate-400 py-2">
        &copy; {CURRENT_YEAR} Daleel Platform. All rights reserved.
      </footer>
    </div>
  );
}
