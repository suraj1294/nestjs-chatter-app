import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  );
}
