import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, Bell, Search, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="utbk-container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="font-bold text-2xl bg-gradient-to-r from-utbk-blue to-utbk-purple bg-clip-text text-transparent">Brainest</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end md:justify-between gap-4">
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {!user && (
              <Link to="/" className="text-sm font-medium transition-colors hover:text-utbk-blue">
                Beranda
              </Link>
            )}
            {user && (
              <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-utbk-blue">
                Dashboard
              </Link>
            )}
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-utbk-blue">
              Tentang Kami
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {/* Notifikasi & Avatar User */}
            {user && (
              <>
                <button className="relative p-2 rounded-full hover:bg-cyan-900/30 transition">
                  <Bell className="w-5 h-5 text-cyan-300" />
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">3</span>
                </button>
                <div className="relative">
                  <button
                    className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-cyan-900/30 transition"
                    onClick={() => setShowDropdown((v) => !v)}
                  >
                    <Avatar className="w-8 h-8 border-2 border-cyan">
                      <AvatarFallback>{user.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-cyan-300" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-blue-3d-light/95 rounded-md shadow-lg border border-cyan/20 z-50 py-2">
                      <div className="px-3 py-2 border-b border-cyan/10">
                        <div className="font-semibold text-white text-sm truncate">{user.name}</div>
                        <div className="text-xs text-cyan-300">{user.role === 'admin' ? 'Admin' : 'Siswa'}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-pink-400 hover:bg-pink-900/10 text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {user ? (
              <></>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                  Masuk
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-utbk-blue hover:bg-utbk-blue/90" size="sm">
                  Daftar
                </Button>
              </div>
            )}
            <Button variant="outline" className="md:hidden" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background">
          <div className="utbk-container py-4 flex flex-col space-y-4">
            {!user && (
              <Link 
                to="/" 
                className="text-base font-medium transition-colors hover:text-utbk-blue p-2" 
                onClick={closeMenu}
              >
                Beranda
              </Link>
            )}
            {user && (
              <Link 
                to="/dashboard" 
                className="text-base font-medium transition-colors hover:text-utbk-blue p-2"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            )}
            <Link 
              to="/about" 
              className="text-base font-medium transition-colors hover:text-utbk-blue p-2"
              onClick={closeMenu}
            >
              Tentang Kami
            </Link>

            <div className="pt-4 border-t">
              {user ? (
                <>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => {
                      navigate('/login');
                      closeMenu();
                    }} 
                    variant="outline" 
                    className="w-full mb-2"
                  >
                    Masuk
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/register');
                      closeMenu();
                    }} 
                    className="w-full bg-utbk-blue hover:bg-utbk-blue/90"
                  >
                    Daftar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
