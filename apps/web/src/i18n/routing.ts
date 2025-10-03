import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always', // This ensures all routes are prefixed with locale
});

export const { locales, defaultLocale, localePrefix } = routing;
