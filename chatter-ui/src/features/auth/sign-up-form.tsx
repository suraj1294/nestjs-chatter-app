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

import { Link, Navigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import useCreateUser from '@/services/useCreateUser';
import parseGqlError from '@/lib/graphql-parse-error';
import { useRef } from 'react';
import { useAuth } from './auth-context';
import { Card } from '@/components/ui/card';

const FormSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    email: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    },
  );

export function SignUpForm() {
  const emailRef = useRef<string>('');
  const { auth } = useAuth();
  const { mutate, isPending, error } = useCreateUser({
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
    emailRef.current = data.email;
    mutate({ email: data.email, password: data.password, name: data.name });
  }

  const errorMessage = parseGqlError(error);

  if (auth?.user?.id) {
    return <Navigate to="/" />;
  }

  return (
    <Card className="w-2/3 p-4 max-w-96">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="john doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="*****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {emailRef.current === form.watch('email') && errorMessage && (
            <FormMessage>{errorMessage}</FormMessage>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader /> : null} Sign Up
          </Button>
          <Link to="/auth/login">
            <Button variant="link">Already have an account?</Button>
          </Link>
        </form>
      </Form>
    </Card>
  );
}
