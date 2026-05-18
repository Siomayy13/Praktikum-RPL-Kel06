import React, { useState, useEffect } from 'react';
import { updateReport } from '../../api/api';
import { compressImage } from '../../utils/imageCompressor';
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

function EditReportView({ selectedReport, setSelectedReport, fetchReports, setActiveView, setModalState }) {
  const [editData, setEditData] = useState({ title: '', category: '', location: '', description: '', photo: null });
  const [editKategori, setEditKategori] = useState('');
  const [updating, setUpdating] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handlePhotoSelect = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setPhotoError('Hanya file JPEG, JPG, dan PNG yang bisa diunggah');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Gambar maksimal berukuran 5MB');
      return;
    }
    setPhotoError('');
    setEditData((prev) => ({ ...prev, photo: file }));
  };

  useEffect(() => {
    if (selectedReport) {
      setEditData({
        title: selectedReport.title || '',
        category: selectedReport.category || '',
        location: selectedReport.location || '',
        description: selectedReport.description || '',
        photo: null,
      });
      setEditKategori(selectedReport.category || '');
    }
  }, [selectedReport]);

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
    if (updating) return;
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', editData.title);
      formData.append('category', editKategori);
      formData.append('location', editData.location);
      formData.append('description', editData.description);
      if (editData.photo) {
        const compressed = await compressImage(editData.photo);
        formData.append('photo', compressed);
      }

      const updatedResponse = await updateReport(selectedReport.id, formData);
      await fetchReports();

      if (updatedResponse?.data) {
        setSelectedReport(updatedResponse.data);
      }

      setModalState({
        isOpen: true,
        title: 'Laporan Berhasil Diperbarui',
        message: 'Laporan fasilitas kini telah diperbarui.\nCek detail laporan anda pada halaman daftar laporan.',
        onCloseAction: () => setActiveView('detail'),
      });
    } catch (err) {
      console.error(err);
      alert('Gagal update');
    } finally {
      setUpdating(false);
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
            <Dropdown
              menu={{
                items: ['Ringan', 'Sedang', 'Berat'].map((opt) => ({
                  key: opt,
                  label: opt,
                  onClick: () => setEditKategori(opt),
                })),
                selectedKeys: [editKategori],
              }}
              trigger={['click']}
            >
              <button
                type="button"
                className="dash-input"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: '#fff', textAlign: 'left' }}
              >
                <span style={{ color: editKategori ? '#1a3252' : '#94a3b8' }}>
                  {editKategori || 'Pilih salah satu'}
                </span>
                <DownOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
              </button>
            </Dropdown>
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
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'block' }}>
          Dokumentasi Pendukung (Foto)
        </label>
        <div
          className={`upload-box${isDragging ? ' dragging' : ''}`}
          onClick={() => document.getElementById('editPhotoInput').click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handlePhotoSelect(e.dataTransfer.files[0]); }}
          style={{ cursor: 'pointer' }}
        >
          <div className="upload-icon"><i className={isDragging ? 'fas fa-download' : 'fas fa-upload'}></i></div>
          <h4>{isDragging ? 'Lepas untuk mengunggah' : 'Pilih foto atau tarik ke sini'}</h4>
          <p>Mendukung JPG, PNG, atau WEBP (Maksimal 5MB)</p>
          <input
            id="editPhotoInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            style={{ display: 'none' }}
            onChange={(e) => handlePhotoSelect(e.target.files[0])}
          />
        </div>
        {photoError && (
          <div style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="fas fa-circle-exclamation"></i> {photoError}
          </div>
        )}
        <div className="upload-preview-grid">
          {editData.photo ? (
            <div className="preview-box">
              <img src={URL.createObjectURL(editData.photo)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : selectedReport.photo ? (
            <div className="preview-box">
              <img src={selectedReport.photo} alt="lama" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div className="preview-box"><i className="far fa-image"></i></div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={() => setActiveView('detail')} disabled={updating}>Batalkan</button>
        <button className="btn-submit" onClick={handleUpdate} disabled={updating}>
          <i className={updating ? 'fas fa-spinner fa-spin' : 'fas fa-floppy-disk'}></i>
          {updating ? ' Menyimpan...' : ' Update'}
        </button>
      </div>
    </>
  );
}

export default EditReportView;
