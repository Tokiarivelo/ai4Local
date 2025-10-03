import { createNavigation } from 'next-intl/navigation';

export const locales = ['fr', 'mg'] as const;
export const defaultLocale = 'fr' as const;

export type Locale = (typeof locales)[number];

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard',
  '/campaigns': '/campaigns',
  '/analytics': '/analytics',
  '/settings': '/settings',
  '/profile': '/profile',
  '/auth/signup': '/auth/signup',
  '/auth/signin': '/auth/signin',
  '/demo': '/demo',
} as const;

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales, pathnames });
