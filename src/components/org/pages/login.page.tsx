import { useNavigate } from '@tanstack/react-router';
import { LoginForm } from '@/components/org/forms/login.form';
import type { signInWithEmailAndPasswordReturnType } from '@/services/users.http-service';

export function LoginPage() {
  const navigate = useNavigate({ from: '/login' });

  const handleSuccess = (_data: signInWithEmailAndPasswordReturnType) => {
    navigate({ to: '/' });
  };

  return (
    <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm handleSuccess={handleSuccess} />
      </div>
    </section>
  );
}
