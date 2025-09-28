import { useNavigate } from '@tanstack/react-router';
import { UpdatePasswordForm } from '@/components/org/forms/update-password.form';
import { useAuth } from '@/hooks/useAuth';

type UpdatePasswordPageProps = {
  token: string;
};

export function UpdatePasswordPage(props: UpdatePasswordPageProps) {
  const navigate = useNavigate({
    from: '/update-password/$token',
  });
  const { updatePassword } = useAuth();
  return (
    <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm
          handleSubmit={async (password: string) => {
            const result = await updatePassword({
              password,
              token: props.token,
            });

            return result;
          }}
          handleSuccess={() => {
            navigate({ to: '/login' });
          }}
        />
      </div>
    </section>
  );
}
