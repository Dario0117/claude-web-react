import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { LoginForm } from '@/components/org/forms/login.form';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate({ from: '/app/login' });
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate({ to: '/app/d' });
    }
  }, [isLoggedIn, navigate]);
  return (
    <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm handleLogin={login} />
      </div>
    </section>
  );
}
