'use client';

import React, { useState, useEffect } from 'react';
import { SearchIcon, BellIcon } from './ui/Icons';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import type { HeaderProps } from './types';

export const Header: React.FC<HeaderProps> = ({ onSearch, unreadCount, searchQuery = '' }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    // Debounced search
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchQuery);
  };

  return (
    <header className="sticky top-0 z-10 bg-[var(--bg)] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Title and Icon */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <BellIcon size={24} className="text-[var(--brand-mid)]" />
            {unreadCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 flex items-center justify-center text-xs font-bold"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] dark:text-white">
              Notifications
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Gérez tous vos messages et alertes
            </p>
          </div>
        </div>

        {/* Right: Search Bar */}
        <div className="flex-1 max-w-md ml-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <SearchIcon
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                type="search"
                placeholder="Rechercher notifications..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 w-full"
                aria-label="Rechercher dans les notifications"
              />
            </div>
          </form>
        </div>

        {/* Mobile: Avatar/Actions could go here */}
        <div className="ml-4 flex items-center space-x-2">
          {/* Quick stats for desktop */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>{unreadCount} non lues</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile search bar - shown on smaller screens */}
      <div className="px-4 pb-3 sm:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 w-full"
            aria-label="Rechercher dans les notifications"
          />
        </form>
      </div>
    </header>
  );
};
