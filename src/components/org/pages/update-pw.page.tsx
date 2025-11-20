import { useNavigate } from '@tanstack/react-router';
import { UpdatePasswordForm } from '@/components/org/forms/update-password.form';
import { useUpdatePasswordMutation } from '@/services/users.http-service';

export function UpdatePasswordPage() {
  const navigate = useNavigate({
    from: '/update-password/$token',
  });
  const updatePassword = useUpdatePasswordMutation();
  return (
    <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm
          updatePasswordMutation={updatePassword}
          handleSuccess={() => {
            navigate({ to: '/login' });
          }}
        />
      </div>
    </section>
  );
}
