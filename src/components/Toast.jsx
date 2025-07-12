'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    className: 'bg-success-500 border-success-400 text-white',
  },
  error: {
    icon: XCircle,
    className: 'bg-error-500 border-error-400 text-white',
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-warning-500 border-warning-400 text-white',
  },
  info: {
    icon: Info,
    className: 'bg-info-500 border-info-400 text-white',
  },
};

export default function Toast({ notification, onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const toastType = TOAST_TYPES[notification.type] || TOAST_TYPES.info;
  const IconComponent = toastType.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div
        className={`
          flex items-start space-x-3 p-4 rounded-lg border shadow-lg
          ${toastType.className}
        `}
      >
        <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">
            {notification.title}
          </h4>
          {notification.message && (
            <p className="text-sm opacity-90">
              {notification.message}
            </p>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Componente contenedor para múltiples toasts
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Función global para mostrar toasts
    window.showToast = (notification) => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { ...notification, id }]);
    };

    return () => {
      delete window.showToast;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          notification={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
} 