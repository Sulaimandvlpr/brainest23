
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-4">
      <h1 className="text-9xl font-extrabold text-utbk-blue mb-4">404</h1>
      <p className="text-2xl font-semibold mb-6">Halaman Tidak Ditemukan</p>
      <p className="text-muted-foreground mb-8 max-w-lg">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
      </p>
      <Button asChild className="bg-utbk-blue hover:bg-utbk-blue/90">
        <Link to="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
};

export default NotFound;
