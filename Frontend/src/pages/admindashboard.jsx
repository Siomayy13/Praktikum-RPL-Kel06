import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { useAdminReports } from '../hooks/useAdminReports';
import AdminDashboardView from '../components/admindashboard/AdminDashboardView';
import AdminReportListView from '../components/admindashboard/AdminReportListView';
import AdminReportDetailView from '../components/admindashboard/AdminReportDetailView';
import AdminStatistikView from '../components/admindashboard/AdminStatistikView';
import AdminProfileViews from '../components/admindashboard/AdminProfileViews';
import '../styles/dashboard.css';

function AdminDashboard() {
  const [activeView, setActiveView] = useState('beranda');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('admin')));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onCloseAction: null });
  const { reports, fetchReports } = useAdminReports();
  const contentAreaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentAreaRef.current) contentAreaRef.current.scrollTo(0, 0);
    const viewsNeedingData = ['beranda', 'kelola', 'detail', 'statistik'];
    if (user && viewsNeedingData.includes(activeView)) fetchReports();
  }, [activeView]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setActiveView('detail');
  };

  const handleSidebarNav = (viewId) => {
    if (viewId === 'detail') setSelectedReport(null);
    setActiveView(viewId);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activeView={activeView} setActiveView={handleSidebarNav} handleLogout={handleLogout} role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
            <span style={{ marginLeft: '8px' }}>{user?.username || 'Admin'}</span>
          </div>
        </div>

        <div className="content-area" ref={contentAreaRef}>
          {activeView === 'beranda' && (
            <AdminDashboardView reports={reports} user={user} onViewDetail={handleViewDetail} setActiveView={setActiveView} />
          )}
          {activeView === 'kelola' && (
            <AdminReportListView reports={reports} onViewDetail={handleViewDetail} />
          )}
          {activeView === 'detail' && (
            <AdminReportDetailView selectedReport={selectedReport} setSelectedReport={setSelectedReport} user={user} fetchReports={fetchReports} setActiveView={setActiveView} setModalState={setModalState} />
          )}
          {activeView === 'statistik' && (
            <AdminStatistikView reports={reports} />
          )}
          {activeView === 'profil' && (
            <AdminProfileViews user={user} setUser={setUser} setModalState={setModalState} />
          )}
        </div>
      </div>

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

export default AdminDashboard;
