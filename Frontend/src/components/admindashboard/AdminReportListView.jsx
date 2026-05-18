import React, { useState } from 'react';
import { getStatusClass, formatTimeAgo } from '../../utils/formatters';
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

function AdminReportListView({ reports, onViewDetail }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterTanggal, setFilterTanggal] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const total = reports.length;
  const diproses = reports.filter(r => r.status?.toLowerCase() === 'diproses').length;
  const selesai = reports.filter(r => r.status?.toLowerCase() === 'selesai').length;

  const filtered = filterByPeriod(reports, filterTanggal).filter(r => {
    const matchSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = filterKategori === 'semua' || r.category?.toLowerCase() === filterKategori;
    const matchStatus   = filterStatus === 'semua'   || r.status?.toLowerCase()   === filterStatus;
    return matchSearch && matchKategori && matchStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const hasActiveFilter = filterKategori !== 'semua' || filterStatus !== 'semua' || filterTanggal !== 'semua';

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentReports = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetPage = () => setCurrentPage(1);

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
                  <a href="#" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
                    onClick={(e) => { e.preventDefault(); onViewDetail(r); }}>
                    Lihat Detail <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <div className="page-info">Menampilkan {currentReports.length} dari {filtered.length} laporan</div>
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
}

export default AdminReportListView;
