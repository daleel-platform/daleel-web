import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { usePageTitle } from '@/hooks/use-page-title';

export function ForgotPasswordPage() {
  usePageTitle('Forgot Password');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/60 px-6 py-12">
      <ForgotPasswordForm />
    </div>
  );
}
