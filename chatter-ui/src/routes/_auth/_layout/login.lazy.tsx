import { LoginForm } from '@/components/auth/login-form';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_auth/_layout/login')({
  component: Login,
});

function Login() {
  return (
    <>
      <LoginForm />
    </>
  );
}
