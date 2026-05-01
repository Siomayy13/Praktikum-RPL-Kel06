import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-logo-icon">
          <i className="fas fa-building-columns"></i>
        </div>
        <h1>lapor.in</h1>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          <h2>Masuk ke lapor.in</h2>
          
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Email</label>
            </div>
            <div className="input-container">
              <i className="fas fa-at input-icon-left"></i>
              <input 
                type="email" 
                className="login-input" 
                placeholder="Masukkan email Anda" 
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Kata Sandi</label>
              <a href="#" className="forgot-password">Lupa kata sandi?</a>
            </div>
            <div className="input-container">
              <i className="fas fa-lock input-icon-left"></i>
              <input 
                type={showPassword ? "text" : "password"} 
                className="login-input" 
                placeholder="Masukkan kata sandi" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (showError) setShowError(false);
                }}
              />
              <i 
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} input-icon-right`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            {showError && (
              <div className="error-message">
                <i className="fas fa-circle-exclamation"></i> Kata sandi yang Anda masukkan salah. Silakan coba lagi.
              </div>
            )}
          </div>

          <button 
            className="btn-login"
            onClick={(e) => {
              e.preventDefault();
              if (password === 'password123') {
                setShowError(false);
                setShowSuccess(true);
              } else {
                setShowError(true);
              }
            }}
          >
            Masuk <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <div className="login-card-footer">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </div>
      </div>

      <div className="login-features">
        <div className="login-feature-item">
          <i className="fas fa-gauge-high"></i>
          <span>Respons Cepat</span>
        </div>
        <div className="login-feature-item">
          <i className="fas fa-shield-halved"></i>
          <span>Aman & Terpercaya</span>
        </div>
        <div className="login-feature-item">
          <i className="fas fa-chart-column"></i>
          <span>Transparansi Data</span>
        </div>
      </div>

      <div className="login-footer">
        <div className="login-footer-left">
          <div className="logo-text">lapor.in</div>
          <div className="copyright">© 2026 lapor.in — Universitas Diponegoro</div>
        </div>
        <div className="login-footer-right">
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Ketentuan Layanan</a>
          <a href="#">Kontak Admin</a>
        </div>
      </div>

      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <i className="fas fa-check"></i>
            </div>
            <h2 className="modal-title">Login Berhasil!</h2>
            <p className="modal-text">
              Selamat datang kembali! Anda telah berhasil masuk ke akun Anda.
            </p>
            <button 
              className="btn-login" 
              style={{ marginTop: 0 }}
              onClick={() => navigate('/dashboard')}
            >
              Masuk ke Beranda <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
