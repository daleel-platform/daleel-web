import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ROUTES } from '@/routes/paths';
import { isOnboardingDismissed } from '@/features/onboarding/utils/onboarding-storage';

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  const { data: user } = useCurrentUser();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  if (isAuthenticated) {
    const isMentorSignUp =
      pathname === ROUTES.REGISTER &&
      searchParams.get('intent') === 'mentor' &&
      !user?.mentorProfile;

    const hasCompletedOnboarding =
      Boolean(user?.mentorProfile) ||
      (user?.interests && user.interests.length > 0) ||
      isOnboardingDismissed(user?.id);

    const redirectTo = isMentorSignUp
      ? ROUTES.MENTOR_ONBOARDING
      : hasCompletedOnboarding
        ? ROUTES.MENTORS
        : ROUTES.ONBOARDING;

    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
