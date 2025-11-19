'use client';

import { useActionState } from 'react';
import { signUpAction } from './actions';
import { Input, Label, Button } from '@/components/ui';
export default function SignupPage() {
  const [state, formAction] = useActionState(signUpAction, null);

  return (
    <div className="flex flex-col items-center mx-auto mt-16 max-w-lg rounded border border-zinc-500 p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Create Account</h1>
      <form action={formAction} className="mx-auto w-2/3 space-y-4" noValidate>
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
        <Button className="w-full mt-4">Sign Up</Button>
      </form>
      <p className="text-md text-neutral-400">
        Have an account?{' '}
        <a href="/login" className="underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
