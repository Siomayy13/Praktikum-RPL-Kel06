import React, { useState, useRef, useEffect } from 'react';
import { formatTimeAgo } from '../utils/formatters';

const STATUS_ICON = {
  pending:    { icon: 'fa-clock',           color: '#475569' },
  diproses:   { icon: 'fa-gear',            color: '#c2410c' },
  selesai:    { icon: 'fa-circle-check',    color: '#0f766e' },
  ditolak:    { icon: 'fa-circle-xmark',    color: '#b91c1c' },
  dibatalkan: { icon: 'fa-ban',             color: '#94a3b8' },
  new_report: { icon: 'fa-file-circle-plus', color: '#1a3252' },
};

function NotificationBell({ notifications, unreadCount, markAllRead, markRead, clearAll, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleItemClick = (n) => {
    markRead(n.id);
  };

  const handleNavigate = (e, n) => {
    e.stopPropagation();
    markRead(n.id);
    setOpen(false);
    if (onNavigate) onNavigate(n.reportId);
  };

  return (
    <div className="notif-wrapper" ref={ref}>
      <button className="notif-bell-btn" onClick={() => setOpen((v) => !v)} aria-label="Notifikasi">
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          {/* Header */}
          <div className="notif-header">
            <div className="notif-header-left">
              <span className="notif-header-title">Notifikasi</span>
              {unreadCount > 0 && <span className="notif-count-pill">{unreadCount} baru</span>}
            </div>
            <div className="notif-header-actions">
              {unreadCount > 0 && (
                <button className="notif-action-btn" onClick={markAllRead}>
                  Tandai dibaca
                </button>
              )}
              {notifications.length > 0 && (
                <button className="notif-action-btn danger" onClick={clearAll}>
                  Hapus semua
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <i className="fas fa-bell-slash"></i>
                <span>Belum ada notifikasi</span>
              </div>
            ) : (
              notifications.map((n) => {
                const iconInfo = STATUS_ICON[n.type || n.status] || STATUS_ICON.pending;
                return (
                  <div
                    key={n.id}
                    className={`notif-item${n.read ? '' : ' unread'}`}
                    onClick={() => handleItemClick(n)}
                  >
                    <div
                      className="notif-item-icon"
                      style={{ color: iconInfo.color, background: `${iconInfo.color}18` }}
                    >
                      <i className={`fas ${iconInfo.icon}`}></i>
                    </div>

                    <div className="notif-item-body">
                      <p className="notif-item-msg">{n.message}</p>
                      <span className="notif-item-time">{formatTimeAgo(n.time)}</span>
                    </div>

                    {onNavigate && n.type === 'new_report' && (
                      <button
                        className="notif-goto-btn"
                        onClick={(e) => handleNavigate(e, n)}
                        title="Lihat laporan"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    )}

                    {!n.read && <span className="notif-unread-dot"></span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
