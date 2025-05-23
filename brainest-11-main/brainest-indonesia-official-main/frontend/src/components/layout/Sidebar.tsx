import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Book, Calendar, BarChart2, Settings, User, LogOut, ChevronLeft, ChevronRight, Gift, Trophy, Clock, Star, Flame, MessageCircle, PlayCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  badge?: number;
}

function SidebarItem({ href, label, icon, isActive, badge }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 relative hover:scale-105 hover:shadow-[0_0_16px_0_rgba(34,211,238,0.25)] hover:bg-cyan-900/20",
        isActive 
          ? "bg-gradient-to-r from-cyan-700/80 to-blue-700/80 text-white shadow-lg border-l-4 border-cyan-400 ring-2 ring-cyan-300/30"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg">{badge}</span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const sidebarItems = [
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
    {
      href: '/dashboard/leaderboard',
      label: 'Leaderboard',
      icon: <Trophy className="h-5 w-5" />,
    },
    ...((user?.role !== 'siswa') ? [
      {
        href: '/dashboard/leaderboard-xp',
        label: 'Leaderboard',
        icon: <BarChart2 className="h-5 w-5" />,
      },
    ] : []),
    ...(user?.role === 'guru' ? [
      {
        href: '/guru',
        label: 'Guru',
        icon: <ShieldCheck className="h-5 w-5" />,
      },
    ] : []),
    ...((user?.role !== 'admin' && user?.role !== 'guru') ? [
      {
        href: '/dashboard/activity-log',
        label: 'Riwayat Aktivitas',
        icon: <Clock className="h-5 w-5" />,
      },
    ] : []),
    ...(user?.role !== 'admin' && user?.role !== 'guru' ? [
      {
        href: '/dashboard/settings',
        label: 'Pengaturan',
        icon: <Settings className="h-5 w-5" />,
      },
    ] : []),
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className={`flex flex-col justify-between ${collapsed ? 'w-20' : 'w-64'} min-h-screen bg-gradient-to-b from-blue-3d via-blue-3d-light to-cyan/30 shadow-3d rounded-tr-3xl rounded-br-3xl border-r border-cyan/20 transition-all duration-300 hidden md:flex`}>
      <div>
        {/* Collapse/Expand Button */}
        <div className="flex justify-end p-2">
          <button
            className="bg-cyan-700/80 hover:bg-cyan-500/80 text-white rounded-full p-1 shadow"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Perbesar Sidebar' : 'Perkecil Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        {/* User Info */}
        <div className={`flex flex-col items-center gap-2 px-4 ${collapsed ? 'py-2' : 'py-4'}`}>
          <Avatar className={`border-4 border-cyan shadow-3d ${collapsed ? 'w-10 h-10' : 'w-16 h-16'}`}>
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="text-white font-bold text-lg text-center truncate w-full">{user?.name || 'User'}</div>
              {user?.role && (
                <Badge className={`rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-gradient-to-r from-pink-500 to-cyan-400 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'}`}>{user.role === 'admin' ? 'Admin' : 'Siswa'}</Badge>
              )}
            </>
          )}
        </div>
        {/* Menu */}
        <div className="px-4 py-2">
          {!collapsed && <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-cyan-200">Menu</h2>}
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                href={item.href}
                label={collapsed ? '' : item.label}
                icon={item.icon}
                isActive={
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                }
                badge={!collapsed ? item.badge : undefined}
              />
            ))}
            {user?.role === 'admin' && (
              <SidebarItem
                href="/admin"
                label={collapsed ? '' : 'Admin'}
                icon={<ShieldCheck className="h-5 w-5" />}
                isActive={pathname.startsWith('/admin')}
              />
            )}
          </div>
        </div>
      </div>
      {/* Tombol Logout di bawah */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-pink-600 to-red-500 text-white font-bold py-2 rounded-full shadow-lg hover:scale-105 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
