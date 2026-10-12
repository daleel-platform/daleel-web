import { Navigate, Route, Routes } from 'react-router';
import { ROUTES } from '@/routes/paths';
import { ProtectedRoute } from '@/routes/guards/protected-route';
import { PublicOnlyRoute } from '@/routes/guards/public-only-route';
import { DashboardLayout } from '@/routes/layouts/dashboard-layout';

import { AboutPage } from '@/pages/about-page';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';
import { ForgotPasswordPage } from '@/pages/forgot-password-page';
import { ResetPasswordPage } from '@/pages/reset-password-page';
import { MentorsPage } from '@/pages/mentors-page';
import { MentorDetailsPage } from '@/pages/mentor-details-page';
import { SessionsPage } from '@/pages/sessions-page';
import { MessagesPage } from '@/pages/messages-page';
import { ProfilePage } from '@/pages/profile-page';
import { NotFoundPage } from '@/pages/not-found-page';

export function AppRouter() {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path={ROUTES.HOME} element={<AboutPage />} />

      {/* Guest-only auth routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      {/* Authenticated protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<Navigate to={ROUTES.MENTORS} replace />}
          />
          <Route path={ROUTES.MENTORS} element={<MentorsPage />} />
          <Route path="/mentors/:id" element={<MentorDetailsPage />} />
          <Route path={ROUTES.SESSIONS} element={<SessionsPage />} />
          <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Catch-all 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
