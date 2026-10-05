// Shared photo helpers for farm profiles & public farm stores.
// Photos uploaded from a device are resized + JPEG-compressed in the browser
// before being stored, so many photos fit within the localStorage quota.

export const PHOTO_CATEGORIES = ['Farm', 'Cattle', 'Process', 'Products', 'Team'];

export const FALLBACK_PHOTO = '/images/hero/hero-1.jpg';
export const FALLBACK_LOGO = '/images/milk-bottle.svg';

export const MAX_GALLERY_PHOTOS = 24;

let photoSeq = 0;
export const makePhotoId = () => `ph-${Date.now()}-${photoSeq++}`;

/** Accepts legacy string arrays or object arrays and returns [{id,url,caption,category}] */
export const normalizeGallery = (gallery = []) =>
  (Array.isArray(gallery) ? gallery : [])
    .filter(Boolean)
    .map((g, i) =>
      typeof g === 'string'
        ? { id: `ph-legacy-${i}`, url: g, caption: '', category: 'Farm' }
        : { id: g.id || `ph-legacy-${i}`, url: g.url, caption: g.caption || '', category: g.category || 'Farm' }
    )
    .filter(g => g.url);

/** Resize an image File to fit maxSize px and return a compressed JPEG data URL. */
export const compressImageFile = (file, maxSize = 1200, quality = 0.72) =>
  new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      reject(new Error(`"${file?.name || 'File'}" is not an image`));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read "${file.name}"`));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(`Could not decode "${file.name}"`));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; // flatten transparent PNGs
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/** Approximate size (KB) of a data URL or 0 for normal URLs */
export const dataUrlSizeKB = (url = '') =>
  url.startsWith('data:') ? Math.round((url.length * 3) / 4 / 1024) : 0;

/** img onError handler that swaps to a fallback once */
export const withFallback = (fallback = FALLBACK_PHOTO) => (e) => {
  if (e.currentTarget.dataset.fallback) return;
  e.currentTarget.dataset.fallback = '1';
  e.currentTarget.src = fallback;
};
