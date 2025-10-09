import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]',
          'placeholder:text-gray-500 focus:border-[var(--brand-mid)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-mid)] focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400',
          'dark:focus:border-[var(--brand-light)] dark:focus:ring-[var(--brand-light)]',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
