import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              borderRadius: '12px',
              background: toast.type === 'error' ? '#7A1F1D' :
                          toast.type === 'info' ? '#0F3E5D' :
                          toast.type === 'warning' ? '#874D00' : '#183626',
              color: '#FAF7F2',
              fontSize: '0.92rem',
              fontWeight: '500',
              boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
              border: '1px solid rgba(232, 197, 130, 0.35)',
              maxWidth: '380px',
              animation: 'slideUpToast 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <span>
              {toast.type === 'error' ? '⚠️' :
               toast.type === 'info' ? 'ℹ️' :
               toast.type === 'warning' ? '🔔' : '🥛'}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
