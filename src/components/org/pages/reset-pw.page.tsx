import { useNavigate } from '@tanstack/react-router';
import { ResetPasswordForm } from '@/components/org/forms/reset-password.form';
import { useAuth } from '@/hooks/useAuth';

export function ResetPasswordPage() {
  const navigate = useNavigate({ from: '/app/register' });
  const { resetPassword } = useAuth();
  return (
    <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm
          handleSubmit={async (email: string) => {
            console.log({
              email,
            });

            const result = await resetPassword({
              email,
            });

            return result;
          }}
          handleSuccess={() => {
            navigate({ to: '/app/login' });
          }}
        />
      </div>
    </section>
  );
}
