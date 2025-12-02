// components/ui/Button.tsx
import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', fullWidth, type, ...props },
    ref
  ) => {
    const sizes: Record<Size, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
    };
    const variants: Record<Variant, string> = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-400',
      ghost:
        'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 focus:ring-2 focus:ring-neutral-500',
      danger:
        'bg-red-700 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500',
    };

    return (
      <button
        ref={ref}
        // default to submit when inside forms; otherwise leave as passed
        type={type ?? 'submit'}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium outline-none transition cursor-pointer',
          sizes[size],
          variants[variant],
          fullWidth && 'w-full',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
