import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { fetchAllReports, createReport, updateReport, deleteReport, updateUserProfile, updateUserPhoto } from '../api/api';
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
  const [searchQuery, setSearchQuery] = useState("");
  const [buatKategori, setBuatKategori] = useState('');
  const [editKategori, setEditKategori] = useState('Berat');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onCloseAction: null
  });
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const contentAreaRef = useRef(null);

  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo(0, 0);
    }

    const viewsNeedingData = ['beranda', 'daftar'];
    if (user && viewsNeedingData.includes(activeView)) {
      fetchReports();
    }

    setSearchQuery("");
  }, [activeView]);

  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    diproses: 0,
    selesai: 0
  });

  const fetchReports = async () => {
    try {
      const data = await fetchAllReports();

      const myReports = data.filter(r => Number(r.userId) === Number(user.id));

      setReports(myReports);

      setStats({
        total: myReports.length,
        diproses: myReports.filter(r => r.status?.toLowerCase() === "diproses").length,
        selesai: myReports.filter(r => r.status?.toLowerCase() === "selesai").length
      });

    } catch (err) {
      console.error(err);
    }
  };

  // Handle Navigation
  const handleLogout = () => {
    navigate('/');
  };

  // --- Sub Views --- //

  const renderBeranda = () => (
    <>
      <div className="welcome-banner">
        <h1>Selamat Datang di Portal lapor.in, {user?.name}!</h1>
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
          <div className="stat-value">{stats.total}</div>
          <div className="stat-desc">Total Laporan Masuk</div>
        </div>
        <div className="stat-card active">
          <div className="stat-header">
            <div className="stat-icon green"><i className="fas fa-arrows-rotate"></i></div>
            <span className="stat-title">Proses Aktif</span>
          </div>
          <div className="stat-value">{stats.diproses}</div>
          <div className="stat-desc">Sedang Diproses</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon dark"><i className="fas fa-check-circle"></i></div>
            <span className="stat-title">Hasil Akhir</span>
          </div>
          <div className="stat-value">{stats.selesai}</div>
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
            {reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4).map((r, i) => {
              const getStatusClass = (status) => {
                switch (status?.toLowerCase()) {
                  case "pending":
                    return "status-terkirim"; // abu
                  case "diproses":
                    return "status-diproses"; // biru
                  case "ditolak":
                    return "status-ditolak"; // merah
                  case "selesai":
                    return "status-selesai"; // oren
                  default:
                    return "status-terkirim";
                }
              };

              const formatTimeAgo = (timestamp) => {
                const now = new Date();
                const past = new Date(timestamp);
                const diff = Math.floor((now - past) / 1000);

                if (diff < 60) return `${diff} detik yang lalu`;
                if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
                if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
                return `${Math.floor(diff / 86400)} hari yang lalu`;
              };

              return (
                <tr key={r.id}>
                  <td className="td-id">#LPR-2026-{r.id}</td>

                  <td>
                    <h4 className="td-title">{r.title}</h4>
                  </td>

                  <td className="td-loc">{r.location}</td>

                  <td>
                    <span className={`badge-status ${getStatusClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="td-time">
                    {formatTimeAgo(r.createdAt)}
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setSelectedReport(r);
                        setActiveView('detail');
                      }}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </>
  );

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    photo: null
  });

  const handleSubmitReport = async () => {
    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("userId", user.id);
      formData.append("status", "pending");

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      await createReport(formData);
      await fetchReports();

      setForm({
        title: "",
        category: "",
        location: "",
        description: "",
        photo: null
      });

      setModalState({
        isOpen: true,
        title: "Laporan Terkirim!",
        message: "Laporan fasilitas Anda telah berhasil dikirim dan akan segera diproses.",
        onCloseAction: () => setActiveView("daftar")
      });

    } catch (err) {
      console.error(err);
      alert("Gagal kirim laporan: " + err.message);
    }
  };

  const renderBuatLaporan = () => (
    <>
      <h2 className="page-title">Sampaikan Laporan Anda</h2>
      <p className="page-desc">
        Laporkan kerusakan fasilitas atau sampaikan aspirasi akademik Anda secara mendetail untuk penanganan yang lebih cepat.
      </p>

      <div className="form-card">
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label>Judul Laporan</label>
          <input
            type="text"
            className="dash-input"
            placeholder="Misal: Proyektor bermasalah di Ruang Seminar 4"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tingkat Kerusakan</label>
            <CustomDropdown
              options={['Ringan', 'Sedang', 'Berat']}
              value={form.category}
              onChange={(val) => setForm({ ...form, category: val })}
              placeholder="Pilih salah satu"
            />
          </div>

          <div className="form-group">
            <label>Lokasi Spesifik</label>
            <input
              type="text"
              className="dash-input"
              placeholder="Gedung, Lantai, No. Ruangan"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Deskripsi Detail</label>
          <textarea
            className="dash-textarea"
            placeholder="Ceritakan detail kendala atau kronologi kerusakan..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </div>
      </div>

      <div className="form-card">
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px',
            display: 'block'
          }}
        >
          Dokumentasi Pendukung (Foto)
        </label>

        {/* upload click */}
        <div
          className="upload-box"
          onClick={() => document.getElementById("fileInput").click()}
          style={{ cursor: 'pointer' }}
        >
          <div className="upload-icon"><i className="fas fa-upload"></i></div>
          <h4>Pilih foto atau tarik ke sini</h4>
          <p>Mendukung JPG, PNG, atau HEIC (Maksimal 5MB)</p>
        </div>

        {/* hidden input */}
        <input
          id="fileInput"
          type="file"
          style={{ display: "none" }}
          onChange={(e) =>
            setForm({ ...form, photo: e.target.files[0] })
          }
        />

        {/* preview */}
        <div className="upload-preview-grid">
          {form.photo ? (
            <div className="preview-box">
              <img
                src={URL.createObjectURL(form.photo)}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <>
              <div className="preview-box"><i className="far fa-image"></i></div>
            </>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          className="btn-cancel"
          onClick={() => setActiveView('beranda')}
        >
          Batalkan
        </button>

        <button
          className="btn-submit"
          onClick={handleSubmitReport}
        >
          Kirim Laporan
        </button>
      </div>
    </>
  );

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-terkirim";
      case "diproses":
        return "status-diproses";
      case "ditolak":
        return "status-ditolak";
      case "selesai":
        return "status-selesai";
      default:
        return "status-terkirim";
    }
  };

  const filteredReports = reports.filter(r =>
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // bisa kamu ubah

  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentReports = filteredReports.slice(startIndex, endIndex);

  const renderDaftarLaporan = () => {
    const total = reports.length;
    const diproses = reports.filter(r => r.status?.toLowerCase() === "diproses").length;
    const selesai = reports.filter(r => r.status?.toLowerCase() === "selesai").length;

    return (
      <>
        <h2 className="page-title">Daftar Laporan Anda</h2>
        <p className="page-desc" style={{ maxWidth: '700px' }}>
          Pantau perkembangan setiap laporan fasilitas yang telah Anda ajukan.
        </p>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Total Laporan</span>
              <div className="stat-icon light"><i className="fas fa-clipboard-list"></i></div>
            </div>
            <div className="stat-value">{total}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Sedang Diproses</span>
              <div className="stat-icon light" style={{ color: '#0f766e', backgroundColor: '#ccfbf1' }}>
                <i className="fas fa-arrows-rotate"></i>
              </div>
            </div>
            <div className="stat-value" style={{ color: '#0f766e' }}>{diproses}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Selesai</span>
              <div className="stat-icon light" style={{ color: '#c2410c', backgroundColor: '#ffedd5' }}>
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <div className="stat-value" style={{ color: '#c2410c' }}>{selesai}</div>
          </div>
        </div>

        <div className="list-layout">
          <div className="list-main">
            <div className="table-container">
              <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Riwayat Aktivitas</h3>
                <div className="search-container" style={{ margin: '0 20px', flex: 1, maxWidth: '400px' }}>
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari laporan..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>ID Laporan</th>
                    <th>Judul & Tingkat Kerusakan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {currentReports.map((r) => (
                    <tr key={r.id}>
                      <td className="td-id">#LPR-2026-{r.id}</td>

                      <td>
                        <h4 className="td-title">{r.title}</h4>
                        <p className="td-desc">{r.category}</p>
                      </td>

                      <td className="td-time">{formatDate(r.createdAt)}</td>

                      <td>
                        <span className={`badge-status ${getStatusClass(r.status)}`}>
                          {r.status}
                        </span>
                      </td>

                      <td>
                        <a
                          href="#"
                          className="btn-link"
                          onClick={() => {
                            setSelectedReport(r);
                            setActiveView('detail');
                          }}
                        >
                          Lihat Detail <i className="fas fa-chevron-right" style={{ marginLeft: '4px' }}></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION (dummy dulu) */}
              <div className="pagination">
                <div className="page-info">
                  Menampilkan {currentReports.length} dari {totalItems} laporan
                </div>

                <div className="page-numbers">
                  <div
                    className="page-num"
                    style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: currentPage > 1 ? 'pointer' : 'not-allowed', opacity: currentPage > 1 ? 1 : 0.5 }}
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  >
                    <i className="fas fa-chevron-left" style={{ color: '#cbd5e1' }}></i>
                  </div>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <div
                      key={num}
                      className={`page-num ${currentPage === num ? "active" : ""}`}
                      onClick={() => setCurrentPage(num)}
                      style={{ border: currentPage === num ? 'none' : '1px solid #e2e8f0', backgroundColor: currentPage === num ? '' : 'white', cursor: "pointer" }}
                    >
                      {num}
                    </div>
                  ))}

                  <div
                    className="page-num"
                    style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: currentPage < totalPages ? 'pointer' : 'not-allowed', opacity: currentPage < totalPages ? 1 : 0.5 }}
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  >
                    <i className="fas fa-chevron-right" style={{ color: '#cbd5e1' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >
      </>
    );
  };

  const [selectedReport, setSelectedReport] = useState(null);

  const renderDetailLaporan = () => {
    if (!selectedReport) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', color: '#64748b' }}>
          <i className="fas fa-folder-open" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '20px' }}></i>
          <h2 style={{ color: '#1a3252', marginBottom: '10px', fontSize: '1.5rem' }}>Belum Ada Laporan yang Dipilih</h2>
          <p style={{ maxWidth: '400px', marginBottom: '24px' }}>Silakan kembali ke menu Daftar Laporan dan pilih salah satu laporan untuk melihat rincian lengkapnya.</p>
          <button className="btn-primary" onClick={() => setActiveView('daftar')}>
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Kembali ke Daftar Laporan
          </button>
        </div>
      );
    }

    const formatTanggal = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };

    const getStatusClass = (status) => {
      if (!status) return "status-terkirim";

      switch (status.toLowerCase()) {
        case "pending":
          return "status-terkirim";
        case "diproses":
          return "status-diproses";
        case "selesai":
          return "status-selesai";
        case "ditolak":
          return "status-ditolak";
        default:
          return "status-terkirim";
      }
    };

    const getStatusText = (status) => {
      if (!status) return "Pending";

      switch (status.toLowerCase()) {
        case "pending":
          return "Pending";
        case "diproses":
          return "Diproses";
        case "selesai":
          return "Selesai";
        case "ditolak":
          return "Ditolak";
        default:
          return status;
      }
    };

    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('daftar')}>
            Daftar Laporan
          </span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
          <span style={{ color: '#1a3252', fontWeight: 700 }}>
            ID #LPR-2026-{selectedReport.id}
          </span>
        </div>

        <div className="list-layout">
          <div className="list-main">
            <div className="detail-card">
              <div className="detail-top">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <span className={`badge-status ${getStatusClass(selectedReport.status)}`}>
                      {getStatusText(selectedReport.status)}
                    </span>
                    {selectedReport.status?.toLowerCase() !== "pending" && selectedReport.admin && (
                      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        oleh {selectedReport.admin.username}
                      </span>
                    )}
                  </div>

                  <h2 className="detail-title">{selectedReport.title}</h2>

                  <div className="detail-meta">
                    Dilaporkan oleh: <strong>{user?.name || "User"}</strong> • {formatTanggal(selectedReport.createdAt)}
                  </div>
                </div>

                <div className="detail-category">
                  <span>Kategori</span>
                  <strong>{selectedReport.category}</strong>
                </div>
              </div>

              <div className="detail-section-title">Deskripsi Lengkap</div>
              <div className="detail-box">
                {selectedReport.description}
              </div>

              <div className="detail-section-title">
                <i className="fas fa-location-dot" style={{ color: '#0f766e', marginRight: '6px' }}></i>
                Lokasi Detail
              </div>

              <div className="loc-detail">
                <strong>{selectedReport.location}</strong>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-section-title">Bukti Foto</div>

              <div className="upload-preview-grid" style={{ marginTop: '10px' }}>
                {selectedReport.photo ? (
                  <img
                    src={selectedReport.photo}
                    alt="report"
                    style={{
                      width: "150px",
                      borderRadius: "8px",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <div className="preview-box">
                    <i className="far fa-image"></i>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="list-side">
            <div className="detail-header-actions">
              <button
                className="btn-edit-report"
                onClick={() => setActiveView('edit')}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <i className="fas fa-pen"></i> Edit Laporan
              </button>

              <button
                className="btn-delete-report"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowDeleteModal(true)}
              >
                <i className="fas fa-trash-alt"></i> Hapus Laporan
              </button>
            </div>

            <div className="side-panel" style={{ backgroundColor: 'white' }}>
              <h3><i className="fas fa-clock-rotate-left"></i> Perkembangan Laporan</h3>

              <div className="detail-timeline">
                <div className="dt-item">
                  <div className="dt-icon active"><i className="fas fa-wrench"></i></div>
                  <div className="dt-content">
                    <h4>{getStatusText(selectedReport.status)}</h4>
                    <span>{formatTanggal(selectedReport.createdAt)}</span>
                    <div className="dt-box">
                      Status laporan saat ini: {getStatusText(selectedReport.status)}
                    </div>
                  </div>
                </div>

                <div className="dt-item" style={{ marginBottom: 0 }}>
                  <div className="dt-icon pending"><i className="fas fa-paper-plane"></i></div>
                  <div className="dt-content">
                    <h4>Laporan Diajukan</h4>
                    <span>{formatTanggal(selectedReport.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="side-panel" style={{ backgroundColor: 'white' }}>
              <h4 style={{ color: '#1a3252', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
                Butuh Bantuan Segera?
              </h4>
              <p className="help-text">
                Jika laporan bersifat darurat (misal: korsleting listrik), silakan hubungi hotline kampus.
              </p>
              <div className="help-phone">
                <i className="fas fa-phone-alt"></i> 0878-123-456
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const [editData, setEditData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    photo: null
  });

  useEffect(() => {
    if (selectedReport && activeView === "edit") {
      setEditData({
        title: selectedReport.title || "",
        category: selectedReport.category || "",
        location: selectedReport.location || "",
        description: selectedReport.description || "",
        photo: null
      });

      setEditKategori(selectedReport.category || "");
    }
  }, [selectedReport, activeView]);

  const renderEditLaporan = () => {
    if (!selectedReport) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', color: '#64748b' }}>
          <i className="fas fa-pen-to-square" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '20px' }}></i>
          <h2 style={{ color: '#1a3252', marginBottom: '10px', fontSize: '1.5rem' }}>Pilih Laporan untuk Diedit</h2>
          <p style={{ maxWidth: '400px', marginBottom: '24px' }}>Anda belum memilih laporan mana yang ingin diubah. Silakan pilih dari Daftar Laporan terlebih dahulu.</p>
          <button className="btn-primary" onClick={() => setActiveView('daftar')}>
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Kembali ke Daftar
          </button>
        </div>
      );
    }

    const handleUpdate = async () => {
      try {
        const formData = new FormData();
        formData.append("title", editData.title);
        formData.append("category", editKategori);
        formData.append("location", editData.location);
        formData.append("description", editData.description);

        if (editData.photo) {
          formData.append("photo", editData.photo);
        }

        const updatedResponse = await updateReport(selectedReport.id, formData);
        await fetchReports();

        if (updatedResponse && updatedResponse.data) {
          setSelectedReport(updatedResponse.data);
        }

        setModalState({
          isOpen: true,
          title: "Laporan Berhasil Diperbarui",
          message: "Laporan fasilitas kini telah diperbarui.\nCek detail laporan anda pada halaman daftar laporan.",
          onCloseAction: () => setActiveView("detail")
        });

      } catch (err) {
        console.error(err);
        alert("Gagal update");
      }
    };

    return (
      <>
        <h2 className="page-title">Edit Laporan Anda</h2>
        <p className="page-desc">
          Laporkan kerusakan fasilitas atau sampaikan aspirasi akademik Anda secara mendetail untuk penanganan yang lebih cepat.
        </p>

        <div className="form-card">
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Judul Laporan</label>
            <input
              type="text"
              className="dash-input"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
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
              <input
                type="text"
                className="dash-input"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Deskripsi Detail</label>
            <textarea
              className="dash-textarea"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="form-card">
          <label style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px',
            display: 'block'
          }}>
            Dokumentasi Pendukung (Foto)
          </label>

          {/* 🔥 UPLOAD BOX CUSTOM */}
          <div
            className="upload-box"
            onClick={() => document.getElementById("editPhotoInput").click()}
            style={{ cursor: "pointer" }}
          >
            <div className="upload-icon">
              <i className="fas fa-upload"></i>
            </div>
            <h4>Pilih foto atau tarik ke sini</h4>
            <p>Mendukung JPG, PNG, atau HEIC (Maksimal 5MB)</p>

            {/* INPUT ASLI DISEMBUNYIKAN */}
            <input
              id="editPhotoInput"
              type="file"
              style={{ display: "none" }}
              onChange={(e) =>
                setEditData({ ...editData, photo: e.target.files[0] })
              }
            />
          </div>

          {/* 🔥 PREVIEW */}
          <div className="upload-preview-grid">
            {editData.photo ? (
              <div className="preview-box">
                <img
                  src={URL.createObjectURL(editData.photo)}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
            ) : selectedReport.photo ? (
              <div className="preview-box">
                <img
                  src={selectedReport.photo}
                  alt="lama"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>
            ) : (
              <div className="preview-box">
                <i className="far fa-image"></i>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn-cancel"
            onClick={() => setActiveView('detail')}
          >
            Batalkan
          </button>

          <button
            className="btn-submit"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </>
    );
  };

  const [showPassword, setShowPassword] = useState(false);

  const renderProfil = () => (
    <div className="profile-layout">
      <h2 className="profile-title">Profil Saya</h2>

      <div className="profile-card">

        <div className="profile-avatar-container">
          {user?.photo ? (
            <img
              src={user.photo}
              alt="avatar"
              className="profile-avatar-img"

            />
          ) : (
            <i className="far fa-user-circle profile-avatar"></i>
          )}
        </div>

        <div className="profile-form">

          <div className="profile-field">
            <label>NAMA LENGKAP</label>
            <div className="profile-input-readonly">
              {user?.name || 'Tidak ada data'}
            </div>
          </div>

          <div className="profile-field">
            <label>ALAMAT EMAIL</label>
            <div className="profile-input-readonly">
              {user?.email || 'Tidak ada data'}
            </div>
          </div>

          <div className="profile-field">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>KATA SANDI</label>
              <span
                className="profile-link"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveView('editProfil')}
              >
                Ubah Kata Sandi
              </span>
            </div>

            <div className="profile-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={user?.password ? user.password : (showPassword ? "Tidak tersedia" : "•••••••••••")}
                readOnly
                className="profile-input"
              />
              <i
                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} profile-input-icon`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', zIndex: 10 }}
              ></i>
            </div>
          </div>

          <button
            className="btn-profile-primary"
            onClick={() => setActiveView('editProfil')}
          >
            <i className="fas fa-pen" style={{ marginRight: '8px' }}></i>
            EDIT PROFIL
          </button>

          <button
            className="btn-profile-secondary"
            onClick={() => {
              if (!confirm("Yakin mau hapus akun?")) return;
              alert("Fitur belum tersedia 😅");
            }}
          >
            Hapus Akun
          </button>

        </div>
      </div>
    </div>
  );


  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: null,
    photoPreview: null
  });

  useEffect(() => {
    if (activeView === 'editProfil') {
      setProfileData({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        confirmPassword: "",
        photo: null,
        photoPreview: user?.photo || null
      });
    }
  }, [activeView, user]);

  const handleUpdateProfile = async () => {
    try {
      if (profileData.password && profileData.password !== profileData.confirmPassword) {
        return alert("Password dan konfirmasi password tidak cocok!");
      }

      const updatePayload = {
        name: profileData.name,
        email: profileData.email,
      };

      if (profileData.password) {
        updatePayload.password = profileData.password;
      }

      const result = await updateUserProfile(user.id, updatePayload);
      let updatedUser = result.data;

      if (profileData.photo) {
        const formData = new FormData();
        formData.append("photo", profileData.photo);

        const photoResult = await updateUserPhoto(user.id, formData);
        updatedUser = photoResult.data;
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setModalState({
        isOpen: true,
        title: "Profil Diperbarui!",
        message: "Perubahan profil Anda telah berhasil disimpan.",
        onCloseAction: () => setActiveView("profil")
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan");
    }
  };

  const renderEditProfil = () => (
    <div className="profile-layout">
      <h2 className="profile-title">Edit Profil Saya</h2>
      <div className="profile-card">
        <div className="profile-avatar-container edit-mode" onClick={() => document.getElementById('profilePhotoInput').click()} style={{ cursor: 'pointer' }}>
          {profileData.photoPreview ? (
            <img src={profileData.photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            <i className="far fa-user-circle profile-avatar"></i>
          )}
          <div className="profile-avatar-edit">
            <i className="fas fa-camera"></i>
          </div>
        </div>
        <input
          id="profilePhotoInput"
          type="file"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setProfileData({
                ...profileData,
                photo: file,
                photoPreview: URL.createObjectURL(file)
              });
            }
          }}
        />

        <div className="profile-form">
          <div className="profile-field">
            <label>NAMA LENGKAP</label>
            <div className="profile-input-wrapper">
              <input
                type="text"
                className="profile-input"
                value={profileData.name}
                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="profile-field">
            <label>ALAMAT EMAIL</label>
            <div className="profile-input-wrapper">
              <input
                type="email"
                className="profile-input"
                value={profileData.email}
                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="profile-field">
            <label>KATA SANDI BARU</label>
            <div className="profile-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="profile-input"
                value={profileData.password}
                onChange={e => setProfileData({ ...profileData, password: e.target.value })}
              />
              <i
                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} profile-input-icon`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', zIndex: 10 }}
              ></i>
            </div>
          </div>

          <div className="profile-field">
            <label>KONFIRMASI KATA SANDI BARU</label>
            <div className="profile-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Konfirmasi kata sandi baru"
                className="profile-input"
                value={profileData.confirmPassword}
                onChange={e => setProfileData({ ...profileData, confirmPassword: e.target.value })}
              />
              <i
                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} profile-input-icon`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', zIndex: 10 }}
              ></i>
            </div>
          </div>

          <button className="btn-profile-primary" onClick={handleUpdateProfile}>
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
          </div>
          <div className="topbar-user" onClick={() => setActiveView('profil')} style={{ cursor: 'pointer' }}>
            {user?.photo ? (
              <img src={user.photo} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <i className="far fa-user-circle"></i>
            )}
            <span style={{ marginLeft: '8px' }}>{user?.name || "User"}</span>
          </div>
        </div>

        <div className="content-area" ref={contentAreaRef}>
          {activeView === 'beranda' && renderBeranda()}
          {activeView === 'buat' && renderBuatLaporan()}
          {activeView === 'daftar' && renderDaftarLaporan()}
          {activeView === 'detail' && renderDetailLaporan()}
          {activeView === 'edit' && renderEditLaporan()}
          {activeView === 'profil' && renderProfil()}
          {activeView === 'editProfil' && renderEditProfil()}
        </div>
      </div>

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-icon">
              <i className="fas fa-trash-alt"></i>
            </div>
            <h2 className="delete-modal-title">Hapus Laporan?</h2>
            <p className="delete-modal-text">
              Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <button
              className="delete-modal-btn-confirm"
              onClick={async () => {
                setShowDeleteModal(false);
                await deleteReport(selectedReport.id);
                await fetchReports();
                setActiveView('daftar');
              }}
            >
              Hapus
            </button>
            <button
              className="delete-modal-btn-cancel"
              onClick={() => setShowDeleteModal(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {modalState.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{
            textAlign: 'center',
            padding: '40px',
            background: 'white',
            borderRadius: '16px',
            maxWidth: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 30px' }}>
              <div style={{
                width: '110px', height: '110px',
                borderRadius: '50%',
                background: '#f8fafc',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <div style={{
                  width: '80px', height: '80px',
                  borderRadius: '50%',
                  background: '#a5f3fc',
                  display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    background: '#0f766e',
                    color: 'white',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '1rem'
                  }}>
                    <i className="fas fa-check"></i>
                  </div>
                </div>
              </div>
            </div>

            <h2 style={{ color: '#1a3252', marginBottom: '12px', fontSize: '1.25rem', fontWeight: 800 }}>{modalState.title}</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '32px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {modalState.message}
            </p>
            <button
              className="btn-login"
              style={{ width: '100%', padding: '14px', background: '#1a3252', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' }}
              onClick={() => {
                setModalState({ ...modalState, isOpen: false });
                if (modalState.onCloseAction) {
                  modalState.onCloseAction();
                }
              }}
            >
              TUTUP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
