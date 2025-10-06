import DashboardLayout from '@/app/components/layout/DashboardLayout';
import type { Metadata } from 'next';

// Metadata for the root layout
export const metadata: Metadata = {
  title: 'AI4Local - Marketing Digital par IA',
  description: 'Plateforme de marketing digital par IA pour les PME malgaches',
};

const mockUser = {
  id: '1',
  name: 'Marie Dupont',
  email: 'marie.dupont@ai4local.com',
  role: 'Admin' as const,
  permissions: [],
};

// This layout only handles non-localized routes
// The middleware will redirect all traffic to /[locale]
export default function DashboardLocalLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout user={mockUser}>{children}</DashboardLayout>;
}
