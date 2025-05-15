
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="utbk-container flex flex-col md:h-24 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 md:px-0">
          <Link to="/" className="flex items-center justify-center">
            <span className="font-bold text-lg bg-gradient-to-r from-utbk-blue to-utbk-purple bg-clip-text text-transparent">Brainest</span>
          </Link>
          <p className="text-xs text-muted-foreground md:ml-4">
            &copy; {new Date().getFullYear()} Brainest Tryout UTBK. Semua hak dilindungi.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-end gap-4">
          <Link to="/about" className="text-xs text-muted-foreground hover:underline">
            Tentang Kami
          </Link>
          <Link to="/privacy" className="text-xs text-muted-foreground hover:underline">
            Kebijakan Privasi
          </Link>
          <Link to="/terms" className="text-xs text-muted-foreground hover:underline">
            Syarat & Ketentuan
          </Link>
        </div>
      </div>
    </footer>
  );
}
