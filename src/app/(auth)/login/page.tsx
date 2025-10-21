'use client';

import { useActionState } from 'react';
import { signInAction } from './actions';
import { Input, Label, Button } from '@/components/ui';
export default function LoginPage() {
  const [state, formAction] = useActionState(signInAction, null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form
        action={formAction}
        className="space-y-4"
        noValidate
        aria-describedby="login-help"
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        {state?.error && (
          <p role="alert" className="text-red-400 text-sm">
            {state.error}
          </p>
        )}
        <Button>Sign in</Button>
      </form>
      <p id="login-help" className="text-sm text-neutral-400">
        No account?{' '}
        <a href="/signup" className="underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
