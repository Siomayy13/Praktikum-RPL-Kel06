import React from 'react';

const Footer = () => {
  return (
    <footer className="footer section">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="nav-brand">lapor.<span>in</span></a>
            <p className="footer-desc">
              Sistem manajemen fasilitas cerdas untuk mendukung visi Universitas Diponegoro menjadi pusat keunggulan pendidikan kelas dunia.
            </p>
          </div>
          <div className="footer-links-group">
            <div className="footer-links">
              <h4>LAYANAN</h4>
              <ul>
                <li><a href="#">Buat Laporan</a></li>
                <li><a href="#">Daftar Fasilitas</a></li>
                <li><a href="#">Cek Status</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>INFORMASI</h4>
              <ul>
                <li><a href="#">Pusat Bantuan</a></li>
                <li><a href="#">Panduan</a></li>
                <li><a href="#">Kebijakan</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>KONTAK</h4>
              <ul>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Email Kami</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Universitas Diponegoro Akademik.</p>
          <div className="footer-bottom-links">
            <a href="#">Syarat &amp; Ketentuan</a>
            <a href="#">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
