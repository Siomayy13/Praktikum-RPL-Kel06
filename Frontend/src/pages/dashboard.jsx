import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import '../styles/dashboard.css';

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-select-container">
      <div 
        className="dash-select custom-select-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: value ? '#1a3252' : '#94a3b8', fontWeight: value ? 700 : 400 }}
      >
        {value || placeholder}
      </div>
      {isOpen && (
        <div className="custom-select-menu">
          {options.map(opt => (
            <div 
              key={opt} 
              className={`custom-select-option ${value === opt ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function Dashboard() {
  const [activeView, setActiveView] = useState('beranda');
  const [buatKategori, setBuatKategori] = useState('');
  const [editKategori, setEditKategori] = useState('Berat');
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const navigate = useNavigate();

  // Handle Navigation
  const handleLogout = () => {
    navigate('/login');
  };

  // --- Sub Views --- //

  const renderBeranda = () => (
    <>
      <div className="welcome-banner">
        <h1>Selamat Datang di Portal lapor.in, User!</h1>
        <p>Pantau, kelola, dan tuntaskan setiap laporan fasilitas kampus dengan presisi demi kenyamanan bersama.</p>
        <div className="banner-actions">
          <button className="btn-banner-primary" onClick={() => setActiveView('buat')}>
            <i className="fas fa-plus"></i> Buat Laporan Baru
          </button>
          <button className="btn-banner-secondary" onClick={() => setActiveView('daftar')}>
            Daftar Laporan
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon dark"><i className="fas fa-clipboard-list"></i></div>
            <span className="stat-title">Total Aduan</span>
          </div>
          <div className="stat-value">0</div>
          <div className="stat-desc">Total Laporan Masuk</div>
        </div>
        <div className="stat-card active">
          <div className="stat-header">
            <div className="stat-icon green"><i className="fas fa-arrows-rotate"></i></div>
            <span className="stat-title">Proses Aktif</span>
          </div>
          <div className="stat-value">0</div>
          <div className="stat-desc">Sedang Diproses</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon dark"><i className="fas fa-check-circle"></i></div>
            <span className="stat-title">Hasil Akhir</span>
          </div>
          <div className="stat-value">0</div>
          <div className="stat-desc">Berhasil Diselesaikan</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div>
            <h3>Aktivitas Laporan Terbaru</h3>
            <p>Daftar keluhan yang baru saja diperbarui oleh sistem</p>
          </div>
          <a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); setActiveView('daftar'); }}>Lihat Semua</a>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID Laporan</th>
              <th>Judul Laporan</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="td-id">#LPR-2026-001</td>
              <td><h4 className="td-title">AC Ruang Lab 3 Mati Total</h4></td>
              <td className="td-loc">Gedung Utama, Lt 3</td>
              <td><span className="badge-status status-ditolak">Ditolak</span></td>
              <td className="td-time">2 Menit yang lalu <button className="btn-icon" onClick={() => setActiveView('detail')}><i className="fas fa-chevron-right"></i></button></td>
            </tr>
            <tr>
              <td className="td-id">#LPR-2026-002</td>
              <td><h4 className="td-title">Kebocoran Pipa Toilet Lantai 2</h4></td>
              <td className="td-loc">Dekanat Fakultas Teknik, Lt 5</td>
              <td><span className="badge-status status-diproses">Diproses</span></td>
              <td className="td-time">1 Jam yang lalu <button className="btn-icon" onClick={() => setActiveView('detail')}><i className="fas fa-chevron-right"></i></button></td>
            </tr>
            <tr>
              <td className="td-id">#LPR-2026-003</td>
              <td><h4 className="td-title">Proyektor Ruang Seminar Buram</h4></td>
              <td className="td-loc">Parkir Timur</td>
              <td><span className="badge-status status-selesai">Selesai</span></td>
              <td className="td-time">3 Jam yang lalu <button className="btn-icon" onClick={() => setActiveView('detail')}><i className="fas fa-chevron-right"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  const renderBuatLaporan = () => (
    <>
      <h2 className="page-title">Sampaikan Laporan Anda</h2>
      <p className="page-desc">Laporkan kerusakan fasilitas atau sampaikan aspirasi akademik Anda secara mendetail untuk penanganan yang lebih cepat.</p>

      <div className="form-card">
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label>Judul Laporan</label>
          <input type="text" className="dash-input" placeholder="Misal: Proyektor bermasalah di Ruang Seminar 4" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tingkat Kerusakan</label>
            <CustomDropdown 
              options={['Ringan', 'Sedang', 'Berat']} 
              value={buatKategori} 
              onChange={setBuatKategori} 
              placeholder="Pilih salah satu" 
            />
          </div>
          <div className="form-group">
            <label>Lokasi Spesifik</label>
            <input type="text" className="dash-input" placeholder="Gedung, Lantai, No. Ruangan" />
          </div>
        </div>

        <div className="form-group">
          <label>Deskripsi Detail</label>
          <textarea className="dash-textarea" placeholder="Ceritakan detail kendala atau kronologi kerusakan yang terjadi agar teknisi kami dapat mempersiapkan peralatan yang tepat..."></textarea>
        </div>
      </div>

      <div className="form-card">
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'block' }}>Dokumentasi Pendukung (Foto)</label>
        <div className="upload-box">
          <div className="upload-icon"><i className="fas fa-upload"></i></div>
          <h4>Pilih foto atau tarik ke sini</h4>
          <p>Mendukung JPG, PNG, atau HEIC (Maksimal 5MB)</p>
        </div>
        <div className="upload-preview-grid">
          <div className="preview-box"><i className="far fa-image"></i></div>
          <div className="preview-box"><i className="far fa-image"></i></div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={() => setActiveView('beranda')}>Batalkan</button>
        <button className="btn-submit" onClick={() => setActiveView('daftar')}>Kirim Laporan</button>
      </div>
    </>
  );

  const renderDaftarLaporan = () => (
    <>
      <h2 className="page-title">Daftar Laporan Anda</h2>
      <p className="page-desc" style={{ maxWidth: '700px' }}>Pantau perkembangan setiap laporan fasilitas yang telah Anda ajukan. Tim manajemen kami bekerja keras untuk memastikan setiap resolusi diberikan tepat waktu.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Laporan</span>
            <div className="stat-icon light"><i className="fas fa-clipboard-list"></i></div>
          </div>
          <div className="stat-value">24</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Sedang Diproses</span>
            <div className="stat-icon light" style={{ color: '#0f766e', backgroundColor: '#ccfbf1' }}><i className="fas fa-arrows-rotate"></i></div>
          </div>
          <div className="stat-value" style={{ color: '#0f766e' }}>08</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Selesai</span>
            <div className="stat-icon light" style={{ color: '#c2410c', backgroundColor: '#ffedd5' }}><i className="fas fa-check-circle"></i></div>
          </div>
          <div className="stat-value" style={{ color: '#c2410c' }}>14</div>
        </div>
      </div>

      <div className="list-layout">
        <div className="list-main">
          <div className="table-container">
            <div className="table-header">
              <h3>Riwayat Aktivitas</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID Laporan</th>
                  <th>Judul & Kategori</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="td-id">#LPR-2026-001</td>
                  <td>
                    <h4 className="td-title">AC Ruang Lab 3 Mati Total</h4>
                    <p className="td-desc">Berat</p>
                  </td>
                  <td className="td-time">12 Apr 2026</td>
                  <td><span className="badge-status status-diproses">Diproses</span></td>
                  <td><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', marginLeft: '4px' }}></i></a></td>
                </tr>
                <tr>
                  <td className="td-id">#LPR-2026-002</td>
                  <td>
                    <h4 className="td-title">Kebocoran Pipa Toilet Lantai 2</h4>
                    <p className="td-desc">Berat</p>
                  </td>
                  <td className="td-time">10 Mar 2026</td>
                  <td><span className="badge-status status-terkirim">Laporan Terkirim</span></td>
                  <td><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', marginLeft: '4px' }}></i></a></td>
                </tr>
                <tr>
                  <td className="td-id">#LPR-2026-003</td>
                  <td>
                    <h4 className="td-title">Proyektor Ruang Seminar Buram</h4>
                    <p className="td-desc">Sedang</p>
                  </td>
                  <td className="td-time">08 Feb 2026</td>
                  <td><span className="badge-status status-selesai">Selesai</span></td>
                  <td><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', marginLeft: '4px' }}></i></a></td>
                </tr>
                <tr>
                  <td className="td-id">#LPR-2026-004</td>
                  <td>
                    <h4 className="td-title">Permintaan Kursi Tambahan</h4>
                    <p className="td-desc">Ringan</p>
                  </td>
                  <td className="td-time">05 Jan 2026</td>
                  <td><span className="badge-status status-ditolak">Ditolak</span></td>
                  <td><a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', marginLeft: '4px' }}></i></a></td>
                </tr>
              </tbody>
            </table>
            
            <div className="pagination">
              <div className="page-info">Menampilkan 4 dari 24 laporan</div>
              <div className="page-numbers">
                <i className="fas fa-chevron-left" style={{ color: '#cbd5e1', cursor: 'pointer' }}></i>
                <div className="page-num active">1</div>
                <div className="page-num">2</div>
                <div className="page-num">3</div>
                <i className="fas fa-chevron-right" style={{ color: '#64748b', cursor: 'pointer' }}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="list-side">
          <div className="side-panel">
            <h3><i className="far fa-circle-question"></i> Panduan Status</h3>
            
            <div className="timeline-item status-terkirim">
              <h4 className="timeline-title">Laporan Terkirim</h4>
              <p className="timeline-desc">Laporan baru masuk ke antrean dan sedang menunggu verifikasi awal dari admin.</p>
            </div>
            <div className="timeline-item status-diproses">
              <h4 className="timeline-title">Diproses</h4>
              <p className="timeline-desc">Petugas lapangan telah ditugaskan dan sedang menangani masalah yang dilaporkan.</p>
            </div>
            <div className="timeline-item status-selesai">
              <h4 className="timeline-title">Selesai</h4>
              <p className="timeline-desc">Pekerjaan telah rampung. Mohon berikan feedback melalui tombol Lihat Detail.</p>
            </div>
            <div className="timeline-item status-ditolak" style={{ marginBottom: 0 }}>
              <h4 className="timeline-title">Ditolak</h4>
              <p className="timeline-desc">Laporan tidak dapat ditindaklanjuti karena informasi tidak lengkap atau di luar wewenang.</p>
            </div>
          </div>

          <div className="side-panel" style={{ backgroundColor: 'white' }}>
            <h4 style={{ color: '#1a3252', fontSize: '0.9rem', margin: '0 0 8px 0' }}>Butuh Bantuan Segera?</h4>
            <p className="help-text">Jika laporan bersifat darurat (misal: korsleting listrik), silakan hubungi hotline kampus.</p>
            <div className="help-phone">
              <i className="fas fa-phone-alt"></i> 0878-123-456
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderDetailLaporan = () => (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('daftar')}>Daftar Laporan</span>
        <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
        <span style={{ color: '#1a3252', fontWeight: 700 }}>ID #LPR-2026-001</span>
      </div>

      <div className="list-layout">
        <div className="list-main">
          <div className="detail-card">
            <div className="detail-top">
              <div>
                <span className="badge-status status-diproses">Sedang Diproses</span>
                <h2 className="detail-title">AC Ruang Lab 3 Mati Total</h2>
                <div className="detail-meta">Dilaporkan oleh: <strong>User Iphone</strong> • 12 April 2026</div>
              </div>
              <div className="detail-category">
                <span>Kategori</span>
                <strong>Berat</strong>
              </div>
            </div>

            <div className="detail-section-title">Deskripsi Lengkap</div>
            <div className="detail-box">
              AC di Ruang Lab 3 tidak bisa dinyalakan sama sekali sejak kemarin siang. Ini sangat mengganggu aktivitas praktikum karena ruangan menjadi sangat panas dan pengap, terutama saat kelas penuh. Harap segera ditindaklanjuti.
            </div>

            <div className="detail-section-title"><i className="fas fa-location-dot" style={{ color: '#0f766e', marginRight: '6px' }}></i> Lokasi Detail</div>
            <div className="loc-detail">
              <strong>Gedung A, Lantai 3, Laboratorium Networking</strong>
              <p>Fakultas Teknik, Kampus Tembalang, Semarang</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-section-title">Bukti Foto</div>
            <div className="upload-preview-grid" style={{ marginTop: '10px' }}>
              <div className="preview-box"><i className="far fa-image"></i></div>
            </div>
          </div>
        </div>

        <div className="list-side">
          <div className="detail-header-actions">
            <button className="btn-edit-report" onClick={() => setActiveView('edit')} style={{ flex: 1, justifyContent: 'center' }}>
              <i className="fas fa-pen"></i> Edit Laporan
            </button>
            <button className="btn-delete-report" style={{ flex: 1, justifyContent: 'center' }}>
              <i className="fas fa-trash-alt"></i> Hapus Laporan
            </button>
          </div>

          <div className="side-panel" style={{ backgroundColor: 'white' }}>
            <h3><i className="fas fa-clock-rotate-left"></i> Perkembangan Laporan</h3>
            
            <div className="detail-timeline">
              <div className="dt-item">
                <div className="dt-icon active"><i className="fas fa-wrench"></i></div>
                <div className="dt-content">
                  <h4>Sedang Diproses</h4>
                  <span>14 Apr 2026, 09:15 WIB</span>
                  <div className="dt-box">Tim teknisi sedang berada di lokasi untuk melakukan perbaikan.</div>
                </div>
              </div>
              
              <div className="dt-item">
                <div className="dt-icon done"><i className="fas fa-clipboard-check"></i></div>
                <div className="dt-content">
                  <h4>Laporan Terverifikasi</h4>
                  <span>12 Apr 2026, 15:30 WIB</span>
                  <div className="dt-box" style={{ backgroundColor: 'transparent', padding: 0 }}>Diverifikasi oleh Admin. Unit perbaikan telah dijadwalkan.</div>
                </div>
              </div>

              <div className="dt-item" style={{ marginBottom: 0 }}>
                <div className="dt-icon pending"><i className="fas fa-paper-plane"></i></div>
                <div className="dt-content">
                  <h4>Laporan Diajukan</h4>
                  <span>12 Apr 2026, 10:05 WIB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="side-panel" style={{ backgroundColor: 'white' }}>
            <h4 style={{ color: '#1a3252', fontSize: '0.9rem', margin: '0 0 8px 0' }}>Butuh Bantuan Segera?</h4>
            <p className="help-text">Jika laporan bersifat darurat (misal: korsleting listrik), silakan hubungi hotline kampus.</p>
            <div className="help-phone">
              <i className="fas fa-phone-alt"></i> 0878-123-456
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderEditLaporan = () => (
    <>
      <h2 className="page-title">Edit Laporan Anda</h2>
      <p className="page-desc">Laporkan kerusakan fasilitas atau sampaikan aspirasi akademik Anda secara mendetail untuk penanganan yang lebih cepat.</p>

      <div className="form-card">
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label>Judul Laporan</label>
          <input type="text" className="dash-input" defaultValue="AC Ruang Lab 3 Mati Total" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tingkat Kerusakan</label>
            <CustomDropdown 
              options={['Ringan', 'Sedang', 'Berat']} 
              value={editKategori} 
              onChange={setEditKategori} 
              placeholder="Pilih salah satu" 
            />
          </div>
          <div className="form-group">
            <label>Lokasi Spesifik</label>
            <input type="text" className="dash-input" defaultValue="Gedung Utama, Lt 3" />
          </div>
        </div>

        <div className="form-group">
          <label>Deskripsi Detail</label>
          <textarea className="dash-textarea" defaultValue="AC di Ruang Lab 3 tidak bisa dinyalakan sama sekali sejak kemarin siang. Ini sangat mengganggu aktivitas praktikum karena ruangan menjadi sangat panas dan pengap, terutama saat kelas penuh. Harap segera ditindaklanjuti."></textarea>
        </div>
      </div>

      <div className="form-card">
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'block' }}>Dokumentasi Pendukung (Foto)</label>
        <div className="upload-box">
          <div className="upload-icon"><i className="fas fa-upload"></i></div>
          <h4>Pilih foto atau tarik ke sini</h4>
          <p>Mendukung JPG, PNG, atau HEIC (Maksimal 5MB)</p>
        </div>
        <div className="upload-preview-grid">
          <div className="preview-box"><i className="far fa-image"></i></div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={() => setActiveView('detail')}>Batalkan</button>
        <button className="btn-submit" onClick={() => setActiveView('detail')}>Update</button>
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
            <div className="profile-input-readonly">Dips lucu baik hati</div>
          </div>
          
          <div className="profile-field">
            <label>ALAMAT EMAIL</label>
            <div className="profile-input-readonly">yapokonyainiemail@gmail.com</div>
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
            <i className="fas fa-camera"></i>
          </div>
        </div>
        
        <div className="profile-form">
          <div className="profile-field">
            <label>NAMA LENGKAP</label>
            <div className="profile-input-readonly">Dips lucu baik hati</div>
          </div>
          
          <div className="profile-field">
            <label>ALAMAT EMAIL</label>
            <div className="profile-input-readonly">yapokonyainiemail@gmail.com</div>
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
      {/* SIDEBAR */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        handleLogout={handleLogout} 
      />

      {/* MAIN CONTENT */}
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
            <i className="far fa-user-circle"></i> User
          </div>
        </div>

        <div className="content-area">
          {activeView === 'beranda' && renderBeranda()}
          {activeView === 'buat' && renderBuatLaporan()}
          {activeView === 'daftar' && renderDaftarLaporan()}
          {activeView === 'detail' && renderDetailLaporan()}
          {activeView === 'edit' && renderEditLaporan()}
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

export default Dashboard;
