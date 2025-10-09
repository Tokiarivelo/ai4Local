import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--brand-mid)] hover:bg-[var(--brand-dark)] text-white',
      secondary: 'bg-[var(--brand-light)] hover:bg-[var(--brand-mid)] text-[var(--text)]',
      ghost: 'hover:bg-[var(--brand-ghost)] text-[var(--text)]',
      outline:
        'border border-[var(--brand-mid)] text-[var(--brand-mid)] hover:bg-[var(--brand-ghost)]',
      destructive: 'bg-red-600 hover:bg-red-700 text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-mid)] focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'dark:focus-visible:ring-offset-slate-900',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
