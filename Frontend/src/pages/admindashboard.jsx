import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import '../styles/dashboard.css';
import { fetchAllReports, updateReport, deleteReport, updateAdminProfile, updateAdminPhoto } from '../api/api';

function AdminDashboard() {
  const [activeView, setActiveView] = useState('beranda');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("admin")));
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statistikPeriod, setStatistikPeriod] = useState("semua");
  const contentAreaRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
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
        name: user?.username || "",
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
        username: profileData.name,
        email: profileData.email,
      };

      if (profileData.password) {
        updatePayload.password = profileData.password;
      }

      const result = await updateAdminProfile(user.id_admin, updatePayload);
      let updatedUser = result.data;

      if (profileData.photo) {
        const formData = new FormData();
        formData.append("photo", profileData.photo);

        const photoResult = await updateAdminPhoto(user.id_admin, formData);
        updatedUser = photoResult.data;
      }

      localStorage.setItem("admin", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowProfileSuccess(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan");
    }
  };

  const fetchReports = async () => {
    try {
      const data = await fetchAllReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo(0, 0);
    }
    const viewsNeedingData = ['beranda', 'kelola', 'detail', 'statistik'];
    if (user && viewsNeedingData.includes(activeView)) {
      fetchReports();
    }
    setSearchQuery("");
    setCurrentPage(1);
  }, [activeView]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/');
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "status-terkirim";
      case "diproses": return "status-diproses";
      case "ditolak": return "status-ditolak";
      case "selesai": return "status-selesai";
      default: return "status-terkirim";
    }
  };

  // getStatusText removed as it is no longer used

  const formatTanggal = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " WIB";
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

  const renderBeranda = () => {
    const total = reports.length;
    const urgent = reports.filter(r => r.category?.toLowerCase() === "berat").length;
    const latestReports = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

    return (
      <>
        <div className="admin-header">
          <div>
            <div className="admin-subtitle">SISTEM MANAJEMEN FASILITAS, UNIVERSITAS DIPONEGORO</div>
            <h1 className="admin-title">Selamat Datang, {user?.username || "Admin"}</h1>
          </div>
          <div className="admin-date-btn">
            <i className="far fa-calendar-alt"></i> {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper blue">
              <i className="far fa-file-alt"></i>
            </div>
            <div>
              <div className="admin-stat-label">Total Laporan</div>
              <div className="admin-stat-value">{total}</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon-wrapper red">
              <i className="fas fa-exclamation"></i>
            </div>
            <div>
              <div className="admin-stat-label">Berat</div>
              <div className="admin-stat-value">{urgent}</div>
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
              {latestReports.map(r => (
                <tr key={r.id}>
                  <td className="td-id" style={{ color: '#64748b' }}>#LPR-2026-{r.id}</td>
                  <td>
                    <h4 className="td-title">{r.title}</h4>
                    <p className="td-desc">{r.category}</p>
                  </td>
                  <td><span className={`badge-status ${getStatusClass(r.status)}`}>{r.status?.toUpperCase()}</span></td>
                  <td><a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); setSelectedReport(r); setActiveView('detail'); }}>Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i></a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderKelolaLaporan = () => {
    const total = reports.length;
    const diproses = reports.filter(r => r.status?.toLowerCase() === "diproses").length;
    const selesai = reports.filter(r => r.status?.toLowerCase() === "selesai").length;

    const filteredReports = reports.filter(r => {
      const matchSearch = r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchKategori = filterKategori === 'Semua' || r.category?.toLowerCase() === filterKategori.toLowerCase();
      const matchStatus = filterStatus === 'Semua' || r.status?.toLowerCase() === filterStatus.toLowerCase();

      return matchSearch && matchKategori && matchStatus;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const itemsPerPage = 7;
    const totalItems = filteredReports.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

    return (
      <>
        <h2 className="admin-page-title">Kelola Laporan</h2>

        <div className="admin-workload-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="workload-card-main">
            <h3 className="workload-title">Beban kerja admin saat ini berada di level optimal.</h3>
            <div className="workload-stats">
              <div className="workload-stat-item">
                <span className="workload-label">TOTAL LAPORAN</span>
                <span className="workload-val">{total}</span>
              </div>
              <div className="workload-stat-item">
                <span className="workload-label">SEDANG PROSES</span>
                <span className="workload-val">{diproses}</span>
              </div>
              <div className="workload-stat-item">
                <span className="workload-label">SELESAI</span>
                <span className="workload-val" style={{ color: '#67e8f9' }}>{selesai}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1a3252' }}>Daftar Antrean Laporan</h3>
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
            <div className="table-filters" style={{ display: 'flex', gap: '4px', position: 'relative' }}>
              <button
                className={`filter-btn ${(filterKategori === 'Semua' && filterStatus === 'Semua') ? 'active' : ''}`}
                onClick={() => {
                  setFilterKategori('Semua');
                  setFilterStatus('Semua');
                  setCurrentPage(1);
                  setOpenDropdown(null);
                }}
              >Semua</button>

              <div style={{ position: 'relative' }}>
                <button
                  className={`filter-btn ${filterKategori !== 'Semua' ? 'active' : ''}`}
                  onClick={() => setOpenDropdown(openDropdown === 'kategori' ? null : 'kategori')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {filterKategori === 'Semua' ? 'Tingkat Kerusakan' : filterKategori}
                  <i className={`fas fa-chevron-${openDropdown === 'kategori' ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }}></i>
                </button>

                {openDropdown === 'kategori' && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px', zIndex: 10, width: '200px' }}>
                    {['Semua', 'Berat', 'Sedang', 'Ringan'].map(opt => (
                      <div
                        key={opt}
                        onClick={() => { setFilterKategori(opt); setOpenDropdown(null); setCurrentPage(1); }}
                        style={{ padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: filterKategori === opt ? '#0f766e' : '#475569', background: filterKategori === opt ? '#f0fdfa' : 'transparent', fontWeight: filterKategori === opt ? '600' : '500' }}
                        onMouseOver={(e) => { if (filterKategori !== opt) e.target.style.background = '#f8fafc'; }}
                        onMouseOut={(e) => { if (filterKategori !== opt) e.target.style.background = 'transparent'; }}
                      >
                        {opt === 'Semua' ? 'Semua Tingkat Kerusakan' : opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  className={`filter-btn ${filterStatus !== 'Semua' ? 'active' : ''}`}
                  onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {filterStatus === 'Semua' ? 'Status' : filterStatus}
                  <i className={`fas fa-chevron-${openDropdown === 'status' ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }}></i>
                </button>

                {openDropdown === 'status' && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px', zIndex: 10, width: '140px' }}>
                    {['Semua', 'Pending', 'Diproses', 'Selesai', 'Ditolak'].map(opt => (
                      <div
                        key={opt}
                        onClick={() => { setFilterStatus(opt); setOpenDropdown(null); setCurrentPage(1); }}
                        style={{ padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: filterStatus === opt ? '#0f766e' : '#475569', background: filterStatus === opt ? '#f0fdfa' : 'transparent', fontWeight: filterStatus === opt ? '600' : '500' }}
                        onMouseOver={(e) => { if (filterStatus !== opt) e.target.style.background = '#f8fafc'; }}
                        onMouseOut={(e) => { if (filterStatus !== opt) e.target.style.background = 'transparent'; }}
                      >
                        {opt === 'Semua' ? 'Semua Status' : opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>ID LAPORAN</th>
                <th style={{ width: '35%' }}>JUDUL & LOKASI</th>
                <th style={{ width: '15%' }}>WAKTU MASUK</th>
                <th style={{ width: '10%' }}>TINGKAT KERUSAKAN</th>
                <th style={{ width: '15%' }}>STATUS</th>
                <th style={{ width: '10%' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map(r => (
                <tr key={r.id}>
                  <td className="td-id" style={{ color: '#1a3252', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>#LPR-2026-{r.id}</td>
                  <td>
                    <h4 className="td-title" style={{ fontSize: '0.9rem' }}>{r.title}</h4>
                    <p className="td-desc" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{r.location}</p>
                  </td>
                  <td className="td-time" style={{ fontSize: '0.8rem' }}>{formatTimeAgo(r.createdAt)}</td>
                  <td><span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#334155' }}>{r.category}</span></td>
                  <td><span className={`badge-status ${getStatusClass(r.status)}`} style={{ fontSize: '0.65rem' }}>{r.status?.toUpperCase()}</span></td>
                  <td>
                    <a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); setSelectedReport(r); setActiveView('detail'); }}>
                      Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <div className="page-info">Menampilkan {currentReports.length} dari {totalItems} laporan</div>
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
                  className={`page-num ${currentPage === num ? 'active' : ''}`}
                  style={{ border: currentPage === num ? 'none' : '1px solid #e2e8f0', backgroundColor: currentPage === num ? '' : 'white', cursor: 'pointer' }}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </div>
              ))}

              <div
                className="page-num"
                style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: currentPage < totalPages ? 'pointer' : 'not-allowed', opacity: currentPage < totalPages ? 1 : 0.5 }}
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              >
                <i className="fas fa-chevron-right" style={{ color: '#64748b' }}></i>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDetailLaporan = () => {
    if (!selectedReport) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', color: '#64748b' }}>
          <i className="fas fa-folder-open" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '20px' }}></i>
          <h2 style={{ color: '#1a3252', marginBottom: '10px', fontSize: '1.5rem' }}>Belum Ada Laporan yang Dipilih</h2>
          <p style={{ maxWidth: '400px', marginBottom: '24px' }}>Silakan kembali ke menu Kelola Laporan dan pilih salah satu laporan untuk melihat rincian lengkapnya.</p>
          <button className="btn-primary" onClick={() => setActiveView('kelola')}>
            <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Kembali ke Kelola Laporan
          </button>
        </div>
        // <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', color: '#64748b' }}>
        //   <i className="fas fa-file-alt" style={{ fontSize: '4rem', color: '#cbd5e1', marginBottom: '20px' }}></i>
        //   <h2 style={{ color: '#1a3252', marginBottom: '10px', fontSize: '1.5rem' }}>Pilih Laporan</h2>
        //   <p style={{ maxWidth: '400px', marginBottom: '24px' }}>Silakan pilih laporan dari daftar untuk melihat detail dan mengelolanya.</p>
        //   <button className="btn-primary" onClick={() => setActiveView('kelola')}>
        //     <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Kembali ke Daftar
        //   </button>
        // </div>
      );
    }

    const handleUpdateStatus = async (newStatus) => {
      try {
        const formData = new FormData();
        formData.append("title", selectedReport.title || "");
        formData.append("category", selectedReport.category || "");
        formData.append("location", selectedReport.location || "");
        formData.append("description", selectedReport.description || "");
        formData.append("status", newStatus);
        if (user && user.id_admin) {
          formData.append("adminId", user.id_admin);
        }

        const updatedResponse = await updateReport(selectedReport.id, formData);
        await fetchReports();

        if (updatedResponse && updatedResponse.data) {
          setSelectedReport(updatedResponse.data);
        }
        setShowStatusDropdown(false);
      } catch (err) {
        console.error(err);
        alert("Gagal mengupdate status laporan");
      }
    };

    const handleDelete = () => {
      setShowDeleteModal(true);
    };

    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('kelola')}>Daftar Laporan</span>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
          <span style={{ color: '#1a3252', fontWeight: 700 }}>ID #LPR-2026-{selectedReport.id}</span>
        </div>

        <div className="list-layout">
          <div className="list-main">
            <div className="detail-card">
              <div className="detail-top">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <span className={`badge-status ${getStatusClass(selectedReport.status)}`}>
                      {selectedReport.status?.toUpperCase()}
                    </span>
                    {selectedReport.status?.toLowerCase() !== "pending" && selectedReport.admin && (
                      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        oleh {selectedReport.admin.username}
                      </span>
                    )}
                  </div>
                  <h2 className="detail-title">{selectedReport.title}</h2>
                  <div className="detail-meta">Dilaporkan oleh: <strong>{selectedReport.user?.name || "User"}</strong> • {formatTanggal(selectedReport.createdAt)}</div>
                </div>

                <div className="detail-category">
                  <span>Tingkat Kerusakan</span>
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
              <div style={{ minHeight: '150px' }}>
                {selectedReport.photo ? (
                  <img
                    src={selectedReport.photo}
                    alt="Bukti"
                    style={{ width: '100%', borderRadius: '12px', marginTop: '16px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', marginTop: '16px' }}>
                    <i className="far fa-image" style={{ fontSize: '3rem' }}></i>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="list-side">
            <div className="detail-header-actions" style={{ gap: '16px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <button className="btn-edit-report" style={{ width: '100%', justifyContent: 'center', borderColor: '#f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', padding: '16px' }} onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                  <i className="fas fa-pen" style={{ color: '#0f766e' }}></i> <span style={{ color: '#0f766e' }}>Ubah<br />Status</span>
                </button>
                {showStatusDropdown && (
                  <div className="status-dropdown-menu">
                    <div className="status-dropdown-item" onClick={() => handleUpdateStatus("pending")}>
                      <span style={{ color: '#475569' }}>Pending</span>
                      <div className="status-dot" style={{ backgroundColor: '#475569' }}></div>
                    </div>
                    <div className="status-dropdown-item" onClick={() => handleUpdateStatus("diproses")}>
                      <span style={{ color: '#c2410c' }}>Diproses</span>
                      <div className="status-dot" style={{ backgroundColor: '#c2410c' }}></div>
                    </div>
                    <div className="status-dropdown-item" onClick={() => handleUpdateStatus("selesai")}>
                      <span style={{ color: '#0f766e' }}>Selesai</span>
                      <div className="status-dot" style={{ backgroundColor: '#0f766e' }}></div>
                    </div>
                    <div className="status-dropdown-item" onClick={() => handleUpdateStatus("ditolak")}>
                      <span style={{ color: '#b91c1c' }}>Ditolak</span>
                      <div className="status-dot" style={{ backgroundColor: '#b91c1c' }}></div>
                    </div>
                  </div>
                )}
              </div>
              <button className="btn-delete-report" style={{ flex: 1, justifyContent: 'center', padding: '16px' }} onClick={handleDelete}>
                <i className="fas fa-trash-alt"></i> Hapus<br />Laporan
              </button>
            </div>

            <div className="side-panel" style={{ backgroundColor: 'white', marginTop: '4px' }}>
              <h3 style={{ fontSize: '1.1rem' }}><i className="fas fa-clock-rotate-left" style={{ color: '#0f766e' }}></i> Perkembangan Laporan</h3>
              <div className="detail-timeline" style={{ marginTop: '24px' }}>
                <div className="dt-item">
                  <div className="dt-icon active"><i className="fas fa-wrench"></i></div>
                  <div className="dt-content">
                    <h4>{selectedReport.status?.toUpperCase()}</h4>
                    <span>{formatTanggal(selectedReport.createdAt)}</span>
                    <div className="dt-box">
                      Status laporan saat ini: {selectedReport.status?.toUpperCase()}
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

  const renderStatistikLaporan = () => {
    const now = new Date();
    const filteredReports = reports.filter(r => {
      if (statistikPeriod === "semua") return true;
      const reportDate = new Date(r.createdAt);
      if (statistikPeriod === "hari_ini") {
        return reportDate.toDateString() === now.toDateString();
      }
      if (statistikPeriod === "minggu_ini") {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        firstDayOfWeek.setHours(0, 0, 0, 0);
        return reportDate >= firstDayOfWeek;
      }
      if (statistikPeriod === "bulan_ini") {
        return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
      }
      if (statistikPeriod === "tahun_ini") {
        return reportDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    const total = filteredReports.length;
    const selesai = filteredReports.filter(r => r.status?.toLowerCase() === "selesai").length;
    const diproses = filteredReports.filter(r => r.status?.toLowerCase() === "diproses").length;
    const pending = filteredReports.filter(r => r.status?.toLowerCase() === "pending").length;
    const ditolak = filteredReports.filter(r => r.status?.toLowerCase() === "ditolak").length;

    const berat = filteredReports.filter(r => r.category?.toLowerCase() === "berat").length;
    const sedang = filteredReports.filter(r => r.category?.toLowerCase() === "sedang").length;
    const ringan = filteredReports.filter(r => r.category?.toLowerCase() === "ringan").length;

    const persentaseSelesai = total === 0 ? 0 : ((selesai / total) * 100).toFixed(1);

    // Status percentage for donut
    const pctSelesai = total === 0 ? 0 : Math.round((selesai / total) * 100);
    const pctProses = total === 0 ? 0 : Math.round((diproses / total) * 100);
    const pctPending = total === 0 ? 0 : Math.round((pending / total) * 100);
    const pctDitolak = total === 0 ? 0 : Math.round((ditolak / total) * 100);

    // Kategori max width calculation
    const maxKategori = Math.max(berat, sedang, ringan, 1);

    return (
      <>
        <div className="admin-header">
          <div>
            <h1 className="admin-title" style={{ fontSize: '2.2rem' }}>Resolusi Fasilitas</h1>
            <p className="admin-desc" style={{ marginTop: '8px', color: '#475569', lineHeight: 1.5 }}>Analisis pemeliharaan infrastruktur kampus Universitas Diponegoro<br />Data diperbarui secara real-time berdasarkan laporan masuk.</p>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              className="btn-dark-blue"
              onClick={() => setOpenDropdown(openDropdown === 'periode' ? null : 'periode')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px' }}
            >
              <i className="far fa-calendar-alt"></i>
              {statistikPeriod === 'semua' && 'Semua Waktu'}
              {statistikPeriod === 'hari_ini' && 'Hari Ini'}
              {statistikPeriod === 'minggu_ini' && 'Minggu Ini'}
              {statistikPeriod === 'bulan_ini' && 'Bulan Ini'}
              {statistikPeriod === 'tahun_ini' && 'Tahun Ini'}
              <i className={`fas fa-chevron-${openDropdown === 'periode' ? 'up' : 'down'}`} style={{ marginLeft: '4px', fontSize: '0.8rem' }}></i>
            </button>

            {openDropdown === 'periode' && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#1a3252', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', padding: '8px', zIndex: 50, width: '200px', border: '1px solid #274b7a' }}>
                {[
                  { value: 'semua', label: 'Semua Waktu' },
                  { value: 'hari_ini', label: 'Hari Ini' },
                  { value: 'minggu_ini', label: 'Minggu Ini' },
                  { value: 'bulan_ini', label: 'Bulan Ini' },
                  { value: 'tahun_ini', label: 'Tahun Ini' }
                ].map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => { setStatistikPeriod(opt.value); setOpenDropdown(null); }}
                    style={{ padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'white', background: statistikPeriod === opt.value ? '#274b7a' : 'transparent', fontWeight: statistikPeriod === opt.value ? '700' : '500', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}
                    onMouseEnter={(e) => { if (statistikPeriod !== opt.value) { e.target.style.background = '#1e3a5f'; } }}
                    onMouseLeave={(e) => { if (statistikPeriod !== opt.value) { e.target.style.background = 'transparent'; } }}
                  >
                    {opt.label}
                    {statistikPeriod === opt.value && <i className="fas fa-check" style={{ fontSize: '0.8rem', color: '#a5f3fc' }}></i>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="stats-layout">
          <div className="stats-main">
            <div className="stats-row">
              <div className="stat-card-white">
                <div className="stat-label-light">EFISIENSI PENYELESAIAN</div>
                <div className="stat-val-huge">{persentaseSelesai}%</div>
                <div className="stat-trend green"><i className="fas fa-arrow-trend-up"></i> Data Real-time</div>
                <i className="fas fa-check-circle bg-icon"></i>
              </div>
              <div className="stat-card-dark">
                <div className="stat-label-light" style={{ color: '#94a3b8' }}>TOTAL LAPORAN</div>
                <div className="stat-val-huge" style={{ color: 'white' }}>{total}</div>
                <div className="stat-desc-dark">Keseluruhan<br />Laporan</div>
              </div>
            </div>

            <div className="stat-card-white mt-20">
              <div className="card-header-flex">
                <h3 className="card-title-sm">Tingkat Kerusakan</h3>
                <i className="fas fa-chart-bar" style={{ color: '#cbd5e1' }}></i>
              </div>

              <div className="bar-chart-container">
                <div className="bar-item">
                  <div className="bar-label-row">
                    <span className="bar-label">Berat</span>
                    <span className="bar-val">{berat} Laporan</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(berat / maxKategori) * 100}%`, backgroundColor: '#1a3252' }}></div>
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label-row">
                    <span className="bar-label">Sedang</span>
                    <span className="bar-val">{sedang} Laporan</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(sedang / maxKategori) * 100}%`, backgroundColor: '#1a3252' }}></div>
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label-row">
                    <span className="bar-label">Ringan</span>
                    <span className="bar-val">{ringan} Laporan</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(ringan / maxKategori) * 100}%`, backgroundColor: '#1a3252' }}></div>
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
                <div className="donut-chart" style={{
                  background: `conic-gradient(#0f766e 0% ${pctSelesai}%, #fb923c ${pctSelesai}% ${pctSelesai + pctProses}%, #1a3252 ${pctSelesai + pctProses}% ${pctSelesai + pctProses + pctPending}%, #ef4444 ${pctSelesai + pctProses + pctPending}% 100%)`
                }}>
                  <div className="donut-hole">
                    <div className="donut-val">{selesai}</div>
                    <div className="donut-label">SELESAI</div>
                  </div>
                </div>
              </div>

              <div className="donut-legend">
                <div className="legend-item">
                  <div className="legend-marker" style={{ backgroundColor: '#0f766e' }}></div>
                  <span className="legend-label">Selesai</span>
                  <span className="legend-val">{pctSelesai}%</span>
                </div>
                <div className="legend-item">
                  <div className="legend-marker" style={{ backgroundColor: '#fb923c' }}></div>
                  <span className="legend-label">Dalam Proses</span>
                  <span className="legend-val">{pctProses}%</span>
                </div>
                <div className="legend-item">
                  <div className="legend-marker" style={{ backgroundColor: '#1a3252' }}></div>
                  <span className="legend-label">Pending</span>
                  <span className="legend-val">{pctPending}%</span>
                </div>
                <div className="legend-item">
                  <div className="legend-marker" style={{ backgroundColor: '#ef4444' }}></div>
                  <span className="legend-label">Ditolak</span>
                  <span className="legend-val">{pctDitolak}%</span>
                </div>
              </div>
            </div>
          </div>
        </div >

        {/* <div className="stat-card-white mt-20">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title-sm">Tren Laporan Bulanan</h3>
              <p className="card-desc-sm">Fluktuasi volume laporan (Data Simulasi)</p>
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
        </div> */}
      </>
    );
  };

  const renderProfil = () => (
    <div className="profile-layout">
      <h2 className="profile-title">Profil Saya</h2>
      <div className="profile-card">
        <div className="profile-avatar-container">
          {user?.photo ? (
            <img src={user.photo} alt="avatar" className="profile-avatar-img" />
          ) : (
            <i className="far fa-user-circle profile-avatar"></i>
          )}
        </div>

        <div className="profile-form">
          <div className="profile-field">
            <label>NAMA LENGKAP</label>
            <div className="profile-input-readonly">{user?.username || "Admin"}</div>
          </div>

          <div className="profile-field">
            <label>ALAMAT EMAIL</label>
            <div className="profile-input-readonly">{user?.email || "-"}</div>
          </div>

          <div className="profile-field">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>KATA SANDI</label>
              <span className="profile-link" style={{ cursor: 'pointer' }} onClick={() => setActiveView('editProfil')}>Ubah Kata Sandi</span>
            </div>
            <div className="profile-input-wrapper">
              <input type={showPassword ? "text" : "password"} value={user?.password || "•••••••••••"} readOnly className="profile-input" />
              <i
                className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} profile-input-icon`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <button className="btn-profile-primary" onClick={() => setActiveView('editProfil')}>
            <i className="fas fa-pen" style={{ marginRight: '8px' }}></i> EDIT PROFIL
          </button>
        </div>
      </div>
    </div>
  );

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
                style={{ cursor: 'pointer' }}
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
                style={{ cursor: 'pointer' }}
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
          </div>
          <div className="topbar-user" onClick={() => setActiveView('profil')} style={{ cursor: 'pointer' }}>
            {user?.photo ? (
              <img src={user.photo} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <i className="far fa-user-circle"></i>
            )}
            <span style={{ marginLeft: '8px' }}>{user?.username || "Admin"}</span>
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
                try {
                  setShowDeleteModal(false);
                  await deleteReport(selectedReport.id);
                  await fetchReports();
                  setActiveView("kelola");
                } catch (err) {
                  console.error(err);
                  alert("Gagal menghapus laporan");
                }
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

      {showProfileSuccess && (
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

            <h2 style={{ color: '#1a3252', marginBottom: '12px', fontSize: '1.25rem', fontWeight: 800 }}>Profil Diperbarui!</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '32px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              Perubahan profil Anda telah berhasil disimpan.
            </p>
            <button
              className="btn-login"
              style={{ width: '100%', padding: '14px', background: '#1a3252', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' }}
              onClick={() => {
                setShowProfileSuccess(false);
                setActiveView('profil');
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

export default AdminDashboard;
