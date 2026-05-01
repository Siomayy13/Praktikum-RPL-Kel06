import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import '../styles/register.css';


function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-page register-page">
      <div className="register-header">
        <div className="logo-text">lapor.in</div>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          <div className="register-card-header">
            <h2>Buat Akun Anda</h2>
            <p className="register-subtitle">Sistem Manajemen Aduan Fasilitas Kampus.</p>
          </div>
          
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Nama Lengkap</label>
            </div>
            <div className="input-container">
              <i className="fas fa-user input-icon-left"></i>
              <input 
                type="text" 
                className="login-input" 
                placeholder="Masukkan nama" 
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Email</label>
            </div>
            <div className="input-container">
              <i className="fas fa-graduation-cap input-icon-left"></i>
              <input 
                type="email" 
                className="login-input" 
                placeholder="Masukkan Email" 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col form-group">
              <div className="form-label-row">
                <label className="form-label">Kata Sandi</label>
              </div>
              <div className="input-container">
                <i className="fas fa-lock input-icon-left"></i>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="login-input" 
                  placeholder="........" 
                />
              </div>
            </div>

            <div className="form-col form-group">
              <div className="form-label-row">
                <label className="form-label">Konfirmasi</label>
              </div>
              <div className="input-container">
                <i className="fas fa-shield-halved input-icon-left"></i>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="login-input" 
                  placeholder="........" 
                />
              </div>
            </div>
          </div>

          <button 
            className="btn-login" 
            style={{ marginTop: '20px' }}
            onClick={(e) => {
              e.preventDefault();
              setShowSuccess(true);
            }}
          >
            Daftar Sekarang <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <div className="login-card-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </div>
      </div>

      <div className="login-features">
        <div className="login-feature-item">
          <i className="fas fa-shield-halved"></i>
          <span>Keamanan Terenkripsi</span>
        </div>
        <div className="login-feature-item">
          <i className="fas fa-scale-balanced"></i>
          <span>Sesuai Regulasi</span>
        </div>
      </div>

      <div className="login-footer" style={{ borderTop: 'none', padding: '0 60px 40px' }}>
        <div className="login-footer-left">
          <div className="logo-text">lapor.in</div>
          <div className="copyright">© 2026 lapor.in - Universitas Diponegoro</div>
        </div>
      </div>

      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <i className="fas fa-check"></i>
            </div>
            <h2 className="modal-title">Pendaftaran Berhasil!</h2>
            <p className="modal-text">
              Akun Anda telah berhasil dibuat. Silakan masuk untuk mulai menggunakan layanan lapor.in.
            </p>
            <button 
              className="btn-login" 
              style={{ marginTop: 0 }}
              onClick={() => navigate('/dashboard')}
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
