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
import { Card } from '@/components/ui/card';
import { Link, Navigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import useLoginUser from '@/services/useLoginUser';
import { AxiosError } from 'axios';
import { useAuth } from './auth-context';

const FormSchema = z.object({
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export function LoginForm() {
  const { auth, loadUser } = useAuth();

  const { mutate, isPending, error } = useLoginUser({
    onSuccess: () => {
      toast({
        title: 'Login Success.',
        description: 'Logged in Successfully',
      });

      form.reset();
      loadUser?.();
    },
    onError: () => {
      toast({
        title: 'Failed to Login',
        description: 'Invalid Credentials',
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

  const errorMessage = (error as AxiosError<{ message?: string }>)?.response
    ?.data?.message;

  if (auth?.user) {
    return <Navigate to="/" />;
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

          {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader /> : 'Log In'}
          </Button>
          <Link to="/auth/sign-up">
            <Button variant="link"> Don't have an account? </Button>
          </Link>
        </form>
      </Form>
    </Card>
  );
}
