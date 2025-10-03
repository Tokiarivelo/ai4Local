import type { Metadata } from 'next';

// Metadata for the root layout
export const metadata: Metadata = {
  title: 'AI4Local - Marketing Digital par IA',
  description: 'Plateforme de marketing digital par IA pour les PME malgaches',
};

// This layout only handles non-localized routes
// The middleware will redirect all traffic to /[locale]
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
