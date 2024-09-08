import { Loader2, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import useCreateChat from '@/services/useCreateChat';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from '@/app';
import { useNavigate } from '@tanstack/react-router';

export function CreateChatButton() {
  const [isPrivate, setIsPrivate] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const { mutate, isPending } = useCreateChat({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setOpen(false);
      toast({
        title: 'Chat Created.',
        description: 'Chat Created Successfully',
      });
      navigate({ to: `/chat/${data?.createChat._id}` });
    },
  });

  const handleSubmit = () => {
    mutate({ isPrivate, name });
  };

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <PlusCircle />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <form onSubmit={handleSubmit}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create a New Chat</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPrivate"
                name="isPrivate"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                disabled={isPending}
              />
              <Label htmlFor="isPrivate">Private</Label>
            </div>
            <Input
              placeholder="Chat Name"
              name="name"
              autoFocus
              value={name}
              disabled={isPending}
              onChange={(e) => setName(e.target.value)}
            />
            <DialogFooter className="sm:justify-start">
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => handleSubmit()}
              >
                {isPending && <Loader2 />} Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
