import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/style.css";

function Home() {
  const [activeTab, setActiveTab] = useState("Beranda");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("header, section");
      let current = "Beranda";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          const id = section.getAttribute("id");
          if (id === "hero") current = "Beranda";
          else if (id === "steps") current = "Langkah Pengaduan";
          else if (id === "features") current = "Informasi";
        }
      });

      setActiveTab(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="nav-logo">
              lapor.in
            </Link>
            <div className="nav-links">
              <a 
                href="#" 
                className={`nav-link ${activeTab === "Beranda" ? "active" : ""}`}
                onClick={() => setActiveTab("Beranda")}
              >
                Beranda
              </a>
              <a 
                href="#steps" 
                className={`nav-link ${activeTab === "Langkah Pengaduan" ? "active" : ""}`}
                onClick={() => setActiveTab("Langkah Pengaduan")}
              >
                Langkah Pengaduan
              </a>
              <a 
                href="#features" 
                className={`nav-link ${activeTab === "Informasi" ? "active" : ""}`}
                onClick={() => setActiveTab("Informasi")}
              >
                Informasi
              </a>
            </div>
          </div>
          <div className="nav-auth">
            <Link to="/login" className="nav-login">
              Masuk
            </Link>
            <Link to="/register" className="btn-register">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <span className="badge">LAYANAN DIGITAL MAHASISWA</span>
          <h1>Layanan Aduan Fasilitas Kampus Universitas Diponegoro</h1>
          <p>
            Sistem pelaporan terpadu untuk pemeliharaan dan perbaikan fasilitas kampus guna mendukung kenyamanan civitas akademika.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Lapor Sekarang</button>
            <div className="search-box">
              <input type="text" placeholder="Cek Status Laporan..." />
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Steps Section */}
      <section id="steps" className="steps-section">
        <h2>Langkah Pengaduan</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="icon-wrapper">
              <i className="fas fa-pen-to-square"></i>
            </div>
            <h3>Menulis Laporan</h3>
            <p>Laporkan keluhan atau kerusakan fasilitas melalui form yang tersedia.</p>
          </div>
          <div className="step-item">
            <div className="icon-wrapper">
              <i className="fas fa-shield-halved"></i>
            </div>
            <h3>Proses Verifikasi</h3>
            <p>Laporan Anda akan diverifikasi oleh admin.</p>
          </div>
          <div className="step-item">
            <div className="icon-wrapper">
              <i className="fas fa-gears"></i>
            </div>
            <h3>Proses Tindak Lanjut</h3>
            <p>Tim teknis akan segera melakukan perbaikan di lokasi kejadian.</p>
          </div>
          <div className="step-item">
            <div className="icon-wrapper">
              <i className="fas fa-circle-check"></i>
            </div>
            <h3>Selesai</h3>
            <p>Fasilitas telah diperbaiki dan laporan Anda resmi ditutup.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-content">
          <div className="features-text">
            <h2>
              Transparansi dan Efisiensi
              <br />
              dalam Satu Genggaman
            </h2>
            <p>
              Kami berkomitmen untuk menjaga standar fasilitas kelas dunia di lingkungan Universitas Diponegoro melalui sistem yang transparan dan akuntabel bagi seluruh civitas akademika.
            </p>
          </div>
          <div className="features-cards">
            <div className="feature-card">
              <div className="icon-wrapper icon-shield">
                <i className="fas fa-shield"></i>
              </div>
              <div className="card-text">
                <h3>Keamanan Data</h3>
                <p>Pelaporan aman dengan sistem verifikasi identitas resmi civitas akademika UNDIP.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper icon-location">
                <i className="fas fa-location-dot"></i>
              </div>
              <div className="card-text">
                <h3>Tagging Lokasi</h3>
                <p>Penentuan titik kerusakan secara presisi melalui integrasi sistem geospatial kampus.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <h2>lapor.in</h2>
            <p>
              Sistem manajemen fasilitas cerdas untuk mendukung visi Universitas Diponegoro menjadi pusat keunggulan pendidikan kelas dunia.
            </p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>LAYANAN</h4>
              <ul>
                <li>
                  <a href="#">Buat Laporan</a>
                </li>
                <li>
                  <a href="#">Daftar Fasilitas</a>
                </li>
                <li>
                  <a href="#">Cek Status</a>
                </li>
              </ul>
            </div>
            <div className="link-group">
              <h4>INFORMASI</h4>
              <ul>
                <li>
                  <a href="#">Pusat Bantuan</a>
                </li>
                <li>
                  <a href="#">Panduan</a>
                </li>
                <li>
                  <a href="#">Kebijakan</a>
                </li>
              </ul>
            </div>
            <div className="link-group">
              <h4>KONTAK</h4>
              <ul>
                <li>
                  <a href="#">Twitter</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">Email Kami</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Universitas Diponegoro Academic</p>
          <div className="bottom-links">
            <a href="#">Syarat & Ketentuan</a>
            <a href="#">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;