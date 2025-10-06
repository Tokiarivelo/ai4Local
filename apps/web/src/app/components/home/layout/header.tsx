'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { NavigationItem } from '@/types/common';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: 'dashboard', href: '/dashboard' },
  { label: 'customers', href: '/customers' },
  { label: 'campaigns', href: '/campaigns' },
  { label: 'formation', href: '/formation' },
];

export function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const t = useTranslations('navigation');
  const auth = useTranslations('auth');
  const params = useParams();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AI4Local</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                {t(item.label)}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <LocaleSwitcher locale={params.locale as string} />
            <Button variant="outline" size="sm">
              {auth('login')}
            </Button>
            <Button size="sm">Commencer</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={onMenuToggle}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white block px-3 py-2 text-base font-medium transition-colors"
              >
                {t(item.label)}
              </a>
            ))}
            <div className="px-3 py-2 space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                {auth('login')}
              </Button>
              <Button size="sm" className="w-full">
                Commencer
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
