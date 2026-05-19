import { useState, useEffect, useCallback } from 'react';

const NOTIF_KEY  = (uid) => `lapor_notif_user_${uid}`;
const SEEN_KEY   = (uid) => `lapor_seen_status_${uid}`;

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
}

export function useNotifications(reports, userId) {
  const [notifications, setNotifications] = useState(() => load(NOTIF_KEY(userId)) || []);

  useEffect(() => {
    if (!reports.length || !userId) return;

    const seenStatuses = load(SEEN_KEY(userId));
    const isFirstLoad  = seenStatuses === null;
    const seen         = seenStatuses || {};

    const newNotifs = [...(load(NOTIF_KEY(userId)) || [])];
    let changed = false;

    reports.forEach((r) => {
      const current  = r.status?.toLowerCase();
      const previous = seen[r.id];

      if (!isFirstLoad && previous !== undefined && previous !== current) {
        const alreadyAdded = newNotifs.some(
          (n) => n.reportId === r.id && n.status === current
        );
        if (!alreadyAdded) {
          newNotifs.unshift({
            id:       `${r.id}_${current}_${Date.now()}`,
            reportId: r.id,
            title:    r.title,
            status:   current,
            message:  `Status laporan "${r.title}" diubah ke ${current.charAt(0).toUpperCase() + current.slice(1)}`,
            time:     new Date().toISOString(),
            read:     false,
          });
          changed = true;
        }
      }
      seen[r.id] = current;
    });

    localStorage.setItem(SEEN_KEY(userId), JSON.stringify(seen));

    if (changed || isFirstLoad) {
      const trimmed = newNotifs.slice(0, 20);
      setNotifications(trimmed);
      localStorage.setItem(NOTIF_KEY(userId), JSON.stringify(trimmed));
    }
  }, [reports, userId]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(NOTIF_KEY(userId), JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const markRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem(NOTIF_KEY(userId), JSON.stringify(updated));
      return updated;
    });
  }, [userId]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.setItem(NOTIF_KEY(userId), JSON.stringify([]));
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead, markRead, clearAll };
}
