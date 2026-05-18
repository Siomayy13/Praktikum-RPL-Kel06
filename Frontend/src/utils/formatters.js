export const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':     return 'status-terkirim';
    case 'diproses':    return 'status-diproses';
    case 'ditolak':     return 'status-ditolak';
    case 'selesai':     return 'status-selesai';
    case 'dibatalkan':  return 'status-dibatalkan';
    default:            return 'status-terkirim';
  }
};

export const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':     return 'Pending';
    case 'diproses':    return 'Diproses';
    case 'selesai':     return 'Selesai';
    case 'ditolak':     return 'Ditolak';
    case 'dibatalkan':  return 'Dibatalkan';
    default:            return status || 'Pending';
  }
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatTanggal = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

export const formatTimeAgo = (timestamp) => {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  if (diff < 60)    return `${diff} detik yang lalu`;
  if (diff < 3600)  return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  return `${Math.floor(diff / 86400)} hari yang lalu`;
};
