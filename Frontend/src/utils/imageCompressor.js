/**
 * Compress an image file using the browser Canvas API.
 * Reduces a 4-5 MB photo to ~200-300 KB before uploading.
 *
 * @param {File} file - Original image file
 * @param {number} maxWidth - Max width in pixels (default 1200)
 * @param {number} quality - JPEG quality 0-1 (default 0.8)
 * @returns {Promise<File>} Compressed image as a new File
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    // Skip non-image or tiny files (< 200 KB) — not worth compressing
    if (!file.type.startsWith('image/') || file.size < 200 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const ratio = Math.min(maxWidth / img.width, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
};
