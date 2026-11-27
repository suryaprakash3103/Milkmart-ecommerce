import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, CheckCircle2, X, Sparkles } from 'lucide-react';

export const InstallAppButton = ({ style = {}, variant = 'compact' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if already installed in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show instructional modal for Edge, Chrome, Opera, iOS
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        style={{
          backgroundColor: '#E8C582',
          color: '#183626',
          border: 'none',
          padding: variant === 'compact' ? '3px 10px' : '8px 14px',
          borderRadius: '14px',
          fontSize: variant === 'compact' ? '0.72rem' : '0.84rem',
          fontWeight: '800',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.15s ease',
          ...style
        }}
        title="Install MilkMart as an app on Google Chrome, Edge, Opera, Android & iOS"
      >
        <Download size={variant === 'compact' ? 12 : 15} />
        <span>Install App</span>
      </button>

      {/* Manual Installation Guide Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 35, 24, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '16px'
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E6DEC9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#183626',
              color: '#FAF7F2',
              padding: '18px 22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#E8C582" />
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#FAF7F2', fontFamily: 'Fraunces, Georgia, serif' }}>
                  Install MilkMart Web App
                </h4>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#FAF7F2', cursor: 'pointer', display: 'flex' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '22px' }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.86rem', color: '#55685C', lineHeight: 1.5 }}>
                MilkMart works as a high-performance standalone app on <strong>Google Chrome, Microsoft Edge, Opera, Safari, Android &amp; Windows</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#183626' }}>
                <div style={{ backgroundColor: '#FAF5EE', borderRadius: '10px', padding: '12px', border: '1px solid #E6DEC9' }}>
                  <strong>🖥️ Desktop (Chrome / Edge / Opera):</strong>
                  <div style={{ marginTop: '4px', color: '#55685C' }}>
                    Look for the <strong>Install Icon (⊕ or 💻)</strong> on the right side of your browser address bar and click <em>"Install MilkMart"</em>.
                  </div>
                </div>

                <div style={{ backgroundColor: '#E8F5EE', borderRadius: '10px', padding: '12px', border: '1px solid rgba(25, 109, 61, 0.2)' }}>
                  <strong>📱 Android (Chrome / Opera / Samsung):</strong>
                  <div style={{ marginTop: '4px', color: '#55685C' }}>
                    Tap the <strong>three dots (⋮)</strong> at top right and choose <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
                  </div>
                </div>

                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '10px', padding: '12px', border: '1px solid #E6DEC9' }}>
                  <strong>🍎 iPhone / iPad (Safari):</strong>
                  <div style={{ marginTop: '4px', color: '#55685C' }}>
                    Tap the <strong>Share button</strong> at bottom and select <strong>"Add to Home Screen"</strong>.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
