import { Link, Navigate } from 'react-router';
import { DaleelLogo } from '@/components/logo';
import { usePageTitle } from '@/hooks/use-page-title';
import { ROUTES } from '@/routes/paths';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { MentorOnboardingWizard } from '@/features/onboarding/components/mentor-onboarding-wizard';

const CURRENT_YEAR = new Date().getFullYear();

export function MentorOnboardingPage() {
  usePageTitle('Become a Mentor');
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/70">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Users who already have a mentor profile manage it from their profile page
  if (user?.mentorProfile) {
    return <Navigate to={ROUTES.PROFILE} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col py-6 px-4 sm:px-6">
      <header className="mx-auto w-full max-w-2xl pb-5">
        <Link
          to={ROUTES.MENTORS}
          className="inline-block hover:opacity-90 transition-opacity"
          aria-label="Daleel Mentors"
        >
          <DaleelLogo size="md" />
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center">
        <MentorOnboardingWizard />
      </main>

      <footer className="text-center text-xs text-slate-400 pt-6 pb-2">
        &copy; {CURRENT_YEAR} Daleel Platform. All rights reserved.
      </footer>
    </div>
  );
}
