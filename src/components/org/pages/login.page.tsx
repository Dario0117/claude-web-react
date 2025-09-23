import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { LoginForm } from '@/components/org/forms/login.form';
import { useLogin } from '@/services/users.service';

export function LoginPage() {
  const navigate = useNavigate({ from: '/login' });
  const login = useLogin();

  useEffect(() => {
    if (login.isSuccess) {
      navigate({ to: '/' });
    }
  }, [login.isSuccess, navigate]);
  return (
    <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm loginMutation={login} />
      </div>
    </section>
  );
}
