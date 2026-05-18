import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { useReports } from '../hooks/useReports';
import DashboardView from '../components/dashboard/DashboardView';
import ProfileViews from '../components/dashboard/ProfileViews';
import CreateReportModal from '../components/dashboard/CreateReportModal';
import '../styles/dashboard.css';

function Dashboard() {
  const location = useLocation();
  const [activeView, setActiveView] = useState(() => location.state?.view || 'beranda');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBuatModal, setShowBuatModal] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onCloseAction: null });
  const { reports, stats, fetchReports } = useReports(user?.id);
  const contentAreaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentAreaRef.current) contentAreaRef.current.scrollTo(0, 0);
    if (user && activeView === 'beranda') fetchReports();
  }, [activeView]);

  const handleLogout = () => navigate('/');

  // Intercept sidebar nav — daftar/detail go to /reports page
  const handleSidebarNav = (viewId) => {
    if (viewId === 'daftar') navigate('/reports');
    else if (viewId === 'detail') navigate('/reports', { state: { initialView: 'detail' } });
    else setActiveView(viewId);
  };

  // From beranda chevron: navigate to /reports with pre-selected report
  const handleViewDetail = (report) => {
    navigate('/reports', { state: { selectedReport: report } });
  };

  const handleReportSuccess = () => {
    setShowBuatModal(false);
    setModalState({
      isOpen: true,
      title: 'Laporan Terkirim!',
      message: 'Laporan fasilitas Anda telah berhasil dikirim dan akan segera diproses.',
      onCloseAction: () => navigate('/reports'),
    });
    fetchReports(); // background refresh
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeView={activeView} setActiveView={handleSidebarNav} handleLogout={handleLogout} onBuatLaporan={() => setShowBuatModal(true)} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-wrapper">
        <div className="topbar">
          <div className="topbar-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="topbar-logo-mobile">lapor.in</div>
          </div>
          <div className="topbar-user" onClick={() => setActiveView('profil')} style={{ cursor: 'pointer' }}>
            {user?.photo ? (
              <img src={user.photo} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <i className="far fa-user-circle"></i>
            )}
            <span style={{ marginLeft: '8px' }}>{user?.name || 'User'}</span>
          </div>
        </div>

        <div className="content-area" ref={contentAreaRef}>
          {activeView === 'beranda' && (
            <DashboardView
              user={user}
              reports={reports}
              stats={stats}
              onBuatLaporan={() => setShowBuatModal(true)}
              onViewDetail={handleViewDetail}
              setActiveView={handleSidebarNav}
            />
          )}
          {activeView === 'profil' && (
            <ProfileViews user={user} setUser={setUser} setActiveView={setActiveView} setModalState={setModalState} />
          )}
        </div>
      </div>

      {showBuatModal && (
        <CreateReportModal userId={user?.id} onClose={() => setShowBuatModal(false)} onSuccess={handleReportSuccess} />
      )}

      {modalState.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', maxWidth: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 30px' }}>
              <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#a5f3fc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0f766e', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem' }}>
                    <i className="fas fa-check"></i>
                  </div>
                </div>
              </div>
            </div>
            <h2 style={{ color: '#1a3252', marginBottom: '12px', fontSize: '1.25rem', fontWeight: 800 }}>{modalState.title}</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '32px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{modalState.message}</p>
            <button
              className="btn-login"
              style={{ width: '100%', padding: '14px', background: '#1a3252', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' }}
              onClick={() => {
                setModalState({ ...modalState, isOpen: false });
                if (modalState.onCloseAction) modalState.onCloseAction();
              }}
            >
              TUTUP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
