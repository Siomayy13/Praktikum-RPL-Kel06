import React, { useState } from 'react';
import { deleteReport, updateReport } from '../../api/api';
import { getStatusClass, getStatusText, formatTanggal } from '../../utils/formatters';

function ReportDetailView({ selectedReport, user, fetchReports, setActiveView, setModalState }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(false);

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

  const handleBatalkan = async () => {
    try {
      setLoadingAction(true);
      const formData = new FormData();
      formData.append('title', selectedReport.title || '');
      formData.append('category', selectedReport.category || '');
      formData.append('location', selectedReport.location || '');
      formData.append('description', selectedReport.description || '');
      formData.append('status', 'dibatalkan');
      await updateReport(selectedReport.id, formData);
      await fetchReports();
      setShowDeleteModal(false);
      setModalState({
        isOpen: true,
        title: 'Laporan Dibatalkan',
        message: 'Laporan Anda telah berhasil dibatalkan.',
        onCloseAction: () => setActiveView('daftar'),
      });
    } catch (error) {
      console.error(error);
      alert('Gagal membatalkan laporan');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleHapusPermanent = async () => {
    try {
      setLoadingAction(true);
      await deleteReport(selectedReport.id);
      await fetchReports();
      setShowDeleteModal(false);
      if (setModalState) {
        setModalState({
          isOpen: true,
          title: 'Laporan Dihapus',
          message: 'Riwayat laporan telah berhasil dihapus dari sistem.',
          onCloseAction: () => setActiveView('daftar'),
        });
      } else {
        setActiveView('daftar');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus laporan');
    } finally {
      setLoadingAction(false);
    }
  };

  const status = selectedReport.status?.toLowerCase();
  const isLocked = ['diproses', 'selesai'].includes(status);
  const isCancelled = status === 'dibatalkan';
  const isDeleteOnly = isCancelled || status === 'ditolak';

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('daftar')}>Daftar Laporan</span>
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
                    {getStatusText(selectedReport.status)}
                  </span>
                  {selectedReport.status?.toLowerCase() !== 'pending' && selectedReport.admin && (
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                      oleh {selectedReport.admin.username}
                    </span>
                  )}
                </div>
                <h2 className="detail-title">{selectedReport.title}</h2>
                <div className="detail-meta">
                  Dilaporkan oleh: <strong>{user?.name || 'User'}</strong> • {formatTanggal(selectedReport.createdAt)}
                </div>
              </div>
              <div className="detail-category">
                <span>Kategori</span>
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
            <div className="upload-preview-grid" style={{ marginTop: '10px' }}>
              {selectedReport.photo ? (
                <img
                  src={selectedReport.photo}
                  alt="report"
                  style={{ width: '150px', borderRadius: '8px', objectFit: 'cover', cursor: 'zoom-in' }}
                  onClick={() => setPhotoPreview(true)}
                />
              ) : (
                <div className="preview-box"><i className="far fa-image"></i></div>
              )}
            </div>
          </div>
        </div>

        <div className="list-side">
          <div className="detail-header-actions">
            {isDeleteOnly ? (
              <button className="btn-delete-report" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowDeleteModal(true)}>
                <i className="fas fa-trash-alt"></i> Hapus Riwayat Laporan
              </button>
            ) : isLocked ? (
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
                <i className="fas fa-lock"></i>
                Laporan tidak dapat diubah karena sudah {status === 'selesai' ? 'selesai' : 'diproses'}
              </div>
            ) : (
              <>
                <button className="btn-edit-report" onClick={() => setActiveView('edit')} style={{ flex: 1, justifyContent: 'center' }}>
                  <i className="fas fa-pen"></i> Edit Laporan
                </button>
                <button className="btn-delete-report" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowDeleteModal(true)}>
                  <i className="fas fa-trash-alt"></i> Batalkan Laporan
                </button>
              </>
            )}
          </div>

          <div className="side-panel" style={{ backgroundColor: 'white' }}>
            <h3><i className="fas fa-clock-rotate-left"></i> Perkembangan Laporan</h3>
            <div className="detail-timeline">
              <div className="dt-item">
                <div className="dt-icon active"><i className="fas fa-wrench"></i></div>
                <div className="dt-content">
                  <h4>{getStatusText(selectedReport.status)}</h4>
                  <span>{formatTanggal(selectedReport.createdAt)}</span>
                  <div className="dt-box">Status laporan saat ini: {getStatusText(selectedReport.status)}</div>
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
            <div className="delete-modal-icon">
              <i className={isDeleteOnly ? 'fas fa-trash-alt' : 'fas fa-ban'}></i>
            </div>
            <h2 className="delete-modal-title">
              {isDeleteOnly ? 'Hapus Riwayat Laporan?' : 'Batalkan Laporan?'}
            </h2>
            <p className="delete-modal-text">
              {isDeleteOnly
                ? <>Laporan akan dihapus permanen dari sistem.<br />Tindakan ini tidak dapat dibatalkan.</>
                : <>Laporan akan ditandai sebagai <strong>dibatalkan</strong>.<br />Anda masih bisa menghapus riwayatnya nanti.</>
              }
            </p>
            <button className="delete-modal-btn-confirm" onClick={isDeleteOnly ? handleHapusPermanent : handleBatalkan} disabled={loadingAction}>
              <i className={loadingAction ? 'fas fa-spinner fa-spin' : (isDeleteOnly ? 'fas fa-trash-alt' : 'fas fa-ban')} style={{ marginRight: '6px' }}></i>
              {loadingAction ? 'Memproses...' : (isDeleteOnly ? 'Hapus Permanen' : 'Ya, Batalkan')}
            </button>
            <button className="delete-modal-btn-cancel" onClick={() => setShowDeleteModal(false)} disabled={loadingAction}>Kembali</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportDetailView;
