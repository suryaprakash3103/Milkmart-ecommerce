import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { withFallback } from '../../utils/farmPhotos';

/**
 * Full-screen photo viewer.
 * photos: [{ id, url, caption, category }], index: number | null
 */
export const PhotoLightbox = ({ photos = [], index, onClose, onChange }) => {
  const isOpen = index !== null && index !== undefined && photos[index];

  const go = useCallback(
    (delta) => {
      if (!photos.length) return;
      onChange((index + delta + photos.length) % photos.length);
    },
    [index, photos.length, onChange]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, go, onClose]);

  if (!isOpen) return null;
  const photo = photos[index];

  const navBtn = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(250, 247, 242, 0.15)',
    color: '#FAF7F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)'
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(10, 22, 15, 0.94)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      {/* Top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', top: 16, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FAF7F2' }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E8C582' }}>
          {index + 1} / {photos.length}
          {photo.category && <span style={{ marginLeft: 10, color: '#A5B5AA', fontWeight: 600 }}>• {photo.category}</span>}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ ...navBtn, position: 'static', transform: 'none', width: 40, height: 40 }}
        >
          <X size={22} />
        </button>
      </div>

      {/* Image */}
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '1100px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.caption || 'Farm photo'}
          onError={withFallback()}
          style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', animation: 'fadeIn 0.2s ease' }}
        />
        {photos.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" style={{ ...navBtn, left: -8 }}>
              <ChevronLeft size={26} />
            </button>
            <button onClick={() => go(1)} aria-label="Next photo" style={{ ...navBtn, right: -8 }}>
              <ChevronRight size={26} />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {photo.caption && (
        <p onClick={(e) => e.stopPropagation()} style={{ color: '#FAF7F2', fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.1rem', margin: '16px 0 0', textAlign: 'center' }}>
          {photo.caption}
        </p>
      )}

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto', maxWidth: '100%', padding: '4px' }}
        >
          {photos.map((p, i) => (
            <img
              key={p.id}
              src={p.url}
              alt=""
              onClick={() => onChange(i)}
              onError={withFallback()}
              style={{
                width: 64,
                height: 48,
                objectFit: 'cover',
                borderRadius: 6,
                cursor: 'pointer',
                flexShrink: 0,
                opacity: i === index ? 1 : 0.5,
                outline: i === index ? '2px solid #E8C582' : 'none',
                outlineOffset: 2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
