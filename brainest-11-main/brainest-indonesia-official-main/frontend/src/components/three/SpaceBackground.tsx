// WARNING: JANGAN IMPORT ATAU RENDER FILE INI DI PRODUCTION!
// SpaceBackground menyebabkan error WebGL context pada device/browser yang tidak support WebGL/3D.
// Pastikan semua import dan render SpaceBackground sudah dinonaktifkan di App.tsx dan file lain.

export default function SpaceBackground() {
  if (typeof window !== 'undefined') {
    // Tampilkan warning di console jika komponen ini dirender
    console.warn('SpaceBackground dinonaktifkan: Jangan gunakan komponen ini di production karena menyebabkan error WebGL pada banyak device/browser.');
  }
  return null;
} 