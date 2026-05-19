import { useState, useEffect, useCallback } from 'react';

const NOTIF_KEY = 'lapor_notif_admin';
const SEEN_KEY  = 'lapor_seen_admin_ids';

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
}

export function useAdminNotifications(reports) {
  const [notifications, setNotifications] = useState(() => load(NOTIF_KEY) || []);

  useEffect(() => {
    if (!reports.length) return;

    const seenIds   = load(SEEN_KEY);
    const isFirstLoad = seenIds === null;
    const seenSet   = new Set(seenIds || []);

    const newNotifs = [...(load(NOTIF_KEY) || [])];
    let changed = false;

    reports.forEach((r) => {
      if (!seenSet.has(r.id)) {
        if (!isFirstLoad) {
          const alreadyAdded = newNotifs.some(
            (n) => n.reportId === r.id && n.type === 'new_report'
          );
          if (!alreadyAdded) {
            newNotifs.unshift({
              id:       `admin_${r.id}_${Date.now()}`,
              reportId: r.id,
              type:     'new_report',
              title:    r.title,
              user:     r.user?.name || 'User',
              message:  `Laporan baru dari ${r.user?.name || 'User'}: "${r.title}"`,
              time:     r.createdAt,
              read:     false,
            });
            changed = true;
          }
        }
        seenSet.add(r.id);
      }
    });

    localStorage.setItem(SEEN_KEY, JSON.stringify([...seenSet]));

    if (changed || isFirstLoad) {
      const trimmed = newNotifs.slice(0, 20);
      setNotifications(trimmed);
      localStorage.setItem(NOTIF_KEY, JSON.stringify(trimmed));
    }
  }, [reports]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.setItem(NOTIF_KEY, JSON.stringify([]));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead, markRead, clearAll };
}
