import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import '../styles/register.css';
import BASE_URL from '../api/api';


function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setShowError(false);

    // VALIDASI
    if (!name || !email || !password) {
      setErrorMsg("Semua field wajib diisi");
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak sama");
      setShowError(true);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setShowSuccess(true);
      } else {
        setErrorMsg(data?.message || "Register gagal");
        setShowError(true);
      }

    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
      setShowError(true);
    }
  };

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

          <form onSubmit={handleRegister}>
            {/* NAMA */}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* EMAIL */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <i
                      className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} input-icon-right`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  )}
                </div>
              </div>

              {/* CONFIRM */}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && (
                    <i
                      className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} input-icon-right`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    ></i>
                  )}
                </div>
              </div>
            </div>

            {/* ERROR */}
            {showError && (
              <div className="error-message">
                <i className="fas fa-circle-exclamation"></i> {errorMsg}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="btn-login"
              style={{ marginTop: '20px' }}
            >
              Daftar Sekarang <i className="fas fa-arrow-right"></i>
            </button>
          </form>
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

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <i className="fas fa-check"></i>
            </div>
            <h2 className="modal-title">Pendaftaran Berhasil!</h2>
            <p className="modal-text">
              Akun Anda telah berhasil dibuat. Silakan login.
            </p>
            <button
              className="btn-login"
              style={{ marginTop: 0 }}
              onClick={() => navigate('/login')}
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
