// components/ui/Textarea.tsx
import * as React from 'react';
import { cn } from '@/lib/cn';

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    invalid?: boolean;
  };

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      data-invalid={invalid ? '' : undefined}
      className={cn(
        'w-full rounded-lg bg-neutral-900 text-neutral-100 placeholder-neutral-500',
        'px-3 py-2 ring-1 ring-neutral-700 outline-none',
        'focus:ring-2 focus:ring-blue-500',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'data-[invalid]:ring-red-500 data-[invalid]:focus:ring-red-400',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
