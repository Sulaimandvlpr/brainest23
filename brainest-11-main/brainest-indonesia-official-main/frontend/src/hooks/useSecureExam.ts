
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseSecureExamOptions {
  onExamTerminated?: () => void;
  onFullScreenExit?: () => void;
}

export function useSecureExam({ onExamTerminated, onFullScreenExit }: UseSecureExamOptions = {}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [isExamActive, setIsExamActive] = useState(false);
  
  // Track tab visibility
  const handleVisibilityChange = useCallback(() => {
    if (isExamActive && document.visibilityState === 'hidden') {
      if (warningCount === 0) {
        toast.warning('Peringatan: Jangan tinggalkan halaman ujian', {
          description: 'Jika Anda meninggalkan halaman lagi, ujian akan dihentikan.'
        });
        setWarningCount(prev => prev + 1);
      } else {
        toast.error('Ujian dihentikan karena mencoba meninggalkan halaman ujian');
        setIsExamActive(false);
        
        if (onExamTerminated) {
          onExamTerminated();
        }
      }
    }
  }, [isExamActive, warningCount, onExamTerminated]);

  // Track fullscreen changes
  const handleFullScreenChange = useCallback(() => {
    const isCurrentlyFullScreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    
    setIsFullScreen(isCurrentlyFullScreen);
    
    // If exam is active and user exits fullscreen
    if (isExamActive && !isCurrentlyFullScreen) {
      toast.warning('Mode layar penuh dimatikan. Harap aktifkan kembali untuk melanjutkan ujian.');
      
      if (onFullScreenExit) {
        onFullScreenExit();
      }
    }
  }, [isExamActive, onFullScreenExit]);

  // Enable fullscreen
  const requestFullScreen = useCallback(async () => {
    try {
      const docEl = document.documentElement;
      
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if ((docEl as any).mozRequestFullScreen) {
        await (docEl as any).mozRequestFullScreen();
      } else if ((docEl as any).webkitRequestFullscreen) {
        await (docEl as any).webkitRequestFullscreen();
      } else if ((docEl as any).msRequestFullscreen) {
        await (docEl as any).msRequestFullscreen();
      }
      
      setIsFullScreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      toast.error('Gagal mengaktifkan mode layar penuh');
    }
  }, []);

  // Exit fullscreen
  const exitFullScreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
      
      setIsFullScreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  // Start exam with security features
  const startSecureExam = useCallback(async () => {
    await requestFullScreen();
    setIsExamActive(true);
    setWarningCount(0);
    
    // Enable anti-cheating measures
    document.addEventListener('contextmenu', preventDefaultAction, true);
    document.addEventListener('copy', preventDefaultAction, true);
    document.addEventListener('cut', preventDefaultAction, true);
    document.addEventListener('paste', preventDefaultAction, true);
    document.addEventListener('keydown', preventInspectElement, true);
    
    toast.success('Ujian dimulai dalam mode aman', {
      description: 'Jangan tinggalkan layar penuh atau buka tab lain.'
    });
  }, [requestFullScreen]);

  // End exam and disable security features
  const endSecureExam = useCallback(async () => {
    setIsExamActive(false);
    
    // Remove anti-cheating measures
    document.removeEventListener('contextmenu', preventDefaultAction, true);
    document.removeEventListener('copy', preventDefaultAction, true);
    document.removeEventListener('cut', preventDefaultAction, true);
    document.removeEventListener('paste', preventDefaultAction, true);
    document.removeEventListener('keydown', preventInspectElement, true);
    
    await exitFullScreen();
  }, [exitFullScreen]);

  // Set up and clean up event listeners
  useEffect(() => {
    // Only add listeners if exam is active
    if (isExamActive) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleFullScreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.addEventListener('mozfullscreenchange', handleFullScreenChange);
      document.addEventListener('MSFullscreenChange', handleFullScreenChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, [isExamActive, handleVisibilityChange, handleFullScreenChange]);

  return {
    isFullScreen,
    isExamActive,
    warningCount,
    startSecureExam,
    endSecureExam,
    requestFullScreen,
    exitFullScreen
  };
}

// Helper functions for anti-cheating
const preventDefaultAction = (e: Event) => {
  e.preventDefault();
  return false;
};

const preventInspectElement = (e: KeyboardEvent) => {
  // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  if (
    e.keyCode === 123 || // F12
    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I or Ctrl+Shift+J
    (e.ctrlKey && e.keyCode === 85) // Ctrl+U
  ) {
    e.preventDefault();
    return false;
  }
};
