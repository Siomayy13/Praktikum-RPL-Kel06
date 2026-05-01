import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="nav-brand">lapor.<span>in</span></a>
      <div className="nav-links">
        <a href="#hero" className="active">Beranda</a>
        <a href="#steps">Langkah Pengaduan</a>
        <a href="#features">Informasi</a>
      </div>
      <div className="nav-auth">
        <a href="#" className="btn-masuk">Masuk</a>
        <a href="#" className="btn-daftar">Daftar</a>
      </div>
    </nav>
  );
};

export default Navbar;
