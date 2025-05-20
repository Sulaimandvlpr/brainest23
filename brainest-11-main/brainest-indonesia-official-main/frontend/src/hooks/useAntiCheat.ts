import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AntiCheatState {
  isFullscreen: boolean;
  isTabActive: boolean;
  isDevToolsOpen: boolean;
  warnings: number;
}

export function useAntiCheat(onWarning: (message: string) => void) {
  const [state, setState] = useState<AntiCheatState>({
    isFullscreen: false,
    isTabActive: true,
    isDevToolsOpen: false,
    warnings: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Deteksi fullscreen
    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement !== null;
      setState(prev => ({ ...prev, isFullscreen }));
      
      if (!isFullscreen) {
        onWarning('Anda keluar dari mode fullscreen. Ini dapat dianggap sebagai pelanggaran.');
      }
    };

    // Deteksi tab switching
    const handleVisibilityChange = () => {
      const isTabActive = document.visibilityState === 'visible';
      setState(prev => ({ ...prev, isTabActive }));
      
      if (!isTabActive) {
        onWarning('Anda beralih ke tab lain. Ini dapat dianggap sebagai pelanggaran.');
      }
    };

    // Deteksi DevTools
    const checkDevTools = () => {
      const threshold = 160;
      const isDevToolsOpen = window.outerWidth - window.innerWidth > threshold ||
                            window.outerHeight - window.innerHeight > threshold;
      
      setState(prev => ({ ...prev, isDevToolsOpen }));
      
      if (isDevToolsOpen) {
        onWarning('DevTools terdeteksi terbuka. Ini dapat dianggap sebagai pelanggaran.');
      }
    };

    // Deteksi screenshot
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
        onWarning('Mencoba mengambil screenshot atau print. Ini dapat dianggap sebagai pelanggaran.');
      }
    };

    // Deteksi right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onWarning('Klik kanan dinonaktifkan selama tryout.');
    };

    // Event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', checkDevTools);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Initial check
    checkDevTools();

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', checkDevTools);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onWarning]);

  // Fungsi untuk memaksa fullscreen
  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setState(prev => ({ ...prev, isFullscreen: true }));
    } catch (err) {
      onWarning('Gagal masuk mode fullscreen. Silakan coba lagi.');
    }
  };

  // Fungsi untuk mengecek pelanggaran
  const checkViolations = () => {
    const violations = [];
    
    if (!state.isFullscreen) violations.push('Tidak dalam mode fullscreen');
    if (!state.isTabActive) violations.push('Tab tidak aktif');
    if (state.isDevToolsOpen) violations.push('DevTools terbuka');
    
    return violations;
  };

  return {
    ...state,
    requestFullscreen,
    checkViolations
  };
} 