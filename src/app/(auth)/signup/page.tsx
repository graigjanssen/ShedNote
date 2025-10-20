"use client";

import { useActionState } from "react";
import { signUpAction } from "./actions";

export default function SignupPage() {
  const [state, formAction] = useActionState(signUpAction, null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Account</h1>
      <form action={formAction} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="mt-1 w-full rounded-lg bg-neutral-900 p-3 ring-1 ring-neutral-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="mt-1 w-full rounded-lg bg-neutral-900 p-3 ring-1 ring-neutral-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {state?.error && (
          <p role="alert" className="text-red-400 text-sm">
            {state.error}
          </p>
        )}
        <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 focus:ring-2 focus:ring-blue-400">
          Sign Up
        </button>
      </form>
      <p className="text-sm text-neutral-400">
        Have an account?{" "}
        <a href="/login" className="underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
