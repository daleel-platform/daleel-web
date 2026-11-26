import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { usePageTitle } from '@/hooks/use-page-title';

export function ResetPasswordPage() {
  usePageTitle('Reset Password');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/60 px-6 py-12">
      <ResetPasswordForm />
    </div>
  );
}
