import { CircleUser } from 'lucide-react';
import { useAuth } from './auth-context';
import useLogoutUser from '@/services/useLogoutUser';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/app';

export const UserMenu = () => {
  const { auth } = useAuth();
  const { mutate } = useLogoutUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: () => {
      // TODO: handle error
      //queryClient.invalidateQueries({ queryKey: ['me'] });
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
        <DropdownMenuItem>{auth?.user?.name}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutate()}>log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
