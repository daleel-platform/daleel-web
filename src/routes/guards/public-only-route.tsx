import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ROUTES } from '@/routes/paths';
import { isOnboardingDismissed } from '@/features/onboarding/utils/onboarding-storage';

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();
  const { data: user } = useCurrentUser();

  if (isAuthenticated) {
    const hasCompletedOnboarding =
      (user?.interests && user.interests.length > 0) ||
      isOnboardingDismissed(user?.id);

    return (
      <Navigate
        to={hasCompletedOnboarding ? ROUTES.MENTORS : ROUTES.ONBOARDING}
        replace
      />
    );
  }

  return <Outlet />;
}
