import { Navigate, Outlet, useLocation } from 'react-router';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ROUTES } from '@/routes/paths';

export function ProtectedRoute() {
  const { isAuthenticated, token, logout } = useAuth();
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCurrentUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (token && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/70">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Handle failure to load the authenticated user (e.g., 500 error, network down)
  if (token && isError && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50/70">
        <Card className="max-w-md w-full p-6 text-center space-y-4 border border-slate-200/90 shadow-sm rounded-2xl bg-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Unable to load your profile
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {error?.message ||
                'We could not connect to the server to load your account. Please check your connection and try again.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => refetch()}
              loading={isFetching}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Retry
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-slate-500"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <Outlet />;
}
