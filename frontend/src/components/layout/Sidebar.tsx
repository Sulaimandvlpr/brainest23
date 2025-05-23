import React from 'react';
import { BarChart2, Flame, Book, Trophy } from 'lucide-react';

export const sidebarItems = (user) => [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    href: '/dashboard/tryout-live',
    label: 'Tryout Live',
    icon: <Flame className="h-5 w-5" />,
  },
  {
    href: '/dashboard/packages',
    label: 'Paket Tryout',
    icon: <Book className="h-5 w-5" />,
    badge: 2,
  },
  // Only show XP leaderboard for siswa
  ...(user?.role === 'siswa' ? [
    {
      href: '/dashboard/leaderboard-xp',
      label: 'Leaderboard',
      icon: <Trophy className="h-5 w-5" />,
    },
  ] : []),
  // Show other leaderboard for non-siswa
  ...((user?.role !== 'siswa') ? [
    {
      href: '/dashboard/leaderboard',
      label: 'Leaderboard',
      icon: <BarChart2 className="h-5 w-5" />,
    },
  ] : []),
]; 