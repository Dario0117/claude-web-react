import { useNavigate } from '@tanstack/react-router';
import { RegisterForm } from '@/components/org/forms/register.form';
import { useAuth } from '@/hooks/useAuth';

export function RegisterPage() {
  const navigate = useNavigate({ from: '/register' });
  const { register } = useAuth();
  return (
    <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm
          handleSubmit={async (
            username: string,
            password: string,
            email: string,
          ) => {
            const result = await register({
              username,
              password,
              email,
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
