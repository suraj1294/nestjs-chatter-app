import { SignUpForm } from '@/components/auth/sign-up-form';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_auth/_layout/sign-up')({
  component: SignUp,
});

function SignUp() {
  return <SignUpForm />;
}
