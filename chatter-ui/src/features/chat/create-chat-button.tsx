import { PlusCircle } from 'lucide-react';

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

export function CreateChatButton() {
  const [isPrivate, setIsPrivate] = useState(false);

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <PlusCircle />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New Chat</DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPrivate"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="isPrivate">Private</Label>
          </div>
          <Input placeholder="Chat Name" autoFocus />
          <DialogFooter className="sm:justify-start">
            <Button type="button">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
