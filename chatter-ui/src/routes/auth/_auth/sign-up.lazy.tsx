import { SignUpForm } from '@/features/auth/sign-up-form';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/auth/_auth/sign-up')({
  component: SignUp,
});

function SignUp() {
  return <SignUpForm />;
}
