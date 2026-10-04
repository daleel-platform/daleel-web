import { BrowserRouter, Route, Routes } from 'react-router';
import { ForgotPasswordPage } from '@/pages/forgot-password-page';
import { ResetPasswordPage } from '@/pages/reset-password-page';
import { ROUTES } from '@/routes/paths';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';
import { DashboardPage } from '@/pages/dashboard-page';
import App from '@/App';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<App />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
