import React, { useState } from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar">S</div>
          <div className="user-info">
            <div className="user-name">Siswa User</div>
            <div className="user-role">
              <span className="badge">Siswa</span>
            </div>
          </div>
        </div>

        <nav className="nav-menu">
          <ul>
            <li className="nav-item">
              <a href="/dashboard" className="nav-link active">
                <span className="nav-link-icon">📊</span>
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="/tryout-live" className="nav-link">
                <span className="nav-link-icon">🎯</span>
                Tryout Live
              </a>
            </li>
            <li className="nav-item">
              <a href="/paket-tryout" className="nav-link">
                <span className="nav-link-icon">📚</span>
                Paket Tryout
                <span className="badge-notification">2</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/leaderboard" className="nav-link">
                <span className="nav-link-icon">🏆</span>
                Leaderboard
              </a>
            </li>
            <li className="nav-item">
              <a href="/riwayat" className="nav-link">
                <span className="nav-link-icon">📅</span>
                Riwayat Aktivitas
              </a>
            </li>
            <li className="nav-item">
              <a href="/pengaturan" className="nav-link">
                <span className="nav-link-icon">⚙️</span>
                Pengaturan
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Top Navigation */}
      <div className="top-nav">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="nav-brand">Brainest</div>
        <div className="nav-actions">
          <button className="badge">
            🔔
            <span className="badge-notification">3</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <section className="hero">
          <h1>Persiapkan UTBK<br />Lebih Efektif<br />Bersama Brainest</h1>
          <p>Platform tryout online yang dirancang khusus untuk membantu persiapan UTBK dengan keamanan tinggi dan evaluasi komprehensif.</p>
          <a href="/register" className="button button-primary">Daftar Sekarang</a>
          <a href="/login" className="button button-secondary">Login</a>
        </section>
      </main>
    </div>
  );
}

export default App; 