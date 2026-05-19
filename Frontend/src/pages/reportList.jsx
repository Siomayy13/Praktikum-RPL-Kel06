import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { useReports } from '../hooks/useReports';
import { useNotifications } from '../hooks/useNotifications';
import NotificationBell from '../components/NotificationBell';
import ReportListView from '../components/dashboard/ReportListView';
import ReportDetailView from '../components/dashboard/ReportDetailView';
import EditReportView from '../components/dashboard/EditReportView';
import CreateReportModal from '../components/dashboard/CreateReportModal';
import '../styles/dashboard.css';

function ReportListPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();
  const contentAreaRef = useRef(null);

  const { reports, fetchReports } = useReports(user?.id);
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotifications(reports, user?.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subView, setSubView] = useState(() => {
    if (location.state?.selectedReport || location.state?.initialView === 'detail') return 'detail';
    return 'list';
  });
  const [selectedReport, setSelectedReport] = useState(() => location.state?.selectedReport || null);
  const [showBuatModal, setShowBuatModal] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', onCloseAction: null });

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (contentAreaRef.current) contentAreaRef.current.scrollTo(0, 0);
  }, [subView]);

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setSubView('detail');
  };

  const handleReportSuccess = () => {
    setShowBuatModal(false);
    setModalState({
      isOpen: true,
      title: 'Laporan Terkirim!',
      message: 'Laporan fasilitas Anda telah berhasil dikirim dan akan segera diproses.',
      onCloseAction: () => setSubView('list'),
    });
    fetchReports(); // background refresh — tidak memblokir modal
  };

  const handleLogout = () => navigate('/');

  const handleSidebarNav = (viewId) => {
    if (viewId === 'beranda') navigate('/dashboard');
    else if (viewId === 'daftar') setSubView('list');
    else if (viewId === 'detail') { setSelectedReport(null); setSubView('detail'); }
    else if (viewId === 'profil') navigate('/dashboard');
  };

  const sidebarActiveView = subView === 'list' ? 'daftar' : 'detail';

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeView={sidebarActiveView}
        setActiveView={handleSidebarNav}
        handleLogout={handleLogout}
        onBuatLaporan={() => setShowBuatModal(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-wrapper">
        <div className="topbar">
          <div className="topbar-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="topbar-logo-mobile">lapor.in</div>
          </div>
          <div className="topbar-right">
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              markAllRead={markAllRead}
              markRead={markRead}
              clearAll={clearAll}
            />
            <div className="topbar-user" onClick={() => navigate('/dashboard', { state: { view: 'profil' } })} style={{ cursor: 'pointer' }}>
              {user?.photo ? (
                <img src={user.photo} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <i className="far fa-user-circle"></i>
              )}
              <span style={{ marginLeft: '8px' }}>{user?.name || 'User'}</span>
            </div>
          </div>
        </div>

        <div className="content-area" ref={contentAreaRef}>
          {subView === 'list' && (
            <ReportListView
              reports={reports}
              onBuatLaporan={() => setShowBuatModal(true)}
              onViewDetail={handleViewDetail}
            />
          )}
          {subView === 'detail' && (
            <ReportDetailView
              selectedReport={selectedReport}
              user={user}
              fetchReports={fetchReports}
              setActiveView={(v) => {
                if (v === 'daftar') setSubView('list');
                else if (v === 'edit') setSubView('edit');
                else setSubView(v);
              }}
              setModalState={setModalState}
            />
          )}
          {subView === 'edit' && (
            <EditReportView
              selectedReport={selectedReport}
              setSelectedReport={setSelectedReport}
              fetchReports={fetchReports}
              setActiveView={(v) => {
                if (v === 'detail') setSubView('detail');
                else if (v === 'daftar') setSubView('list');
                else setSubView(v);
              }}
              setModalState={setModalState}
            />
          )}
        </div>
      </div>

      {showBuatModal && (
        <CreateReportModal
          userId={user?.id}
          onClose={() => setShowBuatModal(false)}
          onSuccess={handleReportSuccess}
        />
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

export default ReportListPage;
