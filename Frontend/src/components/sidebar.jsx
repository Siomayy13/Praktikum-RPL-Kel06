import React, { useState } from 'react';

function Sidebar({ activeView, setActiveView, handleLogout, role = 'user' }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const userMenu = [
    { id: 'beranda', label: 'Beranda', icon: 'fas fa-border-all', activeMatch: ['beranda'] },
    { id: 'buat', label: 'Buat Laporan', icon: 'fas fa-plus-square', activeMatch: ['buat', 'edit'] },
    { id: 'daftar', label: 'Daftar Laporan', icon: 'fas fa-list-ul', activeMatch: ['daftar'] },
    { id: 'detail', label: 'Detail Laporan', icon: 'far fa-file-alt', activeMatch: ['detail'] },
  ];

  const adminMenu = [
    { id: 'beranda', label: 'Beranda', icon: 'fas fa-border-all', activeMatch: ['beranda'] },
    { id: 'kelola', label: 'Kelola Laporan', icon: 'fas fa-cog', activeMatch: ['kelola'] },
    { id: 'detail', label: 'Detail Laporan', icon: 'far fa-file-alt', activeMatch: ['detail'] },
    { id: 'statistik', label: 'Statistik Laporan', icon: 'fas fa-chart-bar', activeMatch: ['statistik'] },
  ];

  const menuItems = role === 'admin' ? adminMenu : userMenu;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <i className="fas fa-building-columns"></i>
        </div>
        <div className="sidebar-logo-text">
          <h2>lapor.in</h2>
          <span>Manajemen Fasilitas</span>
        </div>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={`menu-item ${item.activeMatch.includes(activeView) ? 'active' : ''}`} 
            onClick={() => setActiveView(item.id)}
          >
            <i className={item.icon}></i> {item.label}
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <ul className="sidebar-menu">
          <li className="menu-item logout" onClick={() => setShowLogoutModal(true)}>
            <i className="fas fa-sign-out-alt"></i> Keluar
          </li>
        </ul>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', maxWidth: '400px' }}>
            <div className="modal-icon" style={{ width: '60px', height: '60px', background: '#fee2e2', color: '#b91c1c', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem', margin: '0 auto 20px' }}>
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <h2 style={{ color: '#1a3252', marginBottom: '10px', fontSize: '1.4rem' }}>Konfirmasi Keluar</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '30px' }}>
              Apakah Anda yakin ingin mengakhiri sesi Anda di lapor.in?
            </p>
            <button 
              className="btn-login" 
              style={{ width: '100%', padding: '14px', background: '#b91c1c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}
              onClick={handleLogout}
            >
              Keluar
            </button>
            <button 
              style={{ width: '100%', padding: '14px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
              onClick={() => setShowLogoutModal(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
