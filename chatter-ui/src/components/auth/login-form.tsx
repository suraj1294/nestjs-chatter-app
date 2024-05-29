'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Card } from '../ui/card';
import { Link } from '@tanstack/react-router';
import useCreateUser from '@/services/useCreateUser';
import { Loader } from 'lucide-react';

const FormSchema = z.object({
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export function LoginForm() {
  const { mutate, isPending } = useCreateUser({
    onSuccess: () => {
      toast({
        title: 'Account created.',
        description: 'Login Successful',
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: 'Account creation failed.',
        description: 'Failed to create account.',
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({ email: data.email, password: data.password });
  }

  return (
    <Card className="w-2/3 p-4 max-w-96">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="*****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader /> : 'Log In'}
          </Button>
          <Link to="/sign-up">
            <Button variant="link"> Don't have an account? </Button>
          </Link>
        </form>
      </Form>
    </Card>
  );
}
