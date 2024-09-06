import { LoginForm } from '@/features/auth/login-form.tsx';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/auth/_auth/login')({
  component: Login,
});

function Login() {
  return (
    <>
      <LoginForm />
    </>
  );
}
