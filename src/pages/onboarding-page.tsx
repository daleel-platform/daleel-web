import { Link, Navigate } from 'react-router';
import { DaleelLogo } from '@/components/logo';
import { usePageTitle } from '@/hooks/use-page-title';
import { ROUTES } from '@/routes/paths';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { MenteeOnboardingWizard } from '@/features/onboarding/components/mentee-onboarding-wizard';

const CURRENT_YEAR = new Date().getFullYear();

export function OnboardingPage() {
  usePageTitle('Get Started');
  const { data: user, isLoading } = useCurrentUser();

  // Only redirect to mentors if the user has ALREADY COMPLETED their profile
  if (!isLoading && user && user.interests && user.interests.length > 0) {
    return <Navigate to={ROUTES.MENTORS} replace />;
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
        <MenteeOnboardingWizard />
      </main>

      <footer className="text-center text-xs text-slate-400 pt-6 pb-2">
        &copy; {CURRENT_YEAR} Daleel Platform. All rights reserved.
      </footer>
    </div>
  );
}
