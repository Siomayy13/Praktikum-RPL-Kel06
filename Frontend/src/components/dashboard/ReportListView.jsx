import React, { useState } from 'react';
import { getStatusClass, formatDate } from '../../utils/formatters';
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const periodOptions = [
  { value: 'semua',      label: 'Semua Waktu' },
  { value: 'hari_ini',   label: 'Hari Ini' },
  { value: 'minggu_ini', label: 'Minggu Ini' },
  { value: 'bulan_ini',  label: 'Bulan Ini' },
  { value: 'tahun_ini',  label: 'Tahun Ini' },
];

function filterByPeriod(reports, period) {
  const now = new Date();
  return reports.filter(r => {
    const d = new Date(r.createdAt);
    if (period === 'hari_ini') return d.toDateString() === now.toDateString();
    if (period === 'minggu_ini') {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return d >= start;
    }
    if (period === 'bulan_ini') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === 'tahun_ini') return d.getFullYear() === now.getFullYear();
    return true;
  });
}

function ReportListView({ reports, onBuatLaporan, onViewDetail }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterTanggal, setFilterTanggal] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const total = reports.length;
  const diproses = reports.filter(r => r.status?.toLowerCase() === 'diproses').length;
  const selesai = reports.filter(r => r.status?.toLowerCase() === 'selesai').length;

  const resetPage = () => setCurrentPage(1);

  const filtered = filterByPeriod(reports, filterTanggal)
    .filter(r => {
      const matchSearch =
        r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKategori = filterKategori === 'semua' || r.category?.toLowerCase() === filterKategori;
      const matchStatus   = filterStatus === 'semua'   || r.status?.toLowerCase()   === filterStatus;
      return matchSearch && matchKategori && matchStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const hasActiveFilter = filterKategori !== 'semua' || filterStatus !== 'semua' || filterTanggal !== 'semua';

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="page-title-row">
        <h2 className="page-title" style={{ margin: 0 }}>Daftar Laporan Anda</h2>
        <button className="buat-modal-btn-submit" onClick={onBuatLaporan}>
          <i className="fas fa-plus"></i> Buat Laporan
        </button>
      </div>
      <p className="page-desc" style={{ maxWidth: '700px' }}>
        Pantau perkembangan setiap laporan fasilitas yang telah Anda ajukan.
      </p>

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
            <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0 }}>Riwayat Aktivitas</h3>
              <div className="search-container" style={{ margin: '0 16px', flex: 1, maxWidth: '380px' }}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Cari laporan..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Filter Tingkat Kerusakan */}
                <Dropdown
                  menu={{
                    items: [
                      { key: 'semua',  label: 'Semua Tingkat' },
                      { key: 'ringan', label: 'Ringan' },
                      { key: 'sedang', label: 'Sedang' },
                      { key: 'berat',  label: 'Berat' },
                    ],
                    selectedKeys: [filterKategori],
                    onClick: ({ key }) => { setFilterKategori(key); resetPage(); },
                  }}
                  trigger={['click']}
                >
                  <button type="button" className={`filter-btn${filterKategori !== 'semua' ? ' active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {filterKategori === 'semua' ? 'Kerusakan' : filterKategori.charAt(0).toUpperCase() + filterKategori.slice(1)}
                    <DownOutlined style={{ fontSize: '10px' }} />
                  </button>
                </Dropdown>

                {/* Filter Tanggal */}
                <Dropdown
                  menu={{
                    items: periodOptions.map(o => ({ key: o.value, label: o.label })),
                    selectedKeys: [filterTanggal],
                    onClick: ({ key }) => { setFilterTanggal(key); resetPage(); },
                  }}
                  trigger={['click']}
                >
                  <button type="button" className={`filter-btn${filterTanggal !== 'semua' ? ' active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {periodOptions.find(o => o.value === filterTanggal)?.label}
                    <DownOutlined style={{ fontSize: '10px' }} />
                  </button>
                </Dropdown>

                {/* Filter Status */}
                <Dropdown
                  menu={{
                    items: [
                      { key: 'semua',      label: 'Semua Status' },
                      { key: 'pending',    label: 'Pending' },
                      { key: 'diproses',   label: 'Diproses' },
                      { key: 'selesai',    label: 'Selesai' },
                      { key: 'ditolak',    label: 'Ditolak' },
                      { key: 'dibatalkan', label: 'Dibatalkan' },
                    ],
                    selectedKeys: [filterStatus],
                    onClick: ({ key }) => { setFilterStatus(key); resetPage(); },
                  }}
                  trigger={['click']}
                >
                  <button type="button" className={`filter-btn${filterStatus !== 'semua' ? ' active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {filterStatus === 'semua' ? 'Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    <DownOutlined style={{ fontSize: '10px' }} />
                  </button>
                </Dropdown>

                {/* Reset */}
                {hasActiveFilter && (
                  <button type="button" className="filter-btn" style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                    onClick={() => { setFilterKategori('semua'); setFilterStatus('semua'); setFilterTanggal('semua'); resetPage(); }}>
                    <i className="fas fa-xmark" style={{ marginRight: '4px' }}></i> Reset
                  </button>
                )}
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
                {currentReports.map(r => (
                  <tr key={r.id}>
                    <td className="td-id">#LPR-2026-{r.id}</td>
                    <td>
                      <h4 className="td-title">{r.title}</h4>
                      <p className="td-desc">{r.category}</p>
                    </td>
                    <td className="td-time">{formatDate(r.createdAt)}</td>
                    <td>
                      <span className={`badge-status ${getStatusClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td>
                      <a href="#" className="btn-link" onClick={(e) => { e.preventDefault(); onViewDetail(r); }}>
                        Lihat Detail <i className="fas fa-chevron-right" style={{ marginLeft: '4px' }}></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <div className="page-info">
                Menampilkan {currentReports.length} dari {filtered.length} laporan
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
                    className={`page-num ${currentPage === num ? 'active' : ''}`}
                    onClick={() => setCurrentPage(num)}
                    style={{ border: currentPage === num ? 'none' : '1px solid #e2e8f0', backgroundColor: currentPage === num ? '' : 'white', cursor: 'pointer' }}
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
      </div>
    </>
  );
}

export default ReportListView;
