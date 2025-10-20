"use client";

import { useActionState } from "react";
import { signInAction } from "./actions";

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
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
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
            name="password"
            type="password"
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
          Sign in
        </button>
      </form>
      <p id="login-help" className="text-sm text-neutral-400">
        No account?{" "}
        <a href="/signup" className="underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
