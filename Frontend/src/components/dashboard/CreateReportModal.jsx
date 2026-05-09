import React, { useState } from 'react';
import { createReport } from '../../api/api';
import { compressImage } from '../../utils/imageCompressor';
import CustomDropdown from '../CustomDropdown';

function CreateReportModal({ userId, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', category: '', location: '', description: '', photo: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
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
                <CustomDropdown
                  options={['Ringan', 'Sedang', 'Berat']}
                  value={form.category}
                  onChange={(val) => setForm({ ...form, category: val })}
                  placeholder="Pilih salah satu"
                />
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
                className="buat-modal-upload"
                onClick={() => document.getElementById('buatModalFileInput').click()}
              >
                {form.photo ? (
                  <img
                    src={URL.createObjectURL(form.photo)}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                  />
                ) : (
                  <>
                    <div className="buat-modal-upload-icon"><i className="fas fa-upload"></i></div>
                    <span className="buat-modal-upload-title">Klik atau drag & drop</span>
                    <span className="buat-modal-upload-hint">JPG, PNG, WEBP · Maks 5MB</span>
                  </>
                )}
              </div>
              <input
                id="buatModalFileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
              />
              {form.photo && (
                <button className="buat-modal-remove-photo" onClick={() => setForm({ ...form, photo: null })}>
                  <i className="fas fa-times"></i> Hapus foto
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="buat-modal-footer">
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
