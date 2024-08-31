import { CircleUser } from 'lucide-react';

import { useAuth } from './auth-context';
import useLogoutUser from '@/services/useLogoutUser';
import { useRouter } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const UserMenu = () => {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const { mutate } = useLogoutUser({
    onSuccess: () => {
      setAuth({ user: undefined });
      router.navigate({ to: '/login' });
    },
    onError: () => {
      setAuth({ user: undefined });
      router.navigate({ to: '/login' });
    },
  });

  if (!auth?.user?.id) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CircleUser className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">User Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>{auth?.user?.email}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutate()}>log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
