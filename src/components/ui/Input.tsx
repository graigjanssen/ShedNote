// components/ui/Input.tsx
import * as React from 'react';
import { cn } from '@/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-invalid={invalid ? '' : undefined}
      className={cn(
        // base
        'w-full rounded-lg bg-neutral-900 text-neutral-100 placeholder-neutral-500',
        'px-3 py-2 ring-1 ring-neutral-700 outline-none',
        // focus
        'focus:ring-2 focus:ring-blue-500',
        // states
        'disabled:cursor-not-allowed disabled:opacity-60',
        // invalid
        'data-[invalid]:ring-red-500 data-[invalid]:focus:ring-red-400',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
