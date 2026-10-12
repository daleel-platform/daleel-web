import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ROUTES } from '@/routes/paths';

export function ProtectedRoute() {
  const { isAuthenticated, token } = useAuth();
  const { isLoading } = useCurrentUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (token && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return <Outlet />;
}
