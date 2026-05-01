import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import '../styles/dashboard.css';

function AdminDashboard() {
  const [activeView, setActiveView] = useState('beranda');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const renderBeranda = () => (
    <>
      <div className="admin-header">
        <div>
          <div className="admin-subtitle">SISTEM MANAJEMEN FASILITAS, UNIVERSITAS DIPONEGORO</div>
          <h1 className="admin-title">Selamat Datang, Admin</h1>
        </div>
        <div className="admin-date-btn">
          <i className="far fa-calendar-alt"></i> Senin, 21 April 2026
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper blue">
            <i className="far fa-file-alt"></i>
          </div>
          <div>
            <div className="admin-stat-label">Total Laporan</div>
            <div className="admin-stat-value">1,284</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper red">
            <i className="fas fa-exclamation"></i>
          </div>
          <div>
            <div className="admin-stat-label">Urgent</div>
            <div className="admin-stat-value">12</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-list" style={{ color: '#1a3252' }}></i>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Laporan Terbaru</h3>
          </div>
          <a href="#" className="btn-link" style={{ fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); setActiveView('kelola'); }}>Lihat Semua <i className="fas fa-arrow-right" style={{ marginLeft: '4px' }}></i></a>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>ID LAPORAN</th>
              <th style={{ width: '40%' }}>JUDUL & TINGKAT KERUSAKAN</th>
              <th style={{ width: '25%' }}>STATUS</th>
              <th style={{ width: '15%' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="td-id" style={{ color: '#64748b' }}>#LPR-2026-001</td>
              <td>
                <h4 className="td-title">Laboratorium Jaringan Komputer</h4>
                <p className="td-desc">Berat</p>
              </td>
              <td><span className="badge-status status-diproses">DIPROSES</span></td>
              <td><a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i></a></td>
            </tr>
            <tr>
              <td className="td-id" style={{ color: '#64748b' }}>#LPR-2026-002</td>
              <td>
                <h4 className="td-title">Gedung Teknik Komputer, Lt 2</h4>
                <p className="td-desc">Berat</p>
              </td>
              <td><span className="badge-status status-terkirim">LAPORAN DITERIMA</span></td>
              <td><a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i></a></td>
            </tr>
            <tr>
              <td className="td-id" style={{ color: '#64748b' }}>#LPR-2026-003</td>
              <td>
                <h4 className="td-title">Enviro Hall, Lt 5</h4>
                <p className="td-desc">Sedang</p>
              </td>
              <td><span className="badge-status status-selesai" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}>SELESAI</span></td>
              <td><a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i></a></td>
            </tr>
            <tr>
              <td className="td-id" style={{ color: '#64748b' }}>#LPR-2026-004</td>
              <td>
                <h4 className="td-title">Gedung Teknik Komputer, A201</h4>
                <p className="td-desc">Ringan</p>
              </td>
              <td><span className="badge-status status-selesai" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}>SELESAI</span></td>
              <td><a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i></a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const renderKelolaLaporan = () => (
    <>
      <h2 className="admin-page-title">Kelola Laporan</h2>

      <div className="admin-workload-grid">
        <div className="workload-card-main">
          <h3 className="workload-title">Beban kerja admin saat ini<br/>berada di level optimal.</h3>
          <div className="workload-stats">
            <div className="workload-stat-item">
              <span className="workload-label">TOTAL LAPORAN</span>
              <span className="workload-val">128</span>
            </div>
            <div className="workload-stat-item">
              <span className="workload-label">SEDANG PROSES</span>
              <span className="workload-val">42</span>
            </div>
            <div className="workload-stat-item">
              <span className="workload-label">SELESAI</span>
              <span className="workload-val" style={{ color: '#a5f3fc' }}>18</span>
            </div>
          </div>
        </div>
        
        <div className="workload-card-side">
          <div className="admin-stat-icon-wrapper red">
            <i className="fas fa-exclamation"></i>
          </div>
          <div>
            <div className="workload-side-label">URGENT</div>
            <div className="workload-side-val">12 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Kasus</span></div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1a3252' }}>Daftar Antrean Laporan</h3>
          <div className="table-filters">
            <button className="filter-btn active">Semua</button>
            <button className="filter-btn">Kategori</button>
            <button className="filter-btn">Status</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>ID LAPORAN</th>
              <th style={{ width: '35%' }}>JUDUL & TINGKAT KERUSAKAN</th>
              <th style={{ width: '15%' }}>WAKTU MASUK</th>
              <th style={{ width: '10%' }}>KATEGORI</th>
              <th style={{ width: '15%' }}>STATUS</th>
              <th style={{ width: '10%' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="td-id" style={{ color: '#1a3252' }}>#LPR-<br/>2026-<br/>001</td>
              <td>
                <h4 className="td-title" style={{ fontSize: '0.9rem' }}>Laboratorium Jaringan Komputer</h4>
                <p className="td-desc" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>"AC tidak berfungsi dengan baik, suhu mencapai 28 derajat..."</p>
              </td>
              <td className="td-time" style={{ fontSize: '0.8rem' }}>10 Menit<br/>yang lalu</td>
              <td><span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>Berat</span></td>
              <td><span className="badge-status status-diproses" style={{ fontSize: '0.65rem' }}>DIPROSES</span></td>
              <td><a href="#" className="btn-link" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', lineHeight: 1.2 }} onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat<br/>Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', marginTop: '2px' }}></i></a></td>
            </tr>
            <tr>
              <td className="td-id" style={{ color: '#1a3252' }}>#LPR-<br/>2026-<br/>002</td>
              <td>
                <h4 className="td-title" style={{ fontSize: '0.9rem' }}>Gedung Teknik Komputer, Lt 2</h4>
                <p className="td-desc" style={{ fontSize: '0.8rem' }}>Kebocoran pipa di area toilet pria, air menggenang.</p>
              </td>
              <td className="td-time" style={{ fontSize: '0.8rem' }}>45 Menit<br/>yang lalu</td>
              <td><span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>Berat</span></td>
              <td><span className="badge-status status-terkirim" style={{ fontSize: '0.65rem' }}>LAPORAN DITERIMA</span></td>
              <td><a href="#" className="btn-link" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', lineHeight: 1.2 }} onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat<br/>Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', marginTop: '2px' }}></i></a></td>
            </tr>
            <tr>
              <td className="td-id" style={{ color: '#1a3252' }}>#LPR-<br/>2026-<br/>004</td>
              <td>
                <h4 className="td-title" style={{ fontSize: '0.9rem' }}>Enviro Hall, Lt 5</h4>
                <p className="td-desc" style={{ fontSize: '0.8rem' }}>Proyektor buram dan tidak bisa digunakan.</p>
              </td>
              <td className="td-time" style={{ fontSize: '0.8rem' }}>3 Jam<br/>yang lalu</td>
              <td><span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>Sedang</span></td>
              <td><span className="badge-status status-selesai" style={{ fontSize: '0.65rem' }}>SELESAI</span></td>
              <td><a href="#" className="btn-link" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', lineHeight: 1.2 }} onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat<br/>Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', marginTop: '2px' }}></i></a></td>
            </tr>
          </tbody>
        </table>
        
        <div className="pagination">
          <div className="page-info">Menampilkan 3 dari 128 laporan</div>
          <div className="page-numbers">
            <div className="page-num" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white' }}><i className="fas fa-chevron-left" style={{ color: '#cbd5e1' }}></i></div>
            <div className="page-num active">1</div>
            <div className="page-num" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white' }}>2</div>
            <div className="page-num" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white' }}>3</div>
            <div className="page-num" style={{ border: '1px solid #e2e8f0', backgroundColor: 'white' }}><i className="fas fa-chevron-right" style={{ color: '#64748b' }}></i></div>
          </div>
        </div>
      </div>
    </>
  );

  const renderDetailLaporan = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('kelola')}>Daftar Laporan</span>
        <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
        <span style={{ color: '#1a3252', fontWeight: 700 }}>ID #LPR-2026-001</span>
      </div>

      <div className="list-layout">
        <div className="list-main">
          <div className="detail-card">
            <div className="detail-top" style={{ marginBottom: '16px' }}>
              <div>
                <span className="badge-status status-diproses" style={{ marginBottom: '12px' }}>SEDANG DIPROSES</span>
                <h2 className="detail-title" style={{ marginTop: '0' }}>AC Ruang Lab 3 Mati Total</h2>
                <div className="detail-meta">Dilaporkan oleh: <strong style={{ color: '#334155' }}>User Iphone</strong> • 12 April 2026</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>KATEGORI</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a3252' }}>Berat</div>
              </div>
            </div>

            <div className="detail-section-title" style={{ marginTop: '30px' }}>DESKRIPSI LENGKAP</div>
            <div className="detail-box" style={{ minHeight: '150px' }}>
              Diisi apa yah pokonya deskripsi
            </div>

            <div className="detail-section-title" style={{ marginTop: '30px' }}><i className="fas fa-location-dot" style={{ color: '#0f766e', marginRight: '6px' }}></i> LOKASI DETAIL</div>
            <div className="loc-detail">
              <strong>Gedung A, Lantai 3, Laboratorium Networking</strong>
              <p>Fakultas Teknik, Kampus Tembalang, Semarang</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-section-title">BUKTI FOTO</div>
            <div style={{ minHeight: '150px' }}></div>
          </div>
        </div>

        <div className="list-side">
          <div className="detail-header-actions" style={{ gap: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <button className="btn-edit-report" style={{ width: '100%', justifyContent: 'center', borderColor: '#f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', padding: '16px' }} onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                <i className="fas fa-pen" style={{ color: '#0f766e' }}></i> <span style={{ color: '#0f766e' }}>Ubah<br/>Status</span>
              </button>
              {showStatusDropdown && (
                <div className="status-dropdown-menu">
                  <div className="status-dropdown-item" onClick={() => setShowStatusDropdown(false)}>
                    <span>Ditolak</span>
                    <div className="status-dot"></div>
                  </div>
                  <div className="status-dropdown-item" onClick={() => setShowStatusDropdown(false)}>
                    <span>Diproses</span>
                    <div className="status-dot"></div>
                  </div>
                  <div className="status-dropdown-item" onClick={() => setShowStatusDropdown(false)}>
                    <span>Selesai</span>
                    <div className="status-dot"></div>
                  </div>
                </div>
              )}
            </div>
            <button className="btn-delete-report" style={{ flex: 1, justifyContent: 'center', padding: '16px' }}>
              <i className="fas fa-trash-alt"></i> Hapus<br/>Laporan
            </button>
          </div>

          <div className="side-panel" style={{ backgroundColor: 'white', marginTop: '4px' }}>
            <h3 style={{ fontSize: '1.1rem' }}><i className="fas fa-clock-rotate-left" style={{ color: '#0f766e' }}></i> Perkembangan Laporan</h3>
            
            <div className="detail-timeline" style={{ marginTop: '24px' }}>
              <div className="dt-item">
                <div className="dt-icon active" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}><i className="fas fa-wrench"></i></div>
                <div className="dt-content">
                  <h4 style={{ color: '#1a3252' }}>Sedang Diproses</h4>
                  <span>14 Apr 2026, 09:15 WIB</span>
                  <div className="dt-box" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>Tim teknisi sedang berada di lokasi untuk melakukan perbaikan.</div>
                </div>
              </div>
              
              <div className="dt-item">
                <div className="dt-icon" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}><i className="fas fa-clipboard-check"></i></div>
                <div className="dt-content">
                  <h4 style={{ color: '#1a3252' }}>Laporan Terverifikasi</h4>
                  <span>12 Apr 2026, 15:30 WIB</span>
                  <div className="dt-box" style={{ backgroundColor: 'transparent', padding: 0, color: '#64748b' }}>Diverifikasi oleh Admin. Unit perbaikan telah dijadwalkan.</div>
                </div>
              </div>

              <div className="dt-item" style={{ marginBottom: 0 }}>
                <div className="dt-icon" style={{ backgroundColor: '#e2e8f0', color: '#94a3b8' }}><i className="fas fa-paper-plane"></i></div>
                <div className="dt-content">
                  <h4 style={{ color: '#64748b' }}>Laporan Diajukan</h4>
                  <span>12 Apr 2026, 10:05 WIB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="side-panel" style={{ backgroundColor: 'white' }}>
            <h4 style={{ color: '#1a3252', fontSize: '0.9rem', margin: '0 0 8px 0' }}>Butuh Bantuan Segera?</h4>
            <p className="help-text">Jika laporan bersifat darurat (misal: korsleting listrik), silakan hubungi hotline kampus.</p>
            <div className="help-phone" style={{ color: '#1a3252' }}>
              <i className="fas fa-phone-alt"></i> 0878-123-456
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderStatistikLaporan = () => (
    <>
      <div className="admin-header">
        <div>
          <h1 className="admin-title" style={{ fontSize: '2.2rem' }}>Resolusi Fasilitas</h1>
          <p className="admin-desc" style={{ marginTop: '8px', color: '#475569', lineHeight: 1.5 }}>Analisis pemeliharaan infrastruktur kampus Universitas Diponegoro<br/>Data diperbarui secara real-time berdasarkan laporan masuk.</p>
        </div>
        <button className="btn-dark-blue">
          <i className="far fa-calendar-alt"></i> Pilih Periode
        </button>
      </div>

      <div className="stats-layout">
        <div className="stats-main">
          <div className="stats-row">
            <div className="stat-card-white">
              <div className="stat-label-light">EFISIENSI PENYELESAIAN</div>
              <div className="stat-val-huge">92.4%</div>
              <div className="stat-trend green"><i className="fas fa-arrow-trend-up"></i> +4.2% dari bulan lalu</div>
              <i className="fas fa-check-circle bg-icon"></i>
            </div>
            <div className="stat-card-dark">
              <div className="stat-label-light" style={{ color: '#94a3b8' }}>TOTAL LAPORAN</div>
              <div className="stat-val-huge" style={{ color: 'white' }}>1,284</div>
              <div className="stat-desc-dark">Rata-rata 42<br/>laporan/hari</div>
            </div>
          </div>

          <div className="stat-card-white mt-20">
            <div className="card-header-flex">
              <h3 className="card-title-sm">Kategori Terlapor</h3>
              <i className="fas fa-chart-bar" style={{ color: '#cbd5e1' }}></i>
            </div>
            
            <div className="bar-chart-container">
              <div className="bar-item">
                <div className="bar-label-row">
                  <span className="bar-label">Berat</span>
                  <span className="bar-val">452 Laporan</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: '100%', backgroundColor: '#1a3252' }}></div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label-row">
                  <span className="bar-label">Sedang</span>
                  <span className="bar-val">312 Laporan</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: '68%', backgroundColor: '#1a3252' }}></div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label-row">
                  <span className="bar-label">Ringan</span>
                  <span className="bar-val">218 Laporan</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: '48%', backgroundColor: '#1a3252' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-side">
          <div className="stat-card-side">
            <h3 className="card-title-sm">Status Penyelesaian</h3>
            <p className="card-desc-sm">Distribusi kondisi laporan saat ini</p>
            
            <div className="donut-chart-wrapper">
              <div className="donut-chart">
                <div className="donut-hole">
                  <div className="donut-val">824</div>
                  <div className="donut-label">SELESAI</div>
                </div>
              </div>
            </div>

            <div className="donut-legend">
              <div className="legend-item">
                <div className="legend-marker" style={{ backgroundColor: '#0f766e' }}></div>
                <span className="legend-label">Selesai</span>
                <span className="legend-val">64%</span>
              </div>
              <div className="legend-item">
                <div className="legend-marker" style={{ backgroundColor: '#fb923c' }}></div>
                <span className="legend-label">Dalam Proses</span>
                <span className="legend-val">28%</span>
              </div>
              <div className="legend-item">
                <div className="legend-marker" style={{ backgroundColor: '#1a3252' }}></div>
                <span className="legend-label">Menunggu</span>
                <span className="legend-val">8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card-white mt-20">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title-sm">Tren Laporan Bulanan</h3>
            <p className="card-desc-sm">Fluktuasi volume laporan selama 6 bulan terakhir</p>
          </div>
          <div className="chart-legend-top">
            <span className="legend-pill"><div className="marker dark"></div> VOLUME</span>
            <span className="legend-pill"><div className="marker green"></div> RESOLUSI</span>
          </div>
        </div>
        
        <div className="vertical-chart-container">
          <div className="v-bar-group">
            <div className="v-bar-bg" style={{ height: '50%' }}>
              <div className="v-bar-fill dark" style={{ height: '60%' }}></div>
              <div className="v-bar-fill green" style={{ height: '55%' }}></div>
            </div>
            <span className="v-bar-label">JAN</span>
          </div>
          <div className="v-bar-group">
            <div className="v-bar-bg" style={{ height: '60%' }}>
              <div className="v-bar-fill dark" style={{ height: '70%' }}></div>
              <div className="v-bar-fill green" style={{ height: '65%' }}></div>
            </div>
            <span className="v-bar-label">FEB</span>
          </div>
          <div className="v-bar-group">
            <div className="v-bar-bg" style={{ height: '90%' }}>
              <div className="v-bar-fill dark" style={{ height: '95%' }}></div>
              <div className="v-bar-fill green" style={{ height: '90%' }}></div>
            </div>
            <span className="v-bar-label">MAR</span>
          </div>
          <div className="v-bar-group">
            <div className="v-bar-bg" style={{ height: '75%' }}>
              <div className="v-bar-fill dark" style={{ height: '80%' }}></div>
              <div className="v-bar-fill green" style={{ height: '85%' }}></div>
            </div>
            <span className="v-bar-label">APR</span>
          </div>
          <div className="v-bar-group">
            <div className="v-bar-bg" style={{ height: '45%' }}></div>
            <span className="v-bar-label">MEI</span>
          </div>
          <div className="v-bar-group">
            <div className="v-bar-bg" style={{ height: '55%' }}></div>
            <span className="v-bar-label">JUN</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderProfil = () => (
    <div className="profile-layout">
      <h2 className="profile-title">Profil Saya</h2>
      <div className="profile-card">
        <div className="profile-avatar-container">
          <i className="far fa-user-circle profile-avatar"></i>
        </div>
        
        <div className="profile-form">
          <div className="profile-field">
            <label>NAMA LENGKAP</label>
            <div className="profile-input-readonly">Admin unchdeep</div>
          </div>
          
          <div className="profile-field">
            <label>ALAMAT EMAIL</label>
            <div className="profile-input-readonly">adminunchdeepimut@gmail.com</div>
          </div>
          
          <div className="profile-field">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>KATA SANDI</label>
              <a href="#" className="profile-link">Ubah Kata Sandi?</a>
            </div>
            <div className="profile-input-wrapper">
              <input type="password" value="•••••••••••" readOnly className="profile-input" />
              <i className="fas fa-eye-slash profile-input-icon"></i>
            </div>
          </div>
          
          <button className="btn-profile-primary" onClick={() => setActiveView('editProfil')}>
            <i className="fas fa-pen" style={{ marginRight: '8px' }}></i> EDIT PROFIL
          </button>
          
          <button className="btn-profile-secondary">
            Hapus Akun
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditProfil = () => (
    <div className="profile-layout">
      <h2 className="profile-title">Edit Profil Saya</h2>
      <div className="profile-card">
        <div className="profile-avatar-container edit-mode">
          <i className="far fa-user-circle profile-avatar"></i>
          <div className="profile-avatar-edit">
            <i className="fas fa-image"></i>
          </div>
        </div>
        
        <div className="profile-form">
          <div className="profile-field">
            <label>NAMA LENGKAP</label>
            <div className="profile-input-readonly">Admin unchdeep</div>
          </div>
          
          <div className="profile-field">
            <label>ALAMAT EMAIL</label>
            <div className="profile-input-readonly">adminunchdeepimut@gmail.com</div>
          </div>
          
          <div className="profile-field">
            <label>KATA SANDI BARU</label>
            <div className="profile-input-wrapper">
              <input type="password" value="•••••••••••" readOnly className="profile-input" />
              <i className="fas fa-eye-slash profile-input-icon"></i>
            </div>
          </div>

          <div className="profile-field">
            <label>KONFIRMASI KATA SANDI BARU</label>
            <div className="profile-input-wrapper">
              <input type="password" value="•••••••••••" readOnly className="profile-input" />
              <i className="fas fa-eye-slash profile-input-icon"></i>
            </div>
          </div>
          
          <button className="btn-profile-primary" onClick={() => setShowProfileSuccess(true)}>
            SIMPAN PERUBAHAN
          </button>
          
          <button className="btn-profile-secondary" onClick={() => setActiveView('profil')}>
            Batal
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        handleLogout={handleLogout} 
        role="admin"
      />

      <div className="main-wrapper">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-logo-mobile">lapor.in</div>
            <div className="search-container">
              <i className="fas fa-search"></i>
              <input type="text" className="search-input" placeholder="Cari laporan..." />
            </div>
          </div>
          <div className="topbar-user" onClick={() => setActiveView('profil')} style={{ cursor: 'pointer' }}>
            <i className="far fa-user-circle"></i> Admin
          </div>
        </div>

        <div className="content-area">
          {activeView === 'beranda' && renderBeranda()}
          {activeView === 'kelola' && renderKelolaLaporan()}
          {activeView === 'detail' && renderDetailLaporan()}
          {activeView === 'statistik' && renderStatistikLaporan()}
          {activeView === 'profil' && renderProfil()}
          {activeView === 'editProfil' && renderEditProfil()}
        </div>
      </div>

      {showProfileSuccess && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', maxWidth: '400px' }}>
            <div className="modal-icon" style={{ width: '70px', height: '70px', background: '#ecfeff', color: '#0f766e', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
              <i className="fas fa-check"></i>
            </div>
            <h2 style={{ color: '#1a3252', marginBottom: '10px' }}>Profil Diperbarui!</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '30px' }}>
              Perubahan profil Anda telah berhasil disimpan.
            </p>
            <button 
              className="btn-login" 
              style={{ width: '100%', padding: '15px', background: '#1a3252', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => {
                setShowProfileSuccess(false);
                setActiveView('profil');
              }}
            >
              Kembali ke Profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
