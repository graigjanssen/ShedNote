'use client';

import { useActionState } from 'react';
import { signUpAction } from './actions';
import { Input, Label, Button } from '@/components/ui';
export default function SignupPage() {
  const [state, formAction] = useActionState(signUpAction, null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Account</h1>
      <form action={formAction} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" required />
        </div>
        {state?.error && (
          <p role="alert" className="text-red-400 text-sm">
            {state.error}
          </p>
        )}
        <Button>Sign Up</Button>
      </form>
      <p className="text-sm text-neutral-400">
        Have an account?{' '}
        <a href="/login" className="underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
