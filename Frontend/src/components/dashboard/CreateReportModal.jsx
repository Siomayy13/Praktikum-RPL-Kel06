import React, { useState } from 'react';
import { createReport } from '../../api/api';
import { compressImage } from '../../utils/imageCompressor';
import { Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

function CreateReportModal({ userId, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', category: '', location: '', description: '', photo: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
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
    setForm((prev) => ({ ...prev, photo: file }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!form.title.trim() || !form.category || !form.location.trim() || !form.description.trim() || !form.photo) {
      setFormError('Lengkapi data untuk melapor');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('location', form.location);
      formData.append('description', form.description);
      formData.append('userId', userId);
      formData.append('status', 'pending');
      if (form.photo) {
        const compressed = await compressImage(form.photo);
        formData.append('photo', compressed);
      }

      await createReport(formData);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Gagal kirim laporan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="buat-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="buat-modal">
        <div className="buat-modal-header">
          <div>
            <h2>Buat Laporan Baru</h2>
            <p>Sampaikan kerusakan fasilitas kampus secara detail</p>
          </div>
          <button className="buat-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="buat-modal-body">
          <div className="buat-modal-left">
            <div className="buat-modal-field">
              <label>Judul Laporan</label>
              <input
                type="text"
                className="buat-modal-input"
                placeholder="Misal: Proyektor bermasalah di Ruang Seminar 4"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="buat-modal-row">
              <div className="buat-modal-field">
                <label>Tingkat Kerusakan</label>
                <Dropdown
                  menu={{
                    items: ['Ringan', 'Sedang', 'Berat'].map((opt) => ({
                      key: opt,
                      label: opt,
                      onClick: () => setForm({ ...form, category: opt }),
                    })),
                    selectedKeys: [form.category],
                  }}
                  trigger={['click']}
                >
                  <button
                    type="button"
                    className="buat-modal-input"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: '#fff', textAlign: 'left' }}
                  >
                    <span style={{ color: form.category ? '#1a3252' : '#94a3b8' }}>
                      {form.category || 'Pilih salah satu'}
                    </span>
                    <DownOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
                  </button>
                </Dropdown>
              </div>
              <div className="buat-modal-field">
                <label>Lokasi Spesifik</label>
                <input
                  type="text"
                  className="buat-modal-input"
                  placeholder="Gedung, Lantai, No. Ruangan"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>

            <div className="buat-modal-field">
              <label>Deskripsi Detail</label>
              <textarea
                className="buat-modal-textarea"
                placeholder="Ceritakan detail kendala atau kronologi kerusakan..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="buat-modal-right">
            <div className="buat-modal-field">
              <label>Foto Bukti</label>
              <div
                className={`buat-modal-upload${isDragging ? ' dragging' : ''}`}
                onClick={() => document.getElementById('buatModalFileInput').click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handlePhotoSelect(e.dataTransfer.files[0]); }}
              >
                {form.photo ? (
                  <img
                    src={URL.createObjectURL(form.photo)}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                  />
                ) : (
                  <>
                    <div className="buat-modal-upload-icon">
                      <i className={isDragging ? 'fas fa-download' : 'fas fa-upload'}></i>
                    </div>
                    <span className="buat-modal-upload-title">{isDragging ? 'Lepas untuk mengunggah' : 'Klik atau drag & drop'}</span>
                    <span className="buat-modal-upload-hint">JPEG, JPG, dan PNG · Maks 5MB</span>
                  </>
                )}
              </div>
              <input
                id="buatModalFileInput"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                style={{ display: 'none' }}
                onChange={(e) => handlePhotoSelect(e.target.files[0])}
              />
              {photoError && (
                <div style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fas fa-circle-exclamation"></i> {photoError}
                </div>
              )}
              {form.photo && (
                <button className="buat-modal-remove-photo" onClick={() => { setForm({ ...form, photo: null }); setPhotoError(''); }}>
                  <i className="fas fa-times"></i> Hapus foto
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="buat-modal-footer">
          {formError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontSize: '0.82rem', fontWeight: 600, flex: 1 }}>
              <i className="fas fa-circle-exclamation"></i> {formError}
            </div>
          )}
          <button className="buat-modal-btn-cancel" onClick={onClose}>Batal</button>
          <button className="buat-modal-btn-submit" onClick={handleSubmit} disabled={submitting}>
            <i className={submitting ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'}></i>
            {submitting ? ' Mengirim...' : ' Kirim Laporan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateReportModal;
