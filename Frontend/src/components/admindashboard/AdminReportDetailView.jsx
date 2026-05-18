import React, { useState } from 'react';
import { updateReport, deleteReport } from '../../api/api';
import { getStatusClass } from '../../utils/formatters';
import { Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const formatTanggal = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB';

function AdminReportDetailView({ selectedReport, setSelectedReport, user, fetchReports, setActiveView, setModalState }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null); // key status yang sedang diupdate
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
    );
  }

  const handleUpdateStatus = async (newStatus) => {
    if (updatingStatus) return;
    setUpdatingStatus(newStatus);
    try {
      const formData = new FormData();
      formData.append('title', selectedReport.title || '');
      formData.append('category', selectedReport.category || '');
      formData.append('location', selectedReport.location || '');
      formData.append('description', selectedReport.description || '');
      formData.append('status', newStatus);
      if (user?.id_admin) formData.append('adminId', user.id_admin);

      const updatedResponse = await updateReport(selectedReport.id, formData);
      await fetchReports();
      if (updatedResponse?.data) setSelectedReport(updatedResponse.data);
      setDropdownOpen(false);
      messageApi
        .open({ type: 'loading', content: 'Memperbarui status laporan...', duration: 1 })
        .then(() => messageApi.success(`Status berhasil diubah ke "${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}"`, 2));
    } catch (err) {
      console.error(err);
      messageApi
        .open({ type: 'loading', content: 'Memperbarui status laporan...', duration: 0.5 })
        .then(() => messageApi.error('Gagal mengupdate status laporan', 2));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteReport(selectedReport.id);
      await fetchReports();
      setShowDeleteModal(false);
      setModalState({
        isOpen: true,
        title: 'Laporan Dihapus',
        message: 'Laporan telah berhasil dihapus permanen dari sistem.',
        onCloseAction: () => setActiveView('kelola'),
      });
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus laporan');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {contextHolder}
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
                  {selectedReport.status?.toLowerCase() !== 'pending' && selectedReport.admin && (
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                      oleh {selectedReport.admin.username}
                    </span>
                  )}
                </div>
                <h2 className="detail-title">{selectedReport.title}</h2>
                <div className="detail-meta">
                  Dilaporkan oleh: <strong>{selectedReport.user?.name || 'User'}</strong> • {formatTanggal(selectedReport.createdAt)}
                </div>
              </div>
              <div className="detail-category">
                <span>Tingkat Kerusakan</span>
                <strong>{selectedReport.category}</strong>
              </div>
            </div>

            <div className="detail-section-title">Deskripsi Lengkap</div>
            <div className="detail-box">{selectedReport.description}</div>

            <div className="detail-section-title">
              <i className="fas fa-location-dot" style={{ color: '#0f766e', marginRight: '6px' }}></i>
              Lokasi Detail
            </div>
            <div className="loc-detail"><strong>{selectedReport.location}</strong></div>
          </div>

          <div className="detail-card">
            <div className="detail-section-title">Bukti Foto</div>
            <div style={{ minHeight: '150px' }}>
              {selectedReport.photo ? (
                <img
                  src={selectedReport.photo}
                  alt="Bukti"
                  style={{ width: '100%', borderRadius: '12px', marginTop: '16px', objectFit: 'cover', cursor: 'zoom-in' }}
                  onClick={() => setPhotoPreview(true)}
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
            <div style={{ flex: 1 }}>
              <Dropdown
                open={dropdownOpen}
                onOpenChange={(val) => { if (!updatingStatus) setDropdownOpen(val); }}
                menu={{
                  items: [
                    { key: 'pending',  label: 'Pending',  icon: updatingStatus === 'pending'  ? <i className="fas fa-spinner fa-spin" style={{ color: '#475569' }} /> : <i className="fas fa-clock"        style={{ color: '#475569' }} /> },
                    { key: 'diproses', label: 'Diproses', icon: updatingStatus === 'diproses' ? <i className="fas fa-spinner fa-spin" style={{ color: '#c2410c' }} /> : <i className="fas fa-gear"         style={{ color: '#c2410c' }} /> },
                    { key: 'selesai',  label: 'Selesai',  icon: updatingStatus === 'selesai'  ? <i className="fas fa-spinner fa-spin" style={{ color: '#0f766e' }} /> : <i className="fas fa-circle-check" style={{ color: '#0f766e' }} /> },
                    { key: 'ditolak',  label: 'Ditolak',  icon: updatingStatus === 'ditolak'  ? <i className="fas fa-spinner fa-spin" style={{ color: '#b91c1c' }} /> : <i className="fas fa-circle-xmark" style={{ color: '#b91c1c' }} />, danger: true },
                  ],
                  onClick: ({ key }) => handleUpdateStatus(key),
                  selectedKeys: [selectedReport.status?.toLowerCase()],
                }}
                trigger={['click']}
                placement="bottomLeft"
              >
                <button
                  type="button"
                  className="btn-edit-report"
                  style={{ width: '100%', justifyContent: 'center', borderColor: '#f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                >
                  <i className="fas fa-pen" style={{ color: '#0f766e' }}></i>
                  <span style={{ color: '#0f766e' }}>Ubah<br />Status</span>
                  <DownOutlined style={{ fontSize: '10px', color: '#0f766e', marginLeft: '4px' }} />
                </button>
              </Dropdown>
            </div>
            <button className="btn-delete-report" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowDeleteModal(true)}>
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
                  <div className="dt-box">Status laporan saat ini: {selectedReport.status?.toUpperCase()}</div>
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
            <h4 style={{ color: '#1a3252', fontSize: '0.9rem', margin: '0 0 8px 0' }}>Butuh Bantuan Segera?</h4>
            <p className="help-text">Jika laporan bersifat darurat (misal: korsleting listrik), silakan hubungi hotline kampus.</p>
            <div className="help-phone"><i className="fas fa-phone-alt"></i> 0878-123-456</div>
          </div>
        </div>
      </div>

      {photoPreview && (
        <div className="photo-lightbox-overlay" onClick={() => setPhotoPreview(false)}>
          <img src={selectedReport.photo} alt="preview" className="photo-lightbox-img" />
        </div>
      )}

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <div className="delete-modal-icon"><i className="fas fa-trash-alt"></i></div>
            <h2 className="delete-modal-title">Hapus Laporan?</h2>
            <p className="delete-modal-text">Apakah Anda yakin ingin menghapus laporan ini?<br />Tindakan ini tidak dapat dibatalkan.</p>
            <button className="delete-modal-btn-confirm" onClick={handleDelete} disabled={deleting}>
              <i className={deleting ? 'fas fa-spinner fa-spin' : 'fas fa-trash-alt'} style={{ marginRight: '6px' }}></i>
              {deleting ? 'Menghapus...' : 'Hapus Permanen'}
            </button>
            <button className="delete-modal-btn-cancel" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Batal</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminReportDetailView;
